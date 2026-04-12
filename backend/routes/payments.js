const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// M-Pesa Daraja API helpers
async function getMpesaToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const { data } = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return data.access_token;
}

function getMpesaTimestamp() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');
}

// ── POST /api/payments/initiate ──────────────────────
router.post('/initiate', protect, async (req, res) => {
  try {
    const { phone, plan } = req.body;

    if (!phone || !plan) {
      return res.status(400).json({ error: 'Phone number and plan are required.' });
    }

    const plans = {
      monthly: { amount: 499, name: 'Monthly Premium', months: 1 },
      annual: { amount: 3499, name: 'Annual Premium', months: 12 },
    };

    if (!plans[plan]) {
      return res.status(400).json({ error: 'Invalid plan. Choose monthly or annual.' });
    }

    const planDetails = plans[plan];

    // Format phone: 0712345678 → 254712345678
    const formattedPhone = phone.replace(/^0/, '254').replace(/^\+/, '');

    // Get M-Pesa access token
    const token = await getMpesaToken();
    const timestamp = getMpesaTimestamp();
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Initiate STK Push
    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: planDetails.amount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: `SSD-${req.user._id}`,
        TransactionDesc: `SmartSchool Digital ${planDetails.name}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({
      message: 'Payment request sent. Check your phone for the M-Pesa prompt.',
      checkoutRequestId: data.CheckoutRequestID,
      plan: planDetails,
    });
  } catch (err) {
    console.error('M-Pesa initiation error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initiation failed. Please try again.' });
  }
});

// ── POST /api/payments/mpesa/callback ───────────────
// This is called by Safaricom servers after payment
router.post('/mpesa/callback', async (req, res) => {
  try {
    const { Body } = req.body;

    if (Body.stkCallback.ResultCode !== 0) {
      // Payment failed or was cancelled
      console.log('M-Pesa payment failed:', Body.stkCallback.ResultDesc);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    // Payment successful — extract details
    const metadata = Body.stkCallback.CallbackMetadata.Item;
    const amount = metadata.find((i) => i.Name === 'Amount')?.Value;
    const mpesaCode = metadata.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;
    const accountRef = Body.stkCallback.AccountReference;

    // Find user from account reference (SSD-userId)
    const userId = accountRef.replace('SSD-', '');
    const user = await User.findById(userId);

    if (user) {
      const now = new Date();
      const isAnnual = amount >= 3499;
      user.tier = isAnnual ? 'annual' : 'monthly';
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + (isAnnual ? 12 : 1));
      user.subscriptionExpiresAt = expiry;
      user.subscriptionId = mpesaCode;
      await user.save({ validateBeforeSave: false });
      console.log(`✅ Subscription activated for ${user.email}: ${user.tier}`);
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    console.error('M-Pesa callback error:', err);
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' }); // Always return 0 to Safaricom
  }
});

// ── GET /api/payments/status ─────────────────────────
router.get('/status', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    tier: user.tier,
    isPremium: user.isPremium(),
    subscriptionExpiresAt: user.subscriptionExpiresAt,
  });
});

module.exports = router;
