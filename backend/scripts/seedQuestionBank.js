/**
 * ExamsForge by SmartSchool Digital
 * scripts/seedQuestionBank.js
 *
 * Seeds the QuestionBank collection with starter questions for Grade 10–12 CBC.
 * Run once after setup: node scripts/seedQuestionBank.js
 *
 * Usage:
 *   cd backend
 *   node scripts/seedQuestionBank.js
 *
 * FIX: QuestionBank schema is defined inline so this script is fully self-contained
 *      and does not depend on models/QuestionBank.js existing beforehand.
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/examsforge';

// ── Inline QuestionBank schema (no external model file required) ─────────────
const questionBankSchema = new mongoose.Schema(
  {
    grade:             { type: String, required: true, enum: ['Grade 10', 'Grade 11', 'Grade 12'] },
    subject:           { type: String, required: true },
    strand:            { type: String, required: true },
    subStrand:         { type: String, required: true },
    questionType:      { type: String, required: true, enum: ['short_answer', 'structured', 'long_answer', 'calculation', 'essay'] },
    difficulty:        { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    marks:             { type: Number, required: true },
    questionText:      { type: String, required: true },
    answerGuide:       { type: String, required: true },
    tags:              [{ type: String }],
    learningObjective: { type: String },
  },
  { timestamps: true }
);

const QuestionBank = mongoose.models.QuestionBank || mongoose.model('QuestionBank', questionBankSchema);
// ────────────────────────────────────────────────────────────────────────────

const seedQuestions = [

  // ── GRADE 10 — MATHEMATICS ──────────────────────────────────────────────
  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', subStrand: 'Quadratic Equations',
    questionType: 'calculation', difficulty: 'medium', marks: 4,
    questionText: 'Solve the quadratic equation 2x² + 5x − 3 = 0, giving your answers to 2 decimal places where necessary.',
    answerGuide: 'Using quadratic formula or factorisation: x = ½ or x = −3. Award 2 marks for correct method, 1 mark per correct root.',
    tags: ['quadratic', 'algebra', 'equations'], learningObjective: 'Solve quadratic equations by factorisation and formula',
  },
  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', subStrand: 'Indices and Logarithms',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: '(a) Simplify: 3²× 3⁴ ÷ 3³ (2 marks)\n(b) If log₁₀ 2 = 0.3010, find the value of log₁₀ 32 without using a calculator. Show your working. (4 marks)',
    answerGuide: '(a) 3³ = 27 — 2 marks. (b) log₁₀ 32 = log₁₀ 2⁵ = 5 × 0.3010 = 1.505 — award 2 marks for recognising 32 = 2⁵, 2 marks for correct calculation.',
    tags: ['indices', 'logarithms'], learningObjective: 'Apply laws of indices and logarithms',
  },
  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', subStrand: 'Trigonometry',
    questionType: 'calculation', difficulty: 'medium', marks: 5,
    questionText: 'A ladder of length 6 m leans against a vertical wall. The foot of the ladder is 2.5 m from the base of the wall on a horizontal ground.\n(a) Calculate the angle the ladder makes with the ground. (3 marks)\n(b) Find how high up the wall the ladder reaches. (2 marks)',
    answerGuide: '(a) cos θ = 2.5/6, θ = cos⁻¹(0.4167) = 65.4° (3 marks). (b) height = √(6² − 2.5²) = √(36 − 6.25) = √29.75 ≈ 5.45 m (2 marks).',
    tags: ['trigonometry', 'Pythagoras', 'angles'], learningObjective: 'Apply trigonometric ratios to solve real-life problems',
  },
  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Statistics and Probability', subStrand: 'Measures of Central Tendency',
    questionType: 'structured', difficulty: 'easy', marks: 4,
    questionText: 'The marks scored by 10 students in a Mathematics test were: 45, 67, 54, 78, 62, 45, 89, 54, 73, 68.\n(a) Find the mode of the marks. (1 mark)\n(b) Calculate the median mark. (3 marks)',
    answerGuide: '(a) Mode = 45 and 54 (bimodal) — 1 mark. (b) Arrange in order: 45,45,54,54,62,67,68,73,78,89; Median = (62+67)/2 = 64.5 — award 2 marks for arranging, 1 mark for correct median.',
    tags: ['statistics', 'mean', 'median', 'mode'], learningObjective: 'Calculate measures of central tendency from raw data',
  },

  // ── GRADE 10 — BIOLOGY ──────────────────────────────────────────────────
  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology', subStrand: 'Cell Structure and Function',
    questionType: 'structured', difficulty: 'easy', marks: 5,
    questionText: '(a) State TWO differences between a plant cell and an animal cell. (2 marks)\n(b) Explain the function of the mitochondria in a cell. (3 marks)',
    answerGuide: '(a) Any 2 from: plant cells have cell wall / chloroplasts / large central vacuole; animal cells do not — 1 mark each. (b) Mitochondria are the site of aerobic respiration; they produce ATP (energy) from glucose and oxygen — 1 mark for site, 2 marks for detailed explanation.',
    tags: ['cell biology', 'organelles', 'plant cell', 'animal cell'], learningObjective: 'Describe the structure and functions of cell organelles',
  },
  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Nutrition', subStrand: 'Nutrients and their Functions',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    questionText: 'State TWO functions of proteins in the human body.',
    answerGuide: 'Any 2 from: growth and repair of body tissues; production of enzymes and hormones; production of antibodies for immunity; source of energy when carbohydrates are insufficient — 1 mark each.',
    tags: ['nutrition', 'proteins', 'diet'], learningObjective: 'Identify the functions of food nutrients in the body',
  },
  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Gaseous Exchange', subStrand: 'Breathing Mechanism',
    questionType: 'long_answer', difficulty: 'hard', marks: 8,
    questionText: 'Describe what happens during inhalation in a human being, starting from when the diaphragm contracts to when oxygen enters the blood. (8 marks)',
    answerGuide: 'Diaphragm contracts and flattens (1); intercostal muscles contract (1); thoracic cavity volume increases (1); pressure in lungs decreases below atmospheric (1); air rushes into lungs through trachea/bronchi/bronchioles (1); oxygen diffuses across alveolar walls and capillary walls (1); oxygen dissolves in moisture on alveoli surface (1); oxygen combines with haemoglobin in red blood cells (1). Max 8 marks.',
    tags: ['gaseous exchange', 'breathing', 'lungs', 'alveoli'], learningObjective: 'Explain the mechanism of breathing in humans',
  },

  // ── GRADE 10 — CHEMISTRY ────────────────────────────────────────────────
  {
    grade: 'Grade 10', subject: 'Chemistry',
    strand: 'Acids, Bases and Salts', subStrand: 'pH and Indicators',
    questionType: 'structured', difficulty: 'easy', marks: 5,
    questionText: 'A solution has a pH of 2.\n(a) Is the solution acidic, neutral, or alkaline? (1 mark)\n(b) Name ONE indicator that could be used to test this solution and state the colour it would turn. (2 marks)\n(c) If this solution were diluted with water, how would the pH change? Explain your answer. (2 marks)',
    answerGuide: '(a) Acidic — 1 mark. (b) Any suitable indicator e.g. litmus → red; phenolphthalein → colourless; universal indicator → red/orange — 1 mark each. (c) pH would increase (move towards 7) — 1 mark; dilution reduces H⁺ ion concentration — 1 mark.',
    tags: ['pH', 'acids', 'indicators', 'dilution'], learningObjective: 'Explain the pH scale and use of indicators',
  },
  {
    grade: 'Grade 10', subject: 'Chemistry',
    strand: 'Stoichiometry', subStrand: 'Mole Concept',
    questionType: 'calculation', difficulty: 'medium', marks: 6,
    questionText: 'Calculate the number of moles in 22.0 g of carbon dioxide (CO₂).\n(a) Calculate the molar mass of CO₂. (2 marks)\n(b) Calculate the number of moles of CO₂. (2 marks)\n(c) Calculate the number of molecules in this sample. (Avogadro\'s number = 6.02 × 10²³) (2 marks)',
    answerGuide: '(a) Molar mass = 12 + (16×2) = 44 g/mol — 2 marks. (b) moles = 22/44 = 0.5 mol — 2 marks. (c) molecules = 0.5 × 6.02×10²³ = 3.01×10²³ — 2 marks.',
    tags: ['mole concept', 'stoichiometry', 'Avogadro'], learningObjective: 'Apply the mole concept in chemical calculations',
  },

  // ── GRADE 10 — PHYSICS ──────────────────────────────────────────────────
  {
    grade: 'Grade 10', subject: 'Physics',
    strand: 'Mechanics', subStrand: "Newton's Laws of Motion",
    questionType: 'structured', difficulty: 'medium', marks: 7,
    questionText: 'A car of mass 1200 kg accelerates from rest to a velocity of 20 m/s in 8 seconds.\n(a) Calculate the acceleration of the car. (2 marks)\n(b) Calculate the net force acting on the car. (2 marks)\n(c) If a frictional force of 300 N opposes the motion, calculate the driving force of the engine. (3 marks)',
    answerGuide: '(a) a = (v-u)/t = (20-0)/8 = 2.5 m/s² — 2 marks. (b) F = ma = 1200 × 2.5 = 3000 N — 2 marks. (c) Net force = Driving force − Friction; 3000 = F − 300; F = 3300 N — 3 marks (1 for equation, 2 for answer).',
    tags: ["Newton's laws", 'force', 'acceleration', 'mass'], learningObjective: "Apply Newton's second law to solve problems",
  },
  {
    grade: 'Grade 10', subject: 'Physics',
    strand: 'Waves', subStrand: 'Wave Properties',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'A wave has a frequency of 50 Hz and a wavelength of 4 m. Calculate the speed of the wave.',
    answerGuide: 'Speed = frequency × wavelength; v = 50 × 4 = 200 m/s — 1 mark for formula, 2 marks for correct answer with units.',
    tags: ['waves', 'frequency', 'wavelength', 'wave speed'], learningObjective: 'Apply the wave equation to calculate wave speed',
  },

  // ── GRADE 11 — MATHEMATICS ──────────────────────────────────────────────
  {
    grade: 'Grade 11', subject: 'Mathematics',
    strand: 'Sequences and Series', subStrand: 'Arithmetic Progressions',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'An arithmetic progression has a first term of 5 and a common difference of 3.\n(a) Write down the first four terms of the sequence. (2 marks)\n(b) Find the 20th term of the sequence. (2 marks)\n(c) Calculate the sum of the first 20 terms. (2 marks)',
    answerGuide: '(a) 5, 8, 11, 14 — 2 marks. (b) T₂₀ = 5 + (20−1)×3 = 5 + 57 = 62 — 2 marks. (c) S₂₀ = 20/2 × (5 + 62) = 10 × 67 = 670 — 2 marks.',
    tags: ['sequences', 'arithmetic progression', 'series'], learningObjective: 'Find terms and sums of arithmetic progressions',
  },
  {
    grade: 'Grade 11', subject: 'Mathematics',
    strand: 'Calculus (Introductory)', subStrand: 'Differentiation',
    questionType: 'calculation', difficulty: 'medium', marks: 5,
    questionText: 'Given that f(x) = 3x³ − 2x² + 5x − 1,\n(a) Find f\'(x), the derivative of f(x). (3 marks)\n(b) Find the gradient of the curve at x = 2. (2 marks)',
    answerGuide: '(a) f\'(x) = 9x² − 4x + 5 — 1 mark per correct term (3 marks). (b) f\'(2) = 9(4) − 4(2) + 5 = 36 − 8 + 5 = 33 — 2 marks.',
    tags: ['calculus', 'differentiation', 'gradient'], learningObjective: 'Differentiate polynomials and find gradients at points',
  },

  // ── GRADE 11 — BIOLOGY ──────────────────────────────────────────────────
  {
    grade: 'Grade 11', subject: 'Biology',
    strand: 'Genetics and Heredity', subStrand: 'Mendelian Genetics',
    questionType: 'structured', difficulty: 'medium', marks: 8,
    questionText: 'In pea plants, tall (T) is dominant over short (t). Two heterozygous tall plants are crossed.\n(a) Using a genetic cross diagram, show the expected offspring. (4 marks)\n(b) State the expected phenotypic ratio of the offspring. (2 marks)\n(c) If 80 offspring were produced, how many would be expected to be short? (2 marks)',
    answerGuide: '(a) Parental genotypes: Tt × Tt; Gametes: T, t and T, t; Punnett square showing TT, Tt, Tt, tt — 4 marks (1 each for parents, gametes, grid, offspring). (b) 3 tall : 1 short — 2 marks. (c) 80 × ¼ = 20 short plants — 2 marks.',
    tags: ['genetics', 'Mendel', 'dominant', 'recessive', 'Punnett square'], learningObjective: 'Predict outcomes of monohybrid crosses using Punnett squares',
  },
  {
    grade: 'Grade 11', subject: 'Biology',
    strand: 'Reproduction', subStrand: 'Human Reproduction',
    questionType: 'long_answer', difficulty: 'hard', marks: 10,
    questionText: 'Describe the events that occur during the menstrual cycle in a human female, explaining the role of hormones at each stage. (10 marks)',
    answerGuide: 'Menstruation (days 1-5): low oestrogen and progesterone, uterine lining shed (2 marks); Follicular phase: FSH stimulates follicle development, oestrogen rises (2 marks); Ovulation (day 14): LH surge causes release of egg from ovary (2 marks); Luteal phase: corpus luteum produces progesterone, maintains uterine lining (2 marks); If no fertilisation: corpus luteum degenerates, progesterone drops, lining sheds (2 marks). Max 10 marks.',
    tags: ['reproduction', 'menstrual cycle', 'hormones', 'FSH', 'LH'], learningObjective: 'Explain hormonal control of the menstrual cycle',
  },

  // ── GRADE 11 — CHEMISTRY ────────────────────────────────────────────────
  {
    grade: 'Grade 11', subject: 'Chemistry',
    strand: 'Reaction Kinetics', subStrand: 'Factors Affecting Rate',
    questionType: 'structured', difficulty: 'medium', marks: 8,
    questionText: 'An experiment was carried out to investigate the rate of reaction between marble chips and hydrochloric acid.\n(a) Write a balanced equation for this reaction. (2 marks)\n(b) State THREE factors that would increase the rate of this reaction, explaining each one. (6 marks)',
    answerGuide: '(a) CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂ — 2 marks (1 for correct reactants/products, 1 for balancing). (b) Any 3 of: increase concentration of HCl — more frequent collisions (2 marks); increase temperature — more particles with activation energy (2 marks); use powdered marble — greater surface area, more collisions (2 marks); use a catalyst — provides alternative pathway with lower activation energy (2 marks).',
    tags: ['kinetics', 'rate of reaction', 'collision theory'], learningObjective: 'Explain factors affecting rate of reaction using collision theory',
  },

  // ── GRADE 11 — PHYSICS ──────────────────────────────────────────────────
  {
    grade: 'Grade 11', subject: 'Physics',
    strand: 'Linear and Circular Motion', subStrand: 'Circular Motion',
    questionType: 'calculation', difficulty: 'hard', marks: 8,
    questionText: 'A stone of mass 0.2 kg is tied to a string of length 0.8 m and whirled in a horizontal circle at a speed of 4 m/s.\n(a) Calculate the centripetal acceleration of the stone. (3 marks)\n(b) Calculate the tension in the string (centripetal force). (3 marks)\n(c) What provides the centripetal force in this situation? (2 marks)',
    answerGuide: '(a) a = v²/r = 4²/0.8 = 16/0.8 = 20 m/s² — 3 marks. (b) F = ma = 0.2 × 20 = 4 N — 3 marks. (c) The tension in the string provides the centripetal force — 2 marks.',
    tags: ['circular motion', 'centripetal force', 'tension'], learningObjective: 'Apply equations for circular motion to solve problems',
  },

  // ── GRADE 12 — MATHEMATICS ──────────────────────────────────────────────
  {
    grade: 'Grade 12', subject: 'Mathematics',
    strand: 'Calculus', subStrand: 'Integration',
    questionType: 'calculation', difficulty: 'hard', marks: 8,
    questionText: 'Given f(x) = 3x² + 4x − 1,\n(a) Find ∫f(x) dx. (3 marks)\n(b) Evaluate ∫₁³ f(x) dx. (5 marks)',
    answerGuide: '(a) ∫(3x² + 4x − 1)dx = x³ + 2x² − x + C — 3 marks (1 per term; accept without +C in definite integral context). (b) [x³ + 2x² − x]₁³ = (27 + 18 − 3) − (1 + 2 − 1) = 42 − 2 = 40 — 3 marks for substitution, 2 marks for correct evaluation.',
    tags: ['integration', 'calculus', 'definite integral'], learningObjective: 'Evaluate definite and indefinite integrals of polynomials',
  },
  {
    grade: 'Grade 12', subject: 'Mathematics',
    strand: 'Vectors and Matrices', subStrand: 'Matrix Operations',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'Given matrices A = [[2, 3], [1, 4]] and B = [[1, 0], [2, 1]],\n(a) Calculate A × B. (4 marks)\n(b) Find the determinant of matrix A. (2 marks)',
    answerGuide: '(a) AB = [[2×1+3×2, 2×0+3×1], [1×1+4×2, 1×0+4×1]] = [[8, 3], [9, 4]] — 1 mark per correct element (4 marks). (b) det(A) = 2×4 − 3×1 = 8 − 3 = 5 — 2 marks.',
    tags: ['matrices', 'matrix multiplication', 'determinant'], learningObjective: 'Perform matrix operations including multiplication and determinants',
  },

  // ── GRADE 12 — BIOLOGY ──────────────────────────────────────────────────
  {
    grade: 'Grade 12', subject: 'Biology',
    strand: 'Molecular Biology and Biotechnology', subStrand: 'DNA Structure and Replication',
    questionType: 'long_answer', difficulty: 'hard', marks: 10,
    questionText: 'Describe the structure of the DNA molecule and explain the process of DNA replication. (10 marks)',
    answerGuide: 'Structure (5 marks): Double helix structure (1); two polynucleotide strands held by hydrogen bonds (1); each nucleotide has deoxyribose sugar, phosphate group, and nitrogenous base (1); complementary base pairing — A-T, G-C (1); antiparallel strands (1). Replication (5 marks): enzyme helicase unwinds and unzips the double helix by breaking hydrogen bonds (1); each strand serves as a template (1); DNA polymerase adds complementary nucleotides in 5\'→3\' direction (1); two identical DNA molecules formed — semi-conservative replication (1); leading and lagging strand synthesis explained (1).',
    tags: ['DNA', 'replication', 'molecular biology', 'base pairing'], learningObjective: 'Describe DNA structure and explain semi-conservative replication',
  },
  {
    grade: 'Grade 12', subject: 'Biology',
    strand: 'Ecology and Conservation', subStrand: 'Ecosystems and Biomes',
    questionType: 'structured', difficulty: 'medium', marks: 8,
    questionText: 'Study the food chain: Grass → Grasshopper → Frog → Snake → Hawk.\n(a) Identify the producer in this food chain. (1 mark)\n(b) Construct a pyramid of numbers for this food chain and explain its shape. (4 marks)\n(c) Using the 10% energy transfer rule, if 10,000 kJ of energy is available at the producer level, calculate the energy available to the hawk. (3 marks)',
    answerGuide: '(a) Grass — 1 mark. (b) Correct pyramid drawn with grass at base and hawk at apex (2 marks); each level has fewer organisms than the level below, hence a typical upright pyramid shape (2 marks). (c) Grasshopper: 1000 kJ; Frog: 100 kJ; Snake: 10 kJ; Hawk: 1 kJ — 1 mark per correct calculation up to 3 marks.',
    tags: ['ecology', 'food chain', 'energy flow', 'pyramid of numbers'], learningObjective: 'Explain energy flow through ecosystems and construct ecological pyramids',
  },

  // ── GRADE 12 — CHEMISTRY ────────────────────────────────────────────────
  {
    grade: 'Grade 12', subject: 'Chemistry',
    strand: 'Advanced Organic Chemistry', subStrand: 'Reactions of Organic Compounds',
    questionType: 'structured', difficulty: 'hard', marks: 9,
    questionText: 'Ethanol (C₂H₅OH) undergoes several types of chemical reactions.\n(a) Write a balanced equation for the complete combustion of ethanol. (3 marks)\n(b) Write the equation for the oxidation of ethanol to ethanoic acid. Name the oxidising agent used. (3 marks)\n(c) Describe the esterification reaction between ethanol and ethanoic acid, including the conditions required and the name of the product. (3 marks)',
    answerGuide: '(a) C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O — 3 marks (1 for correct products, 2 for balancing). (b) C₂H₅OH → CH₃COOH (or via CH₃CHO); oxidising agent: acidified potassium dichromate (K₂Cr₂O₇/H₂SO₄) — 2 marks for equation, 1 for oxidising agent. (c) C₂H₅OH + CH₃COOH ⇌ CH₃COOC₂H₅ + H₂O; conditions: concentrated H₂SO₄ catalyst, heat; product: ethyl ethanoate — 1 mark each.',
    tags: ['organic chemistry', 'ethanol', 'combustion', 'esterification', 'oxidation'], learningObjective: 'Write equations for reactions of alcohols and carboxylic acids',
  },

  // ── GRADE 12 — PHYSICS ──────────────────────────────────────────────────
  {
    grade: 'Grade 12', subject: 'Physics',
    strand: 'Nuclear Physics', subStrand: 'Radioactivity',
    questionType: 'structured', difficulty: 'hard', marks: 9,
    questionText: 'A radioactive sample has a half-life of 20 years. The initial activity of the sample is 800 counts per second.\n(a) Define the term "half-life". (2 marks)\n(b) Calculate the activity after 60 years. (4 marks)\n(c) State TWO safety precautions that should be taken when handling radioactive materials. (3 marks)',
    answerGuide: '(a) Half-life is the time taken for half of the radioactive nuclei in a sample to decay / for the activity to halve — 2 marks. (b) After 20 years: 400 cps; after 40 years: 200 cps; after 60 years: 100 cps — 4 marks (1 per correct step + 1 for final answer). (c) Any 2: wear protective clothing/lead apron; use tongs/remote handling; store in lead containers; minimise exposure time; stand behind lead screen — 1.5 marks each.',
    tags: ['radioactivity', 'half-life', 'nuclear physics', 'safety'], learningObjective: 'Apply the concept of half-life to calculate activity at different times',
  },

  // ── GRADE 10 — HISTORY ──────────────────────────────────────────────────
  {
    grade: 'Grade 10', subject: 'History and Citizenship',
    strand: 'Pre-Colonial African History', subStrand: 'African Political Systems',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'With reference to pre-colonial East African societies:\n(a) Distinguish between a centralised and a non-centralised political system. (2 marks)\n(b) Give ONE example each of a centralised and a non-centralised society in pre-colonial Kenya. (2 marks)\n(c) Identify TWO strengths of the centralised political system. (2 marks)',
    answerGuide: '(a) Centralised: one supreme ruler/king with defined hierarchical authority; non-centralised: authority distributed among elders/age groups, no single ruler — 1 mark each. (b) Centralised: e.g. Buganda Kingdom (accept Wanga Kingdom); non-centralised: e.g. Kikuyu, Maasai, Luo — 1 mark each. (c) Any 2: strong military for defence; efficient tax collection; clear laws and order; large-scale projects possible; diplomatic relations — 1 mark each.',
    tags: ['pre-colonial', 'political systems', 'East Africa'], learningObjective: 'Compare centralised and non-centralised political systems in pre-colonial Africa',
  },

  // ── GRADE 10 — GEOGRAPHY ────────────────────────────────────────────────
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', subStrand: 'Plate Tectonics',
    questionType: 'long_answer', difficulty: 'medium', marks: 8,
    questionText: 'Explain how the theory of plate tectonics accounts for the formation of the following:\n(a) Fold mountains (3 marks)\n(b) Ocean trenches (3 marks)\n(c) State TWO pieces of evidence that support the theory of plate tectonics. (2 marks)',
    answerGuide: '(a) Two plates converge (collide); continental plates buckle and fold upwards under compression; layers of rock folded to form mountain ranges e.g. Himalayas — 3 marks. (b) Oceanic plate subducts (slides under) continental plate; denser oceanic crust sinks into mantle; forms deep trench at subduction zone e.g. Mariana Trench — 3 marks. (c) Any 2: continental fit of Africa and South America; similar fossils on separated continents; similar rock types; mid-ocean ridges; palaeomagnetism — 1 mark each.',
    tags: ['plate tectonics', 'fold mountains', 'ocean trenches'], learningObjective: 'Explain landform formation using the theory of plate tectonics',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Introduction to Geography',
    questionType: 'structured', difficulty: 'easy', marks: 4,
    questionText: 'A group of Grade 10 learners from Mwangaza School visited Lake Nakuru National Park to study the surrounding environment.\n(a) Define Geography as a learning area. (2 marks)\n(b) Mention two branches of Geography they are likely to study during the trip. (2 marks)',
    answerGuide: '(a) Geography is the study of the interrelationships between natural and human phenomena on the Earth\'s surface — 2 marks. (b) Any 2 from: Physical Geography; Human and Economic Geography; Practical Geography — 1 mark each.',
    tags: ['introduction to geography', 'branches of geography', 'definition'], learningObjective: 'Define Geography and identify its main branches',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Introduction to Geography',
    questionType: 'structured', difficulty: 'easy', marks: 4,
    questionText: 'During a lesson on the school field, the Geography teacher asked students to identify features created by nature.\n(a) Name two physical features they might identify. (2 marks)\n(b) State two aspects studied under Human Geography. (2 marks)',
    answerGuide: '(a) Any 2: mountains/hills; rivers/lakes; valleys; plains; forests — 1 mark each. (b) Any 2: population; settlement; agriculture; trade; industry; transport — 1 mark each.',
    tags: ['physical features', 'human geography', 'introduction'], learningObjective: 'Distinguish between physical and human geography aspects',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Introduction to Geography',
    questionType: 'long_answer', difficulty: 'medium', marks: 10,
    questionText: 'During an inter-school Geography contest, students were challenged to explore the relationship between Geography and other subjects.\n(a) Explain the relationship between:\n   i. Geography and Biology. (2 marks)\n   ii. Geography and Computer Studies. (2 marks)\n   iii. Geography and Agriculture. (2 marks)\n(b) Give two reasons Geography is considered significant in understanding environmental issues. (4 marks)',
    answerGuide: '(a)(i) Geography and Biology — both study living organisms and their environments; Biogeography examines distribution of plants and animals — 2 marks. (ii) Geography and Computer Studies — GIS and remote sensing use computer technology to store and analyse spatial data; computers aid in mapping and data presentation — 2 marks. (iii) Geography and Agriculture — Geography studies soils, climate, relief which influence crop and livestock farming; land use planning uses geographical knowledge — 2 marks. (b) Any 4: Geography identifies causes of environmental degradation; promotes conservation of natural resources; monitors climate change impacts; assists in disaster risk management; supports sustainable land use planning — 1 mark each.',
    tags: ['relationship with other subjects', 'GIS', 'environment', 'agriculture'], learningObjective: 'Explain the relationship between Geography and other learning areas',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Introduction to Geography',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    questionText: 'Give two importance of studying Geography.',
    answerGuide: 'Any 2 from: helps understand the Earth and environment; aids in resource planning and management; enhances disaster preparedness; provides knowledge for economic and social development; promotes environmental conservation; aids navigation and mapping; fosters cultural understanding — 1 mark each.',
    tags: ['importance of geography', 'introduction'], learningObjective: 'State the importance of studying Geography',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Map Work',
    questionType: 'structured', difficulty: 'easy', marks: 5,
    questionText: 'A map of Kisumu County was given to students to identify social amenities.\n(a) Define a map. (1 mark)\n(b) State two methods of representing relief on topographical maps. (2 marks)\n(c) Explain one use of map scales. (1 mark)\n(d) A person who designs and reads maps is known as a? (1 mark)',
    answerGuide: '(a) A map is a representation of the Earth\'s surface or part of it on a flat surface, drawn to scale — 1 mark. (b) Any 2: contour lines; spot heights/triangulation points; hachures/shading/layer colouring; relief models — 1 mark each. (c) Map scales are used to measure actual distances on the ground from distances on the map — 1 mark. (d) Cartographer — 1 mark.',
    tags: ['map definition', 'relief representation', 'map scale', 'cartographer'], learningObjective: 'Define a map and describe methods of representing relief',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Map Work',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Students from Baraka High School used an atlas to study East African countries.\n(a) Describe two characteristics of a topographical map. (4 marks)\n(b) Explain three uses of maps in daily life. (6 marks)',
    answerGuide: '(a) Any 2: drawn to a specific scale; shows both natural and man-made features; uses conventional symbols/signs; includes marginal information (title, scale, key, north arrow); covers a specific area in detail — 2 marks each. (b) Any 3: navigation and route planning; land use planning and management; locating resources and social amenities; military and disaster planning; tourism and recreation; urban and regional development planning — 2 marks each.',
    tags: ['topographical map', 'map uses', 'characteristics'], learningObjective: 'Describe characteristics and uses of topographical maps',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Map Work',
    questionType: 'structured', difficulty: 'medium', marks: 8,
    questionText: 'Students compared various maps during a group discussion.\n(a) Explain two differences between sketch maps and topographical maps. (4 marks)\n(b) Name four items of marginal information found in topographical maps. (4 marks)',
    answerGuide: '(a) Any 2 differences: sketch maps are not drawn to precise scale while topographical maps are drawn to exact scale; sketch maps show only selected features while topographical maps show detailed features; sketch maps are hand-drawn approximations while topographical maps are professionally surveyed — 2 marks each difference (1 per map). (b) Any 4: title; scale; key/legend; north arrow; grid references; contour interval; date of publication; publisher/authority — 1 mark each.',
    tags: ['sketch maps', 'topographical maps', 'marginal information'], learningObjective: 'Differentiate between sketch maps and topographical maps',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Map Work',
    questionType: 'structured', difficulty: 'hard', marks: 13,
    questionText: 'Study the map of Tambach (1:50,000 Sheet 90/3) and answer the following questions.\n(a) i) Identify two types of scale used in the map. (2 marks)\n    ii) Give the longitudinal extent of the area covered by the map. (2 marks)\n(b) i) Identify three relief features found at grid square 0581. (3 marks)\n    ii) Measure the length of dry weather road D329 from the junction at Chebokokwa to the northern edge of the map. (2 marks)\n(c) Explain how the following factors have influenced settlement in the area covered by the map:\n    i. Relief (1 mark)\n    ii. Drainage (1 mark)\n    iii. Transport (1 mark)\n(d) Citing evidence from the map, give two economic activities carried out in the area. (2 marks)',
    answerGuide: '(a)(i) Any 2: representative fraction (RF); linear/graphical scale; statement scale — 1 mark each. (ii) Read from the map longitude values on east and west edges — 2 marks. (b)(i) Any 3 features from grid square 0581 e.g. hills, valleys, rivers, escarpments — 1 mark each. (ii) Measure map distance and convert using scale (1:50,000 means 1 cm = 0.5 km) — 2 marks. (c)(i) Settlements avoid steep slopes; found on gentle/flat land — 1 mark. (ii) Settlements found near rivers for water supply but avoid flood-prone areas — 1 mark. (iii) Settlements cluster along roads for accessibility — 1 mark. (d) Any 2 with evidence: farming (cultivated land); pastoralism (grazing land); trade (market centres); lumbering (forests) — 1 mark each.',
    tags: ['topographical map', 'Tambach', 'map reading', 'grid references', 'settlement', 'economic activities'], learningObjective: 'Read and interpret a topographical map',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Statistical Methods',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'The table below shows the number of mangoes harvested by a farmer over nine consecutive days:\nDay 1: 25, Day 2: 30, Day 3: 20, Day 4: 25, Day 5: 30, Day 6: 40, Day 7: 25, Day 8: 35, Day 9: 20.\n(a) Calculate the mean number of mangoes harvested. (2 marks)\n(b) Determine the median of the data. (2 marks)\n(c) Identify the mode of the number of mangoes harvested. (1 mark)',
    answerGuide: '(a) Mean = (25+30+20+25+30+40+25+35+20) ÷ 9 = 250 ÷ 9 ≈ 27.8 — 1 mark for summing, 1 mark for dividing correctly. (b) Arranged in order: 20, 20, 25, 25, 25, 30, 30, 35, 40; Median = 5th value = 25 — 1 mark for arranging, 1 mark for correct answer. (c) Mode = 25 (appears 3 times) — 1 mark.',
    tags: ['mean', 'median', 'mode', 'statistics', 'data analysis'], learningObjective: 'Calculate measures of central tendency from raw data',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Statistical Methods',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'The table below shows the population of four towns in Nakuru County in 2023:\nMolo: 45,000; Njoro: 60,000; Naivasha: 85,000; Gilgil: 35,000.\n(a) Construct a simple bar graph to represent the population distribution of the four towns. (4 marks)\n(b) State two merits of using a bar graph to present the above data. (2 marks)',
    answerGuide: '(a) Award 1 mark for correct labelled axes; 1 mark for appropriate scale; 1 mark for correctly plotted bars; 1 mark for title. (b) Any 2: easy to read and interpret; allows direct comparison between categories; visually appealing; can show exact values; suitable for discrete data — 1 mark each.',
    tags: ['bar graph', 'data presentation', 'population', 'statistics', 'Nakuru'], learningObjective: 'Construct and interpret bar graphs from geographical data',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Statistical Methods',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Learners in a Geography project analysed rainfall and temperature data for Kisii County.\n(a) Using statistical tools, explain three ways in which data can be presented. (6 marks)\n(b) Describe four methods of analysing and interpreting collected data. (4 marks)',
    answerGuide: '(a) Any 3: bar graphs — use vertical/horizontal bars to show quantities for comparison; line graphs — show trends/changes over time using plotted points joined by lines; pie charts — show proportions/percentages of a whole using a circle divided into sectors; tables — organise data in rows and columns for easy reference — 2 marks each. (b) Any 4: calculation of mean/median/mode; use of frequency distribution tables; drawing and interpreting graphs; comparison of trends over time; use of GIS and mapping software; regression and correlation analysis — 1 mark each.',
    tags: ['data presentation', 'statistical methods', 'graphs', 'analysis'], learningObjective: 'Present and analyse geographical data using statistical methods',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Statistical Methods',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Learners at Kimathi School prepared bar graphs showing population changes.\n(a) Differentiate between:\n   i. Simple bar graph and multiple bar graph. (2 marks)\n   ii. Line graph and compound line graph. (2 marks)\n(b) Explain three advantages of using line graphs. (6 marks)',
    answerGuide: '(a)(i) A simple bar graph shows one set of data using single bars while a multiple bar graph shows two or more sets of data side by side for comparison — 2 marks. (ii) A line graph shows a single trend over time while a compound line graph shows two or more trends on the same axes for comparison — 2 marks. (b) Any 3: show trends and changes over time clearly; easy to construct and interpret; useful for continuous data; allow comparison of multiple variables when combined; accurately represent fluctuations in data — 2 marks each.',
    tags: ['bar graph', 'line graph', 'compound graph', 'multiple bar graph', 'statistical methods'], learningObjective: 'Distinguish between types of graphs and explain their advantages',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Statistical Methods',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'While compiling their fieldwork report, students presented results using graphs.\n(a) Describe the steps in drawing a combined bar graph. (4 marks)\n(b) Explain three advantages of presenting geographical data using graphs. (3 marks)\n(c) Outline three branches of Geography. (3 marks)',
    answerGuide: '(a) Any 4: draw and label the x-axis and y-axis; choose and mark an appropriate scale on both axes; plot bars for each category side by side; shade/colour each set of bars differently; include a title and key/legend — 1 mark each. (b) Any 3: data is easy to read and interpret visually; allows quick comparison between sets of data; shows trends and patterns clearly; saves space compared to tables — 1 mark each. (c) Physical Geography; Human and Economic Geography; Practical Geography — 1 mark each.',
    tags: ['combined bar graph', 'data presentation', 'branches of geography'], learningObjective: 'Draw combined bar graphs and outline branches of Geography',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Statistical Methods',
    questionType: 'structured', difficulty: 'medium', marks: 14,
    questionText: 'A topographical map of Mt. Kenya region was issued for interpretation during a class test.\n(a) Describe three steps followed when drawing a cross-section from a topographical map. (6 marks)\n(b) Explain four limitations of using statistics to explain geographical facts. (4 marks)\n(c) State two methods of data collection OTHER THAN questionnaires. (2 marks)\n(d) List two disadvantages of administering questionnaires as a method of data collection. (2 marks)',
    answerGuide: '(a) Any 3 steps: place a piece of paper along the line of cross-section; mark where each contour crosses the paper edge and note its elevation; transfer each point to graph paper using vertical scale and draw the profile by joining the points — 2 marks each. (b) Any 4: statistics can be misleading if data is incomplete or biased; cannot explain reasons behind patterns or trends; may not show variations over time or space; over-simplify complex geographical phenomena; averages can hide extremes — 1 mark each. (c) Any 2: observation; interviews; photography/video recording; sampling using instruments — 1 mark each. (d) Any 2: respondents may give false or biased answers; misinterpretation of questions; time-consuming; low response rate — 1 mark each.',
    tags: ['cross-section', 'topographical map', 'limitations of statistics', 'data collection'], learningObjective: 'Draw cross-sections and evaluate statistical methods in Geography',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'GIS/GPS/Remote Sensing',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Grade 10 students learned about geospatial technologies in Geography.\n(a) Name the two main types of geospatial technologies. (2 marks)\n(b) State four components of GIS. (4 marks)\n(c) Explain two importance of GIS in Geography. (4 marks)',
    answerGuide: '(a) GIS (Geographic Information Systems) and Remote Sensing (RS); GPS is also accepted — 1 mark each (any 2). (b) Any 4: hardware (computers, GPS units, scanners, printers); software (ArcGIS, QGIS); data (spatial and attribute data); people (trained operators); procedures/methods — 1 mark each. (c) Any 2: planning and decision making in urban, transport, and resource management; environmental monitoring of deforestation and pollution; disaster management and early warning systems; mapping and visualisation of spatial data — 2 marks each.',
    tags: ['GIS', 'GPS', 'remote sensing', 'geospatial technology'], learningObjective: 'Describe geospatial technologies and their importance in Geography',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Introduction to Geography',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    questionText: 'The school career counsellor advised students to choose careers based on their strengths and interests. List two factors learners should consider when choosing a geography-related career.',
    answerGuide: 'Any 2: personal interest and aptitude in Geography; educational qualifications and skills required; job availability and earning potential; working conditions (fieldwork, office, travel); location preference; physical fitness for fieldwork — 1 mark each.',
    tags: ['careers in geography', 'career choice', 'geography careers'], learningObjective: 'Identify factors to consider when choosing a Geography-related career',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Practical Geography', subStrand: 'Introduction to Geography',
    questionType: 'long_answer', difficulty: 'medium', marks: 10,
    questionText: 'During career week, a guest speaker introduced career paths for Geography students.\n(a) Explain four careers related to the study of Geography. (8 marks)\n(b) State two reasons Geography is important in career development. (2 marks)',
    answerGuide: '(a) Any 4: Cartographer — designs and produces maps; Meteorologist — studies weather and climate patterns; Town Planner — plans land use and urban development using geographical knowledge; Environmental Scientist — monitors and manages environmental issues; GIS Analyst — uses GIS software to analyse spatial data; Geologist — studies rocks and earth materials; Surveyor — measures land for mapping and construction — 2 marks each. (b) Any 2: Geography provides practical and analytical skills used across many industries; understanding of environment, resources, and human activities is essential in many careers; fosters problem-solving and fieldwork skills valued by employers — 1 mark each.',
    tags: ['careers in geography', 'cartographer', 'meteorologist', 'town planner', 'GIS analyst'], learningObjective: 'Explain careers related to the study of Geography',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Natural Systems and Processes', subStrand: 'Rocks',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Study the Rock Cycle diagram and answer the questions below.\n(a) Name and explain the process by which igneous rocks are formed. (2 marks)\n(b) Describe the process of metamorphism and give ONE example each of:\n   i. A rock formed from an igneous rock by metamorphism. (1 mark)\n   ii. A rock formed from a sedimentary rock by metamorphism. (1 mark)\n(c) Explain the difference between intrusive and extrusive igneous rocks, giving ONE example of each. (3 marks)\n(d) State TWO economic importances of rocks and minerals to Kenya. (2 marks)',
    answerGuide: '(a) Igneous rocks are formed by solidification/crystallisation of magma (molten rock); when magma cools below the surface (intrusive) or lava cools on the surface (extrusive) it solidifies into igneous rock — 2 marks. (b) Metamorphism is the transformation of existing rocks by heat and/or pressure without melting: (i) e.g. granite → gneiss; (ii) e.g. limestone → marble or shale → slate — 1 mark each. (c) Intrusive igneous rocks form underground from slowly cooling magma, e.g. granite; extrusive igneous rocks form on the surface from fast-cooling lava, e.g. basalt — 3 marks. (d) Any 2: source of building materials (limestone, granite); source of minerals for mining (gold, soda ash, fluorspar); raw materials for industry; tourism attraction (rock formations) — 1 mark each.',
    tags: ['rocks', 'igneous rocks', 'metamorphism', 'rock cycle', 'minerals'], learningObjective: 'Describe the rock cycle and classify rock types',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Natural Systems and Processes', subStrand: 'Earth Movements',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Study the structure of the Earth diagram and answer the questions.\n(a) Name the layer of the Earth directly responsible for plate movement and explain the mechanism involved. (2 marks)\n(b) Explain why East Africa experiences frequent earthquake activity, with reference to plate tectonics theory. (3 marks)\n(c) Describe THREE effects of earthquakes on human settlements and the economy. (3 marks)\n(d) Define the term "drought" and explain TWO causes of drought in Kenya. (2 marks)',
    answerGuide: '(a) The asthenosphere (upper mantle) — convection currents within the mantle cause plates to move — 2 marks. (b) East Africa lies along the East African Rift System where the African plate is splitting apart (diverging); this movement causes frequent earthquakes along fault lines — 3 marks. (c) Any 3: destruction of buildings and infrastructure; loss of human life and displacement; disruption of economic activities (trade, agriculture); collapse of bridges and roads; tsunamis if earthquake occurs under ocean — 1 mark each. (d) Drought is a prolonged period of abnormally low rainfall leading to water shortage — 1 mark; causes: irregular ITCZ movement reducing rainfall; deforestation reducing moisture in atmosphere — 1 mark each.',
    tags: ['earthquakes', 'plate tectonics', 'East African Rift', 'drought', 'earth movements'], learningObjective: 'Explain causes and effects of earth movements and natural hazards',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Natural Systems and Processes', subStrand: 'Weathering and Soil',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Grade 10 learners studied weathering and soil during a field activity.\n(a) Define the term "soil profile" and name at least THREE horizons found in a typical soil profile. (3 marks)\n(b) Describe THREE types of physical (mechanical) weathering, giving an example of where each commonly occurs in Kenya. (3 marks)\n(c) Explain how climate influences the rate of chemical weathering. (2 marks)\n(d) State TWO ways in which human activities lead to soil degradation. (2 marks)',
    answerGuide: '(a) A soil profile is a vertical section through the soil showing distinct layers (horizons): Horizon O (organic litter); Horizon A (topsoil); Horizon B (subsoil); Horizon C (weathered parent material); Horizon R (bedrock) — 1 mark for definition, 1 mark per any 2 horizons. (b) Any 3: freeze-thaw action (e.g. Mt Kenya highlands — water in cracks freezes and expands, splitting rock); exfoliation/onion weathering (e.g. Rift Valley — heating and cooling causes rock layers to peel); abrasion (e.g. coastal areas or rivers — rocks fragments grind against each other) — 1 mark each. (c) High temperatures increase the rate of chemical reactions; high rainfall provides water for hydrolysis and solution — 2 marks. (d) Any 2: overgrazing removes vegetation cover; poor farming practices such as monocropping deplete soil nutrients; deforestation exposes soil to erosion; urbanisation seals soil with concrete — 1 mark each.',
    tags: ['soil profile', 'weathering', 'physical weathering', 'chemical weathering', 'soil degradation'], learningObjective: 'Describe soil profiles and types of weathering',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human and Economic Activities', subStrand: 'Population',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Study the population pyramid and answer the questions.\n(a) Define the term "population pyramid" and state what information it conveys. (2 marks)\n(b) Identify THREE characteristics of a broad-based population pyramid and explain what each suggests about the country. (3 marks)\n(c) Calculate the dependency ratio given the following data: Young dependants (0–14 yrs): 18.6 million; Working population (15–64 yrs): 31.2 million; Old dependants (65+ yrs): 2.4 million. (3 marks)\n(d) State TWO problems caused by a high dependency ratio in a developing country. (2 marks)',
    answerGuide: '(a) A population pyramid is a back-to-back bar graph showing the age and sex structure of a population; it conveys birth rates, death rates, life expectancy, and dependency levels — 2 marks. (b) Any 3 characteristics: wide base — high birth rate; rapidly narrowing bars — high death rate; small top — low life expectancy; more young people than old — young population — 1 mark each. (c) Dependency ratio = (dependants ÷ working population) × 100 = (18.6 + 2.4) ÷ 31.2 × 100 = 21 ÷ 31.2 × 100 ≈ 67.3% — 1 mark for formula, 1 mark for correct addition, 1 mark for correct answer. (d) Any 2: strain on social services (education, health); reduced savings and investment; slower economic growth; high government expenditure on social welfare — 1 mark each.',
    tags: ['population pyramid', 'dependency ratio', 'population structure', 'birth rate', 'death rate'], learningObjective: 'Interpret population pyramids and calculate dependency ratios',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human and Economic Activities', subStrand: 'Population',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Study the Demographic Transition Model (DTM) and answer the questions.\n(a) State the stage of the DTM most developing African countries are currently in and give TWO reasons for your answer. (3 marks)\n(b) Explain the meaning of the term "natural population increase" and how it is represented in the DTM. (2 marks)\n(c) Define "urbanisation" and identify THREE factors that have led to rapid urbanisation in Kenya. (3 marks)\n(d) Distinguish between "push factors" and "pull factors" in rural–urban migration, giving ONE example of each. (2 marks)',
    answerGuide: '(a) Stage 2 or early Stage 3 — 1 mark; reasons: death rate falling due to improved healthcare; birth rate remains high due to cultural/traditional practices; rapid population growth — 1 mark each (any 2). (b) Natural population increase is the difference between birth rate and death rate when birth rate exceeds death rate; on the DTM it is shown by the gap between the birth rate and death rate lines — 2 marks. (c) Urbanisation is the process by which an increasing proportion of a population lives in towns and cities — 1 mark; factors: rural–urban migration for employment; industrialisation creating jobs in cities; better social services in urban areas — 1 mark each. (d) Push factors are conditions in rural areas that drive people away e.g. drought/land shortage; pull factors are attractions in urban areas that draw people in e.g. employment opportunities — 2 marks.',
    tags: ['demographic transition model', 'urbanisation', 'natural population increase', 'rural-urban migration', 'push factors', 'pull factors'], learningObjective: 'Apply the Demographic Transition Model to African population trends',
  },

  // ── GRADE 11 — BUSINESS STUDIES ─────────────────────────────────────────
  {
    grade: 'Grade 11', subject: 'Business Studies',
    strand: 'Financial Accounting', subStrand: 'Final Accounts',
    questionType: 'calculation', difficulty: 'medium', marks: 8,
    questionText: 'The following information is provided for Njeri\'s business for the year ended 31 December:\nSales: Ksh 450,000; Cost of goods sold: Ksh 280,000; Rent: Ksh 36,000; Salaries: Ksh 60,000; Electricity: Ksh 12,000.\n(a) Prepare a Trading Account showing the Gross Profit. (3 marks)\n(b) Prepare a Profit and Loss Account showing the Net Profit. (5 marks)',
    answerGuide: '(a) Sales 450,000 − COGS 280,000 = Gross Profit Ksh 170,000 — 3 marks (1 per line). (b) Gross profit 170,000; less: Rent 36,000 + Salaries 60,000 + Electricity 12,000 = 108,000; Net Profit = 170,000 − 108,000 = Ksh 62,000 — 5 marks (1 for GP b/f, 1 per expense, 1 for total expenses, 1 for net profit).',
    tags: ['accounting', 'final accounts', 'profit and loss', 'trading account'], learningObjective: 'Prepare trading and profit and loss accounts from given data',
  },

  // ── GRADE 12 — GEOGRAPHY ────────────────────────────────────────────────
  {
    grade: 'Grade 12', subject: 'Geography',
    strand: 'Environmental Management', subStrand: 'Environmental Management',
    questionType: 'long_answer', difficulty: 'hard', marks: 10,
    questionText: 'Climate change is one of the greatest environmental challenges facing Kenya today.\n(a) Define climate change. (2 marks)\n(b) Identify THREE causes of climate change. (3 marks)\n(c) Describe FIVE effects of climate change on Kenya\'s environment and economy. (5 marks)',
    answerGuide: '(a) Long-term alteration in global temperatures and weather patterns, mainly caused by human activities since the mid-20th century — 2 marks. (b) Any 3: burning fossil fuels releasing CO₂; deforestation reducing carbon sinks; industrial emissions; agricultural practices (methane from livestock); urbanisation — 1 mark each. (c) Any 5: reduced rainfall affecting crop production; prolonged droughts affecting water supply; flooding in low-lying areas; melting of Mt Kenya glaciers; loss of biodiversity; sea level rise affecting coastal areas; disruption to tourism; increased disease vectors — 1 mark each.',
    tags: ['climate change', 'environment', 'Kenya', 'sustainability'], learningObjective: 'Analyse the causes and effects of climate change on Kenya',
  },


  // ── GRADE 10 — CRE ─────────────────────────────────────────────────────

// SUB-STRAND: The Holy Bible
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'short_answer', difficulty: 'easy', marks: 2,
  questionText: 'What does the word "inspired" mean in the biblical context?',
  answerGuide: 'Inspired means "God-breathed" (2 Timothy 3:16). God guided human authors so that what they wrote was exactly what God wanted, without error. (2 marks)',
  tags: ['bible', 'inspiration', 'word of God'], learningObjective: 'Explain the meaning of biblical inspiration',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) State FOUR reasons why the Bible is referred to as the inspired Word of God. (4 marks)\n(b) Explain how God used the Holy Spirit in the writing of the Bible. (2 marks)',
  answerGuide: '(a) Any 4: It claims to be inspired (2 Tim 3:16); contains fulfilled prophecies; unity and consistency despite 40+ authors over 1,500 years; changes lives; has power to convict people of sin — 1 mark each. (b) The Holy Spirit moved upon human authors, guiding their minds and memories so they recorded God\'s message without error while still using their own personalities and writing styles — 2 marks.',
  tags: ['bible', 'inspiration', 'Holy Spirit'], learningObjective: 'Explain why the Bible is the inspired Word of God',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) How many books are in the Old Testament and into how many categories are they divided? (2 marks)\n(b) Name the FIVE books of the Law (Pentateuch). (5 marks)\n(c) Name the FIVE Major Prophets of the Old Testament. (5 marks)',
  answerGuide: '(a) 39 books divided into 4 categories: Law, History, Poetry/Wisdom, Prophecy — 1 mark each. (b) Genesis, Exodus, Leviticus, Numbers, Deuteronomy — 1 mark each. (c) Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel — 1 mark each. (Total: award max 8 marks)',
  tags: ['Old Testament', 'books of the Bible', 'categories'], learningObjective: 'Identify the books and categories of the Old Testament',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'structured', difficulty: 'easy', marks: 5,
  questionText: 'State and explain FIVE methods used to study the Holy Bible.',
  answerGuide: 'Any 5 from: Inductive method (observation, interpretation, application); Devotional method (personal spiritual growth); Biographical method (studying a person\'s life); Topical method (gathering verses on a theme); Word study method (tracing a key word). 1 mark for naming, 1 mark for explanation each — max 5 marks.',
  tags: ['bible study', 'methods', 'inductive'], learningObjective: 'Describe methods of studying the Bible',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'long_answer', difficulty: 'medium', marks: 8,
  questionText: 'State and explain EIGHT benefits of studying the Holy Bible.',
  answerGuide: 'Any 8 from: Spiritual growth (1 Peter 2:2); Wisdom for salvation (2 Tim 3:15); Guidance (Psalm 119:105); Freedom from sin; Faith (Romans 10:17); Hope and comfort (Romans 15:4); Equipping for good works (2 Tim 3:16-17); Victory over temptation; Deepens relationship with God; Renews the mind (Romans 12:2). 1 mark each — max 8.',
  tags: ['bible', 'benefits', 'spiritual growth'], learningObjective: 'Explain the benefits of studying the Bible',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Define integrity as used in CRE and give ONE Bible reference. (2 marks)\n(b) State and explain FOUR ways of applying integrity in daily life. (4 marks)',
  answerGuide: '(a) Integrity: being honest, consistent in values, and morally upright. Bible reference: Proverbs 11:3 — 2 marks. (b) Any 4 from: being honest in exams; returning extra change; keeping promises; admitting mistakes; not cheating or lying — 1 mark each.',
  tags: ['integrity', 'values', 'ethics'], learningObjective: 'Apply the virtue of integrity in daily life',
},

// SUB-STRAND: The Exodus
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Exodus',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Describe the call of Moses at the burning bush (Exodus 3:1-22). (5 marks)\n(b) State THREE signs God gave to Moses to reassure him (Exodus 4:1-17). (3 marks)',
  answerGuide: '(a) Moses was tending flocks at Horeb; God appeared in burning bush not consumed; God told Moses to remove sandals on holy ground; identified Himself as the God of Abraham, Isaac, and Jacob; Moses hid his face; God said He heard Israel\'s cry in Egypt; commanded Moses to lead Israel out — 1 mark each for any 5 points. (b) Staff turned into snake; hand became leprous then healed; water from Nile turned to blood — 1 mark each.',
  tags: ['Moses', 'burning bush', 'call of Moses', 'Exodus'], learningObjective: 'Describe the call of Moses and events of the Exodus',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Exodus',
  questionType: 'long_answer', difficulty: 'hard', marks: 10,
  questionText: 'Name and describe ALL TEN plagues of Egypt in order, giving the Bible reference for each. (10 marks)',
  answerGuide: '1 mark each: 1-Water to blood (Ex 7:20); 2-Frogs (Ex 8:2); 3-Gnats/lice (Ex 8:16); 4-Flies (Ex 8:21); 5-Livestock disease (Ex 9:3); 6-Boils (Ex 9:9); 7-Hail (Ex 9:18); 8-Locusts (Ex 10:4); 9-Darkness (Ex 10:21); 10-Death of firstborn (Ex 11:5). Award 1 mark per correctly named plague.',
  tags: ['plagues', 'Egypt', 'Moses', 'Exodus'], learningObjective: 'Identify and describe the ten plagues of Egypt',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Exodus',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe what the Passover was and how it was observed (Exodus 12:1-31). (4 marks)\n(b) State TWO ways the Passover foreshadows Jesus Christ\'s atonement. (2 marks)',
  answerGuide: '(a) God commanded Israel to take an unblemished lamb, slaughter it at twilight, put blood on doorframes; eat it with unleavened bread and bitter herbs; roast over fire; eat in haste; angel of death would pass over homes with blood — 1 mark for each 4 points. (b) Any 2: Jesus is the Passover Lamb (1 Cor 5:7); His blood protects from judgment; the lamb without defect represents Jesus\' sinlessness; the meal represents Holy Communion — 1 mark each.',
  tags: ['Passover', 'atonement', 'Jesus', 'Exodus'], learningObjective: 'Explain the significance of the Passover',
},

// SUB-STRAND: The Sinai Covenant
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Sinai Covenant',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) State the TEN Commandments as given to Moses at Mount Sinai. (5 marks)\n(b) Explain how Christians apply the Ten Commandments in their daily lives today. (3 marks)',
  answerGuide: '(a) 1-No other gods; 2-No idols; 3-Do not misuse God\'s name; 4-Keep Sabbath; 5-Honour parents; 6-Do not murder; 7-Do not commit adultery; 8-Do not steal; 9-Do not give false testimony; 10-Do not covet — ½ mark each = 5 marks. (b) Any 3: worship only God; respect parents; avoid murder/abortion; be faithful in marriage; honest in work; avoid materialism/covetousness — 1 mark each.',
  tags: ['Ten Commandments', 'Sinai', 'Moses', 'covenant'], learningObjective: 'State and apply the Ten Commandments',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Sinai Covenant',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe how Israel broke the Sinai Covenant while Moses was on the mountain. (3 marks)\n(b) How was the covenant renewed? (3 marks)',
  answerGuide: '(a) The people asked Aaron to make gods; Aaron collected gold earrings; made a golden calf; people worshipped it saying "These are your gods who brought you from Egypt" — 1 mark each for 3 points. (b) Moses interceded for Israel; God relented; Moses returned to the mountain; God wrote the commandments on new tablets; Moses\' face shone — 1 mark each for 3 points.',
  tags: ['golden calf', 'covenant renewal', 'Sinai'], learningObjective: 'Describe the breaking and renewal of the Sinai Covenant',
},

// SUB-STRAND: Loyalty to God (Elijah)
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Loyalty to God (Elijah)',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Describe the contest on Mount Carmel between Elijah and the prophets of Baal (1 Kings 18). (5 marks)\n(b) State THREE lessons Christians learn from Elijah\'s contest on Mount Carmel. (3 marks)',
  answerGuide: '(a) Elijah challenged 450 prophets of Baal; two bulls prepared on altars; each side to call their god; Baal prophets called all day — no answer; they cut themselves; Elijah repaired the altar using 12 stones; dug a trench; poured water on sacrifice three times; Elijah prayed; fire from God consumed the sacrifice, wood, stones, and water; people fell down saying "The Lord, He is God!" — 1 mark each for 5 points. (b) Any 3: God alone is powerful; prayer is powerful; idols are powerless; God answers those who trust Him; one faithful person can make a difference — 1 mark each.',
  tags: ['Elijah', 'Mount Carmel', 'Baal', 'idolatry'], learningObjective: 'Describe Elijah\'s fight against Baalism and lessons learned',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Loyalty to God (Elijah)',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe the injustice of Naboth\'s vineyard (1 Kings 21) and how Elijah responded. (4 marks)\n(b) State TWO ways Christians should respond to injustice in society today. (2 marks)',
  answerGuide: '(a) Ahab wanted Naboth\'s vineyard; Naboth refused as it was his inheritance; Jezebel arranged for false accusers; Naboth was stoned; Ahab took the vineyard; Elijah confronted Ahab with God\'s judgment — 1 mark each for 4 points. (b) Any 2: speak out against injustice; support the poor and vulnerable; report corruption; pray for justice; use legal means — 1 mark each.',
  tags: ['Elijah', 'Naboth', 'injustice', 'Jezebel'], learningObjective: 'Describe Elijah\'s fight against injustice',
},

// SUB-STRAND: Old Testament Prophets and Prophet Amos
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Old Testament Prophets and Prophet Amos',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Describe the call of Prophet Amos and the background to his ministry. (4 marks)\n(b) State FOUR visions of Prophet Amos and their significance. (4 marks)',
  answerGuide: '(a) Amos was a shepherd and fig farmer from Tekoa in Judah; not a trained prophet; called by God; ministered during reign of Jeroboam II of Israel; a time of prosperity but great social injustice — 1 mark each for 4 points. (b) Any 4 from: locusts (judgment stayed by intercession); fire (judgment stayed); plumb line (Israel measured and found crooked); summer fruit (end is near); God at the altar (no escape from judgment) — 1 mark each.',
  tags: ['Amos', 'prophet', 'visions', 'social justice'], learningObjective: 'Describe the call and visions of Prophet Amos',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Old Testament Prophets and Prophet Amos',
  questionType: 'long_answer', difficulty: 'hard', marks: 10,
  questionText: 'State and explain EIGHT social evils and injustices condemned by Prophet Amos and explain their relevance to Christians in Kenya today.',
  answerGuide: 'Any 8 from: selling the righteous for silver (human trafficking); trampling on the poor (exploitation); sexual immorality (cult prostitution); dishonest trade/false scales (business fraud); bribery in courts; luxury while poor suffer; oppression of women (cows of Bashan); insincere worship; religious hypocrisy; corruption by leaders — 1 mark for naming the evil + 1 mark for Kenyan relevance each. Max 10 marks.',
  tags: ['Amos', 'social justice', 'injustice', 'Kenya'], learningObjective: 'Apply Amos\'s teachings on justice to contemporary Kenya',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Old Testament Prophets and Prophet Amos',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Define the "Day of the Lord" as taught by Amos and explain why Amos warned it would be darkness, not light. (3 marks)\n(b) State and explain FOUR values acquired from the teachings of Prophet Amos. (4 marks)',
  answerGuide: '(a) Day of the Lord: a time of God\'s judgment and reckoning — 1 mark; Amos warned it would be darkness because Israel assumed it would bless them automatically but their sin made them liable to judgment rather than reward — 2 marks. (b) Any 4 from: Obedience (do what God commands); Integrity (honest in all dealings); Faithfulness (loyal to God); Hope (trust God\'s restoration); Fairness (treat all equally); Love (care for poor); Righteousness (do what is right); Courage (speak against injustice) — 1 mark each.',
  tags: ['Day of the Lord', 'Amos', 'values', 'judgment'], learningObjective: 'Explain the Day of the Lord and values from Prophet Amos',
},

// ── GRADE 10 — CRE — STRAND 2: THE NEW TESTAMENT ─────────────

// SUB-STRAND: New Testament Books
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'New Testament Books',
  questionType: 'structured', difficulty: 'easy', marks: 6,
  questionText: '(a) How many books are in the New Testament and into how many categories are they divided? (2 marks)\n(b) Name the FOUR Gospels. (4 marks)',
  answerGuide: '(a) 27 books divided into 4 categories: Gospels, History (Acts), Epistles (Letters), Prophecy (Revelation) — 1 mark each. (b) Matthew, Mark, Luke, John — 1 mark each.',
  tags: ['New Testament', 'Gospels', 'books'], learningObjective: 'Identify the books and categories of the New Testament',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'New Testament Books',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) State EIGHT reasons why the Bible is referred to as a "library". (4 marks)\n(b) State FOUR ways in which Christians use the Bible to spread the gospel in Kenya today. (4 marks)',
  answerGuide: '(a) Any 8 halved for marks: Many books (66); many authors (~40); many genres; written over ~1,500 years; many languages (Hebrew, Aramaic, Greek); many topics; arranged in sections; used for reading, study, reference — ½ mark each, max 4. (b) Any 4: preaching; evangelism; Bible study groups; Scripture memorization; distribution of Bibles; radio and TV; social media; Bible translation — 1 mark each.',
  tags: ['Bible as library', 'gospel', 'Kenya'], learningObjective: 'Explain why the Bible is a library and how it is used',
},

// SUB-STRAND: Infancy and Early Life of Jesus Christ
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'Infancy and Early Life of Jesus Christ',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) State and explain FOUR Messianic prophecies from the Old Testament that were fulfilled by Jesus Christ. (8 marks)',
  answerGuide: 'Any 4 from: Isaiah 7:14 — born of a virgin, fulfilled Matthew 1:23 (2 marks); Micah 5:2 — born in Bethlehem, fulfilled Matthew 2:1 (2 marks); Isaiah 53 — suffering servant, fulfilled in crucifixion (2 marks); 2 Samuel 7:12-13 — descendant of David with everlasting kingdom (2 marks); Isaiah 61:1-3 — anointing to preach good news, fulfilled Luke 4:18-19 (2 marks). Award 2 marks per prophecy: 1 for the prophecy and its reference, 1 for the fulfillment.',
  tags: ['Messianic prophecies', 'Jesus', 'Old Testament', 'fulfillment'], learningObjective: 'Identify Messianic prophecies and their fulfillment in Jesus',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'Infancy and Early Life of Jesus Christ',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe the baptism of Jesus (Luke 3:21-22). (3 marks)\n(b) State THREE temptations of Jesus in the wilderness and how He overcame each. (3 marks)',
  answerGuide: '(a) Jesus was baptized by John in the Jordan; Heaven opened; Holy Spirit descended like a dove; voice from heaven said "You are my Son, whom I love; with you I am well pleased" — 1 mark each for 3 points. (b) Turn stones to bread — Jesus quoted Scripture (Man shall not live by bread alone); throw yourself down — Jesus quoted Scripture (Do not test the Lord); worship Satan for all kingdoms — Jesus quoted Scripture (Worship the Lord your God only) — 1 mark each.',
  tags: ['baptism', 'temptation', 'Jesus', 'wilderness'], learningObjective: 'Describe the baptism and temptations of Jesus',
},

// SUB-STRAND: Galilean Ministry
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'Galilean Ministry',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Describe what happened when Jesus was rejected in Nazareth (Luke 4:14-30). (4 marks)\n(b) State FOUR lessons Christians learn from Jesus\' rejection in Nazareth. (4 marks)',
  answerGuide: '(a) Jesus returned to Galilee in the power of the Spirit; went to synagogue in Nazareth; read Isaiah 61:1-2 and said it was fulfilled; people were amazed at His gracious words; then questioned "Is this not Joseph\'s son?"; Jesus referenced Elijah and Elisha serving Gentiles; they were furious and drove Him to the cliff edge; He walked through the crowd — 1 mark each for 4 points. (b) Any 4: prophets are not accepted in their hometown; God\'s blessings are not limited to one group; rejection is part of ministry; Jesus continued despite rejection; familiarity can breed contempt; God\'s plan cannot be stopped — 1 mark each.',
  tags: ['Nazareth', 'rejection', 'Jesus', 'Galilean ministry'], learningObjective: 'Describe Jesus\' rejection at Nazareth and lessons learned',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'Galilean Ministry',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) State FIVE teachings of Jesus from the Sermon on the Plain (Luke 6:17-49). (5 marks)\n(b) Identify THREE miracles of Jesus during the Galilean ministry and state what each reveals about Jesus. (3 marks)',
  answerGuide: '(a) Any 5: Blessed are the poor; love your enemies; do to others as you would have them do to you; do not judge; by their fruit you will know them; build on the rock not sand; be merciful as God is merciful; give and it will be given to you — 1 mark each. (b) Any 3: Miraculous catch of fish (Jesus is Lord over creation); healing of leper (Jesus has compassion and power to heal); healing paralyzed man (Jesus has authority to forgive sins); raising widow\'s son at Nain (Jesus has power over death); calming the storm (Jesus is Lord over nature) — 1 mark each.',
  tags: ['Sermon on the Plain', 'miracles', 'Galilean ministry', 'Jesus'], learningObjective: 'Describe Jesus\'s teachings and miracles in the Galilean ministry',
},

// SUB-STRAND: Paul's First Letter to the Corinthians
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: "Paul's First Letter to the Corinthians",
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) State FOUR causes of division in the church at Corinth as addressed by Paul. (4 marks)\n(b) State FOUR moral challenges facing youth today that Paul would address, and state Paul\'s teaching on each. (4 marks)',
  answerGuide: '(a) Any 4: Following different leaders (Paul, Apollos, Peter, Christ); disagreements over food sacrificed to idols; spiritual gifts causing pride; sexual immorality tolerated; taking fellow believers to court; divisions at the Lord\'s Supper — 1 mark each. (b) Any 4 with teaching: sexual immorality — body is temple of Holy Spirit (1 Cor 6:19); peer pressure — bad company corrupts (1 Cor 15:33); drug use — flee and honor God; social media addiction — all things permissible but not beneficial — 1 mark each.',
  tags: ['Corinthians', 'Paul', 'division', 'moral challenges'], learningObjective: 'Describe the challenges Paul addressed in Corinth and their relevance',
},

// ── GRADE 10 — CRE — STRAND 3: CHURCH IN ACTION ─────────────

// SUB-STRAND: The Holy Spirit and Gifts of the Holy Spirit
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'The Holy Spirit and Gifts of the Holy Spirit',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Describe the events of the Day of Pentecost (Acts 2:1-13). (5 marks)\n(b) State THREE lessons learnt from the Day of Pentecost. (3 marks)',
  answerGuide: '(a) Believers were all together in one place; a sound like violent wind filled the house; tongues of fire rested on each of them; all were filled with the Holy Spirit; they spoke in other languages; devout Jews from many nations heard in their own language; some were amazed, others mocked saying they were drunk — 1 mark each for 5 points. (b) Any 3: God keeps His promises; Holy Spirit gives courage to witness; Spirit enables cross-cultural communication; repentance is needed to receive the Spirit; Pentecost marks the birth of the church; obedience leads to blessing — 1 mark each.',
  tags: ['Pentecost', 'Holy Spirit', 'tongues', 'church'], learningObjective: 'Describe the Day of Pentecost and its significance',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'The Holy Spirit and Gifts of the Holy Spirit',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Name and classify the NINE gifts of the Holy Spirit as listed in 1 Corinthians 12:8-11 into THREE categories. (6 marks)\n(b) State TWO ways of discerning true gifts of the Holy Spirit. (2 marks)',
  answerGuide: '(a) Gifts of knowledge: message of wisdom, message of knowledge, distinguishing spirits — 2 marks. Gifts of power: faith, gifts of healing, miraculous powers — 2 marks. Gifts of utterance: prophecy, speaking in tongues, interpretation of tongues — 2 marks. (b) Any 2: confesses Jesus as Lord (1 Cor 12:3); bears good fruit (Gal 5:22-23); edifies the church not self; operates in order; aligns with Scripture; gift of discernment — 1 mark each.',
  tags: ['gifts of the Spirit', 'Holy Spirit', 'Corinthians'], learningObjective: 'Identify and classify the gifts of the Holy Spirit',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'The Holy Spirit and Gifts of the Holy Spirit',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: 'State and explain SIX roles of the Holy Spirit as taught by Jesus (John 14-16, Acts 1:6-8).',
  answerGuide: 'Any 6: Reveals truth about God (John 14:26) — 1 mark; Comforts and counsels as Paraclete — 1 mark; Empowers proclamation of gospel (Acts 1:8) — 1 mark; Teaches and reminds of Jesus\' words (John 14:26) — 1 mark; Convicts of sin, righteousness and judgment (John 16:8-11) — 1 mark; Unites believers into one body — 1 mark; Glorifies Jesus (John 16:14) — 1 mark. Max 6.',
  tags: ['Holy Spirit', 'roles', 'John', 'Acts'], learningObjective: 'Explain the roles of the Holy Spirit as taught by Jesus',
},

// SUB-STRAND: The Holy Trinity
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'The Holy Trinity',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Define the Holy Trinity. (2 marks)\n(b) Describe the role of each person of the Trinity in the life of a Christian. (6 marks)',
  answerGuide: '(a) One God in three distinct persons: Father, Son, and Holy Spirit — co-equal, co-eternal, and co-essential — 2 marks. (b) God the Father: Creator, Provider, plans salvation, gives daily bread and protection — 2 marks. God the Son (Jesus): Redeemer and Saviour, accomplished salvation through death and resurrection, intercedes for believers — 2 marks. God the Holy Spirit: Helper and Comforter, applies salvation, lives in believers, teaches, convicts, and empowers for holy living — 2 marks.',
  tags: ['Trinity', 'Father', 'Son', 'Holy Spirit'], learningObjective: 'Describe the Holy Trinity and the role of each person',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'The Holy Trinity',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Give THREE Bible references that reveal the Father, Son and Holy Spirit together. (3 marks)\n(b) Explain how the Christian belief in monotheism (one God) is consistent with the doctrine of the Trinity. (3 marks)',
  answerGuide: '(a) Matthew 3:16-17 (baptism of Jesus — all three present); Matthew 28:19 (baptize in the name of Father, Son, Holy Spirit); 2 Corinthians 13:14 (grace, love, fellowship) — 1 mark each. (b) Christianity holds that there is only one God (Deuteronomy 6:4); the Trinity does not mean three gods but one God revealed in three persons; each person is distinct but shares the same divine essence — 1 mark each for 3 points.',
  tags: ['Trinity', 'monotheism', 'Bible references'], learningObjective: 'Support the doctrine of the Trinity with Bible references',
},

// SUB-STRAND: Sacraments
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'Sacraments',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Define a sacrament and name the TWO most common sacraments in Christianity. (3 marks)\n(b) Explain FIVE ways in which baptism is important to Christians. (5 marks)',
  answerGuide: '(a) A sacred rite instituted by Christ, using physical elements to convey spiritual grace — 1 mark; Baptism and Holy Communion/Lord\'s Table — 2 marks. (b) Any 5: obedience to Christ\'s command; public declaration of faith; union with Christ\'s death and resurrection; death of the old self; beginning of new life; entry into the Christian community; invitation for the Holy Spirit\'s work; symbol of forgiveness of sins — 1 mark each.',
  tags: ['sacraments', 'baptism', 'Holy Communion'], learningObjective: 'Define sacraments and explain the importance of baptism',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'Sacraments',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe how the Lord\'s Table (Holy Communion) is celebrated in church today. (4 marks)\n(b) State TWO things the bread and wine symbolize in the Lord\'s Table. (2 marks)',
  answerGuide: '(a) The congregation prays and reads Scripture; pastor gives thanks and breaks bread; bread is shared representing Jesus\' body; cup (wine/juice) is shared representing His blood and the new covenant; believers partake in remembrance of Jesus; conducted with self-examination — 1 mark each for 4 points. (b) Bread = Jesus\' body broken for us — 1 mark; Wine = Jesus\' blood of the new covenant shed for forgiveness — 1 mark.',
  tags: ['Holy Communion', 'Lord\'s Table', 'sacrament'], learningObjective: 'Describe the celebration and significance of Holy Communion',
},

// ── GRADE 10 — CRE — STRAND 4: CHRISTIAN LIVING TODAY ────────

// SUB-STRAND: Christian Ethics
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Ethics',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Define Christian ethics and state FOUR sources of Christian ethics. (5 marks)\n(b) State and explain THREE ethical values needed by youth today. (3 marks)',
  answerGuide: '(a) Definition: the study of moral principles based on Christian teaching — 1 mark. Sources: the Bible; Holy Spirit\'s guidance; Church tradition; Christian community; conscience; reason; natural law — 1 mark each for any 4. (b) Any 3 with explanation: Courage (doing right despite fear); Honesty (no cheating/lying); Respect (honouring others); Chastity (sexual purity); Diligence (hard work); Obedience (following rules); Forgiveness; Humility — 1 mark each.',
  tags: ['ethics', 'values', 'youth', 'Christian living'], learningObjective: 'Define Christian ethics and explain ethical values for youth',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Ethics',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: 'State and explain SIX moral challenges facing youth in Kenya today and suggest a solution to EACH challenge.',
  answerGuide: 'Any 6 from: Peer pressure — choose good friends; Drug and substance use — seek counselling/church support; Sexual immorality — abstain, set boundaries; Dishonesty — develop integrity; Social media addiction — limit screen time; Gambling — avoid betting; Mental health — seek help, pray. 1 mark for challenge + solution each = max 6.',
  tags: ['moral challenges', 'youth', 'Kenya', 'solutions'], learningObjective: 'Identify moral challenges facing Kenyan youth and propose solutions',
},

// SUB-STRAND: Human Rights and GBV
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Human Rights and Gender-Based Violence',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Define gender-based violence (GBV) and state SIX types of GBV in Kenya. (4 marks)\n(b) State FOUR causes of gender-based violence in Kenya. (4 marks)',
  answerGuide: '(a) Harmful acts directed at a person based on gender — 1 mark. Types (any 5 for 3 marks): physical; sexual; emotional/psychological; economic; harmful traditional practices (FGM, early marriage); online GBV — ½ mark each, max 3. (b) Any 4: traditional beliefs promoting male dominance; poverty and economic dependence; lack of education; alcohol and drug abuse; weak legal enforcement; harmful cultural practices; political instability; exposure to violence as a child; gender inequality — 1 mark each.',
  tags: ['GBV', 'gender-based violence', 'types', 'causes'], learningObjective: 'Define GBV, identify types and causes in Kenya',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Human Rights and Gender-Based Violence',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) State FOUR effects of gender-based violence on individuals and families. (4 marks)\n(b) State FOUR support services available for GBV victims in Kenya and explain each. (4 marks)',
  answerGuide: '(a) Any 4: physical injuries; STIs including HIV; mental health (depression, PTSD); stigma and shame; family breakdown; children traumatized; economic hardship; cycles of violence continue — 1 mark each. (b) Any 4: Trauma counselling (professional therapy); Psychosocial support (group support); Safe houses/shelters; Legal aid (free lawyers); Medical care at hospitals; GBV Hotline 1195; Faith-based counselling — 1 mark each.',
  tags: ['GBV', 'effects', 'support services', 'Kenya'], learningObjective: 'Describe effects of GBV and support services in Kenya',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Human Rights and Gender-Based Violence',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) What does Genesis 1:26-28 teach about gender equality and GBV? (2 marks)\n(b) What does Galatians 3:28 teach about equality in Christ? (2 marks)\n(c) State TWO values needed to avoid gender-based violence. (2 marks)',
  answerGuide: '(a) Both male and female are made in the image of God; both have equal dignity and worth; violence against another is an attack on God\'s image — 2 marks. (b) "There is neither Jew nor Gentile, neither slave nor free, nor is there male and female, for you are all one in Christ Jesus" — all are equal before God — 2 marks. (c) Any 2: Love; Respect; Equality; Integrity; Courage; Accountability; Compassion; Justice; Self-discipline — 1 mark each.',
  tags: ['equality', 'GBV', 'Genesis', 'Galatians'], learningObjective: 'Apply biblical teachings on equality to the issue of GBV',
},

// SUB-STRAND: Human Sexuality
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Human Sexuality',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Define human sexuality and state what Genesis 1:27 teaches about it. (3 marks)\n(b) Distinguish between dating and courtship using FOUR differences. (4 marks)\n(c) State ONE Christian value that helps young people maintain sexual purity. (1 mark)',
  answerGuide: '(a) Human sexuality is the God-given dimension of being male or female, including physical, emotional, and relational aspects — 1 mark; Genesis 1:27 teaches that God created humankind male and female in His image — 2 marks. (b) Dating is casual while courtship is serious; dating has no commitment while courtship intends marriage; dating is often physical while courtship sets guarded boundaries; dating is private while courtship involves family/church — 1 mark each. (c) Any 1: abstinence; self-discipline; chastity; respect; courage to say no — 1 mark.',
  tags: ['human sexuality', 'dating', 'courtship', 'purity'], learningObjective: 'Explain human sexuality and distinguish between dating and courtship',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Human Sexuality',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Define irresponsible sexual behaviour and state FOUR types. (3 marks)\n(b) State and explain FOUR effects of irresponsible sexual behaviour. (4 marks)\n(c) State ONE way of avoiding irresponsible sexual behaviour. (1 mark)',
  answerGuide: '(a) Sexual activity outside God\'s design — 1 mark. Types (any 4): incest; rape; prostitution; adultery; fornication; bestiality; pornography; sex with a minor — ½ mark each for any 4 = 2 marks. (b) Any 4: unplanned pregnancies; STIs including HIV/AIDS; emotional trauma (guilt, shame); abortion; school dropout; damaged reputation; broken trust; infertility — 1 mark each. (c) Any 1: abstain until marriage; avoid tempting situations; set physical boundaries; pray; avoid pornography; be accountable — 1 mark.',
  tags: ['sexual behaviour', 'effects', 'values', 'purity'], learningObjective: 'Identify irresponsible sexual behaviour and its effects',
},

// SUB-STRAND: Marriage and Family
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Marriage and Family',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) State and explain FOUR Christian teachings on marriage using Bible references. (8 marks)',
  answerGuide: 'Any 4 from: One man, one woman (Genesis 2:24) — 2 marks; Marriage is for companionship (Genesis 2:18) — 2 marks; Marriage is for procreation (Genesis 1:28) — 2 marks; Marriage is permanent (Matthew 19:6) — 2 marks; Husbands love wives as Christ loved the church (Ephesians 5:25) — 2 marks; Wives respect husbands (Ephesians 5:33) — 2 marks. Award 1 mark for teaching + 1 mark for Bible reference each. Max 8 marks.',
  tags: ['marriage', 'family', 'Bible', 'Christian teachings'], learningObjective: 'State Christian teachings on marriage and family',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Marriage and Family',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) State FOUR challenges facing marriage and family life in Kenya today. (4 marks)\n(b) State TWO roles of the church in preparing young people for marriage. (2 marks)',
  answerGuide: '(a) Any 4: financial pressure; infidelity; communication breakdown; interference from in-laws; childlessness; substance abuse; domestic violence; work-life imbalance; social media distraction; parenting disagreements; divorce culture — 1 mark each. (b) Any 2: teaching biblical sexuality; offering premarital counselling; mentoring engaged couples; providing youth groups; supporting married couples through family ministries — 1 mark each.',
  tags: ['marriage challenges', 'family', 'church', 'Kenya'], learningObjective: 'Identify challenges facing families and the church\'s role in supporting them',
},

// SUB-STRAND: Christian Response to Medicine and Technology
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Response to Medicine and Technology',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) Define euthanasia and state THREE forms in which it can be carried out. (4 marks)\n(b) State FOUR Christian views on euthanasia. (4 marks)',
  answerGuide: '(a) Euthanasia is the deliberate ending of a person\'s life to relieve suffering (mercy killing) — 1 mark. Forms: Active euthanasia (giving a lethal injection); Passive euthanasia (withdrawing life support); Assisted suicide (providing means to kill self) — 1 mark each. (b) Any 4: it is a form of murder (Exodus 20:13); life is sacred, only God can take it; deprives relatives of showing love; Jesus has power over sickness and death; suffering does not justify killing; God\'s timing should be respected; palliative care is the Christian alternative — 1 mark each.',
  tags: ['euthanasia', 'right to life', 'Christian ethics'], learningObjective: 'Explain Christian views on euthanasia and the right to life',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Response to Medicine and Technology',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) State FOUR ways in which technology has contributed to the spread of the Gospel. (4 marks)\n(b) State TWO Christian teachings on cosmetic plastic surgery. (2 marks)',
  answerGuide: '(a) Any 4: social media (Facebook, YouTube, TikTok); live broadcasting of church services; digital books and online Bible courses; Christian films and animations; printing press (Bibles, tracts); radio and TV ministries; church websites and apps — 1 mark each. (b) Any 2: God looks at the heart not appearance (1 Samuel 16:7); true beauty comes from inner character (1 Peter 3:3-4); body is temple of the Holy Spirit (1 Corinthians 6:19-20); we are fearfully and wonderfully made (Psalm 139:14); excessive focus on appearance is vanity — 1 mark each.',
  tags: ['technology', 'gospel', 'cosmetic surgery', 'Christian views'], learningObjective: 'Evaluate technology\'s role in spreading the gospel and Christian views on cosmetic surgery',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Response to Medicine and Technology',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) State and explain SIX lessons Christians learn from Daniel and King Solomon\'s aptitude and wisdom. (6 marks)',
  answerGuide: 'Any 6: True wisdom comes from God — not human skill; Daniel gave credit to God not himself — humility; Solomon prayed for wisdom not wealth — seek God first; those faithful to God receive knowledge and discernment — faithfulness; godly wisdom enables just leadership; wisdom brings favour before rulers; wisdom leads to positions of influence; studying honours God; wisdom protects from deception; wise people plan for the future — 1 mark each.',
  tags: ['Daniel', 'Solomon', 'wisdom', 'aptitude'], learningObjective: 'Apply lessons from Daniel and Solomon\'s wisdom to Christian life',
},

  // ── GRADE 10 — CRE (Additional Questions) ──────────────────────────────

// ── STRAND 1: THE OLD TESTAMENT — Additional Questions ───────

// The Holy Bible — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe NINE literary forms used in writing the Bible, giving the Bible book associated with each. (6 marks)',
  answerGuide: 'Any 6 for max marks: Legislative texts (Leviticus); Wise sayings (Proverbs); Prophetic speeches (Isaiah); Prayers (Psalms); Love songs (Song of Solomon); Philosophical essays (Job); Religious epics (Exodus); Epistles (Romans); Gospels (Matthew) — 1 mark each for naming the form with the correct Bible book.',
  tags: ['literary forms', 'Bible', 'genres'], learningObjective: 'Identify literary forms used in writing the Bible',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'structured', difficulty: 'easy', marks: 4,
  questionText: '(a) Describe the inductive method of Bible study and state its THREE main steps. (4 marks)',
  answerGuide: 'Inductive method: careful, systematic reading of Scripture — 1 mark. Three steps: Observation (what does it say? — noting who, what, when, where, why, how) — 1 mark; Interpretation (what does it mean? — original meaning to first audience) — 1 mark; Application (how do I respond? — acting on the truth) — 1 mark.',
  tags: ['inductive method', 'Bible study', 'observation'], learningObjective: 'Describe the inductive method of Bible study',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'short_answer', difficulty: 'easy', marks: 3,
  questionText: 'State THREE difficulties Christians in Kenya face when reading the Bible.',
  answerGuide: 'Any 3: Lack of time; Difficulty understanding; Boredom; Lack of discipline; Distractions (phones, TV); Discouragement from sin; No personal application seen; Negative church experiences; Spiritual attack — 1 mark each.',
  tags: ['Bible reading', 'challenges', 'Kenya'], learningObjective: 'Identify challenges Christians face in reading the Bible',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'structured', difficulty: 'easy', marks: 4,
  questionText: '(a) Define chastity as a virtue and give the relevant Bible reference. (2 marks)\n(b) State FOUR ways of applying chastity in daily life. (2 marks)',
  answerGuide: '(a) Chastity: sexual purity; refraining from sex outside marriage — 1 mark; 1 Corinthians 6:18-20 — 1 mark. (b) Any 4: avoiding pornography; dressing modestly; fleeing sexual temptation; setting boundaries in dating; honouring marriage; memorizing scripture — ½ mark each, max 2 marks.',
  tags: ['chastity', 'integrity', 'values'], learningObjective: 'Apply the virtue of chastity in daily life',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe the biographical method of Bible study using the book of Jonah. (3 marks)\n(b) State THREE lessons a Christian can learn from the life of Jonah. (3 marks)',
  answerGuide: '(a) The biographical method involves studying a person\'s life in Scripture — 1 mark; Jonah ran from God (disobedience) — 1 mark; prayed from the fish (repentance) and finally went to Nineveh (obedience) — 1 mark. (b) Any 3: God is patient and persistent; disobedience has consequences; repentance restores relationship with God; God\'s mercy extends to all nations; one person\'s obedience can save thousands; God can use suffering to correct us — 1 mark each.',
  tags: ['Jonah', 'biographical method', 'obedience', 'repentance'], learningObjective: 'Apply the biographical method using the book of Jonah',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Holy Bible',
  questionType: 'short_answer', difficulty: 'easy', marks: 4,
  questionText: 'State FOUR ways in which the Bible is used in Kenya today.',
  answerGuide: 'Any 4: In churches for worship and preaching; in schools for CRE lessons; in courts for swearing oaths; in homes for devotions; in hospitals for chaplaincy; in prisons for rehabilitation; on radio and TV broadcasts; on online platforms — 1 mark each.',
  tags: ['Bible', 'Kenya', 'uses'], learningObjective: 'Identify ways the Bible is used in Kenya',
},

// The Exodus — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Exodus',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) State FOUR attributes of God revealed through the ten plagues of Egypt. (4 marks)\n(b) State TWO purposes of the ten plagues. (2 marks)',
  answerGuide: '(a) Any 4: God is all-powerful (omnipotent); God is just — punishes sin; God is merciful — warned before each plague; God is faithful — kept His promise to Moses; God is sovereign — controls nature; God protects His people; God is holy — cannot tolerate injustice — 1 mark each. (b) Any 2: to demonstrate God\'s power to Egypt and Israel; to judge Egypt for enslaving Israel; to compel Pharaoh to release Israel; to show the powerlessness of Egyptian gods; to build Israel\'s faith — 1 mark each.',
  tags: ['plagues', 'attributes of God', 'Exodus'], learningObjective: 'Identify attributes of God revealed through the plagues',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Exodus',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe the challenges the Israelites faced in the desert after leaving Egypt and how God cared for them. (6 marks)',
  answerGuide: 'Any 6: Lack of water at Marah — God sweetened bitter water — 1 mark; hunger — God provided manna and quail — 1 mark; thirst at Rephidim — Moses struck rock and water came out — 1 mark; attack by Amalekites — God gave victory when Moses raised his hands — 1 mark; fear and discouragement — God\'s presence in pillar of cloud and fire — 1 mark; complaints and rebellion — God responded with patience and provision — 1 mark.',
  tags: ['Exodus', 'desert', 'God\'s provision', 'challenges'], learningObjective: 'Describe challenges in the desert and how God cared for Israel',
},

// The Sinai Covenant — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Sinai Covenant',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe how the Sinai Covenant was made (Exodus 19-24). (4 marks)\n(b) State TWO ways Christians today express their covenant with God. (2 marks)',
  answerGuide: '(a) God called Moses to Mount Sinai; told Israel to consecrate themselves; God descended in fire, thunder and smoke; Moses presented the Ten Commandments and laws to the people; people agreed "We will do everything the Lord says"; Moses sprinkled blood on the people saying "This is the blood of the covenant" — 1 mark each for 4 points. (b) Any 2: baptism; Holy Communion; church membership commitment; daily prayer and Bible study; tithing; Christian marriage vows — 1 mark each.',
  tags: ['Sinai Covenant', 'making the covenant', 'Moses'], learningObjective: 'Describe the making of the Sinai Covenant and its relevance',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'The Sinai Covenant',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe worship in the wilderness as outlined in the Old Testament. (3 marks)\n(b) State THREE ways in which Christians worship God today. (3 marks)',
  answerGuide: '(a) God commanded Israel to build the Tabernacle as His dwelling place; priests offered daily sacrifices; the Ark of the Covenant was placed in the Most Holy Place; the Sabbath was observed as a day of rest and worship; festivals like Passover and Pentecost were celebrated — 1 mark each for 3 points. (b) Any 3: singing hymns and praise; reading the Bible; prayer; Holy Communion; giving offerings; baptism; fellowship with other believers; preaching and listening to sermons — 1 mark each.',
  tags: ['worship', 'wilderness', 'Tabernacle', 'Christian worship'], learningObjective: 'Describe worship in the wilderness and how Christians worship today',
},

// Loyalty to God (Elijah) — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Loyalty to God (Elijah)',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe Elijah\'s flight to Mount Horeb and what happened there (1 Kings 19). (4 marks)\n(b) State TWO lessons Christians learn from Elijah\'s experience at Horeb. (2 marks)',
  answerGuide: '(a) After defeating Baal prophets, Elijah feared Jezebel and fled to the desert; an angel fed him twice for the journey; he travelled 40 days to Horeb; hid in a cave; God asked "What are you doing here Elijah?"; Elijah complained he was the only one left; God appeared not in wind, earthquake or fire but in a still small voice; God gave Elijah new instructions and told him 7,000 had not bowed to Baal — 1 mark each for 4 points. (b) Any 2: God meets us in our exhaustion; God speaks in a still small voice; we are never alone in serving God; God provides rest and food before giving new assignments; self-pity is overcome by God\'s perspective — 1 mark each.',
  tags: ['Elijah', 'Horeb', 'still small voice', 'burnout'], learningObjective: 'Describe Elijah\'s experience at Horeb and lessons for Christians',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Loyalty to God (Elijah)',
  questionType: 'short_answer', difficulty: 'easy', marks: 4,
  questionText: 'State FOUR forms of idol worship and religious extremism that exist in Kenya today.',
  answerGuide: 'Any 4: Worshipping traditional spirits/ancestors; seeking help from witchdoctors; putting money/career/family above God; joining cults; believing in charms and amulets; worshipping celebrities or political leaders; superstition; occult practices — 1 mark each.',
  tags: ['idol worship', 'Kenya', 'religious extremism', 'Elijah'], learningObjective: 'Identify forms of idol worship in contemporary Kenya',
},

// Old Testament Prophets and Prophet Amos — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Old Testament Prophets and Prophet Amos',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Distinguish between TRUE and FALSE prophets using FOUR characteristics each. (4 marks)\n(b) State TWO ways of identifying a false prophet in Kenya today. (2 marks)',
  answerGuide: '(a) True prophets: speaks in God\'s name; prophecy is fulfilled; leads people to God; willing to suffer for the truth — 1 mark each. False prophets: speaks what people want to hear; prophecy fails; leads people away from God; motivated by money — 1 mark each. (b) Any 2: their predictions fail; they demand money before praying; they lead people away from the Bible; they perform miracles but promote sin; they use fear and manipulation — 1 mark each.',
  tags: ['true prophets', 'false prophets', 'Amos', 'Kenya'], learningObjective: 'Distinguish between true and false prophets',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Old Testament Prophets and Prophet Amos',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) What does Amos 5:21-24 teach about God\'s rejection of insincere worship? (3 marks)\n(b) What does this passage teach Christians in Kenya about worship and social responsibility? (3 marks)',
  answerGuide: '(a) God says "I hate, I despise your religious festivals; I cannot stand your assemblies" — 1 mark; God rejects their burnt offerings, grain offerings, and fellowship offerings — 1 mark; God wants justice to roll like a river and righteousness like a never-failing stream — 1 mark. (b) Any 3: worship that is not accompanied by justice is worthless; Christians cannot separate Sunday worship from Monday ethics; churches should champion justice for the poor; corruption cannot coexist with true worship; caring for the needy is part of worship — 1 mark each.',
  tags: ['Amos', 'worship', 'justice', 'hypocrisy'], learningObjective: 'Apply Amos\'s teaching on genuine worship to Kenyan Christians',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Old Testament Prophets and Prophet Amos',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) State and explain FOUR characteristics of cults and ungodly groups in Kenya today. (4 marks)\n(b) State TWO ways of avoiding joining a cult. (2 marks)',
  answerGuide: '(a) Any 4: distort Scripture; use fear and guilt to control members; discourage association with family; demand absolute loyalty to a leader; claim exclusive revelation; demand money or property; deny core Christian doctrines (Trinity, deity of Christ) — 1 mark each. (b) Any 2: know Scripture well; pray for discernment; check group\'s beliefs against the Bible; avoid groups that isolate members; stay accountable to a local church; be wary of pressure tactics; ask questions before committing — 1 mark each.',
  tags: ['cults', 'false religion', 'Kenya', 'Amos'], learningObjective: 'Identify characteristics of cults and how to avoid them',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Old Testament Prophets and Prophet Amos',
  questionType: 'short_answer', difficulty: 'medium', marks: 4,
  questionText: 'State and explain FOUR of God\'s promises of restoration to Israel as found in Amos 9:8-15.',
  answerGuide: 'Any 4: Rebuild the fallen tabernacle of David — restore true worship; Restore fortunes — return from exile; Bless the land with abundant harvest — reaper overtakes ploughman; Plant them securely in their land — never to be uprooted again — 1 mark each.',
  tags: ['Amos', 'restoration', 'remnant', 'promises'], learningObjective: 'Describe God\'s promises of restoration from Amos',
},

// ── STRAND 2: THE NEW TESTAMENT — Additional Questions ────────

// Messianic Prophecies — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'Infancy and Early Life of Jesus Christ',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe Isaiah\'s prophecy about the Suffering Servant (Isaiah 53). State SIX characteristics. (6 marks)',
  answerGuide: 'Any 6: Despised and rejected by men — 1 mark; Man of sorrows, acquainted with grief — 1 mark; He bore our infirmities — 1 mark; Pierced for our transgressions, crushed for our iniquities — 1 mark; By His wounds we are healed — 1 mark; Led like a lamb to the slaughter — 1 mark; Cut off from the land of the living — 1 mark; Buried with the rich in His death — 1 mark; He bore the sin of many — 1 mark. Max 6.',
  tags: ['Isaiah 53', 'Suffering Servant', 'Messianic prophecy'], learningObjective: 'Describe Isaiah\'s prophecy of the Suffering Servant',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'Infancy and Early Life of Jesus Christ',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe the annunciation of Jesus\' birth to Mary (Luke 1:26-38). (4 marks)\n(b) State TWO ways the birth of Jesus fulfilled Old Testament prophecy. (2 marks)',
  answerGuide: '(a) Angel Gabriel was sent to Nazareth to a virgin named Mary, pledged to be married to Joseph; greeted her "Highly favoured"; told her she would conceive and give birth to a Son named Jesus; He would be called Son of the Most High; His kingdom would never end; Mary asked "How can this be since I am a virgin?"; Gabriel said Holy Spirit would come upon her; nothing is impossible with God; Mary said "I am the Lord\'s servant" — 1 mark each for 4 points. (b) Any 2: born of a virgin as Isaiah 7:14 predicted; born in Bethlehem as Micah 5:2 predicted; called Son of God as 2 Samuel 7:14 foretold; born of the line of David — 1 mark each.',
  tags: ['annunciation', 'Mary', 'Gabriel', 'Jesus'], learningObjective: 'Describe the annunciation of Jesus\' birth',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'Infancy and Early Life of Jesus Christ',
  questionType: 'structured', difficulty: 'easy', marks: 4,
  questionText: '(a) State the role of John the Baptist in preparing the way for Jesus. (4 marks)',
  answerGuide: 'Any 4: Called people to repentance; baptized in the Jordan for forgiveness of sins; proclaimed the coming of the Messiah; fulfilled Isaiah\'s prophecy (a voice crying in the wilderness); told people Jesus was greater than himself; pointed to Jesus as the Lamb of God; lived a simple life as a model of dedication — 1 mark each.',
  tags: ['John the Baptist', 'repentance', 'baptism', 'prophecy'], learningObjective: 'Describe the role of John the Baptist',
},

// Galilean Ministry — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'Galilean Ministry',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe the miraculous catch of fish (Luke 5:1-11). (3 marks)\n(b) State THREE lessons Christians learn from this miracle. (3 marks)',
  answerGuide: '(a) Jesus was teaching by Lake Gennesaret; got into Simon\'s boat; asked him to push out; after teaching, told Simon to let down nets in deep water; Simon said they had worked all night and caught nothing but obeyed; they caught so many fish the nets began to break; both boats filled and began to sink; Simon fell at Jesus\' feet saying "Go away, I am a sinful man"; Jesus said "Don\'t be afraid, from now on you will catch men" — 1 mark each for 3 points. (b) Any 3: obedience to Jesus leads to blessing; Jesus is Lord even over nature; humility and acknowledgment of sin leads to a call; Jesus calls ordinary people; discipleship means leaving everything; success in ministry comes from Jesus\' power not our ability — 1 mark each.',
  tags: ['miraculous catch', 'Simon Peter', 'discipleship', 'Luke 5'], learningObjective: 'Describe the miraculous catch and lessons for discipleship',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'Galilean Ministry',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) State THREE parables Jesus told during His Galilean ministry and the main lesson of each. (6 marks)',
  answerGuide: 'Any 3 parables at 2 marks each: Parable of the Sower (Luke 8) — responses to God\'s word depend on the condition of the heart; Parable of the Good Samaritan (Luke 10) — love your neighbour regardless of background; Parable of the Prodigal Son (Luke 15) — God welcomes repentant sinners; Parable of the Lost Sheep — God seeks one lost person; Parable of the Lost Coin — God rejoices over one repentant sinner; Parable of the Wise and Foolish Builders — obey Jesus\' words for a stable life. 1 mark for naming, 1 mark for lesson.',
  tags: ['parables', 'Galilean ministry', 'Jesus\' teachings'], learningObjective: 'Describe parables told during the Galilean ministry',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: 'Galilean Ministry',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe the Transfiguration of Jesus (Luke 9:28-36). (4 marks)\n(b) State TWO lessons Christians learn from the Transfiguration. (2 marks)',
  answerGuide: '(a) Jesus took Peter, James, and John up a mountain to pray; His appearance changed — face shone, clothes became dazzling white; Moses and Elijah appeared and talked with Jesus about His departure (death) in Jerusalem; Peter offered to make three shelters; a cloud enveloped them; voice from the cloud said "This is my Son whom I have chosen; listen to Him"; when voice had spoken, they saw only Jesus — 1 mark each for 4 points. (b) Any 2: Jesus is the fulfilment of the Law (Moses) and Prophets (Elijah); Jesus is the Son of God confirmed by the Father; believers must listen to Jesus above all; Jesus\' glory was revealed before His suffering; prayer leads to spiritual revelation — 1 mark each.',
  tags: ['Transfiguration', 'Jesus', 'Peter', 'Moses', 'Elijah'], learningObjective: 'Describe the Transfiguration and its significance',
},

// Paul's First Letter to the Corinthians — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: "Paul's First Letter to the Corinthians",
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) What did Paul teach about the body as a temple of the Holy Spirit (1 Corinthians 6:19-20)? (3 marks)\n(b) How should Kenyan youth apply this teaching in their daily lives? (3 marks)',
  answerGuide: '(a) "Do you not know that your bodies are temples of the Holy Spirit who is in you?" — 1 mark; "You are not your own; you were bought at a price" (Jesus\' blood) — 1 mark; "Therefore honour God with your bodies" — 1 mark. (b) Any 3: avoid drug and substance abuse; dress modestly; abstain from premarital sex; avoid tattoos that dishonour God; exercise and eat well; avoid pornography; reject peer pressure to sin — 1 mark each.',
  tags: ['body as temple', 'Holy Spirit', 'Paul', 'Corinthians'], learningObjective: 'Apply Paul\'s teaching on the body as a temple',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The New Testament', subStrand: "Paul's First Letter to the Corinthians",
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe how Paul addressed sexual immorality in the church at Corinth (1 Corinthians 5-6). (4 marks)\n(b) State TWO ways the church in Kenya should address immorality today. (2 marks)',
  answerGuide: '(a) Paul condemned a man sleeping with his father\'s wife — 1 mark; told the church to expel the immoral person — 1 mark; warned that a little yeast (sin) leavens the whole batch — 1 mark; declared that the sexually immoral will not inherit the kingdom of God (1 Cor 6:9) — 1 mark. (b) Any 2: preach consistently on sexual purity; provide counselling for those struggling; discipline members in love; teach that the body is a temple; mentor youth on godly relationships — 1 mark each.',
  tags: ['immorality', 'Corinth', 'Paul', 'church discipline'], learningObjective: 'Describe how Paul addressed immorality and apply it to Kenyan church',
},

// ── STRAND 3: CHURCH IN ACTION — Additional Questions ─────────

// Holy Spirit — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'The Holy Spirit and Gifts of the Holy Spirit',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe Peter\'s message on the Day of Pentecost (Acts 2:14-41). (4 marks)\n(b) State TWO results of Peter\'s message that day. (2 marks)',
  answerGuide: '(a) Peter stood and addressed the crowd; denied they were drunk (only 9am); quoted Joel\'s prophecy about the Spirit being poured on all people — 1 mark; declared Jesus of Nazareth was accredited by God through miracles — 1 mark; stated Jesus was crucified but God raised Him from the dead — 1 mark; declared God has made Jesus both Lord and Messiah — 1 mark. (b) Any 2: the crowd was cut to the heart; they asked "What shall we do?"; about 3,000 were baptized; the church began to grow rapidly; the disciples were accepted as genuine witnesses — 1 mark each.',
  tags: ['Peter', 'Pentecost', 'sermon', 'Acts 2'], learningObjective: 'Describe Peter\'s Pentecost sermon and its results',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'The Holy Spirit and Gifts of the Holy Spirit',
  questionType: 'short_answer', difficulty: 'easy', marks: 4,
  questionText: 'State FOUR ways in which the gifts of the Holy Spirit promote unity in the church today.',
  answerGuide: 'Any 4: Each gift serves others so no member is unnecessary; different gifts complement each other; gifts are given for the common good not personal benefit; those with gifts of wisdom resolve conflicts; gifts of healing and mercy show love; prophecy and teaching build shared understanding; no single gift is superior so pride is avoided — 1 mark each.',
  tags: ['gifts of the Spirit', 'unity', 'church'], learningObjective: 'Explain how spiritual gifts promote unity in the church',
},

// Holy Trinity — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'The Holy Trinity',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Explain how Matthew 3:16-17 (the baptism of Jesus) reveals the Holy Trinity. (3 marks)\n(b) Explain how Matthew 28:19 (the Great Commission) supports the doctrine of the Trinity. (3 marks)',
  answerGuide: '(a) Jesus was baptized — the Son present in bodily form — 1 mark; the Holy Spirit descended like a dove — the Spirit present visibly — 1 mark; a voice from heaven said "You are my Son" — the Father speaking from heaven — 1 mark. (b) Jesus commanded baptism "in the name (singular) of the Father, Son and Holy Spirit" — 1 mark; the use of one "name" for three shows they share one divine essence — 1 mark; all three persons are equally honoured in the Christian initiation rite — 1 mark.',
  tags: ['Trinity', 'baptism', 'Matthew', 'Great Commission'], learningObjective: 'Identify biblical evidence for the Holy Trinity',
},

// Sacraments — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'Sacraments',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) What does Romans 6:3-4 teach about baptism and its connection to Jesus\' death and resurrection? (3 marks)\n(b) State THREE ways in which baptism differs across different Christian denominations in Kenya. (3 marks)',
  answerGuide: '(a) "We were baptized into Christ\'s death" — believers are united with Christ\'s death through baptism — 1 mark; "buried with Him through baptism into death" — the act of going under water symbolizes burial — 1 mark; "just as Christ was raised, we too may live a new life" — coming out of water symbolizes resurrection to new life — 1 mark. (b) Any 3: mode (immersion vs. sprinkling vs. pouring); age (infant vs. believer\'s baptism); formula (Trinitarian name vs. Jesus\' name only); setting (river, pool, or font); necessity for salvation (some see it as essential, others as symbolic) — 1 mark each.',
  tags: ['baptism', 'Romans 6', 'denominations', 'Kenya'], learningObjective: 'Explain the meaning of baptism from Romans 6',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'Sacraments',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) State SIX ways in which the Lord\'s Table (Holy Communion) is significant to a Christian. (6 marks)',
  answerGuide: 'Any 6: Reminds of Jesus\' death and resurrection; unites believers as they wait for the second coming; opportunity to seek forgiveness; renews faith; strengthens fellowship; proclaims the Lord\'s death until He comes; deepens gratitude for salvation; fulfils Jesus\' command "Do this in remembrance of me"; provides spiritual nourishment; celebrates the new covenant — 1 mark each.',
  tags: ['Holy Communion', 'Lord\'s Table', 'significance'], learningObjective: 'Explain the significance of the Lord\'s Table to Christians',
},

// ── STRAND 4: CHRISTIAN LIVING TODAY — Additional Questions ───

// Christian Ethics — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Ethics',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe THREE ethical issues facing Kenyan youth in the area of cyber security. (3 marks)\n(b) State THREE Christian guidelines for responsible use of the internet and social media. (3 marks)',
  answerGuide: '(a) Any 3: cyberbullying — using social media to harass or intimidate others; sexting — sending nude images; online fraud/scamming; pornography access and addiction; identity theft; spreading fake news (misinformation); online gambling — 1 mark each. (b) Any 3: use social media to glorify God not shame others; avoid accessing pornographic sites (body is a temple); be truthful online (no fake news or gossip); do not bully or harass others; practice the golden rule online; respect privacy; limit screen time — 1 mark each.',
  tags: ['cyber security', 'social media', 'ethics', 'youth'], learningObjective: 'Apply Christian ethics to cyber security and social media use',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Ethics',
  questionType: 'short_answer', difficulty: 'easy', marks: 4,
  questionText: 'State and explain FOUR road safety ethics that Kenyan Christians should practice.',
  answerGuide: 'Any 4: Obey traffic rules (Romans 13:1-2 — submit to governing authorities); do not drink and drive (do not be drunk with wine — Ephesians 5:18); use seatbelts (value life — body is temple); do not use mobile phone while driving; be patient and avoid road rage; respect pedestrians; do not overload vehicles — 1 mark each.',
  tags: ['road ethics', 'safety', 'Kenya', 'Christian living'], learningObjective: 'Apply Christian ethics to road safety in Kenya',
},

// Human Rights and GBV — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Human Rights and Gender-Based Violence',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) What does the Bible teach about human rights using Genesis 1:26-27 and Galatians 3:28? (4 marks)\n(b) State TWO ways Christians can help victims of gender-based violence in their communities. (2 marks)',
  answerGuide: '(a) Genesis 1:26-27: all humans are made in God\'s image (Imago Dei) — 1 mark; therefore every person has inherent dignity and worth — 1 mark; violence against a person is an attack on God\'s image — 1 mark; Galatians 3:28: all are equal in Christ — no discrimination based on gender, ethnicity, or social status — 1 mark. (b) Any 2: provide shelter and safety; report abuse to authorities; offer prayer and counselling; accompany victims to seek legal aid; support financially; offer emotional support — 1 mark each.',
  tags: ['human rights', 'Imago Dei', 'GBV', 'Christian response'], learningObjective: 'Apply biblical teachings on human rights to address GBV',
},

// Human Sexuality — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Human Sexuality',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) State and explain FOUR Christian teachings on male-female relationships using Bible references. (4 marks)\n(b) State TWO values that help young people maintain healthy relationships. (2 marks)',
  answerGuide: '(a) Any 4: Both created in God\'s image (Genesis 1:27) — treat each other with dignity — 1 mark; marriage is between one man and one woman (Genesis 2:24) — 1 mark; homosexual acts are forbidden (Leviticus 18:22; Romans 1:26-27) — 1 mark; the sexually immoral will not inherit the kingdom of God (1 Corinthians 6:9) — 1 mark; Sodom and Gomorrah punished for sexual immorality (Jude 1:7) — 1 mark. (b) Any 2: respect — honour one another\'s boundaries; love — seek each other\'s good; honesty — be truthful about intentions; self-discipline — control desires; accountability — involve trusted adults — 1 mark each.',
  tags: ['sexuality', 'relationships', 'Bible', 'values'], learningObjective: 'State Christian teachings on male-female relationships',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Human Sexuality',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Define celibacy and explain TWO Bible references that present it as an alternative to marriage. (4 marks)\n(b) State TWO reasons some Christians choose celibacy. (2 marks)',
  answerGuide: '(a) Celibacy: remaining unmarried and sexually abstinent — 1 mark; Matthew 19:10-12: some are eunuchs for the kingdom of heaven; not everyone can accept this but those who can should — 1 mark plus explanation — 1 mark; 1 Corinthians 7:7-9: Paul presents celibacy as a gift, wishes all were celibate but says if they cannot control themselves they should marry — 1 mark. (b) Any 2: to devote themselves fully to God\'s service; as a calling from God; to avoid distractions of marriage; as a missionary calling; to live as a sign of the kingdom of heaven — 1 mark each.',
  tags: ['celibacy', 'marriage', 'Paul', 'Matthew'], learningObjective: 'Explain celibacy as a Christian alternative to marriage',
},

// Marriage and Family — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Marriage and Family',
  questionType: 'structured', difficulty: 'medium', marks: 8,
  questionText: '(a) State and explain SIX values that contribute to a stable Christian family. (6 marks)\n(b) State TWO Christian solutions to families facing financial pressure. (2 marks)',
  answerGuide: '(a) Any 6: Love (selfless care for each member); Respect (valuing each person\'s dignity); Trust (relying on each other\'s word); Responsibility (each person doing their part); Communication (honest and open sharing); Commitment (staying together through hardship); Patience (not rushing or losing temper); Forgiveness (releasing offenses); Teamwork (working together for shared goals) — 1 mark each. (b) Any 2: budget together and plan finances; tithe and trust God\'s provision; seek financial counselling; avoid debt; both partners work together; pray about finances; cut unnecessary expenses — 1 mark each.',
  tags: ['family values', 'stability', 'marriage', 'finances'], learningObjective: 'Identify values that contribute to stable Christian families',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Marriage and Family',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) What does Ephesians 5:25 teach about the husband\'s role in marriage? (2 marks)\n(b) What does Colossians 3:18-21 teach about harmonious family relationships? (4 marks)',
  answerGuide: '(a) "Husbands, love your wives, just as Christ loved the church and gave himself up for her" — 1 mark; husbands must love sacrificially, putting wives\' interests first as Christ did for the church — 1 mark. (b) Wives submit to husbands as is fitting in the Lord — 1 mark; husbands love wives and do not be harsh with them — 1 mark; children obey parents in everything for this pleases the Lord — 1 mark; fathers do not embitter/provoke children or they will become discouraged — 1 mark.',
  tags: ['Ephesians 5', 'Colossians 3', 'marriage', 'family roles'], learningObjective: 'Apply Paul\'s teachings on family roles from Ephesians and Colossians',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Marriage and Family',
  questionType: 'structured', difficulty: 'easy', marks: 4,
  questionText: 'State FOUR roles of the church in supporting married couples in Kenya today.',
  answerGuide: 'Any 4: Offering premarital counselling; providing marriage enrichment seminars; counselling during marital crises; organizing couples\' fellowships; teaching biblical principles of marriage; supporting families in financial difficulty; hosting family retreats; mentoring young married couples — 1 mark each.',
  tags: ['church', 'marriage support', 'Kenya'], learningObjective: 'Describe the church\'s role in supporting married couples',
},

// Christian Response to Medicine and Technology — Additional
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Response to Medicine and Technology',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) State SIX reasons why Christians say the right to life must be defended according to God\'s Word. (6 marks)',
  answerGuide: 'Any 6: God commands "Do not murder" (Exodus 20:13); life is made in God\'s image (Genesis 1:26-27); God is the giver of life (Acts 17:25); only God has authority over death (Deuteronomy 32:39); Jesus values every person (Matthew 10:31); we are stewards not owners of our bodies; human life has inherent dignity; abortion violates the right to life of the unborn — 1 mark each.',
  tags: ['right to life', 'euthanasia', 'Bible', 'ethics'], learningObjective: 'Defend the right to life using biblical arguments',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Response to Medicine and Technology',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) Describe the creative skills mentioned in Exodus 31:1-6 and Exodus 35:30-35. (4 marks)\n(b) State TWO lessons Christians learn about creative skills from these passages. (2 marks)',
  answerGuide: '(a) Exodus 31:1-6: Bezalel was filled with the Spirit of God with wisdom, understanding, knowledge, and all kinds of skills — 1 mark; skilled to make artistic designs in gold, silver, and bronze; cut and set stones; carve wood — 1 mark; Exodus 35:30-35: skills of engraving, designing and embroidering with blue, purple, and scarlet yarn — 1 mark; also skilled to teach others — 1 mark. (b) Any 2: creative skills are gifts from God; the Holy Spirit can fill people with artistic skill; skill must be used for God\'s glory; God values excellence and craftsmanship; skills should be shared and taught to others — 1 mark each.',
  tags: ['creative skills', 'Bezalel', 'Exodus', 'gifts'], learningObjective: 'Identify creative skills in the Bible and their significance',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Response to Medicine and Technology',
  questionType: 'structured', difficulty: 'medium', marks: 6,
  questionText: '(a) What does Psalm 139:14 teach Christians about God\'s creation of the human body? (2 marks)\n(b) Using 1 Samuel 16:7 and 1 Peter 3:3-4, explain what TRUE beauty means for a Christian. (4 marks)',
  answerGuide: '(a) "I praise you because I am fearfully and wonderfully made" — 1 mark; God made every human body perfectly; cosmetic surgery driven by dissatisfaction denies this truth — 1 mark. (b) 1 Samuel 16:7: "The Lord looks at the heart" not outward appearance — 1 mark; God\'s standard of beauty is internal character and integrity — 1 mark; 1 Peter 3:3-4: true beauty should not come from outward adornment (braided hair, gold jewellery, fine clothes) — 1 mark; but from the unfading beauty of a gentle and quiet spirit which is of great worth to God — 1 mark.',
  tags: ['beauty', 'cosmetic surgery', 'Psalm 139', 'inner character'], learningObjective: 'Apply biblical teaching on true beauty to the issue of cosmetic surgery',
},

// Mixed/Comprehensive Questions covering multiple strands
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'The Old Testament', subStrand: 'Old Testament Prophets and Prophet Amos',
  questionType: 'long_answer', difficulty: 'hard', marks: 10,
  questionText: 'Describe the second coming of Christ as taught in the New Testament. State FIVE signs of the second coming, FOUR ways Christians should prepare, and explain why the second coming gives hope to suffering Christians. (10 marks)',
  answerGuide: 'Signs (any 5, ½ mark each = 2.5 marks): signs in sun/moon/stars; nations in anguish; roaring seas; people fainting with fear; wars and rumours of wars; gospel preached to all nations; great tribulation; false prophets; love of many growing cold. Preparation (any 4, 1 mark each = 4 marks): repent of sin; live holy lives; share the gospel; stay watchful in prayer; study Scripture; love one another; be faithful stewards; do not love the world. Hope (3.5 marks): Jesus promised to return for His people; suffering is temporary; final judgment will vindicate the righteous; reunion with loved ones who died in Christ; eternity with God in the new creation. Award marks for quality of reasoning.',
  tags: ['second coming', 'Christ', 'signs', 'hope', 'preparation'], learningObjective: 'Explain the second coming and how Christians should prepare',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Christian Living Today', subStrand: 'Christian Ethics',
  questionType: 'long_answer', difficulty: 'hard', marks: 10,
  questionText: 'Imagine you are a CRE teacher giving a talk to Form 1 students on living a Christian life in the modern world. Using what you have learned in Grade 10 CRE, write a speech addressing: (a) ONE challenge facing youth today, (b) TWO relevant Bible teachings, (c) FOUR practical ways of overcoming the challenge, and (d) TWO values the youth need.',
  answerGuide: '(a) Any valid challenge (peer pressure, sexual immorality, drugs, cyberbullying, etc.) — 1 mark. (b) Two relevant Bible verses correctly applied — 2 marks. (c) Four practical, realistic solutions — 4 marks. (d) Two clearly explained values — 2 marks. Award 1 mark for quality of speech structure/introduction/conclusion. Max 10 marks.',
  tags: ['applied CRE', 'youth', 'Christian living', 'speech'], learningObjective: 'Apply CRE knowledge to address challenges facing Kenyan youth',
},
{
  grade: 'Grade 10', subject: 'CRE',
  strand: 'Church in Action', subStrand: 'The Holy Spirit and Gifts of the Holy Spirit',
  questionType: 'structured', difficulty: 'hard', marks: 9,
  questionText: '(a) State and explain how the following THREE gifts of the Holy Spirit are manifested in the church today: prophecy, healing, and wisdom. (6 marks)\n(b) Explain how 1 Corinthians 12:4-7 teaches that all gifts are given for the common good. (3 marks)',
  answerGuide: '(a) Prophecy (2 marks): manifests through preaching God\'s word; speaking encouragement, warning, or direction to the church. Healing (2 marks): prayer for the sick with recovery; healing services; medical missions by Christians. Wisdom (2 marks): godly counsel for church leadership decisions; conflict resolution with divine insight; strategic vision for ministry. (b) "There are different kinds of gifts but the same Spirit" — diversity of gifts — 1 mark; "To each one the manifestation of the Spirit is given for the common good" — no gift is for self-benefit — 1 mark; unity in diversity because all gifts come from the same Spirit who distributes as He wills — 1 mark.',
  tags: ['spiritual gifts', 'prophecy', 'healing', 'wisdom', '1 Corinthians 12'], learningObjective: 'Describe manifestations of spiritual gifts and their purpose',
},

];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing bank (optional — comment out to preserve existing data)
    // await QuestionBank.deleteMany({});
    // console.log('Cleared existing question bank');

    const inserted = await QuestionBank.insertMany(seedQuestions);
    console.log(`✅ Inserted ${inserted.length} seed questions into question bank`);

    const breakdown = {};
    inserted.forEach(q => {
      const key = `${q.grade} — ${q.subject}`;
      breakdown[key] = (breakdown[key] || 0) + 1;
    });

    console.log('\nBreakdown by Grade/Subject:');
    Object.entries(breakdown).forEach(([k, v]) => console.log(`  ${k}: ${v} questions`));

    console.log('\nQuestion bank seeded successfully. Run "node scripts/seedQuestionBank.js" again to add more.');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
