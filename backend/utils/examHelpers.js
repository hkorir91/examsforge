// ─────────────────────────────────────────────────────────────────────────────
// examHelpers.js — Exam generation utilities and Machine prompt builder
// Built from analysis of real CBC Grade 10 Kenya exam papers
// ─────────────────────────────────────────────────────────────────────────────

const { getSubjectFullMarks } = require('../models/curriculumHelpers')

// ── Kenyan context pools ──────────────────────────────────────────────────────
const KENYAN_NAMES = [
  'Wanjiku', 'Kipchoge', 'Baraka', 'Amina', 'Otieno', 'Njeri', 'Kamau',
  'Achieng', 'Mutua', 'Chebet', 'Odhiambo', 'Mwangi', 'Zawadi', 'Koech',
  'Kimani', 'Nafula', 'Ouma', 'Kanini', 'Rotich', 'Adhiambo',
  'Simiyu', 'Juma', 'Waweru', 'Auma', 'Nduta', 'Onyango', 'Maina',
]

const KENYAN_SCHOOLS = [
  "Mang'u Senior School", 'Alliance Senior School', 'Precious Blood Senior School',
  'Maranda Senior School', 'Starehe Senior School', 'Highway Senior School',
  'Nakuru Senior School', 'Kisumu Senior School', 'Eldoret Senior School',
  'Strathmore Senior School', 'Upper Hill Senior School', 'Lenana Senior School',
  'Thika Senior School', 'Kenya High Senior School', 'Kaplamboi Junior School',
]

const KENYAN_PLACES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Thika', 'Nakuru', 'Nyeri',
  'Kakamega', 'Machakos', 'Kericho', 'Embu', 'Meru', 'Kisii', 'Kilifi',
  'Nanyuki', 'Garissa', 'Kitale', 'Isiolo',
]

// ── Subject full-exam marks ───────────────────────────────────────────────────
const SUBJECT_FULL_MARKS = {
  'English': 80, 'Literature in English': 80, 'Kiswahili': 80,
  'Fasihi ya Kiswahili': 80, 'Biology': 80, 'Physics': 80,
  'General Science': 80, 'Chemistry': 80, 'Applied Agriculture': 90,
}

function getSubjectTotalMarks(subject, examType) {
  if (['End Term', 'End Year', 'Mock', 'Pre-Mock', 'Series'].includes(examType)) {
    return SUBJECT_FULL_MARKS[subject] || 100
  }
  if (examType === 'Midterm') {
    const full = SUBJECT_FULL_MARKS[subject] || 100
    return Math.round((full / 2) / 5) * 5
  }
  return null // CAT: caller provides 30-40
}

// ── Default section count by exam type ───────────────────────────────────────
function getDefaultSectionCount(examType) {
  if (['End Term', 'End Year', 'Mock', 'Pre-Mock', 'Series'].includes(examType)) return 3
  if (examType === 'Midterm') return 2
  return 1 // CAT
}

// ── Section mark splits ───────────────────────────────────────────────────────
function getSectionMarkSplit(totalMarks, sectionCount) {
  if (sectionCount === 1) return [totalMarks, 0, 0]
  if (sectionCount === 2) {
    // Section A ~40%, Section B ~60%
    const a = Math.round(totalMarks * 0.4 / 5) * 5 || Math.round(totalMarks * 0.4)
    const b = totalMarks - a
    return [a, b, 0]
  }
  if (sectionCount === 3) {
    // Section A ~20% (short answer), B ~40% (structured), C ~40% (long/calculations)
    const a = Math.round(totalMarks * 0.2 / 5) * 5 || Math.round(totalMarks * 0.2)
    const remainder = totalMarks - a
    const b = Math.round(remainder / 2 / 5) * 5 || Math.round(remainder / 2)
    const c = totalMarks - a - b
    return [a, b, c]
  }
  return [totalMarks, 0, 0]
}

// ── Duration calculator ───────────────────────────────────────────────────────
function getDuration(examType, totalMarks) {
  if (examType === 'CAT') return '1 hour'
  if (totalMarks <= 40) return '1 hour 20 minutes'
  if (totalMarks <= 60) return '1 hour 30 minutes'
  if (totalMarks <= 80) return '1 hour 50 minutes'
  if (totalMarks <= 90) return '2 hours'
  return '2 hours 30 minutes'
}

// ── Param validation ──────────────────────────────────────────────────────────
function validateExamParams(params) {
  const { grade, subject, strands, examType, term, year, totalMarks, totalQuestions, school } = params
  if (!grade) return 'Grade is required.'
  if (!['Grade 10', 'Grade 11', 'Grade 12'].includes(grade)) return 'Invalid grade.'
  if (grade !== 'Grade 10') return 'Only Grade 10 is currently available.'
  if (!subject) return 'Subject is required.'
  if (!strands || strands.length === 0) return 'At least one strand must be selected.'
  if (!examType) return 'Exam type is required.'
  if (!term) return 'Term is required.'
  if (!year || isNaN(year)) return 'A valid year is required.'
  if (!totalMarks || totalMarks < 10) return 'Total marks must be at least 10.'
  if (!totalQuestions || totalQuestions < 2) return 'At least 2 questions are required.'
  if (!school || !school.trim()) return 'School name is required.'
  return null
}

// ── Question bank helpers ─────────────────────────────────────────────────────
function selectBalancedQuestions(pool, totalMarks, totalQuestions) {
  if (!pool || pool.length === 0) {
    return { sectionA: [], sectionB: [], sectionC: [] }
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const third = Math.ceil(shuffled.length / 3)
  return {
    sectionA: shuffled.slice(0, third),
    sectionB: shuffled.slice(third, third * 2),
    sectionC: shuffled.slice(third * 2),
  }
}

// ── Subject-specific prompt rules ────────────────────────────────────────────
function getSubjectRules(subject) {
  const rules = {
    'Mathematics': `
- Questions are NUMERICAL with actual values, equations, or problems to solve — NOT explanatory
- Each question or sub-part contains a specific calculation, construction, or problem to work through
- Show what formula or approach is needed clearly in the question
- For sub-parts: use (a), (b), (c) then (i), (ii), (iii) within each part
- Section A: shorter calculations (2-4 marks each question, no sub-parts needed)
- Section B: medium structured problems with (a)(b)(c) sub-parts (8-12 marks each)
- Section C: longer structured problems — multi-step calculations with (a)(b)(c)(d) (10-15 marks each)
- Include Kenya-specific contexts: maps of Kenya, Kenyan distances, shillings, land in hectares
- For geometry: refer to actual Kenyan landmarks and towns for bearings/distances
- Mark scheme: show full working, not just the answer`,

    'Biology': `
- Every question MUST open with a scenario from a Kenyan context (school lab, field trip, community health)
- Section A: short-answer questions — define, name, state, identify (2-4 marks each, 1-2 sub-parts)
- Section B: structured questions with clear (a)(b)(c) sub-parts — explain, describe, discuss (8-12 marks each)
- Section C: extended questions — analyse, evaluate, compare (10-15 marks each with 3-4 sub-parts)
- Include diagrams in question prompts where relevant (e.g. "The diagram below shows a plant cell...")
- Use instruction verbs correctly: State/Name (1-2 marks), Explain/Describe (3-4 marks), Analyse/Evaluate (5+ marks)
- Marking scheme: give specific points with mark allocation per point`,

    'Chemistry': `
- Every question MUST open with a scenario (school lab experiment, industrial application, community health)
- Include calculation questions in Sections B and C with actual numbers
- Use Kenyan industries and examples: Rift Valley soda ash, Kenyan oil refineries, Mumias Sugar
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: definitions and short answers (2-4 marks)
- Section B: structured questions mixing theory and calculations (8-12 marks each)
- Section C: extended structured problems with calculations and explanations (10-15 marks each)
- Marking scheme: show worked solutions for calculations`,

    'Physics': `
- Every question MUST open with a scenario (school demonstration, engineering application, everyday life)
- MUST include numerical calculations in Sections B and C — show given values clearly
- Use Kenyan contexts: Kenya Power electricity, dams in Kenya, roads and vehicles
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: short answers and basic definitions (2-4 marks)
- Section B: structured questions with calculations and diagrams (8-12 marks each)
- Section C: extended questions with multi-step calculations (10-15 marks each)
- Where diagrams are needed, describe clearly in the question text
- Marking scheme: show full formula, substitution, and answer with units`,

    'Applied Agriculture': `
- Every question MUST open with a Kenyan farming scenario (small-scale farmer, school farm, county agricultural office)
- Use Kenyan crops: maize, tea, coffee, pyrethrum, tomatoes, cabbages, potatoes
- Reference Kenyan counties: Kericho (tea), Kisumu (rice), Nakuru (wheat), Meru (miraa)
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: identify, state, name questions (2-4 marks)
- Section B: structured questions — explain, describe practices (8-12 marks)
- Section C: extended questions — evaluate, justify, discuss (10-15 marks)
- Include practical application: e.g. preparing a field, managing a nursery, crop calendar`,

    'Geography': `
- Every question MUST open with a Kenyan geographical scenario (field trip, community, national park)
- Reference real Kenyan features: Lake Victoria, Mount Kenya, Rift Valley, Tana River, Indian Ocean
- Reference real Kenyan towns, counties and regions
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: short answer — define, state, identify (2-4 marks each)
- Section B: structured — describe, explain geographical processes (8-12 marks each)
- Section C: extended — discuss, evaluate, analyse with maps/data (10-15 marks each)
- Where map interpretation is needed, describe the scenario clearly`,

    'History & Citizenship': `
- Every question MUST open with a historical scenario or contemporary Kenyan situation
- Reference real Kenyan history: colonial period, independence 1963, constitution 2010
- Reference real Kenyan institutions: IEBC, National Assembly, County Government, CBK
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: short answer — state, identify, name (2-4 marks)
- Section B: structured — describe, explain historical events and significance (8-12 marks)
- Section C: extended — discuss, analyse, evaluate causes and effects (10-15 marks)
- Questions should connect past events to present-day Kenya and citizenship`,

    'CRE': `
- Every question MUST open with a scenario from a Kenyan context (church, school devotion, community)
- Reference specific Bible books, chapters and verses where appropriate
- Use Kenyan names and settings for scenarios
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: short answer — state, name, identify biblical facts (2-4 marks)
- Section B: structured — explain, describe, analyse biblical events and teachings (8-12 marks)
- Section C: extended — discuss, evaluate Christian values and their application in Kenya today (10-15 marks)
- Marking scheme: specific biblical references and clear model answers`,

    'IRE': `
- Every question MUST open with a scenario from a Muslim community context in Kenya
- Reference specific Quranic Surahs and Hadith where appropriate
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: define, state, identify Islamic terms and teachings (2-4 marks)
- Section B: structured — explain, describe, analyse Islamic practices (8-12 marks)
- Section C: extended — discuss, evaluate Islamic teachings and their application (10-15 marks)
- Use correct Arabic terms with explanations`,

    'HRE': `
- Every question MUST open with a scenario from a Hindu/Jain/Buddhist community context
- Reference Hinduism, Jainism, and Buddhism appropriately
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: name, define, identify (2-4 marks)
- Section B: structured — explain, describe teachings (8-12 marks)
- Section C: extended — discuss, compare, apply teachings to modern Kenyan society (10-15 marks)`,

    'Business Studies': `
- Every question MUST open with a Kenyan business scenario (small business, school canteen, bank visit)
- Include calculation questions: budget preparation, income/expenditure, profit/loss
- Reference Kenyan institutions: CBK, KRA, NSSF, NHIF, M-Pesa, Equity Bank
- Reference Kenyan shillings (KES) in all financial questions
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: define, identify, state business concepts (2-4 marks)
- Section B: structured — explain, evaluate, analyse business situations (8-12 marks)
- Section C: extended — including financial calculations and business decision-making (10-15 marks)`,

    'English': `
- Section A (Language): listening/speaking task, grammar questions, reading comprehension, writing
- Grammar questions: identify parts of speech, rewrite sentences, fill blanks
- Reading comprehension: based on a Kenyan-context passage
- Writing: formal letter, essay, story continuation, summary
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section B (Literature): questions on set texts — oral literature, drama, poetry, prose`,

    'Kiswahili': `
- Section A (Kiswahili): ufahamu wa kusoma, sarufi, kuandika
- Grammar: tambua sehemu za sentensi, badilisha wakati, jaza pengo
- Ufahamu: maswali kuhusu kifungu cha habari
- Kuandika: insha ya ubunifu, barua rasmi
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section B (Fasihi): maswali kuhusu fasihi simulizi, mashairi, riwaya`,

    'Computer Studies': `
- Every question MUST open with a Kenyan ICT scenario (school lab, business, community)
- Reference realistic Kenyan technology contexts: mobile money, internet cafes, school systems
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: define, identify, name ICT terms and components (2-4 marks)
- Section B: structured — describe, explain ICT processes and applications (8-12 marks)
- Section C: extended — practical scenarios and problem solving (10-15 marks)
- Include step-by-step practical questions (e.g. steps to format a document)`,

    'Physical Education': `
- Every question MUST open with a sports or fitness scenario from a Kenyan school or community
- Reference Kenyan sports achievements and athletes
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: state, name, identify (2-4 marks)
- Section B: describe techniques, rules, safety (8-12 marks)
- Section C: analyse, evaluate performance and health aspects (10-15 marks)`,
  }

  return rules[subject] || `
- Every question MUST open with a relevant Kenyan scenario
- Sub-parts: (a)(b)(c) then (i)(ii)(iii) within each
- Section A: short answer (2-4 marks per question)
- Section B: structured questions (8-12 marks per question)
- Section C: extended questions (10-15 marks per question)
- Use instruction verbs that match marks: State/Name/Identify (1-2), Explain/Describe (3-4), Analyse/Evaluate/Discuss (5+)`
}

// ── Standard instructions per exam type/subject ──────────────────────────────
function getExamInstructions(subject, examType, sectionCount) {
  const base = [
    'Write your name, admission number, and class clearly at the top of the answer booklet.',
    'Answer ALL questions in each section.',
    'All answers must be written in the answer booklet provided.',
    'Mobile phones and electronic devices are NOT permitted in the examination room.',
  ]
  if (['Mathematics', 'Essential Mathematics'].includes(subject)) {
    return [
      'Write your name, admission number, and class clearly at the top of the answer booklet.',
      'Answer ALL questions provided.',
      'Show ALL working clearly — marks may be awarded for correct working even if the final answer is wrong.',
      'Use mathematical tables or a scientific calculator where necessary.',
      'All working must be in the spaces provided.',
      'Mobile phones and electronic devices are NOT permitted in the examination room.',
    ]
  }
  if (['Chemistry', 'Physics', 'Biology', 'Applied Agriculture', 'General Science'].includes(subject)) {
    return [
      'Write your name, admission number, and class clearly at the top of the answer booklet.',
      'Answer ALL questions in each section.',
      'In structured questions, show all working clearly where calculations are involved.',
      'Use a blue or black pen for writing. Pencils should be used only for drawings and diagrams.',
      'Make drawings neat, clear, and large, and label them correctly using ruled lines.',
      'All answers must be written in the answer booklet provided.',
      'Mobile phones and electronic devices are NOT permitted in the examination room.',
    ]
  }
  return base
}

// ── Section instruction text ──────────────────────────────────────────────────
function getSectionInstruction(sectionIndex, totalMarks, examType) {
  const instructions = [
    'Answer ALL questions in this section. Write your answers concisely in the spaces provided.',
    'Answer ALL questions in this section. Show all working clearly where calculations are involved.',
    'Answer ALL questions in this section. Write your answers clearly and in detail.',
  ]
  return instructions[sectionIndex] || instructions[0]
}

// ── Main prompt builder ───────────────────────────────────────────────────────
function buildExamPrompt({
  grade, subject, strands, substrands, examType, term, year,
  totalMarks, totalQuestions, school, sectionCount,
  bankSeeds, isHybrid,
}) {
  const [marksA, marksB, marksC] = getSectionMarkSplit(totalMarks, sectionCount)

  // Calculate questions per section based on marks
  const questionsPerSection = (marks, avgMarksPerQ) => Math.max(1, Math.round(marks / avgMarksPerQ))
  const qA = questionsPerSection(marksA, 4)   // Section A: ~4 marks each
  const qB = questionsPerSection(marksB, 10)  // Section B: ~10 marks each
  const qC = questionsPerSection(marksC, 12)  // Section C: ~12 marks each

  const strandText = strands.join(', ')
  const substrandText = substrands && substrands.length > 0 ? substrands.join(', ') : 'All sub-strands'

  const bankContext = isHybrid && bankSeeds
    ? `\nQUESTION BANK SEEDS (use these as inspiration but rephrase completely — change names, values, contexts):\n${JSON.stringify(bankSeeds, null, 2)}\n`
    : ''

  const prompt = `You are an expert CBC (Competency-Based Curriculum) Senior School examination setter for the Kenya Certificate of Basic Education (KCBE). You have deep knowledge of the Kenyan CBC curriculum and set examinations exactly like experienced Kenyan teachers.

EXAM DETAILS:
- School: ${school}
- Grade: ${grade}
- Subject: ${subject}
- Strand(s): ${strandText}
- Sub-strand(s): ${substrandText}
- Exam Type: ${examType}
- Term: ${term}
- Year: ${year}
- Total Marks: ${totalMarks}
- Number of Sections: ${sectionCount}
- Duration: ${getDuration(examType, totalMarks)}
${bankContext}

═══════════════════════════════════════════════════
MANDATORY RULES — FOLLOW ALL WITHOUT EXCEPTION
═══════════════════════════════════════════════════

1. KENYAN SCENARIOS: Every question MUST start with a real Kenyan context paragraph.
   - Use names from this list: ${KENYAN_NAMES.slice(0, 12).join(', ')}
   - Use real Kenyan schools like: ${KENYAN_SCHOOLS.slice(0, 5).join(', ')}
   - Use real Kenyan places: ${KENYAN_PLACES.slice(0, 8).join(', ')}
   - Example: "Wanjiku, a Grade 10 learner at ${KENYAN_SCHOOLS[Math.floor(Math.random() * 5)]}, observes..."

2. SUB-PART FORMAT: Questions with multiple parts MUST use:
   - First level: a), b), c), d) 
   - Second level within each: i), ii), iii), iv)
   - Example: "a) i) Define the term... (2 marks)\n   ii) State two examples... (2 marks)"

3. INSTRUCTION VERBS (match to marks):
   - 1 mark: State / Name / Identify / Give / List
   - 2 marks: Define / Outline / Mention / Write / Describe briefly
   - 3-4 marks: Explain / Describe / Illustrate
   - 5-6 marks: Discuss / Analyse / Evaluate / Examine / Compare
   - 7+ marks: Justify / Assess / Critically analyse

4. MARKS MUST ADD UP EXACTLY:
   - Section A total: EXACTLY ${marksA} marks (${qA} questions)
   - Section B total: EXACTLY ${marksB} marks (${qB} questions)${sectionCount >= 3 ? `
   - Section C total: EXACTLY ${marksC} marks (${qC} questions)` : ''}
   - Grand total: EXACTLY ${totalMarks} marks

5. MARKING SCHEME: Every question and sub-part MUST have:
   - A detailed model answer
   - Specific marking points
   - Clear mark allocation per point

6. DIAGRAMS — MANDATORY FOR VISUAL SUBJECTS:
   For Mathematics: When a question involves geometric shapes, coordinate geometry, bearings, or number lines,
   include a "diagram" field in the question object with this format:
   {"type": "cylinder|sphere|cone|triangle|right_triangle|circle|coordinate_grid|bearing|number_line|similar_shapes|bar_chart|pie_chart|histogram|venn_diagram|line_graph|animal_cell|plant_cell|microscope|beaker|soil_profile|circuit|human_heart|digestive_system|respiratory_system|flower|food_web|nephron|ray_diagram|series_parallel_circuit|water_cycle|rock_cycle|data_table",
    "params": {"r": "6cm", "h": "12cm"}, "caption": "Figure 1"}
   
   For Sciences (Biology, Chemistry, Physics, Agriculture): When a question involves cells, apparatus,
   body systems, soil, circuits or specimens, include:
   {"type": "animal_cell|plant_cell|microscope|beaker|soil_profile|circuit|human_heart",
    "params": {"labelledParts": [{"label": "A"}, {"label": "B"}, {"label": "C"}, {"label": "D"}]},
    "caption": "Figure 1: [description]"}
   
   For all other questions: omit the "diagram" field entirely (do NOT include diagram: null).
   Only include diagrams when they genuinely help the student understand the question.

7. SUBJECT RULES:
${getSubjectRules(subject)}

═══════════════════════════════════════════════════
JSON OUTPUT FORMAT — RETURN ONLY THIS, NO OTHER TEXT
═══════════════════════════════════════════════════

{
  "title": "${grade} ${subject} ${examType} Examination",
  "time": "${getDuration(examType, totalMarks)}",
  "instructions": [
    "Write your name, admission number, and class clearly at the top of the answer booklet.",
    "Answer ALL questions in each section.",
    "All answers must be written in the answer booklet provided.",
    "Mobile phones and electronic devices are NOT permitted in the examination room."
  ],
  "sectionA": {
    "marks": ${marksA},
    "instruction": "Answer ALL questions in this section. Write your answers concisely in the spaces provided.",
    "questions": [
      {
        "num": 1,
        "text": "[Opening Kenyan scenario paragraph for this question]",
        "marks": [total marks for this question — sum of all subParts],
        "answer": "",
        "subParts": [
          {
            "label": "a",
            "text": "a) [Question text with marks in brackets, e.g.] State TWO reasons why... (2 marks)",
            "marks": 2,
            "answer": "Model answer: Point 1 (1 mark). Point 2 (1 mark)."
          },
          {
            "label": "b",
            "text": "b) i) Define the term '...' (1 mark)\\n   ii) Give ONE example of... (1 mark)",
            "marks": 2,
            "answer": "i) Definition here (1 mark).\\nii) Example here (1 mark)."
          }
        ]
      }
    ]
  },
  "sectionB": {
    "marks": ${marksB},
    "instruction": "Answer ALL questions in this section. Show all working clearly where calculations are involved.",
    "questions": [
      {
        "num": [continue numbering from Section A],
        "text": "[Opening Kenyan scenario for this question]",
        "marks": [total marks — must sum subParts marks],
        "answer": "",
        "subParts": [
          {
            "label": "a",
            "text": "a) i) [sub-question i] (2 marks)\\n   ii) [sub-question ii] (2 marks)\\n   iii) [sub-question iii] (2 marks)",
            "marks": 6,
            "answer": "i) Answer to i (2 marks).\\nii) Answer to ii (2 marks).\\niii) Answer to iii (2 marks)."
          },
          {
            "label": "b",
            "text": "b) Explain FOUR ways... (4 marks)",
            "marks": 4,
            "answer": "i) Point 1 (1 mark).\\nii) Point 2 (1 mark).\\niii) Point 3 (1 mark).\\niv) Point 4 (1 mark)."
          }
        ]
      }
    ]
  }${sectionCount >= 3 ? `,
  "sectionC": {
    "marks": ${marksC},
    "instruction": "Answer ALL questions in this section. Write your answers clearly and in detail.",
    "questions": [
      {
        "num": [continue numbering],
        "text": "[Opening Kenyan scenario]",
        "marks": [total marks],
        "answer": "",
        "subParts": [
          {
            "label": "a",
            "text": "a) Analyse THREE factors that... (6 marks)",
            "marks": 6,
            "answer": "i) Factor 1: explanation (2 marks).\\nii) Factor 2: explanation (2 marks).\\niii) Factor 3: explanation (2 marks)."
          },
          {
            "label": "b",
            "text": "b) i) Evaluate the significance of... (4 marks)\\n   ii) Propose TWO solutions... (2 marks)",
            "marks": 6,
            "answer": "i) Significance: detailed answer (4 marks).\\nii) Solution 1 (1 mark). Solution 2 (1 mark)."
          }
        ]
      }
    ]
  }` : ''}
}

CRITICAL CHECKS BEFORE RETURNING:
✓ Does Section A marks total exactly ${marksA}?
✓ Does Section B marks total exactly ${marksB}?${sectionCount >= 3 ? `
✓ Does Section C marks total exactly ${marksC}?` : ''}
✓ Does the grand total equal exactly ${totalMarks}?
✓ Does every question start with a Kenyan scenario?
✓ Does every sub-part have a model answer?
✓ Are question numbers continuous across sections?
✓ Are instruction verbs appropriate for mark allocations?

Return ONLY the JSON object. No markdown, no explanation, no code blocks.`

  return prompt
}

// ── Public functions ──────────────────────────────────────────────────────────
function buildFallbackExamPrompt(params) {
  return buildExamPrompt({ ...params, isHybrid: false, bankSeeds: null })
}

function buildHybridExamPrompt(params) {
  const { sectionASeeds, sectionBSeeds, sectionCSeeds, ...rest } = params
  const bankSeeds = {
    sectionA: (sectionASeeds || []).map(q => ({
      questionText: q.questionText,
      answerGuide: q.answerGuide,
      marks: q.marks,
      strand: q.strand,
    })).slice(0, 5),
    sectionB: (sectionBSeeds || []).map(q => ({
      questionText: q.questionText,
      answerGuide: q.answerGuide,
      marks: q.marks,
      strand: q.strand,
    })).slice(0, 4),
    sectionC: (sectionCSeeds || []).map(q => ({
      questionText: q.questionText,
      answerGuide: q.answerGuide,
      marks: q.marks,
      strand: q.strand,
    })).slice(0, 3),
  }
  return buildExamPrompt({ ...rest, isHybrid: true, bankSeeds })
}

module.exports = {
  buildFallbackExamPrompt,
  buildHybridExamPrompt,
  validateExamParams,
  selectBalancedQuestions,
  getDuration,
  getDefaultSectionCount,
  getSubjectTotalMarks,
  getSectionMarkSplit,
}
