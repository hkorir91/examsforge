```js
/**
 * ExamsForge - Question Selection Engine
 * File: /backend/engine/selectQuestion.js
 *
 * Logic:
 * 1. Try to fetch from QuestionBank (reliable)
 * 2. If none found → fallback to AI generator
 */

const QuestionBank = require('../models/QuestionBank');
const { generateAIQuestion } = require('./aiGenerator');

// -------------------------------
// 🎯 MAIN FUNCTION
// -------------------------------
async function selectQuestion({
  subject,
  grade,
  strands,
  difficulty
}) {
  try {

    // -------------------------------
    // 1️⃣ TRY DATABASE FIRST
    // -------------------------------
    const dbQuestion = await QuestionBank.aggregate([
      {
        $match: {
          subject,
          grade,
          strand: { $in: strands },
          difficulty
        }
      },
      { $sample: { size: 1 } }
    ]);

    if (dbQuestion.length > 0) {
      return dbQuestion[0];
    }

    // -------------------------------
    // 2️⃣ FALLBACK TO AI
    // -------------------------------
    console.log("⚠️ No DB question found, using AI...");

    const aiQuestion = await generateAIQuestion({
      subject,
      grade,
      strands,
      difficulty
    });

    return aiQuestion;

  } catch (error) {
    console.error("selectQuestion error:", error.message);
    throw new Error("Failed to select question");
  }
}

module.exports = selectQuestion;
```
