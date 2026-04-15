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
 */

require('dotenv').config();
const mongoose = require('mongoose');
const QuestionBank = require('../models/QuestionBank');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/examsforge';

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
