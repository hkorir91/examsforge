```js
/**
 * ExamsForge - Exam Validation Engine
 * File: /backend/engine/validateExam.js
 *
 * Ensures generated exams meet:
 * - Mark accuracy
 * - No duplication
 * - Structural integrity
 * - Blueprint compliance
 */

const blueprintConfig = require('./examBlueprint');

// -------------------------------
// 🛡️ MAIN VALIDATION FUNCTION
// -------------------------------
function validateExam(exam) {
  if (!exam || !exam.sections) {
    throw new Error("Invalid exam structure");
  }

  const blueprint = blueprintConfig[exam.subject];
  if (!blueprint) {
    throw new Error(`No blueprint found for subject: ${exam.subject}`);
  }

  let totalMarks = 0;
  const seenQuestions = new Set();

  // -------------------------------
  // 🔍 VALIDATE EACH SECTION
  // -------------------------------
  exam.sections.forEach((section, index) => {
    const blueprintSection = blueprint.sections[index];

    if (!blueprintSection) {
      throw new Error(`Unexpected section: ${section.section}`);
    }

    // 1. Check question count
    if (section.questions.length !== blueprintSection.questions) {
      throw new Error(
        `Section ${section.section} must have ${blueprintSection.questions} questions`
      );
    }

    let sectionMarks = 0;

    section.questions.forEach((q, i) => {
      // 2. Required fields
      if (!q.questionText || !q.answerGuide) {
        throw new Error(`Invalid question at ${section.section}, Q${i + 1}`);
      }

      // 3. Prevent duplicates
      if (seenQuestions.has(q.questionText)) {
        throw new Error(`Duplicate question detected in ${section.section}`);
      }
      seenQuestions.add(q.questionText);

      // 4. Validate marks
      if (!q.marks || q.marks <= 0) {
        throw new Error(`Invalid marks in ${section.section}, Q${i + 1}`);
      }

      sectionMarks += q.marks;
      totalMarks += q.marks;

      // 5. Validate strand alignment
      if (!blueprintSection.strands.includes(q.strand)) {
        throw new Error(
          `Invalid strand "${q.strand}" in ${section.section}`
        );
      }
    });

    // 6. Section marks validation (tolerance allowed due to AI variation)
    const expected = blueprintSection.marks;
    const tolerance = 2; // allow ±2 marks flexibility

    if (Math.abs(sectionMarks - expected) > tolerance) {
      throw new Error(
        `Section ${section.section} marks mismatch: expected ~${expected}, got ${sectionMarks}`
      );
    }
  });

  // -------------------------------
  // 🎯 TOTAL MARKS VALIDATION
  // -------------------------------
  const expectedTotal = blueprint.totalMarks;
  const tolerance = 3;

  if (Math.abs(totalMarks - expectedTotal) > tolerance) {
    throw new Error(
      `Total marks mismatch: expected ~${expectedTotal}, got ${totalMarks}`
    );
  }

  return {
    valid: true,
    totalMarks
  };
}

// -------------------------------
// 📦 EXPORT
// -------------------------------
module.exports = {
  validateExam
};
```
