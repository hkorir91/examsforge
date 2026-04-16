/**
 * ExamsForge by SmartSchool Digital
 * examHelpers.js — Hybrid generation pipeline helpers
 *
 * Architecture:
 * 1. Retrieve question pool from bank (QuestionBank model)
 * 2. Select balanced set to fit marks/questions requested
 * 3. Pass to AI for controlled transformation
 * 4. AI rephrases, changes names/values/contexts — never invents new topics
 * 5. Build full exam JSON with marking scheme
 */

// ── Grade context for Senior School CBC ─────────────────
function getGradeContext(grade) {
  const contexts = {
    'Grade 10': 'CBC Senior School — Grade 10 (Age 15–16)',
    'Grade 11': 'CBC Senior School — Grade 11 (Age 16–17)',
    'Grade 12': 'CBC Senior School — Grade 12 (Age 17–18)',
  };
  return contexts[grade] || grade;
}

function getDuration(examType, marks) {
  if (examType === 'CAT') return marks <= 30 ? '45 minutes' : '1 hour';
  if (examType === 'Midterm') return marks <= 50 ? '1 hour 30 minutes' : '2 hours';
  if (examType === 'Pre-Mock' || examType === 'Mock') return marks >= 100 ? '2 hours 30 minutes' : '2 hours';
  return marks >= 100 ? '2 hours 30 minutes' : '2 hours'; // End Term
}

// ── Validate exam params ─────────────────────────────────
function validateExamParams(params) {
  const { grade, subject, strands, examType, term, year, totalMarks, totalQuestions, school } = params;

  if (!grade) return 'Grade is required.';
  if (!['Grade 10', 'Grade 11', 'Grade 12'].includes(grade)) {
    return 'Grade must be Grade 10, 11, or 12 (CBC Senior School).';
  }
  if (!subject) return 'Subject is required.';
  if (!strands || !Array.isArray(strands) || strands.length === 0) {
    return 'At least one strand must be selected.';
  }
  if (!examType || !['CAT', 'Midterm', 'End Term', 'Pre-Mock', 'Mock'].includes(examType)) {
    return 'Exam type must be CAT, Midterm, End Term, Pre-Mock, or Mock.';
  }
  if (!term) return 'Term is required.';
  if (!year || isNaN(year)) return 'Valid year is required.';
  if (!totalMarks || totalMarks < 10 || totalMarks > 150) {
    return 'Total marks must be between 10 and 150.';
  }
  if (!totalQuestions || totalQuestions < 5 || totalQuestions > 50) {
    return 'Total questions must be between 5 and 50.';
  }
  if (!school || school.trim().length < 2) return 'School name is required.';

  return null;
}

// ── Select balanced question set from pool ───────────────
/**
 * Given a pool of questions from the bank, select a balanced subset
 * that roughly fits totalMarks and totalQuestions.
 *
 * Distribution:
 *  - Section A: Short answer (2 marks each) — ~40% of questions
 *  - Section B: Structured (4-6 marks) — ~35% of questions
 *  - Section C: Long answer/calc (8-10 marks) — ~25% of questions
 */
function selectBalancedQuestions(pool, totalMarks, totalQuestions) {
  if (!pool || pool.length === 0) return { sectionA: [], sectionB: [], sectionC: [] };

  const saCount = Math.round(totalQuestions * 0.4);
  const strCount = Math.round(totalQuestions * 0.35);
  const laCount = totalQuestions - saCount - strCount;

  // Partition pool by question type / marks
  const shortAnswer = pool.filter(q => q.marks <= 3 || q.questionType === 'short_answer');
  const structured = pool.filter(q => (q.marks >= 4 && q.marks <= 7) || q.questionType === 'structured');
  const longAnswer = pool.filter(q => q.marks >= 8 || q.questionType === 'long_answer' || q.questionType === 'calculation' || q.questionType === 'practical');

  // Shuffle each group for variety
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const sectionA = shuffle(shortAnswer).slice(0, saCount);
  const sectionB = shuffle(structured).slice(0, strCount);
  const sectionC = shuffle(longAnswer).slice(0, laCount);

  // Fallback: if not enough in any category, fill from remaining pool
  const used = new Set([...sectionA, ...sectionB, ...sectionC].map(q => q._id?.toString()));
  const remaining = shuffle(pool.filter(q => !used.has(q._id?.toString())));

  const fillA = saCount - sectionA.length;
  const fillB = strCount - sectionB.length;
  const fillC = laCount - sectionC.length;

  if (fillA > 0) sectionA.push(...remaining.splice(0, fillA));
  if (fillB > 0) sectionB.push(...remaining.splice(0, fillB));
  if (fillC > 0) sectionC.push(...remaining.splice(0, fillC));

  return { sectionA, sectionB, sectionC };
}

// ── Build hybrid prompt ──────────────────────────────────
/**
 * Builds the AI transformation prompt.
 *
 * The AI receives a structured set of seed questions from the question bank
 * and is instructed to transform them — not invent new content.
 *
 * AI guardrails:
 * - ONLY modify retrieved questions
 * - Do NOT invent entirely new topics
 * - Preserve curriculum objective and difficulty
 * - Preserve approximate mark weight
 * - Output must be teacher-ready and professional
 */
function buildHybridExamPrompt({
  grade, subject, strands, substrands, examType, term, year,
  totalMarks, totalQuestions, school,
  sectionASeeds, sectionBSeeds, sectionCSeeds,
}) {
  const gradeContext = getGradeContext(grade);
  const duration = getDuration(examType, totalMarks);
  const strandList = strands.join(', ');
  const substrandList = substrands.length > 0 ? substrands.join(', ') : 'All sub-strands within selected strands';

  const saMarks = sectionASeeds.reduce((s, q) => s + (q.marks || 2), 0);
  const sbMarks = sectionBSeeds.reduce((s, q) => s + (q.marks || 5), 0);
  const scMarks = sectionCSeeds.reduce((s, q) => s + (q.marks || 9), 0);

  // Format seed questions for the prompt
  const formatSeeds = (seeds, section) =>
    seeds.map((q, i) => `  Q${i + 1} [${q.marks || '?'} marks, ${q.difficulty || 'medium'}, type: ${q.questionType || 'structured'}]:
    Original text: "${q.questionText}"
    Answer guide: "${q.answerGuide}"`).join('\n');

  const hasSectionA = sectionASeeds.length > 0;
  const hasSectionB = sectionBSeeds.length > 0;
  const hasSectionC = sectionCSeeds.length > 0;

  return `You are a senior Kenyan CBC curriculum examiner for ${gradeContext}.

Your task is to TRANSFORM the provided seed questions into a complete, unique exam paper.

CRITICAL RULES — AI GUARDRAILS:
1. ONLY transform the provided seed questions. Do NOT invent entirely new topics.
2. You MUST rephrase every question — change wording, names, values, contexts, scenarios.
3. Use Kenyan names: Amina, Wanjiku, Kipchoge, Otieno, Njeri, Baraka, Fatuma, Kamau, Aisha, Linet
4. Use Kenyan places: Nairobi, Kisumu, Mombasa, Nakuru, Eldoret, Kisii, Thika, Nyeri, Garissa
5. Preserve each question's learning objective, curriculum strand, and approximate difficulty.
6. Preserve approximate mark weight — do not significantly change marks allocation.
7. No multiple choice questions anywhere. All questions must be structured, short answer, or long answer.
8. Use competency-based/action-oriented CBC phrasing: "Analyse", "Evaluate", "Explain how", "Calculate", "Describe", "Justify"
9. Output must be teacher-ready, professional, and exam-standard.

EXAM SPECIFICATIONS:
- School: ${school}
- Grade: ${grade} (${gradeContext})
- Subject: ${subject}
- Strand(s): ${strandList}
- Sub-strand(s): ${substrandList}
- Exam Type: ${examType}
- Term: ${term}, ${year}
- Total Marks: ${totalMarks}
- Duration: ${duration}
- Total Questions: ${totalQuestions}

SEED QUESTIONS TO TRANSFORM:
${hasSectionA ? `\nSECTION A SEEDS (Short Answer, ~${saMarks} marks total):\n${formatSeeds(sectionASeeds, 'A')}` : ''}
${hasSectionB ? `\nSECTION B SEEDS (Structured Questions, ~${sbMarks} marks total):\n${formatSeeds(sectionBSeeds, 'B')}` : ''}
${hasSectionC ? `\nSECTION C SEEDS (Long Answer / Calculations, ~${scMarks} marks total):\n${formatSeeds(sectionCSeeds, 'C')}` : ''}

OUTPUT FORMAT — Return ONLY a valid JSON object. No explanation, no markdown, no text outside the JSON.

{
  "title": "${grade} ${subject} ${examType} Examination",
  "time": "${duration}",
  "instructions": [
    "Write your name, admission number, and class clearly at the top of the answer booklet.",
    "Answer ALL questions in each section.",
    "In Section A, write concise answers in the spaces provided.",
    "In Sections B and C, show all working clearly where calculations are involved.",
    "All answers must be written in the answer booklet provided.",
    "Mobile phones and electronic devices are NOT permitted in the examination room."
  ],
  "sectionA": {
    "marks": ${saMarks || Math.round(totalMarks * 0.3)},
    "instruction": "Answer ALL questions in this section. Write your answers concisely in the spaces provided.",
    "questions": [
      {
        "num": 1,
        "text": "Transformed question text (Kenyan context, CBC language)",
        "marks": 2,
        "questionType": "short_answer",
        "answer": "Model answer: Main point (1 mark). Supporting detail/example (1 mark)."
      }
    ]
  },
  "sectionB": {
    "marks": ${sbMarks || Math.round(totalMarks * 0.4)},
    "instruction": "Answer ALL questions in this section. Show your working clearly where applicable.",
    "questions": [
      {
        "num": ${sectionASeeds.length + 1},
        "text": "Structured question with sub-parts:\\n(a) First part (2 marks)\\n(b) Second part (3 marks)",
        "marks": 5,
        "questionType": "structured",
        "answer": "(a) Model answer part a — 2 marks: [answer]\\n(b) Model answer part b — 3 marks: [answer]"
      }
    ]
  },
  "sectionC": {
    "marks": ${scMarks || Math.round(totalMarks * 0.3)},
    "instruction": "Answer ALL questions in this section. Show all working clearly. Marks are awarded for correct method as well as correct answers.",
    "questions": [
      {
        "num": ${sectionASeeds.length + sectionBSeeds.length + 1},
        "text": "Extended/calculation question:\\n(a) Part a (3 marks)\\n(b) Part b (3 marks)\\n(c) Part c (4 marks)",
        "marks": 10,
        "questionType": "long_answer",
        "answer": "(a) Model answer — 3 marks: [detailed answer]\\n(b) Model answer — 3 marks: [detailed answer]\\n(c) Model answer — 4 marks: [detailed answer]"
      }
    ]
  }
}

Transform ALL ${totalQuestions} seed questions now. Ensure JSON is complete and valid.`;
}

// ── Fallback: pure AI prompt (no question bank hits) ─────
/**
 * Used when the question bank has insufficient questions for the request.
 * Still no MCQ — all structured/short/long answer questions.
 */
function buildFallbackExamPrompt({
  grade, subject, strands, substrands, examType, term, year,
  totalMarks, totalQuestions, school,
}) {
  const gradeContext = getGradeContext(grade);
  const duration = getDuration(examType, totalMarks);
  const strandList = strands.join(', ');
  const substrandList = substrands.length > 0 ? substrands.join(', ') : `All sub-strands within ${strandList}`;

  const saCount = Math.round(totalQuestions * 0.4);
  const sbCount = Math.round(totalQuestions * 0.35);
  const scCount = totalQuestions - saCount - sbCount;

  const saMarks = saCount * 2;
  const sbMarks = sbCount * 5;
  const scMarks = totalMarks - saMarks - sbMarks;
  const scPerQ = scCount > 0 ? Math.round(scMarks / scCount) : 0;

  return `You are a highly experienced Kenyan CBC curriculum specialist and senior examiner for ${gradeContext}.

Generate a COMPLETE, HIGH-QUALITY ${examType} examination paper with these specifications:

EXAMINATION DETAILS:
- School: ${school}
- Grade/Class: ${grade} (${gradeContext})
- Subject: ${subject}
- Strand(s): ${strandList}
- Sub-Strand(s): ${substrandList}
- Exam Type: ${examType}
- Term: ${term}, ${year}
- Total Marks: ${totalMarks}
- Duration: ${duration}
- Total Questions: ${totalQuestions}

QUESTION DISTRIBUTION:
- Section A (Short Answer): ${saCount} questions × 2 marks = ${saMarks} marks
- Section B (Structured): ${sbCount} questions × 5 marks = ${sbMarks} marks
- Section C (Long Answer / Calculations): ${scCount} questions × ${scPerQ} marks = ${scMarks} marks

CRITICAL CBC REQUIREMENTS:
1. ALL questions must align with Kenya CBC Senior School competency-based approach
2. NO multiple choice questions. Structured, short answer, and long answer ONLY.
3. Use Kenyan names: Amina, Wanjiku, Kipchoge, Otieno, Njeri, Baraka, Fatuma, Kamau
4. Use Kenyan places: Nairobi, Kisumu, Mombasa, Nakuru, Eldoret, Kisii, Thika, Nyeri
5. Questions must be appropriate for ${grade} CBC Senior School learners
6. Use CBC action verbs: Analyse, Evaluate, Explain, Calculate, Describe, Justify, Differentiate
7. Distribute difficulty: 30% foundational, 50% developing, 20% extending
8. All questions unambiguous and clearly worded
9. Marking scheme must be detailed with per-mark breakdown
10. Questions must map to the specified strands

SECTION A — Short Answer:
- 2-4 sentence concise answers required
- Test understanding and application of core concepts
- 2 marks each: 1 mark per valid point

SECTION B — Structured Questions:
- Multi-part questions labelled (a), (b), (c)
- Test analysis and application
- Include mark breakdown per part

SECTION C — Long Answer / Calculation / Practical:
- Extended questions requiring detailed responses or multi-step calculations
- Test higher-order thinking: analysis, synthesis, evaluation
- Include complete model answers with mark allocation

Return ONLY a valid JSON object. No explanation, no markdown, no text outside the JSON.

{
  "title": "${grade} ${subject} ${examType} Examination",
  "time": "${duration}",
  "instructions": [
    "Write your name, admission number, and class clearly at the top of the answer booklet.",
    "Answer ALL questions in each section.",
    "In Section A, write concise answers in the spaces provided.",
    "In Sections B and C, show all working clearly where calculations are involved.",
    "All answers must be written in the answer booklet provided.",
    "Mobile phones and electronic devices are NOT permitted in the examination room."
  ],
  "sectionA": {
    "marks": ${saMarks},
    "instruction": "Answer ALL questions in this section. Write your answers concisely in the spaces provided. Each question carries 2 marks.",
    "questions": [
      {
        "num": 1,
        "text": "Short answer question in Kenyan CBC context",
        "marks": 2,
        "questionType": "short_answer",
        "answer": "Model answer: Point 1 (1 mark). Point 2 with elaboration (1 mark)."
      }
    ]
  },
  "sectionB": {
    "marks": ${sbMarks},
    "instruction": "Answer ALL questions in this section. Show your working clearly. Marks are allocated as shown.",
    "questions": [
      {
        "num": ${saCount + 1},
        "text": "Structured question with sub-parts:\\n(a) Part a of question (2 marks)\\n(b) Part b of question (3 marks)",
        "marks": 5,
        "questionType": "structured",
        "answer": "(a) Answer for part a — 2 marks: [answer with mark breakdown]\\n(b) Answer for part b — 3 marks: [answer with mark breakdown]"
      }
    ]
  },
  "sectionC": {
    "marks": ${scMarks},
    "instruction": "Answer ALL questions in this section. Show all working clearly. Marks are awarded for correct method as well as correct answers.",
    "questions": [
      {
        "num": ${saCount + sbCount + 1},
        "text": "Extended question:\\n(a) Part a (${Math.round(scPerQ * 0.3)} marks)\\n(b) Part b (${Math.round(scPerQ * 0.35)} marks)\\n(c) Part c (${scPerQ - Math.round(scPerQ * 0.3) - Math.round(scPerQ * 0.35)} marks)",
        "marks": ${scPerQ},
        "questionType": "long_answer",
        "answer": "(a) Model answer — ${Math.round(scPerQ * 0.3)} marks: [detailed model answer]\\n(b) Model answer — ${Math.round(scPerQ * 0.35)} marks: [detailed model answer]\\n(c) Model answer — ${scPerQ - Math.round(scPerQ * 0.3) - Math.round(scPerQ * 0.35)} marks: [detailed model answer]"
      }
    ]
  }
}

Generate all ${totalQuestions} questions now. Ensure JSON is complete and valid.`;
}

module.exports = {
  buildHybridExamPrompt,
  buildFallbackExamPrompt,
  validateExamParams,
  selectBalancedQuestions,
  getDuration,
  getGradeContext,
};
