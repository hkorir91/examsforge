```js
/**
 * ExamsForge - Question Selection Engine (FULL VERSION)
 * File: /backend/engine/selectQuestion.js
 *
 * Responsibilities:
 * - Fetch from DB (priority)
 * - Fallback to AI if needed
 * - Attach diagrams when required
 */

const QuestionBank = require('../models/QuestionBank');
const { generateAIQuestion } = require('./aiGenerator');
const { generateDiagram } = require('./diagramGenerator');

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
    const dbResult = await QuestionBank.aggregate([
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

    if (dbResult.length > 0) {
      let question = normalizeQuestion(dbResult[0]);

      // Add diagram if needed
      if (needsDiagram(question.questionText)) {
        try {
          const svg = await generateDiagram(question.questionText);
          question.diagram = svg;
        } catch (err) {
          console.warn("Diagram generation failed (DB question):", err.message);
        }
      }

      return question;
    }

    // -------------------------------
    // 2️⃣ FALLBACK TO AI
    // -------------------------------
    console.log("⚠️ No DB question found → using AI");

    let aiQuestion = await generateAIQuestion({
      subject,
      grade,
      strands,
      difficulty
    });

    let question = normalizeQuestion(aiQuestion);

    // Add diagram if needed
    if (needsDiagram(question.questionText)) {
      try {
        const svg = await generateDiagram(question.questionText);
        question.diagram = svg;
      } catch (err) {
        console.warn("Diagram generation failed (AI question):", err.message);
      }
    }

    return question;

  } catch (error) {
    console.error("❌ selectQuestion error:", error.message);
    throw new Error("Failed to select question");
  }
}

// -------------------------------
// 🧹 NORMALIZE STRUCTURE
// -------------------------------
function normalizeQuestion(q) {
  return {
    questionText: q.questionText,
    marks: q.marks,
    difficulty: q.difficulty,
    strand: q.strand,
    subStrand: q.subStrand,
    answerGuide: q.answerGuide,
    diagram: q.diagram || null
  };
}

// -------------------------------
// 🧠 DIAGRAM DETECTION
// -------------------------------
function needsDiagram(text) {
  if (!text) return false;

  const keywords = [
    "diagram",
    "draw",
    "illustrate",
    "label",
    "sketch",
    "figure"
  ];

  return keywords.some(k => text.toLowerCase().includes(k));
}

// -------------------------------
// 📦 EXPORT
// -------------------------------
module.exports = selectQuestion;
```
