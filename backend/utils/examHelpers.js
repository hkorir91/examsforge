/**
 * ExamsForge by SmartSchool Digital
 * examHelpers.js — Phase 2: Subject-Aware Hybrid Generation Pipeline
 *
 * Architecture:
 * 1. Retrieve question pool from bank (QuestionBank model)
 * 2. Select balanced set to fit marks/questions requested
 * 3. Build subject-specific AI prompt with correct question formats
 * 4. AI transforms seed questions with Kenyan context
 * 5. Build full exam JSON with marking scheme
 */

// ── Grade context ────────────────────────────────────────
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
  return marks >= 100 ? '2 hours 30 minutes' : '2 hours';
}

// ── Subject classification ───────────────────────────────
const SUBJECT_TYPES = {
  // Sciences — require calculations, experiments, diagrams
  science: ['Biology', 'Chemistry', 'Physics', 'General Science'],
  // Mathematics — require working shown, calculations, proofs
  mathematics: ['Mathematics', 'Essential Mathematics'],
  // Languages — require comprehension passages, grammar, composition
  language: ['English', 'Kiswahili', 'Arabic', 'French', 'German', 'Chinese',
    'Indigenous Languages', 'Literature in English', 'Fasihi ya Kiswahili',
    'Sign Language', 'Kenyan Sign Language'],
  // Humanities — require case studies, source analysis, essays
  humanities: ['History and Citizenship', 'Geography', 'CRE', 'IRE', 'HRE',
    'Business Studies', 'Life Skills Education', 'Community Service Learning'],
  // Technical — require practical procedures, tools, safety
  technical: ['Agriculture', 'Computer Studies', 'Home Science', 'Aviation',
    'Building and Construction', 'Electricity', 'Drawing and Design',
    'Marine and Fisheries', 'Metalwork', 'Power Mechanics', 'Woodwork',
    'Media Technology'],
  // Arts & Sports — require practical knowledge, performance, technique
  arts: ['Art and Design', 'Music and Dance', 'Theatre and Film', 'Fine Arts',
    'Sports and Recreation', 'Physical Education'],
};

function getSubjectType(subject) {
  for (const [type, subjects] of Object.entries(SUBJECT_TYPES)) {
    if (subjects.includes(subject)) return type;
  }
  return 'humanities';
}

// ── Subject-specific instructions ───────────────────────
function getSubjectInstructions(subject, examType, totalMarks) {
  const type = getSubjectType(subject);

  const base = {
    science: `
SCIENCE-SPECIFIC REQUIREMENTS:
- Include at least ONE question requiring a labelled diagram or description of experimental apparatus
- Include questions on safety precautions where relevant
- For Chemistry: include at least one equation or calculation question
- For Biology: include questions on structure and function, not just definitions
- For Physics: include at least one calculation showing formula, substitution, and answer with units
- Practical questions should ask learners to describe procedures step by step
- Use data/results tables where appropriate for analysis questions`,

    mathematics: `
MATHEMATICS-SPECIFIC REQUIREMENTS:
- ALL calculation questions must show: state formula → substitute values → solve → state answer with units
- Include questions from Number/Algebra, Geometry, Statistics — balanced coverage
- Word problems must use Kenyan contexts (selling maize, building a fence, calculating interest at Equity Bank)
- Never ask learners to "state" or "define" — all questions must require working or application
- Section C must include multi-step problems requiring 3+ calculation steps
- Answers must show complete working — method marks awarded even if final answer is wrong
- Include at least one geometry/construction question with measurements`,

    language: `
LANGUAGE-SPECIFIC REQUIREMENTS:
- Section A: Grammar, vocabulary, and language use questions (fill gaps, identify errors, explain usage)
- Section B: Comprehension questions based on a SHORT passage (4–6 sentences) set in Kenyan context
  * Include: main idea, inference, vocabulary in context, and language feature questions
  * Passage MUST be included in the question text itself
- Section C: Composition/essay question with clear instructions
  * Give learners a choice of TWO topics (they answer ONE)
  * Topics must be relevant to Kenyan senior school learners
- For Kiswahili: use Kiswahili throughout — all questions, answers, instructions
- For Arabic: include Arabic script where appropriate
- Avoid testing memorisation — test understanding and application`,

    humanities: `
HUMANITIES-SPECIFIC REQUIREMENTS:
- Include at least ONE source-based or data-based question (map extract, graph, table, photograph description, quote)
- Geography: include map work / sketch map question in at least one section
- History: include a source analysis question with a short extract followed by questions
- Business Studies: use Kenyan business examples (M-Pesa, Equity Bank, Safaricom, Nakumatt, local markets)
- CRE/IRE/HRE: questions must test understanding and application of values, not just recitation
- Avoid pure recall questions — test application, analysis, and evaluation
- Essays in Section C must have clear marking criteria with awarded marks per point`,

    technical: `
TECHNICAL SUBJECT REQUIREMENTS:
- Include questions on tools, materials, and equipment used in the subject
- Include safety precautions and procedures
- Agriculture: include questions on specific crops/livestock common in Kenya (maize, beans, dairy cattle, poultry)
- Computer Studies: include programming logic, flowcharts, or pseudocode questions
- Home Science: include nutrition calculations, meal planning, or garment construction questions
- Aviation/Electricity/Power Mechanics: include questions on regulations, safety standards, and calculations
- Include at least one question requiring a step-by-step procedure or process description
- Use Kenyan industry examples and local context throughout`,

    arts: `
ARTS AND PHYSICAL EDUCATION REQUIREMENTS:
- Music and Dance: include music notation, theory questions, AND performance technique
- Theatre and Film: include script analysis, staging, or character development questions
- Art and Design: include questions on techniques, elements of art, and Kenyan/African art traditions
- Physical Education: include fitness principles, rules of games, health concepts
- Sports and Recreation: include biomechanics, training methods, sports psychology basics
- Questions must test both knowledge AND practical understanding
- Include questions that reference Kenyan cultural arts, sports personalities, or local events`,
  };

  return base[type] || base.humanities;
}

// ── Subject-specific question format rules ───────────────
function getQuestionFormatRules(subject) {
  const type = getSubjectType(subject);

  const formats = {
    science: `
QUESTION FORMAT FOR SCIENCE:
Section A (Short Answer — 2 marks each):
  - "Define the term ___" or "State TWO functions of ___"
  - "Give TWO differences between ___ and ___"
  - "Name the instrument used to ___"

Section B (Structured — 5–8 marks, multi-part):
  - (a) Describe the structure of ___ (2 marks)
  - (b) Explain how ___ works (3 marks)
  - (c) State ONE safety precaution when handling ___ (1 mark)

Section C (Long Answer — 10–15 marks):
  - Extended experiment/calculation question
  - Include data table, graph interpretation, or multi-step calculation
  - Must include: observation → analysis → conclusion format for practicals`,

    mathematics: `
QUESTION FORMAT FOR MATHEMATICS:
Section A (Short Answer — 2–3 marks each):
  - Direct calculation questions
  - "Simplify", "Evaluate", "Solve for x"

Section B (Structured — 5–8 marks, multi-part):
  - Multi-step problems with labelled sub-parts (a), (b), (c)
  - Word problems in Kenyan context

Section C (Long Answer / Extended Calculation — 10–15 marks):
  - Complex multi-step problems
  - Proof or derivation questions
  - Applied problems requiring interpretation`,

    language: `
QUESTION FORMAT FOR LANGUAGE:
Section A (Language Use — 2 marks each):
  - Grammar identification, correction, or completion
  - Vocabulary in context
  - Language feature identification

Section B (Comprehension — structured around a passage):
  - Provide a 4–6 sentence passage in Kenyan context
  - Questions: main idea, inference, vocabulary, language feature

Section C (Composition / Essay):
  - Provide TWO topic choices — learner answers ONE
  - Clear word count or length guidance
  - Mark allocation: Content, Organisation, Language use`,

    humanities: `
QUESTION FORMAT FOR HUMANITIES:
Section A (Short Answer — 2 marks each):
  - "Define", "State", "Identify", "Give ONE example of"
  - Data/map/source reference questions

Section B (Structured — 5–8 marks):
  - Multi-part questions with source, map, or data stimulus
  - (a) From the source/map, identify ___ (2 marks)
  - (b) Explain ___ (3 marks)
  - (c) Suggest how ___ (2 marks)

Section C (Essay / Extended Response — 10–15 marks):
  - "Discuss", "Analyse", "Evaluate", "Examine"
  - Clear marking guide: 1 mark per valid point, up to maximum
  - Introduction, body points, conclusion expected`,

    technical: `
QUESTION FORMAT FOR TECHNICAL SUBJECTS:
Section A (Short Answer — 2 marks each):
  - "Name", "State", "List TWO"
  - Tool/material identification
  - Safety rule questions

Section B (Structured — 5–8 marks):
  - Process/procedure questions with steps
  - Diagram labelling or description
  - Calculation questions (where applicable)

Section C (Extended / Project — 10–15 marks):
  - Design a solution to a given problem
  - Plan a project or procedure step-by-step
  - Evaluate advantages and disadvantages of a method`,

    arts: `
QUESTION FORMAT FOR ARTS AND PE:
Section A (Short Answer — 2 marks each):
  - "Define", "Name", "State TWO rules of"
  - Identify elements/principles/techniques

Section B (Structured — 5–8 marks):
  - Analysis of a technique, performance, or artwork
  - Describe how to perform/create ___
  - Compare two styles/techniques

Section C (Extended — 10–15 marks):
  - "Describe in detail how you would prepare for/perform/create ___"
  - Analysis of a Kenyan cultural art form or sport
  - Planning/choreography/composition question`,
  };

  return formats[type] || formats.humanities;
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

// ── Select balanced question set ─────────────────────────
function selectBalancedQuestions(pool, totalMarks, totalQuestions) {
  if (!pool || pool.length === 0) return { sectionA: [], sectionB: [], sectionC: [] };

  const saCount = Math.round(totalQuestions * 0.4);
  const strCount = Math.round(totalQuestions * 0.35);
  const laCount = totalQuestions - saCount - strCount;

  const shortAnswer = pool.filter(q => q.marks <= 3 || q.questionType === 'short_answer');
  const structured = pool.filter(q => (q.marks >= 4 && q.marks <= 7) || q.questionType === 'structured');
  const longAnswer = pool.filter(q => q.marks >= 8 || q.questionType === 'long_answer' || q.questionType === 'calculation' || q.questionType === 'practical');

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const sectionA = shuffle(shortAnswer).slice(0, saCount);
  const sectionB = shuffle(structured).slice(0, strCount);
  const sectionC = shuffle(longAnswer).slice(0, laCount);

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
function buildHybridExamPrompt({
  grade, subject, strands, substrands, examType, term, year,
  totalMarks, totalQuestions, school,
  sectionASeeds, sectionBSeeds, sectionCSeeds,
  sectionCount = 3,
}) {
  const gradeContext = getGradeContext(grade);
  const duration = getDuration(examType, totalMarks);
  const strandList = strands.join(', ');
  const substrandList = substrands.length > 0 ? substrands.join(', ') : 'All sub-strands within selected strands';
  const subjectInstructions = getSubjectInstructions(subject, examType, totalMarks);
  const questionFormats = getQuestionFormatRules(subject);

  const saMarks = sectionASeeds.reduce((s, q) => s + (q.marks || 2), 0);
  const sbMarks = sectionBSeeds.reduce((s, q) => s + (q.marks || 5), 0);
  const scMarks = sectionCSeeds.reduce((s, q) => s + (q.marks || 9), 0);

  const formatSeeds = (seeds) =>
    seeds.map((q, i) => `  Q${i + 1} [${q.marks || '?'} marks, ${q.difficulty || 'medium'}, type: ${q.questionType || 'structured'}]:
    Original text: "${q.questionText}"
    Answer guide: "${q.answerGuide}"`).join('\n');

  const hasSectionA = sectionASeeds.length > 0;
  const hasSectionB = sectionBSeeds.length > 0;
  const hasSectionC = sectionCSeeds.length > 0 && sectionCount >= 3;

  return `You are a senior Kenyan CBC curriculum examiner specialising in ${subject} for ${gradeContext}.

Your task is to TRANSFORM the provided seed questions into a complete, professional ${subject} exam paper.

CRITICAL RULES — AI GUARDRAILS:
1. ONLY transform the provided seed questions. Do NOT invent entirely new topics.
2. You MUST rephrase every question — change wording, names, values, contexts, scenarios.
3. Use Kenyan names: Amina, Wanjiku, Kipchoge, Otieno, Njeri, Baraka, Fatuma, Kamau, Aisha, Linet, Mwangi, Chebet
4. Use Kenyan places: Nairobi, Kisumu, Mombasa, Nakuru, Eldoret, Kisii, Thika, Nyeri, Garissa, Kitale, Kakamega
5. Preserve each question's learning objective, curriculum strand, and approximate difficulty.
6. Preserve approximate mark weight — do not significantly change marks allocation.
7. ABSOLUTELY NO multiple choice questions anywhere in the paper.
8. Use competency-based CBC action verbs: Analyse, Evaluate, Explain, Calculate, Describe, Justify, Differentiate, Assess, Examine, Outline
9. Output must be teacher-ready, professional, and match Kenya national exam standards.

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
- Number of Sections: ${sectionCount}
${subjectInstructions}
${questionFormats}

SEED QUESTIONS TO TRANSFORM:
${hasSectionA ? `\nSECTION A SEEDS (Short Answer, ~${saMarks} marks total):\n${formatSeeds(sectionASeeds)}` : ''}
${hasSectionB ? `\nSECTION B SEEDS (Structured Questions, ~${sbMarks} marks total):\n${formatSeeds(sectionBSeeds)}` : ''}
${hasSectionC ? `\nSECTION C SEEDS (Long Answer / Calculations, ~${scMarks} marks total):\n${formatSeeds(sectionCSeeds)}` : ''}

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
        "text": "Transformed question text in Kenyan CBC context",
        "marks": 2,
        "questionType": "short_answer",
        "answer": "Model answer: Main point (1 mark). Supporting detail (1 mark)."
      }
    ]
  },
  "sectionB": {
    "marks": ${sbMarks || Math.round(totalMarks * 0.4)},
    "instruction": "Answer ALL questions in this section. Show your working clearly where applicable.",
    "questions": [
      {
        "num": ${sectionASeeds.length + 1},
        "text": "Structured question:\\n(a) First part (2 marks)\\n(b) Second part (3 marks)",
        "marks": 5,
        "questionType": "structured",
        "answer": "(a) Answer part a — 2 marks: [answer]\\n(b) Answer part b — 3 marks: [answer]"
      }
    ]
  },
  "sectionC": {
    "marks": ${scMarks || Math.round(totalMarks * 0.3)},
    "instruction": "Answer ALL questions in this section. Show all working clearly. Marks are awarded for correct method as well as correct answers.",
    "questions": [
      {
        "num": ${sectionASeeds.length + sectionBSeeds.length + 1},
        "text": "Extended question:\\n(a) Part a (3 marks)\\n(b) Part b (3 marks)\\n(c) Part c (4 marks)",
        "marks": 10,
        "questionType": "long_answer",
        "answer": "(a) Answer — 3 marks: [detailed]\\n(b) Answer — 3 marks: [detailed]\\n(c) Answer — 4 marks: [detailed]"
      }
    ]
  }
}

Transform ALL ${totalQuestions} seed questions now. Ensure JSON is complete and valid.`;
}

// ── Fallback: pure AI prompt ─────────────────────────────
function buildFallbackExamPrompt({
  grade, subject, strands, substrands, examType, term, year,
  totalMarks, totalQuestions, school,
  sectionCount = 3,
}) {
  const gradeContext = getGradeContext(grade);
  const duration = getDuration(examType, totalMarks);
  const strandList = strands.join(', ');
  const substrandList = substrands.length > 0 ? substrands.join(', ') : `All sub-strands within ${strandList}`;
  const subjectInstructions = getSubjectInstructions(subject, examType, totalMarks);
  const questionFormats = getQuestionFormatRules(subject);

  const saCount = Math.round(totalQuestions * 0.4);
  const sbCount = Math.round(totalQuestions * 0.35);
  const scCount = sectionCount >= 3 ? totalQuestions - saCount - sbCount : 0;
  const effectiveSbCount = sectionCount >= 2 ? sbCount : totalQuestions - saCount;

  const saMarks = saCount * 2;
  const sbMarks = sectionCount >= 2 ? Math.round(totalMarks * 0.4) : totalMarks - saMarks;
  const scMarks = sectionCount >= 3 ? totalMarks - saMarks - sbMarks : 0;
  const scPerQ = scCount > 0 ? Math.round(scMarks / scCount) : 0;

  return `You are a highly experienced Kenyan CBC curriculum specialist and senior examiner for ${subject} at ${gradeContext}.

Generate a COMPLETE, PROFESSIONAL ${examType} examination paper that meets Kenya national exam standards.

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
- Number of Sections: ${sectionCount}

QUESTION DISTRIBUTION:
- Section A (Short Answer): ${saCount} questions × 2 marks = ${saMarks} marks
${sectionCount >= 2 ? `- Section B (Structured): ${effectiveSbCount} questions × ~${Math.round(sbMarks / effectiveSbCount)} marks = ${sbMarks} marks` : ''}
${sectionCount >= 3 ? `- Section C (Long Answer): ${scCount} questions × ${scPerQ} marks = ${scMarks} marks` : ''}

CRITICAL CBC REQUIREMENTS:
1. ALL questions must align with Kenya CBC Senior School competency-based approach
2. ABSOLUTELY NO multiple choice questions — structured, short answer, and long answer ONLY
3. Use Kenyan names: Amina, Wanjiku, Kipchoge, Otieno, Njeri, Baraka, Fatuma, Kamau, Mwangi, Chebet
4. Use Kenyan places: Nairobi, Kisumu, Mombasa, Nakuru, Eldoret, Kisii, Thika, Nyeri, Kitale, Garissa
5. Questions appropriate for ${grade} CBC Senior School learners
6. Use CBC action verbs: Analyse, Evaluate, Explain, Calculate, Describe, Justify, Differentiate, Examine
7. Distribute difficulty: 30% foundational, 50% developing, 20% extending
8. All questions must be unambiguous, clear, and professionally worded
9. Marking scheme must be detailed with clear per-mark breakdown
10. Every question must directly map to the specified strands: ${strandList}
${subjectInstructions}
${questionFormats}

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
        "text": "Short answer question in Kenyan CBC context for ${subject}",
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
        "text": "Structured ${subject} question:\\n(a) Part a (2 marks)\\n(b) Part b (3 marks)",
        "marks": 5,
        "questionType": "structured",
        "answer": "(a) Answer — 2 marks: [answer with mark breakdown]\\n(b) Answer — 3 marks: [answer with mark breakdown]"
      }
    ]
  }${sectionCount >= 3 ? `,
  "sectionC": {
    "marks": ${scMarks},
    "instruction": "Answer ALL questions in this section. Show all working clearly. Marks are awarded for correct method as well as correct answers.",
    "questions": [
      {
        "num": ${saCount + effectiveSbCount + 1},
        "text": "Extended ${subject} question:\\n(a) Part a (${Math.round(scPerQ * 0.3)} marks)\\n(b) Part b (${Math.round(scPerQ * 0.35)} marks)\\n(c) Part c (${scPerQ - Math.round(scPerQ * 0.3) - Math.round(scPerQ * 0.35)} marks)",
        "marks": ${scPerQ},
        "questionType": "long_answer",
        "answer": "(a) Model answer — ${Math.round(scPerQ * 0.3)} marks: [detailed model answer]\\n(b) Model answer — ${Math.round(scPerQ * 0.35)} marks: [detailed model answer]\\n(c) Model answer — ${scPerQ - Math.round(scPerQ * 0.3) - Math.round(scPerQ * 0.35)} marks: [detailed model answer]"
      }
    ]
  }` : ''}
}

Generate all ${totalQuestions} questions now covering the strands: ${strandList}. Ensure JSON is complete and valid.`;
}

module.exports = {
  buildHybridExamPrompt,
  buildFallbackExamPrompt,
  validateExamParams,
  selectBalancedQuestions,
  getDuration,
  getGradeContext,
  getSubjectType,
  getSubjectInstructions,
  getQuestionFormatRules,
};
