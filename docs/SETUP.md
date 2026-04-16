# ExamsForge by SmartSchool Digital
## Setup & Deployment Guide

---

## Overview

**ExamsForge** is a CBC Senior School (Grade 10–12) hybrid AI exam generator for Kenyan teachers.

### Key Features
- Grade 10, 11 & 12 CBC Senior School support only
- Hybrid generation: question bank → AI transformation pipeline
- No multiple choice — structured, short answer, and long answer questions only
- 19 senior school subjects with full strand/sub-strand mapping
- M-Pesa payment integration
- PDF export with professional cover page and marking scheme

### Architecture
```
Teacher submits settings
  → Query QuestionBank (MongoDB) for matching questions
  → selectBalancedQuestions() partitions by type/marks
  → buildHybridExamPrompt() sends seeds to Claude AI
  → AI transforms (rephrases, changes names/values, adjusts context)
  → Unique exam saved to Exam collection
  → PDF generated client-side
```

---

## Prerequisites

- Node.js v18+
- MongoDB Atlas or local MongoDB
- Anthropic API key (claude-sonnet-4-20250514)
- Safaricom Daraja API credentials (for M-Pesa)

---

## Installation

### 1. Clone / unzip the project

```bash
unzip examsforge.zip -d examsforge
cd examsforge
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/examsforge
JWT_SECRET=your_very_long_random_secret_here_min_32_chars
ANTHROPIC_API_KEY=sk-ant-...
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=174379
MPESA_PASSKEY=...
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/callback
NODE_ENV=production
```

### 4. Frontend setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://yourdomain.com/api
```

---

## Seed the Question Bank

After setting up MongoDB, run the seed script to populate the question bank with starter questions:

```bash
cd backend
node scripts/seedQuestionBank.js
```

This inserts ~30 verified CBC Grade 10–12 questions across Mathematics, Biology, Chemistry, Physics, History, Geography, and Business Studies.

**To add more questions**, either:
1. Edit `scripts/seedQuestionBank.js` and run it again
2. Insert directly into MongoDB using the `QuestionBank` schema
3. Build an admin UI using the `/api/exams/bank/stats` endpoint

The hybrid engine gracefully falls back to pure AI generation if the question bank has insufficient coverage for a given grade/subject/strand combination.

---

## Running in Development

```bash
# From root
npm run dev
```

Or individually:

```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

---

## Running in Production

```bash
# Build frontend
cd frontend && npm run build

# Start backend (serves frontend static files if configured)
cd backend && npm start
```

---

## Question Bank Schema

Each question bank entry contains:

| Field | Type | Description |
|---|---|---|
| `grade` | String | 'Grade 10', 'Grade 11', or 'Grade 12' |
| `subject` | String | Subject name |
| `strand` | String | CBC strand |
| `subStrand` | String | CBC sub-strand (optional) |
| `questionType` | String | short_answer / structured / long_answer / calculation / practical |
| `questionText` | String | The base question text |
| `answerGuide` | String | Marking guide with mark allocation |
| `marks` | Number | Mark value (1–20) |
| `difficulty` | String | easy / medium / hard |
| `tags` | [String] | Search/filter tags |
| `learningObjective` | String | CBC learning objective covered |
| `isActive` | Boolean | Whether available for generation |

---

## Hybrid Generation Logic

The engine targets **≥50% question bank coverage** to trigger hybrid mode:

- **Hybrid mode (≥50% coverage)**: Seeds from bank → AI transforms each question
- **Fallback mode (<50% coverage)**: Pure AI generation with no-MCQ guardrails

### Question Distribution (default)
| Section | Type | % of questions |
|---|---|---|
| Section A | Short answer (2 marks) | ~40% |
| Section B | Structured (4–6 marks) | ~35% |
| Section C | Long answer / calculation | ~25% |

---

## AI Guardrails

The AI prompt enforces:

1. Only **modify** retrieved questions — no new topic invention
2. Must rephrase every question (different names, values, contexts)
3. Preserve learning objective and difficulty level
4. Preserve approximate mark weight
5. No multiple choice questions anywhere
6. Use CBC action verbs and competency-based language
7. Use Kenyan names and places throughout

---

## Grades & Validation

Only `Grade 10`, `Grade 11`, and `Grade 12` are accepted. Any other grade value will return a 400 validation error. The `validateExamParams()` function in `backend/utils/examHelpers.js` enforces this.

---

## Exam Types Supported

- CAT
- Midterm
- End Term
- Pre-Mock
- Mock

---

## Payments (M-Pesa)

Payment routes are in `backend/routes/payments.js` (unchanged from original). Ensure Daraja API credentials are set in `.env`. The STK Push flow initiates on `/api/payments/initiate` and receives callbacks on `/api/payments/callback`.

---

## Branding

| Asset | Location |
|---|---|
| Product name | ExamsForge |
| Company | SmartSchool Digital |
| Navbar | `frontend/src/components/Navbar.jsx` |
| Landing page | `frontend/src/pages/LandingPage.jsx` |
| Meta/SEO | `frontend/index.html` |
| Footer | Inside `LandingPage.jsx` |

---

## Support

For setup assistance, contact SmartSchool Digital via WhatsApp.

---

*ExamsForge by SmartSchool Digital — CBC Senior School Exam Generator for Kenya*
