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
  // CRE/IRE/HRE — religious education with specific 6-question exam format
  cre: ['CRE', 'IRE', 'HRE'],
  // Humanities — require case studies, source analysis, essays
  humanities: ['Business Studies', 'Life Skills Education', 'Community Service Learning'],
  // History — has its own 3-section structure (A: short answer, B: structured, C: essays/any two)
  history: ['History and Citizenship'],
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
ENGLISH EXAM STRUCTURE — CBC GRADE 10 (VERIFIED FROM ACTUAL KNEC PAPER):

Standard English End Term = 100 marks, 2.5 hours, FIVE sections.
Scale all marks proportionally for other totals (e.g. 80-mark paper = multiply by 0.8).

━━━ SECTION A: COMPREHENSION (20 marks) ━━━
- Include a COMPLETE prose narrative passage of 300–400 words written IN the paper
- Kenyan setting, real names, literary style — NOT a simple information text
- EXACTLY 8 questions in this order:
  Q1. "What was the atmosphere...? Use evidence from the text." (3 marks)
  Q2. "How does the writer convey [range of experience/character]? Refer to the passage." (3 marks)
  Q3. "Describe in your own words [specific event from passage]." (3 marks)
  Q4. "What [pressures/reasons/examples] are given? Give THREE examples from the passage." (3 marks)
  Q5. "What does the phrase '[figurative phrase]' tell you about [subject]?" (2 marks)
  Q6. "Explain the irony in [event]." (2 marks)
  Q7. "Comment on the significance of [character action or final scene]." (2 marks)
  Q8. "Explain the meaning of: (a) '[word/phrase]' (b) '[word/phrase]'" (2 marks)

━━━ SECTION B: SUMMARY WRITING (10 marks) ━━━
- Provide a SEPARATE passage of 300–400 words on a different topic from Section A
- Urban/social/contemporary Kenyan theme — challenges, issues, development
- Instruction: "In not more than 80 words, summarise [specific aspect e.g. challenges facing urban youth].
  Use your own words as far as possible."
- Include "ROUGH COPY" and "FAIR COPY" labels with lined spaces

━━━ SECTION C: GRAMMAR AND LANGUAGE USE (30 marks) ━━━
Include ALL SEVEN of these sub-questions:
  C1. Tense rewriting — 5 sentences, rewrite in tense shown in brackets (5 marks)
  C2. Direct/Reported speech — 6 sentences, mix of both directions (6 marks)
  C3. Subject-verb agreement — 4 sentences, choose correct verb form (4 marks)
  C4. Phrasal verbs — 5 gaps, fill with correct particle from given list (5 marks)
  C5. Active/Passive voice — 4 sentences, change as directed (4 marks)
  C6. Punctuation — 3 unpunctuated sentences, rewrite correctly (3 marks)
  C7. Vocabulary — (a) write SYNONYM for 3 words (1.5 marks) + (b) write ANTONYM for 3 words (1.5 marks) (3 marks total)
- Total Section C = 30 marks

━━━ SECTION D: ORAL SKILLS (10 marks) ━━━
This section IS in the written paper — it tests knowledge of oral skills through written questions:
  D1(a). Odd one out — identify word with different vowel sound from a group (2 marks — 2 groups)
  D1(b). Word stress — mark stress on 4 multi-syllabic words using apostrophe before stressed syllable (2 marks)
  D2. Register — write appropriate response for 3 situations (formal apology, formal excuse, informal refusal) (3 marks — 1 mark each)
  D3. Idiomatic expressions — explain meaning + use in sentence for 3 idioms (3 marks — 1 mark each)
- Total Section D = 10 marks

━━━ SECTION E: POETRY (30 marks) ━━━
- Include a COMPLETE original poem of 20–30 lines IN the paper
- Poem must have literary depth: figurative language, imagery, theme, mood, contrast
- Kenyan/African authorship and context
- EXACTLY 9 questions in this order:
  E1. "What is the poem about? Write a brief prose statement." (2 marks)
  E2. Explain a specific line — what it means + what it tells us about the subject (3 marks)
  E3. Explain a specific phrase — what it suggests about the subject (3 marks)
  E4. Comment on the effect of a short/unusual stanza — why the poet chose this structure (4 marks)
  E5. "Identify and explain ONE figure of speech in the line '...'." (3 marks)
  E6. "What is the mood of the poem? Use evidence from at least TWO stanzas." (4 marks)
  E7. "Examine the use of contrast. Identify at least TWO contrasts and explain their significance." (4 marks)
  E8. "What is the theme? Discuss how the poet develops it through images and language." (4 marks)
  E9. "How does the final stanza serve as a fitting conclusion?" (3 marks)
- Total Section E = 30 marks

━━━ MARK SCALING FOR DIFFERENT EXAM TYPES ━━━
End Term/Mock/Pre-Mock (100 marks): A=20, B=10, C=30, D=10, E=30
80-mark paper: A=16, B=8, C=24, D=8, E=24
CAT 30 marks: A=12 (short passage, 4 questions), B=omit, C=12 (tense + SVA + phrasal verbs), D=6, E=omit
Midterm 50 marks: A=14, B=8, C=16, D=6, E=omit or include shortened

━━━ KENYAN CONTEXT ━━━
Passage names: Amina, Wanjiku, Kipchoge, Baraka, Njeri, Otieno, Fatuma, Mwangi, Chebet, Kamau
Places: Nairobi, Mombasa, Kisumu, Nakuru, Kericho, Thika, Nyeri, Eldoret, Garissa
Themes: healthcare ethics, career choices, environmental issues, youth challenges, cultural heritage
Tense questions: use Kenyan school and work scenarios
Idioms: select universally understood idioms, not British-specific slang

━━━ CRITICAL RULES ━━━
- Section A passage MUST appear in full — no "read the passage on page 3"
- Section B passage is ALWAYS different from Section A — never same passage
- Section E poem MUST appear in full in the paper
- Grammar always in context — never test definitions in isolation
- Poetry questions follow the EXACT ORDER above — do not rearrange
- NEVER include a writing composition section — this is NOT part of the Grade 10 written paper`,

    cre: `
CRE EXAM REQUIREMENTS — CBC GRADE 10 (KNEC/KICD):

━━━ EXAM TYPE AND MARKS ━━━
CAT: 40 marks, 6–8 questions — SINGLE-PART questions (no a/b/c sub-parts)
  - Each question = 1 direct question, 5–7 marks each
  - Example: "Describe FIVE ways in which the Bible is important to Christians." (5 marks)
  - Example: "State SIX consequences of the Fall of Man as recorded in Genesis 3." (6 marks)

Midterm: 50 marks, 8–10 questions — mix of single and two-part questions

End Term / Mock / Pre-Mock / Series: 100 marks, 18–20 questions
  - Use 6 main questions × 3 sub-parts each = 18 sub-questions
  - Q1–Q2: (a) 8 marks + (b) 7 marks + (c) 5 marks = 20 marks each
  - Q3–Q6: (a) 6 marks + (b) 5 marks + (c) 4 marks = 15 marks each
  - Total: 20+20+15+15+15+15 = 100 marks

━━━ EXAM STRUCTURE (End Term/Mock) ━━━
A Grade 10 CRE written exam has EXACTLY 6 questions. Answer ALL.
Each question MUST have exactly THREE sub-parts: (a), (b), (c).
Scale marks to total requested but maintain the 6-question 3-part structure.

For a 100-mark exam: 6 questions × varying marks = 100 total
- Q1–Q2: (a) 8 marks + (b) 7 marks + (c) 5 marks = 20 marks each
- Q3–Q6: (a) 6 marks + (b) 5 marks + (c) 4 marks = 15 marks each
- Total: 20+20+15+15+15+15 = 100 marks

For a 60-mark exam: adjust proportionally (e.g. 6 questions × 10 marks each)

STRAND COVERAGE — questions must distribute across these strands:
- Strand 1: The Old Testament (Q1-Q2 typically)
  Sub-strands: The Holy Bible, The Exodus, The Sinai Covenant, Loyalty to God (Elijah), Prophet Amos
- Strand 2: The New Testament (Q3-Q4 typically)
  Sub-strands: New Testament Books, Infancy and Early Life of Jesus, Galilean Ministry, Paul's 1 Corinthians
- Strand 3: Church in Action (Q5 typically)
  Sub-strands: The Holy Spirit and Gifts, The Holy Trinity, Sacraments
- Strand 4: Christian Living Today (Q6 typically)
  Sub-strands: Christian Ethics, Human Rights and GBV, Human Sexuality, Marriage and Family, Medicine and Technology

QUESTION FORMAT — each question must follow this EXACT pattern:

(a) "Describe [Biblical event/concept] as recorded in [Book Chapter:Verses]." OR
    "Explain how [Biblical figure] [action] and outline [result]." (6–8 marks)
    → DETAILED descriptive answer: 1 mark per specific factual point
    → Always cite the exact Bible reference in the question text

(b) "Explain [NUMBER] [lessons/ways/reasons] that Christians can [action/learn] from [topic]." (5–7 marks)
    → Application-level question connecting scripture to modern Christian life
    → Each point = 1 mark, must be distinct and complete

(c) "State [NUMBER] [characteristics/ways/qualities] of [topic]." (4–5 marks)
    → Knowledge-level recall
    → 1 mark per correct point, no elaboration needed

━━━ CRITICAL CONTENT RULES ━━━
1. EVERY question MUST cite at least ONE specific Bible reference (Book Chapter:Verse)
2. Names must be Biblical (Moses, Elijah, Amos, Jesus, Paul, Peter, Abraham)
3. Apply to Kenyan context: mention Kenya's churches, youth, families, society
4. Use CBC action verbs matching marks:
   - 1-4 marks: State, List, Name, Identify, Give
   - 5-7 marks: Explain, Describe, Discuss, Outline  
   - 8+ marks: Describe in detail, Examine, Analyse, Evaluate
5. Each point in the marking scheme = exactly 1 mark
6. Use KNEC marking language: "Award 1 mark for each correct point. Any [X] correct points."
7. Never ask for essay-style prose — all answers are point-form (1 mark per point)

━━━ TOPIC-SPECIFIC REQUIREMENTS ━━━
The Holy Bible: inspiration (2 Tim 3:16), literary forms, OT categories, Bible study methods
The Exodus: call of Moses (Ex 3), plagues, Passover, crossing Red Sea, provision in wilderness
The Sinai Covenant: making of covenant (Ex 19-20), Ten Commandments, breaking and renewal
Loyalty to God (Elijah): contest at Mt Carmel (1 Kings 18), still small voice (1 Kings 19)
Prophet Amos: social injustice, Day of the Lord, restoration, relevance today
Infancy/Early Life of Jesus: OT prophecies fulfilled, role of John the Baptist, baptism, temptation
Galilean Ministry: rejection at Nazareth, calling disciples, Sermon on Plain, miracles, parables, transfiguration
Paul's 1 Corinthians: divisions, immorality, unity, spiritual gifts (1 Cor 12), Lord's Supper
Holy Spirit: Pentecost (Acts 2), gifts of the Spirit (1 Cor 12), role of Spirit in believers' lives
Holy Trinity: Father, Son, Holy Spirit — unity and distinct roles
Sacraments: Baptism and Lord's Supper — meaning, significance, practice
Christian Ethics: integrity, honesty, moral decision-making
Human Rights and GBV: dignity, equality, Kenyan law, Christian response
Human Sexuality: God's design, abstinence, sexual integrity for youth
Marriage and Family: Christian marriage, roles, challenges in Kenya
Medicine and Technology: Christian ethics in healthcare, bioethics`,

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

    history: `
HISTORY AND CITIZENSHIP EXAM STRUCTURE — CBC GRADE 10 (KNEC Standard):

━━━ EXAM TYPE AND MARKS ━━━
CAT: 40 marks, 10–12 short answer questions (Section A format only)
Midterm: 50 marks, Sections A and B
End Term / Mock / Pre-Mock / Series: 100 marks, THREE sections, 2 hours

━━━ END TERM STRUCTURE (100 marks) ━━━

SECTION A — SHORT ANSWER (20 marks, Answer ALL):
- 10 questions × 2 marks each
- ONLY these verbs: "Define", "List TWO", "Name TWO", "State TWO", "Identify TWO", "Give TWO"
- No explanations — concise factual point-form answers only
- 1 mark per correct point (2 marks = 2 points expected)
- Cover ALL selected strands
- Examples:
  "Define the term History." (2 marks)
  "Name TWO linguistic groups found in Kenya." (2 marks)
  "State TWO causes of the Mau Mau Movement in Kenya." (2 marks)
  "Identify TWO forms of democracy." (2 marks)
  "Give TWO human rights provided in the Constitution of Kenya 2010." (2 marks)

SECTION B — STRUCTURED QUESTIONS (40 marks, Answer ALL):
- 3 questions, each with sub-parts (a) and (b)
- Use verbs: "Explain", "Describe", "Discuss", "Outline" + EXACT number of points
- Always specify: "Explain THREE...", "Describe FOUR...", "Discuss FIVE..."
- 1 mark per valid point — marks = number of points required
- Examples:
  Q11. (a) Explain THREE reasons why the British established colonial rule in Kenya. (6 marks)
       (b) Describe FOUR methods the British used to establish colonial rule in Kenya. (8 marks)
  Q12. (a) Explain THREE social effects of the Trans-Atlantic Slave Trade. (6 marks)
       (b) Discuss FIVE factors that led to the Scramble and Partition of Africa. (10 marks)
  Q13. Describe FIVE causes of the Mau Mau Movement in Kenya. (10 marks)

SECTION C — ESSAY QUESTIONS (40 marks, Answer ANY TWO):
- Provide 3 questions — learner answers ANY TWO
- Each question = 20 marks, TWO sub-parts: (a) 10 marks + (b) 10 marks
- Verbs: "Discuss FIVE...", "Explain FIVE...", "Examine FIVE...", "Analyse FIVE..."
- Always 5 points × 2 marks each = 10 marks per sub-part
- Examples:
  Q14. (a) Discuss FIVE contributions of Jomo Kenyatta to Kenya's independence and nation-building. (10 marks)
       (b) Explain FIVE features of the Constitution of Kenya 2010. (10 marks)
  Q15. (a) Explain FIVE ways through which citizens can participate in governance in Kenya. (10 marks)
       (b) Describe FIVE economic activities of early man in Africa. (10 marks)

━━━ STRAND COVERAGE ━━━
Strand 1 (Kenyan History): Linguistic Groups, Colonial Rule, Constitution 2010, Political Developments
Strand 2 (African History): Human Developments, African Civilisations, Colonisation, Nationalism, Global Wars
Strand 3 (World History): Enlightenment, American Revolution, Democracy

━━━ KENYAN CONTEXT RULES ━━━
- Always use real Kenyan leaders: Jomo Kenyatta, Dedan Kimathi, Me Katilili, Koitalel arap Samoei, Oginga Odinga
- Real communities: Gikuyu, Luo, Maasai, Kamba, Luhya, Kalenjin, Somali, Mijikenda, Swahili
- Real events: Mau Mau, Lancaster House, Independence 1963, 2010 Constitution, Multiparty 1991
- For Section B structured questions: include a brief Kenyan scenario or context before asking
- For Section C essays: always ask about specific Kenyan leaders, events or institutions

━━━ CRITICAL RULES ━━━
- Section A: ONLY "TWO" per question — never one point, never three
- Section B/C: points requested MUST match marks (5 points = 5 marks, not 6)
- Marking guide: list each acceptable point separately
- Use: "Award 1 mark for each correct point. Award any [X] correct points."
- NEVER ask the same sub-topic in both Section B and Section C
- Section C must have 3 questions so learner can choose 2`,
  };

  return base[type] || base[subject === 'English' ? 'english' : subject === 'CRE' || subject === 'IRE' || subject === 'HRE' ? 'cre' : subject === 'History and Citizenship' ? 'history' : 'humanities'];
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
ENGLISH QUESTION FORMAT — verified from actual KNEC Grade 10 paper:

SECTION A — COMPREHENSION (passage + 8 questions):
  Q1. What was the atmosphere/mood in [scene]? Use evidence from the text. (3 marks)
  Q2. How does the writer convey [range/character/experience]? Refer to the passage. (3 marks)
  Q3. Describe in your own words [specific event/problem]. (3 marks)
  Q4. What [pressures/reasons/examples] are given? Give THREE. (3 marks)
  Q5. What does the phrase "[figurative expression]" tell you about [subject]? (2 marks)
  Q6. Explain the irony in [situation/event]. (2 marks)
  Q7. Comment on the significance of [character action/final scene]. (2 marks)
  Q8. Explain the meaning of: (a) "[word]" (b) "[phrase]" (2 marks)

SECTION B — SUMMARY (separate passage + 1 instruction):
  "Read the passage carefully. In not more than 80 words, summarise [specific aspect].
   Use your own words as far as possible."
  ROUGH COPY: [lines]   FAIR COPY: [lines]

SECTION C — GRAMMAR (7 sub-questions, 30 marks total):
  C1: "Rewrite each sentence using the tense indicated in brackets. Do not alter the meaning. (5 marks)"
      (5 sentences × 1 mark each — use varied tenses: Simple Past, Present Perfect, Future Continuous etc.)
  C2: "Change the following sentences from direct to reported speech OR from reported to direct speech. (6 marks)"
      (6 sentences × 1 mark — mix both directions)
  C3: "Choose the correct form of the verb in brackets to complete each sentence. (4 marks)"
      (4 sentences × 1 mark — subject-verb agreement with collective nouns, indefinite pronouns, correlatives)
  C4: "Fill in the blank with the correct particle to complete the phrasal verb. (5 marks)"
      (5 gaps × 1 mark — give list of particles: up, out, off, down, into, on, away)
  C5: "Rewrite the following sentences by changing from active to passive voice or vice versa. (4 marks)"
      (4 sentences × 1 mark)
  C6: "Punctuate the following sentences correctly and rewrite them in full. (3 marks)"
      (3 unpunctuated sentences × 1 mark — mix capitals, commas, colons, apostrophes)
  C7: "(a) Write a SYNONYM for each: [3 academic words] (1½ marks)"
      "(b) Write an ANTONYM for each: [3 academic words] (1½ marks)"

SECTION D — ORAL SKILLS (10 marks):
  D1(a): "Identify the odd one out in terms of the underlined sound in each group: (2 marks)"
         (2 groups of 4 words with underlined vowels — identify word with different sound)
  D1(b): "Mark the stress on the following words by placing an apostrophe (ˈ) before the stressed syllable: (2 marks)"
         (4 multi-syllabic words: e.g. pho-tog-ra-phy, e-co-nom-ic, ca-fe-te-ri-a, re-cord)
  D2: "For each situation, write an appropriate response using the register in brackets: (3 marks, 1 each)"
      (i) [situation] (Formal apology)
      (ii) [situation] (Formal)
      (iii) [situation] (Informal refusal)
  D3: "Explain the meaning of each expression. Then use each in a sentence of your own: (3 marks, 1 each)"
      (3 idiomatic expressions e.g. bite the bullet / burn the midnight oil / the ball is in your court)

SECTION E — POETRY (full poem + 9 questions, 30 marks):
  E1. What is the poem about? Write a brief prose statement. (2 marks)
  E2. What does the poet mean by "[specific line]"? What does this tell us about [subject]? (3 marks)
  E3. Explain the phrase "[specific phrase]". What does it suggest about [subject]? (3 marks)
  E4. Comment on the effect of the [short/unusual] stanza: "[quote]". Why might the poet have chosen this? (4 marks)
  E5. Identify and explain ONE figure of speech in the line "[quote]". (3 marks)
  E6. What is the mood of the poem? Use evidence from at least TWO stanzas. (4 marks)
  E7. Examine the use of contrast. Identify at least TWO contrasts and explain their significance. (4 marks)
  E8. What is the theme? Discuss how the poet develops it through images and language choices. (4 marks)
  E9. How does the final stanza serve as a fitting conclusion? Discuss its meaning and relationship to the poem. (3 marks)`,

    humanities: `
QUESTION FORMAT FOR HUMANITIES:
Section A (Short Answer — 2 marks each):
  - "Define", "State", "Identify", "Give ONE example of"
  - Data/map/source reference questions

Section B (Structured — 5–8 marks):
  - Multi-part questions with source, map, or data stimulus
  - (a) Identify ___ (2 marks) (b) Explain ___ (3 marks) (c) Suggest how ___ (2 marks)

Section C (Essay / Extended Response — 10–15 marks):
  - "Discuss", "Analyse", "Evaluate", "Examine"
  - 1 mark per valid point, up to maximum`,

    history: `
HISTORY QUESTION FORMAT — verified from KNEC Grade 10 papers:

SECTION A (10 × 2 marks = 20 marks — ALL questions):
  Q1. Define the term [concept]. (2 marks)
  Q2. Name/List/State/Identify/Give TWO [items]. (2 marks)
  [continue for all 10 questions — each covers a different topic from selected strands]

SECTION B (3 questions — ALL questions):
  Q11. (a) Explain THREE [reasons/effects/causes] of [event/topic]. (6 marks)
       (b) Describe FOUR [functions/methods/characteristics] of [institution/process]. (8 marks)
  Q12. (a) Explain THREE [social/economic/political] effects of [event]. (6 marks)
       (b) Discuss FIVE [factors/causes/reasons] that led to [event]. (10 marks)
  Q13. Describe FIVE [causes/effects/features] of [Kenyan/African event]. (10 marks)

SECTION C (3 questions — Answer ANY TWO — 20 marks each):
  Q14. (a) Discuss FIVE [contributions/roles/ways] of [person/institution] in [context]. (10 marks)
       (b) Explain FIVE [features/challenges/ways] of [topic]. (10 marks)
  Q15. (a) Examine FIVE ways through which [group] [action] in [context]. (10 marks)
       (b) Describe FIVE [activities/causes/effects] of [historical topic]. (10 marks)
  Q16. (a) Analyse FIVE [factors/reasons] that led to [historical event]. (10 marks)
       (b) Discuss FIVE [challenges/ways/effects] facing [group/institution] today. (10 marks)`,

    cre: `
CRE QUESTION FORMAT — Kenya CBC Grade 10 (KNEC Standard):

EXAM STRUCTURE:
A standard CRE End Term/Mock paper has 6 questions (no sections A/B/C).
Each question has THREE parts: (a), (b), (c).
Total marks: 100 (scale proportionally for other totals).
Time: 2.5 hours.

MARK ALLOCATION PER QUESTION (typical 20-mark question):
  (a) "Describe EIGHT..." or "Explain EIGHT..." = 8 marks (1 mark per valid point)
  (b) "Explain SEVEN..." or "Discuss SEVEN..." = 7 marks (1 mark per valid point)
  (c) "State FIVE..." or "Outline FIVE..." = 5 marks (1 mark per valid point)

MARK ALLOCATION PER QUESTION (typical 15-mark question):
  (a) "Describe SIX..." = 6 marks
  (b) "Explain FIVE..." = 5 marks
  (c) "State FOUR..." = 4 marks

CRITICAL CRE RULES:
1. ALWAYS use these verbs matching marks: Describe/Explain (6-8 marks), Identify/Outline (4-5 marks), State/Give/Name (3-5 marks)
2. NEVER say "discuss briefly" or give vague prompts — always specify exact number of points required
3. Each question must cover ONE main topic/substrand — do not mix topics within a question
4. ALWAYS include specific Bible references in questions e.g. "as recorded in Exodus 3:1-4:17"
5. Marking scheme must list each point separately — "1 mark per valid point"
6. Questions must test understanding and application, not just recitation
7. Use Kenyan context where appropriate — "a Christian leader in Kenya today", "churches in Kenya"
8. Questions should progress: (a) descriptive/historical, (b) explanation/lessons, (c) application/relevance today

TOPIC COVERAGE — distribute 6 questions across these strands:
- The Old Testament: The Bible, Bible Study Methods, Redemption, Stewardship, The Exodus, Sinai Covenant, Prophet Elijah, Prophet Amos
- The New Testament: NT Books, Birth/Baptism/Temptation of Jesus, Galilean Ministry, Paul's 1 Corinthians
- Church in Action: Holy Spirit, Gifts of the Holy Spirit, Holy Trinity, Sacraments
- Christian Living Today: Christian Ethics, Human Rights, Human Sexuality, Marriage and Family, Medicine and Technology

QUESTION EXAMPLES (exact format to follow):
Q1. (a) Describe EIGHT steps through which the Bible was formed from oral tradition to the canon we have today. (8 marks)
    (b) Explain SEVEN ways in which the Bible is important to Christians in their daily lives. (7 marks)
    (c) State FIVE challenges that Bible translators face when translating the Bible into local languages. (5 marks)

Q2. (a) Describe the call of Moses at the burning bush as recorded in Exodus 3:1-4:17 and explain how God prepared him for his mission. (6 marks)
    (b) Explain FIVE lessons that Christians today can learn from the Ten Commandments as given in Exodus 20:1-17. (5 marks)
    (c) State FOUR ways in which Moses' leadership qualities are relevant to Christian leaders in contemporary Kenya. (4 marks)

Q3. (a) Describe how the Holy Spirit empowered the early church on the Day of Pentecost as recorded in Acts 2:1-47. (8 marks)
    (b) Explain SEVEN gifts of the Holy Spirit as described in 1 Corinthians 12:1-31 and state their importance to the church. (7 marks)
    (c) State FIVE ways in which Christians in Kenya today can demonstrate the fruits of the Holy Spirit. (5 marks)`,

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

  return formats[type] || formats[subject === 'History and Citizenship' ? 'history' : 'humanities'];
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
  const questionFormats = (subject === 'English' || subject === 'Kiswahili' || subject === 'CRE' || subject === 'IRE' || subject === 'HRE') ? '' : getQuestionFormatRules(subject);

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
  const questionFormats = (subject === 'English' || subject === 'Kiswahili' || subject === 'CRE' || subject === 'IRE' || subject === 'HRE') ? '' : getQuestionFormatRules(subject);

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
