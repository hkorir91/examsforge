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
  if (examType === 'CAT') {
    if (marks <= 20) return '30 minutes';
    if (marks <= 30) return '45 minutes';
    return '1 hour';
  }
  if (examType === 'Midterm') return marks <= 50 ? '1 hour 30 minutes' : '2 hours';
  if (examType === 'End Year') return marks >= 100 ? '2 hours 30 minutes' : '2 hours';
  if (examType === 'Pre-Mock' || examType === 'Mock' || examType === 'Series') return marks >= 100 ? '2 hours 30 minutes' : '2 hours';
  return marks >= 100 ? '2 hours 30 minutes' : '2 hours'; // End Term
}

// ── Subject classification ───────────────────────────────
const SUBJECT_TYPES = {
  // Sciences — require calculations, experiments, diagrams
  science: ['Biology', 'Chemistry', 'Physics', 'General Science'],
  // Mathematics — require working shown, calculations, proofs
  mathematics: ['Mathematics', 'Essential Mathematics'],
  // English — has comprehensive 5-section CBC structure
  english: ['English'],
  // Other languages — comprehension passage, grammar, composition
  language: ['Kiswahili', 'Arabic', 'French', 'German', 'Chinese',
    'Indigenous Languages', 'Literature in English', 'Fasihi ya Kiswahili',
    'Sign Language', 'Kenyan Sign Language'],
  // Humanities — require case studies, source analysis, essays
  humanities: ['History and Citizenship', 'CRE', 'IRE', 'HRE',
    'Business Studies', 'Life Skills Education', 'Community Service Learning'],
  // Geography — has its own specific rules
  geography: ['Geography'],
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
SCIENCE-SPECIFIC REQUIREMENTS — CRITICAL:
- EVERY science question MUST contain specific, actual content — not vague descriptions
- For Chemistry: write actual equations e.g. "Balance: Fe + O₂ → Fe₂O₃" not "balance an equation"
- For Physics: write actual values e.g. "A car moves at 20m/s for 5 seconds, calculate distance" not "calculate distance for a moving car"
- For Biology: write specific organism names, organs, processes — not "a certain organism"
- Include at least ONE question requiring a labelled diagram or description of experimental apparatus
- Include questions on safety precautions where relevant
- For Chemistry: include at least one balanced equation or stoichiometry calculation
- For Biology: include questions on structure and function with specific named structures
- For Physics: include at least one calculation showing formula, substitution, and answer with units
- Practical questions should ask learners to describe procedures step by step
- Use data/results tables where appropriate for analysis questions`,

    mathematics: `
MATHEMATICS-SPECIFIC REQUIREMENTS — CRITICAL:
- EVERY mathematics question MUST contain ACTUAL numbers, expressions, equations or values
- DO NOT write "Wanjiku encounters expressions to simplify" without giving the actual expression
- ALWAYS write the full mathematical content: e.g. "Simplify: (2³ × 2⁵) ÷ 2⁴" not "simplify an expression"
- ALWAYS write actual equations: e.g. "Solve: x² – 5x – 6 = 0" not "solve a quadratic equation"
- ALWAYS include specific measurements: e.g. "A rectangle has length (x+5)cm and width (x-2)cm" not "a rectangle"
- For logarithms: write "Evaluate: log₁₀ 1000" not "evaluate a logarithm"
- For geometry: write actual coordinates, angles, lengths — e.g. "Triangle ABC where A(1,2) B(3,4) C(5,2)"
- For bearings: write actual bearing values — e.g. "on a bearing of 070°" not "on some bearing"
- ALL calculation questions must show: state formula → substitute values → solve → state answer with units
- Include questions from Number/Algebra, Geometry, Statistics — balanced coverage
- Section C must include multi-step problems requiring 3+ calculation steps
- Answers must show complete working — method marks awarded even if final answer is wrong
- Include at least one geometry/construction question with measurements
- SCORE GRID: Always include a score grid in instructions listing Q1, Q2... with marks`,

    english: `
ENGLISH EXAM REQUIREMENTS — CBC GRADE 10 (KLB/KICD):

━━━ EXAM STRUCTURE ━━━
A Grade 10 English written exam has FIVE sections. Scale marks to total requested:

SECTION A — READING COMPREHENSION (≈20% of total marks)
- Include a COMPLETE prose narrative or expository passage of 200–300 words IN the paper
- The passage MUST be written in full — not referenced or described
- Passage theme must align with selected unit (Etiquette, Climate Change, AI/Healthcare, Careers, etc.)
- Passage style: lively, literary, Kenyan setting, real names and places
- Questions must test (allocate marks as shown):
  * Atmosphere/mood — "What was the atmosphere...? Use evidence from the text." (3 marks)
  * Characterisation — "How does the writer convey...? Refer to the passage." (3 marks)
  * Paraphrase — "Describe in your own words..." (3 marks)
  * Multiple examples — "Give THREE examples of... from the passage." (3 marks)
  * Figurative language — "What does the phrase '...' tell you about...?" (2 marks)
  * Irony/literary device — "Explain the irony in..." (2 marks)
  * Significance — "Comment on the significance of..." (2 marks)
  * Vocabulary in context — "(a) explain '...' (b) explain '...'" (2 marks)
- TOTAL comprehension questions: 7–8 questions

SECTION B — SUMMARY WRITING (≈10% of total marks)
- Provide a SEPARATE passage of 200–280 words (different from Section A)
- Give a specific summary task: "In not more than 80 words, summarise the [challenges/benefits/causes] of..."
- State: "Use your own words as far as possible"
- Provide a lined space labeled "Summary" after the passage

SECTION C — GRAMMAR IN USE (≈25% of total marks)
- Test grammar ALWAYS in context — never in isolation
- Each question MUST embed the grammar point in a sentence or short paragraph
- Question types (mix these):
  * Fill in the gap: "Complete the sentence with the correct word: Amina took a deep ___ (breath/breathe)"
  * Identify and correct: "Identify the error in this sentence and rewrite it correctly: She go to school everyday."
  * Rewrite/transform: "Rewrite in the correct tense: By tomorrow, she ___ (complete) the project."
  * Identify and label: "Underline all the nouns in: The teacher asked Wanjiku to read the letter aloud."
  * Spelling: "Identify the correctly spelled word: necessary / necessery / neccesary"
  * Homophones: "Circle the correct word: The farmer's field was (bear/bare) after the drought."
  * Sentence correction: "Rewrite the following run-on sentence correctly: The rain fell hard it flooded the streets."
  * Pronunciation: "Provide a word with a different vowel sound that rhymes with: stock → stork"
- Grammar topics by unit (match to selected strands):
  Unit 1 → Nouns (count/non-count, common/proper), Pronouns, Determiners
  Unit 2 → Verbs/Tense/Aspect, Adverbs (time/place/manner)
  Unit 3 → Adjectives (order, comparative, superlative), Prepositions
  Unit 4 → Noun Phrases, Verb Phrases, Determiners
  Unit 5 → Phrases (adjective, adverb, prepositional), Adverbs
  Unit 6 → Relative Pronouns, Relative Clauses
  Unit 7 → Clauses (relative, adverbial)
  Unit 8 → Clause Patterns
  Unit 9 → Sentence Types and Structures

SECTION D — WRITING COMPOSITION (≈35% of total marks)
- Give a choice of TWO topics — learner answers ONE
- Writing type must match selected Writing strand:
  FUNCTIONAL WRITING:
    * Formal letter: "Write a letter to the Principal of your school requesting..."
    * Email: "Write an email to your friend describing..."
    * Memo: "Write a memo from the School Captain to all students about..."
    * Report: "Write a short report on the recent sports day held at your school..."
    * Apology letter: "Write a letter of apology to your teacher for..."
    * Notice: "Write a notice to be posted on the school notice board about..."
    * Minutes: "Write the minutes of a meeting held by the school Environmental Club..."
  CREATIVE WRITING:
    * Narrative: "Write a story beginning with: The day I discovered the old photograph..."
    * Descriptive: "Describe a busy market scene in your town on a Saturday morning."
    * Argumentative: "Write a speech arguing for OR against: Social media does more harm than good."
    * Expository: "Write an article explaining the importance of career planning for young people in Kenya."
- Always include: "Your composition will be marked on: Content (10 marks), Organisation (10 marks), Language (10 marks), Mechanics (5 marks)"
- For functional writing specify EXACTLY: format required (letter heading, date, salutation, body, sign-off)
- Word count guidance: compositions 250–350 words, letters/memos 150–200 words

SECTION E — LISTENING AND SPEAKING ORAL (assessed separately — do NOT include in written paper)
- This strand is tested orally by the teacher
- Do NOT include listening and speaking questions in the written exam JSON

━━━ KENYAN CONTEXT RULES ━━━
- Comprehension passages must feature Kenyan settings, names, institutions
- Names: Amina, Wanjiku, Kipchoge, Baraka, Njeri, Otieno, Fatuma, Mwangi, Chebet, Kamau, Achieng, Moraa
- Institutions: Ministry of Health, Kenya Wildlife Service, Safaricom, Kenya Power, county governments, KNEC, hospitals, schools
- Places: Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Nyeri, Garissa, Kericho, Thika, Kisii, Athi River
- Current Kenyan issues: climate change, career choices, AI in healthcare, etiquette, sports, incomes
- CBC Competencies to embed: Critical Thinking, Communication, Citizenship, Creativity, Self-Efficacy

━━━ CRITICAL RULES ━━━
- Comprehension passage MUST appear in full in the exam — not "read the passage on page 3"
- Grammar questions must ALWAYS give a sentence/context first, then ask
- Never test grammar by asking "define a noun" — always embed in context
- Summary must specify a word limit (80 words) and a specific focus aspect
- Writing task must specify: audience, purpose, format, and marking rubric
- Use KNEC-style marking language: "Award 1 mark for each correct point. Accept any reasonable answer."`,

    humanities: `
HUMANITIES-SPECIFIC REQUIREMENTS:
- Include at least ONE source-based or data-based question (map extract, graph, table, photograph description, quote)
- Geography: include map work / sketch map question in at least one section
- History: include a source analysis question with a short extract followed by questions
- Business Studies: use Kenyan business examples (M-Pesa, Equity Bank, Safaricom, Nakumatt, local markets)
- CRE/IRE/HRE: questions must test understanding and application of values, not just recitation
- Avoid pure recall questions — test application, analysis, and evaluation
- Essays in Section C must have clear marking criteria with awarded marks per point`,

    geography: `
GEOGRAPHY-SPECIFIC REQUIREMENTS — CRITICAL:

STRAND COVERAGE — questions MUST cover these official KICD Grade 10 Geography strands:
1. Practical Geography: Introduction to Geography, Map Reading and Interpretation, Statistical Methods, GIS
2. Natural Systems and Processes: Rocks, Earth Movements, Folding, Vulcanicity, Earthquakes
3. Human and Economic Activities: Agriculture, Mining, Energy, Industry

QUESTION CONTENT RULES:
- EVERY question must be specific — name actual landforms, processes, places, data
- Map Reading: reference actual Kenyan topographic maps, grid references, contour lines
- Statistical Methods: include actual data tables or graphs for interpretation
- Rocks: name specific rock types (granite, limestone, sandstone, basalt) and their formation
- Vulcanicity: name actual Kenyan/African volcanoes (Mt Kenya, Mt Kilimanjaro, Longonot, Suswa)
- Earthquakes: reference actual earthquake zones in East Africa (Great Rift Valley)
- Folding: name types (anticline, syncline, monocline) with diagrams
- Agriculture: reference Kenyan farming regions, crops, and methods
- Mining: reference actual Kenyan minerals (soda ash, fluorspar, gold, limestone, titanium)
- Energy: reference Kenyan energy sources (geothermal at Olkaria, hydroelectric at Masinga/Gitaru/Kiambere, wind at Ngong/Lake Turkana)
- Industry: reference actual Kenyan industries (EPZ, KICOMI, Bamburi Cement, East African Breweries)

DIAGRAM REQUIREMENTS:
- Vulcanicity question: include diagram field with type "composite_volcano" or "shield_volcano"
- Folding question: include diagram field with type "fold_diagram"
- Rock cycle question: include diagram field with type "rock_cycle"
- Map reading question: include diagram field with type "contour_map"
- Statistical question: describe a data table or graph in the question text

KENYAN GEOGRAPHY CONTEXT:
- Always use real Kenyan examples: Rift Valley, Lake Victoria, Mt Kenya, Indian Ocean coast
- Reference real counties: Narok, Nakuru, Turkana, Mombasa, Kisumu, Kilifi
- Use real distances, populations, production figures where relevant
- Section C essays must reference specific Kenyan geographical features and problems`,

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

  return base[type] || base[subject === 'English' ? 'english' : 'humanities'];
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

    english: `
QUESTION FORMAT FOR ENGLISH (CBC Grade 10 — KLB structure):

SECTION A — READING COMPREHENSION:
  Full passage (200–300 words) followed by:
  Q1. What was the atmosphere/mood in [opening scene]? Use evidence. (3 marks)
  Q2. How does the writer convey [character's experience]? Refer to passage. (3 marks)
  Q3. Describe in your own words [specific event]. (3 marks)
  Q4. What [pressures/reasons/examples] are given? State THREE. (3 marks)
  Q5. What does the phrase "[figurative phrase]" tell you about [subject]? (2 marks)
  Q6. Explain the [irony/contrast/significance] of [event]. (2 marks)
  Q7. Comment on the significance of [character's/narrator's action]. (2 marks)
  Q8. Explain the meaning: (a) "[word/phrase]" (b) "[word/phrase]" (2 marks)

SECTION B — SUMMARY WRITING:
  Separate passage (200–280 words) + instruction:
  "Read the passage carefully. In not more than 80 words, summarise [specific aspect].
   Use your own words as far as possible."
  [Leave lined space for answer]

SECTION C — GRAMMAR IN USE (in-context only):
  Fill gap: "Complete with correct word: She could not ___ (accept/except) the terms."
  Identify/correct: "Identify and correct the error: The boys has left the classroom."
  Rewrite/transform: "Rewrite in reported speech: She said, 'I will return tomorrow.'"
  Underline: "Underline the relative clause: The man who spoke yesterday is my uncle."
  Spelling: "Circle the correctly spelled word: committee / comittee / commitee"
  Homophones: "Choose correct word: The (weather/whether) in Nairobi was unpredictable."
  Run-on/splice: "Rewrite as two correct sentences: The learners were tired, they kept studying."

SECTION D — WRITING COMPOSITION:
  Functional writing task:
    "You are the Secretary of Thika High School Environmental Club.
     Write a MEMO to all club members about a tree-planting day next Saturday.
     Your memo should include: date, venue, time, and what to bring.
     (Your writing will be marked on: Content 10 marks, Organisation 10 marks,
      Language 10 marks, Mechanics 5 marks)"
  OR Creative writing task:
    "Write a story that begins: The envelope had been sitting on the table for three days..."`,

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

    geography: `
QUESTION FORMAT FOR GEOGRAPHY:
Section A (Short Answer — 2 marks each):
  - "Define the term ___" (1+1 marks for definition + example)
  - "State TWO characteristics of ___" (1 mark each)
  - "Name TWO types of ___" (1 mark each)
  - "Differentiate between ___ and ___" (2 marks)
  - "Give the function of ___ as shown in the map extract" (2 marks)

Section B (Structured — 5–10 marks, multi-part WITH scenario):
  - Must include a stimulus: data table, map description, photograph description, or diagram
  - (a) i) Identify ___ from the diagram/map (1 mark) ii) State the function of ___ (2 marks)
  - (b) Explain THREE ways ___ affects ___ (3 marks)
  - (c) Suggest how Kenya can improve ___ (2 marks)
  - Include at least ONE question with a diagram field (fold, volcano, rock cycle, map)

Section C (Essay — 10–15 marks):
  - Extended questions: "Discuss", "Examine", "Analyse", "Evaluate"
  - Must reference specific Kenyan examples and case studies
  - Mark allocation: 1 mark per valid point clearly stated
  - End with: "any other relevant point (1 mark)" to show flexibility
  - Include at least one sketch map or diagram instruction within question`,

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
function selectBalancedQuestions(pool, totalMarks, totalQuestions, sectionCount = 3) {
  if (!pool || pool.length === 0) return { sectionA: [], sectionB: [], sectionC: [] };

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const shuffled = shuffle(pool);

  // When sectionCount === 1 (CAT), ALL questions go to Section A
  if (sectionCount === 1) {
    return {
      sectionA: shuffled.slice(0, totalQuestions),
      sectionB: [],
      sectionC: [],
    };
  }

  // When sectionCount === 2 (Midterm), split between A and B only
  if (sectionCount === 2) {
    const saCount = Math.round(totalQuestions * 0.45);
    const sbCount = totalQuestions - saCount;
    return {
      sectionA: shuffled.slice(0, saCount),
      sectionB: shuffled.slice(saCount, saCount + sbCount),
      sectionC: [],
    };
  }

  // sectionCount === 3: distribute across A, B, C by question type
  const saCount  = Math.round(totalQuestions * 0.4);
  const strCount = Math.round(totalQuestions * 0.35);
  const laCount  = totalQuestions - saCount - strCount;

  const shortAnswer = pool.filter(q => q.marks <= 3 || q.questionType === 'short_answer');
  const structured  = pool.filter(q => (q.marks >= 4 && q.marks <= 7) || q.questionType === 'structured');
  const longAnswer  = pool.filter(q => q.marks >= 8 || q.questionType === 'long_answer' || q.questionType === 'calculation' || q.questionType === 'practical');

  const sectionA = shuffle(shortAnswer).slice(0, saCount);
  const sectionB = shuffle(structured).slice(0, strCount);
  const sectionC = shuffle(longAnswer).slice(0, laCount);

  const used = new Set([...sectionA, ...sectionB, ...sectionC].map(q => q._id?.toString()));
  const remaining = shuffle(pool.filter(q => !used.has(q._id?.toString())));

  const fillA = saCount  - sectionA.length;
  const fillB = strCount - sectionB.length;
  const fillC = laCount  - sectionC.length;

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

  // When sectionCount=1, all seeds are in sectionASeeds — use totalMarks directly
  const saMarks = sectionCount === 1
    ? totalMarks
    : sectionASeeds.reduce((s, q) => s + (q.marks || 2), 0);
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
10. NEVER write vague question descriptions — always include ACTUAL numbers, expressions, equations, measurements
11. Include learner details section (Name, Admission No., Class, Date, Signature) in instructions

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

// ── Param validation ──────────────────────────────────────
function validateExamParams(params) {
  const { grade, subject, strands, examType, term, year, totalMarks, totalQuestions, school } = params;
  if (!grade) return 'Grade is required.';
  if (!subject) return 'Subject is required.';
  if (!strands || strands.length === 0) return 'At least one strand must be selected.';
  if (!examType) return 'Exam type is required.';
  if (!term) return 'Term is required.';
  if (!year || isNaN(year)) return 'A valid year is required.';
  if (!totalMarks || totalMarks < 10) return 'Total marks must be at least 10.';
  if (!totalQuestions || totalQuestions < 2) return 'At least 2 questions are required.';
  if (!school || !school.trim()) return 'School name is required.';
  return null;
}

// ── Diagram instructions by subject ─────────────────────
// Tells the AI which diagram types are available, when to use them,
// and strictly forbids bracket descriptions like [Diagram shows...].
function buildDiagramInstructions(subject) {
  const subjectType = getSubjectType(subject);

  const COMMON_RULES = `
CRITICAL DIAGRAM RULES — APPLY TO EVERY SUBJECT:
1. When a diagram is needed, add a "diagram" JSON field to the question object — that is ALL.
2. NEVER write bracket descriptions like "[Diagram shows a plant cell]" — STRICTLY FORBIDDEN.
3. NEVER describe the diagram contents in the question text body.
4. Reference a diagram in question text ONLY as: "Study Figure 1 below." or "Refer to the diagram below."
5. Diagram JSON format: {"type": "plant_cell", "params": {}, "caption": "Figure 1: Structure of a Plant Cell"}
6. Only add a diagram when it genuinely helps the student answer — do NOT add diagrams to every question.`;

  const diagramMaps = {
    science: {
      Biology: `
BIOLOGY DIAGRAM INSTRUCTIONS:
These diagram types render as proper labelled SVG diagrams — use them:
- plant_cell → cell structure questions with cell wall, chloroplast, vacuole
- animal_cell → animal cell questions with nucleus, mitochondria, ribosomes
- human_heart → heart structure and blood circulation questions
- digestive_system → digestion and nutrition questions
- respiratory_system → breathing, gas exchange, lung structure questions
- flower → pollination, reproduction, floral structure questions
- food_web → ecosystem, feeding relationships, energy flow questions
- nephron → excretion, kidney tubule, osmoregulation questions
- microscope → practical microscopy, cell observation questions
- soil_profile → soil horizons, soil formation questions

WHEN to use:
- Cell structure question → "diagram": {"type": "plant_cell", "params": {}, "caption": "Figure 1: Structure of a Plant Cell"}
- Heart/circulation question → "diagram": {"type": "human_heart", "params": {}, "caption": "Figure 1: Structure of the Human Heart"}
- Digestion question → "diagram": {"type": "digestive_system", "params": {}, "caption": "Figure 1: The Human Digestive System"}
- Breathing question → "diagram": {"type": "respiratory_system", "params": {}, "caption": "Figure 1: The Human Respiratory System"}
- Food web question → "diagram": {"type": "food_web", "params": {}, "caption": "Figure 1: A Food Web"}
- Flower/reproduction → "diagram": {"type": "flower", "params": {}, "caption": "Figure 1: Structure of a Flower"}
- Excretion/kidney → "diagram": {"type": "nephron", "params": {}, "caption": "Figure 1: Structure of a Nephron"}`,

      Chemistry: `
CHEMISTRY DIAGRAM INSTRUCTIONS:
These diagram types render as proper labelled SVG diagrams — use them:
- beaker → laboratory setup, titration, heating experiments
- bar_chart → comparison of reaction rates, yield percentages
- line_graph → temperature-time graphs, concentration-time graphs
- data_table → results tables for experiments

WHEN to use:
- Lab apparatus question → "diagram": {"type": "beaker", "params": {}, "caption": "Figure 1: Laboratory Setup"}
- Reaction rate graph → "diagram": {"type": "line_graph", "params": {"title": "Rate of Reaction vs Temperature"}, "caption": "Figure 1: Rate of Reaction Graph"}
- Comparison question → "diagram": {"type": "bar_chart", "params": {"title": "Comparison"}, "caption": "Figure 1: Bar Chart"}`,

      Physics: `
PHYSICS DIAGRAM INSTRUCTIONS:
These diagram types render as proper labelled SVG diagrams — use them:
- ray_diagram → light, reflection, refraction, lenses, mirrors
- series_parallel_circuit → electric circuits, resistance, current
- cylinder → volume calculation practical problems
- cone → volume and surface area problems
- sphere → volume and density problems
- line_graph → distance-time, velocity-time, force-extension graphs
- bar_chart → comparison of physical quantities

WHEN to use:
- Ray/optics question → "diagram": {"type": "ray_diagram", "params": {}, "caption": "Figure 1: Ray Diagram"}
- Circuit question → "diagram": {"type": "series_parallel_circuit", "params": {}, "caption": "Figure 1: Electric Circuit"}
- Distance-time graph → "diagram": {"type": "line_graph", "params": {"title": "Distance-Time Graph"}, "caption": "Figure 1: Distance-Time Graph"}`,
    },

    mathematics: `
MATHEMATICS DIAGRAM INSTRUCTIONS:
These diagram types render as proper labelled SVG diagrams — use them:
- triangle → triangle problems, Pythagoras, trigonometry, area
- right_triangle → right-angle problems, SOH-CAH-TOA
- circle → circle theorems, arc length, sector area
- cylinder → volume/surface area of cylinders
- cone → volume/surface area of cones
- sphere → volume/surface area of spheres
- coordinate_grid → plotting points, straight lines, curves
- bearing → compass bearings, directions, navigation problems
- number_line → inequalities, number sets
- bar_chart → statistics questions with comparative data
- pie_chart → statistics questions with proportional data
- histogram → frequency distribution, grouped data
- line_graph → trend data, conversion graphs
- venn_diagram → set theory, probability problems

WHEN to use:
- Triangle/trig question → "diagram": {"type": "triangle", "params": {"a": 6, "b": 8, "c": 10}, "caption": "Figure 1"}
- Circle theorem → "diagram": {"type": "circle", "params": {}, "caption": "Figure 1"}
- Bearing question → "diagram": {"type": "bearing", "params": {"bearing": 65}, "caption": "Figure 1"}
- Statistics comparison → "diagram": {"type": "bar_chart", "params": {"title": "Sales Data"}, "caption": "Figure 1"}
- Venn/sets question → "diagram": {"type": "venn_diagram", "params": {}, "caption": "Figure 1"}`,

    geography: `
GEOGRAPHY DIAGRAM INSTRUCTIONS:
These diagram types render as proper labelled SVG diagrams — use them:
- fold_diagram → anticline/syncline, folding, fold mountains
- composite_volcano → composite/stratovolcano cross-section
- shield_volcano → shield volcano cross-section
- contour_map → topographic map extract, contour interpretation
- earthquake_waves → seismic waves, focus, epicentre
- rock_cycle → rock formation, rock types and transformations
- water_cycle → hydrological cycle, precipitation, evaporation

WHEN to use:
- Folding question → "diagram": {"type": "fold_diagram", "params": {}, "caption": "Figure 1: Types of Folds"}
- Volcano question → "diagram": {"type": "composite_volcano", "params": {}, "caption": "Figure 1: Cross-section of a Composite Volcano"}
- Map reading/contours → "diagram": {"type": "contour_map", "params": {}, "caption": "Figure 1: Topographic Map Extract"}
- Earthquake question → "diagram": {"type": "earthquake_waves", "params": {}, "caption": "Figure 1: Earthquake Waves"}
- Rock cycle question → "diagram": {"type": "rock_cycle", "params": {}, "caption": "Figure 1: The Rock Cycle"}`,
  };

  // Look up diagram map for this subject
  let diagramInstructions = '';
  if (subjectType === 'science') {
    diagramInstructions = diagramMaps.science[subject] || diagramMaps.science.Biology;
  } else if (subjectType === 'mathematics') {
    diagramInstructions = diagramMaps.mathematics;
  } else if (subject === 'Geography') {
    diagramInstructions = diagramMaps.geography;
  } else {
    // Humanities, languages, technical — minimal diagram guidance
    diagramInstructions = `
DIAGRAM INSTRUCTIONS:
If a diagram would genuinely help a question, add a "diagram" JSON field.
Available types: bar_chart, pie_chart, line_graph, data_table.
Reference it in question text as "Study Figure 1 below." — never describe it in brackets.`;
  }

  return `${diagramInstructions}

${COMMON_RULES}`;
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

  // ── Section-aware question + mark distribution ───────────
  // BUG FIX: when sectionCount=1, ALL questions/marks go to Section A.
  // Old code always put 40% in A, 35% in B, 25% in C regardless of sectionCount,
  // then the backend cleared B and C — leaving only ~40% of questions/marks.
  let saCount, effectiveSbCount, scCount, saMarks, sbMarks, scMarks;

  if (sectionCount === 1) {
    // CAT: single section — all questions and all marks in Section A
    saCount        = totalQuestions;
    effectiveSbCount = 0;
    scCount        = 0;
    saMarks        = totalMarks;
    sbMarks        = 0;
    scMarks        = 0;
  } else if (sectionCount === 2) {
    // Midterm: two sections — 40% in A, 60% in B
    saCount        = Math.round(totalQuestions * 0.4);
    effectiveSbCount = totalQuestions - saCount;
    scCount        = 0;
    saMarks        = Math.round(totalMarks * 0.35);
    sbMarks        = totalMarks - saMarks;
    scMarks        = 0;
  } else {
    // End Term / Mock / etc: three sections — 40% A, 35% B, 25% C
    saCount          = Math.round(totalQuestions * 0.4);
    const sbCount    = Math.round(totalQuestions * 0.35);
    scCount          = totalQuestions - saCount - sbCount;
    effectiveSbCount = sbCount;
    saMarks          = Math.round(totalMarks * 0.25);
    sbMarks          = Math.round(totalMarks * 0.40);
    scMarks          = totalMarks - saMarks - sbMarks;
  }

  const saPerQ = saCount > 0         ? Math.round(saMarks / saCount)         : 0;
  const sbPerQ = effectiveSbCount > 0 ? Math.round(sbMarks / effectiveSbCount) : 0;
  const scPerQ = scCount > 0          ? Math.round(scMarks / scCount)          : 0;

  return `You are a highly experienced Kenyan CBC curriculum specialist and senior examiner for ${subject} at ${gradeContext}.

Generate a COMPLETE, PROFESSIONAL ${examType} examination paper that meets Kenya national exam standards.
Every single question MUST be fully written out — NO placeholder text, NO vague descriptions.

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
- Section A (Short Answer): ${saCount} questions totalling ${saMarks} marks (~${saPerQ} marks each)
${sectionCount >= 2 ? `- Section B (Structured): ${effectiveSbCount} questions totalling ${sbMarks} marks (~${sbPerQ} marks each)` : ''}
${sectionCount >= 3 ? `- Section C (Long Answer): ${scCount} questions totalling ${scMarks} marks (~${scPerQ} marks each)` : ''}
GRAND TOTAL: EXACTLY ${totalMarks} marks

CRITICAL CBC REQUIREMENTS:
1. ALL questions must align with Kenya CBC Senior School competency-based approach
2. ABSOLUTELY NO multiple choice questions — structured, short answer, and long answer ONLY
3. EVERY question must contain the COMPLETE, ACTUAL question — not a description of a question
4. Use Kenyan names: Amina, Wanjiku, Kipchoge, Otieno, Njeri, Baraka, Fatuma, Kamau, Mwangi, Chebet
5. Use Kenyan places: Nairobi, Kisumu, Mombasa, Nakuru, Eldoret, Kisii, Thika, Nyeri, Kitale, Garissa
6. Use CBC action verbs matching mark allocations:
   - 1-2 marks: State, Name, Identify, Give, Define, List
   - 3-4 marks: Explain, Describe, Outline, Differentiate
   - 5+ marks: Discuss, Analyse, Evaluate, Examine, Justify
7. Distribute difficulty: 30% foundational, 50% developing, 20% extending
8. Marking scheme: specific per-mark breakdown for EVERY question and sub-part
9. Every question directly maps to the specified strands: ${strandList}
10. Question numbers must be CONTINUOUS across all sections (1, 2, 3... not restarting)
11. Sub-parts use: a) b) c) at first level, i) ii) iii) at second level
${subjectInstructions}
${questionFormats}

${buildDiagramInstructions(subject)}

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
    "instruction": "Answer ALL ${saCount} questions in this section. Write your answers concisely in the spaces provided.",
    "questions": [
      {
        "num": 1,
        "text": "[COMPLETE question text here — Kenyan scenario + actual question with specific content]",
        "marks": ${saPerQ},
        "questionType": "short_answer",
        "subParts": [
          {"label": "a", "text": "a) [Complete sub-question] (1 mark)", "marks": 1, "answer": "[Model answer — 1 mark]"},
          {"label": "b", "text": "b) [Complete sub-question] (1 mark)", "marks": 1, "answer": "[Model answer — 1 mark]"}
        ],
        "answer": ""
      }
    ]
  },
  "sectionB": {
    "marks": ${sbMarks},
    "instruction": "Answer ALL ${effectiveSbCount} questions in this section. Marks are allocated as shown.",
    "questions": [
      {
        "num": ${saCount + 1},
        "text": "[COMPLETE scenario — specific Kenyan context with all data needed to answer the question]",
        "marks": ${sbPerQ},
        "questionType": "structured",
        "subParts": [
          {"label": "a", "text": "a) i) [Sub-question] (X marks)\\n   ii) [Sub-question] (X marks)", "marks": 0, "answer": "i) [Model answer] (X marks).\\nii) [Model answer] (X marks)."},
          {"label": "b", "text": "b) [Sub-question] (X marks)", "marks": 0, "answer": "[Model answer with point-by-point breakdown]"}
        ],
        "answer": ""
      }
    ]
  }${sectionCount >= 3 ? `,
  "sectionC": {
    "marks": ${scMarks},
    "instruction": "Answer ALL ${scCount} questions in this section. Show all working clearly.",
    "questions": [
      {
        "num": ${saCount + effectiveSbCount + 1},
        "text": "[COMPLETE scenario with all data, map description, or source material needed]",
        "marks": ${scPerQ},
        "questionType": "long_answer",
        "subParts": [
          {"label": "a", "text": "a) [Extended question requiring detailed answer] (X marks)", "marks": 0, "answer": "[Comprehensive model answer — point 1 (1 mark), point 2 (1 mark)...]"},
          {"label": "b", "text": "b) [Further sub-question] (X marks)", "marks": 0, "answer": "[Model answer]"},
          {"label": "c", "text": "c) [Final sub-question] (X marks)", "marks": 0, "answer": "[Model answer]"}
        ],
        "answer": ""
      }
    ]
  }` : ''}
}

FINAL CHECK BEFORE RETURNING:
✓ Section A has EXACTLY ${saCount} questions totalling EXACTLY ${saMarks} marks?
${sectionCount >= 2 ? `✓ Section B has EXACTLY ${effectiveSbCount} questions totalling EXACTLY ${sbMarks} marks?` : ''}
${sectionCount >= 3 ? `✓ Section C has EXACTLY ${scCount} questions totalling EXACTLY ${scMarks} marks?` : ''}
✓ Grand total equals EXACTLY ${totalMarks} marks?
✓ Every question has COMPLETE, actual content — no placeholders?
✓ Every sub-part has a model answer in the marking scheme?
✓ Question numbers are continuous across all sections?
✓ All questions reference the specified strands: ${strandList}?

Generate all ${totalQuestions} questions now. Ensure JSON is complete and valid.`;
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
