```js
/**
 * ExamsForge - Exam Generation Engine
 * File: /backend/engine/generateExam.js
 *
 * Builds structured exams using:
 * - Blueprint (structure)
 * - QuestionBank (DB)
 * - AI fallback
 */

const blueprintConfig = require('./examBlueprint');
const selectQuestion = require('./selectQuestion');

// -------------------------------
// 🎯 MAIN GENERATOR FUNCTION
// -------------------------------
async function generateExam({ subject, grade }) {
  const blueprint = blueprintConfig[subject];

  if (!blueprint) {
    throw new Error(`No blueprint found for subject: ${subject}`);
  }

  let examSections = [];
  let totalMarks = 0;

  // Loop through sections
  for (const section of blueprint.sections) {

    let sectionQuestions = [];
    let sectionMarks = 0;

    // Generate required number of questions
    for (let i = 0; i < section.questions; i++) {

      const difficulty = pickDifficulty(section.difficulty);

      const question = await selectQuestion({
        subject,
        grade,
        strands: section.strands,
        difficulty
      });

      sectionQuestions.push({
        questionText: question.questionText,
        marks: question.marks,
        difficulty: question.difficulty,
        strand: question.strand,
        subStrand: question.subStrand,
        answerGuide: question.answerGuide
      });

      sectionMarks += question.marks;
      totalMarks += question.marks;
    }

    examSections.push({
      section: section.name,
      type: section.type,
      questions: sectionQuestions,
      sectionMarks
    });
  }

  return {
    subject,
    grade,
    sections: examSections,
    totalMarks
  };
}

// -------------------------------
// 🎲 DIFFICULTY DISTRIBUTION
// -------------------------------
function pickDifficulty(distribution) {
  const rand = Math.random() * 100;
  let cumulative = 0;

  for (const level in distribution) {
    cumulative += distribution[level];
    if (rand <= cumulative) return level;
  }

  return "medium";
}

// -------------------------------
// 📦 EXPORT
// -------------------------------
module.exports = {
  generateExam
};
```
