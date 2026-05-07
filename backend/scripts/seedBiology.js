/**
 * ExamsForge — Grade 10 Biology Question Bank Seed
 * Source 1: Biology End Term 1 2026 (2 hours, 100 marks)
 * Source 2: Biology Opener Term 2 2026
 * Source 3: KCBE Biology Paper 2026 (90 marks)
 * Source 4: KICD Grade 10 Biology Topical Revision Booklet
 *
 * Run on Render Shell:
 *   MONGO_URI="mongodb+srv://..." node scripts/seedBiology.js
 *
 * Safe to re-run — skips duplicates automatically.
 * Total: 85 questions
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/examsforge';

const questionBankSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  subject: { type: String, required: true },
  strand: { type: String, required: true },
  subStrand: { type: String, required: true },
  questionType: { type: String, required: true },
  difficulty: { type: String, required: true },
  marks: { type: Number, required: true },
  questionText: { type: String, required: true },
  answerGuide: { type: String, required: true },
  tags: [String],
  learningObjective: String,
}, { timestamps: true });

const QuestionBank = mongoose.models.QuestionBank || mongoose.model('QuestionBank', questionBankSchema);

const biologyQuestions = [

  // ══════════════════════════════════════════════════════════════════
  // STRAND 1: CELL BIOLOGY AND BIODIVERSITY
  // ══════════════════════════════════════════════════════════════════

  // ── 1.1 Introduction to Biology ───────────────────────────────────

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Introduction to Biology',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    questionText: 'Define the term Biology.',
    answerGuide: 'Biology is the scientific study of living organisms (1 mark) and their interactions with each other and their environment (1 mark). Accept any correct definition that includes "study of life/living things".',
    tags: ['definition', 'biology', 'introduction'], learningObjective: 'Define the term Biology',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Introduction to Biology',
    questionType: 'short_answer', difficulty: 'easy', marks: 7,
    questionText: 'List the SEVEN characteristic processes of life.',
    answerGuide: 'Award 1 mark each for: (1) Nutrition — obtaining and using food for energy. (2) Respiration — releasing energy from food. (3) Excretion — removing metabolic waste products. (4) Growth — permanent increase in size and mass. (5) Reproduction — producing offspring. (6) Irritability/Sensitivity — detecting and responding to stimuli. (7) Movement — change in position (locomotion in animals, growth movements in plants).',
    tags: ['characteristics-of-life', 'MRS-NERG', 'living-things'], learningObjective: 'List the seven characteristic processes of life',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Introduction to Biology',
    questionType: 'structured', difficulty: 'easy', marks: 5,
    questionText: 'Match each branch of Biology in Column A with its correct description in Column B:\nColumn A: (a) Botany (b) Zoology (c) Microbiology (d) Ecology (e) Entomology\nColumn B: Study of microorganisms / Study of insects / Study of animals / Study of plants / Study of organisms and their surroundings',
    answerGuide: '(a) Botany — Study of plants. (b) Zoology — Study of animals. (c) Microbiology — Study of microorganisms. (d) Ecology — Study of organisms and their surroundings. (e) Entomology — Study of insects. Award 1 mark each.',
    tags: ['branches-of-biology', 'botany', 'zoology', 'ecology', 'microbiology'], learningObjective: 'Identify and match branches of Biology with their descriptions',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Introduction to Biology',
    questionType: 'structured', difficulty: 'easy', marks: 3,
    questionText: 'A community near Lake Victoria is experiencing water-borne diseases, crop failure due to pests, and poor waste management. Explain THREE ways Biology can be applied to solve these problems.',
    answerGuide: '(i) Biology knowledge of disease transmission helps design water treatment systems to eliminate pathogens causing water-borne diseases (1 mark). (ii) Knowledge of pest biology and ecology helps develop biological pest control methods to protect crops (1 mark). (iii) Understanding decomposition and microbiology helps design effective waste management and composting systems (1 mark). Accept any reasonable biological application.',
    tags: ['applications-of-biology', 'Lake-Victoria', 'community', 'Kenya'], learningObjective: 'Apply Biology knowledge to solve community problems',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Introduction to Biology',
    questionType: 'structured', difficulty: 'easy', marks: 8,
    questionText: 'Complete the table below linking fields of Biology to careers:\n| Field of Biology | Area of Study | One Related Career |\n|---|---|---|\n| Botany | | |\n| Zoology | | |\n| Microbiology | | |\n| Biotechnology | | |',
    answerGuide: 'Award 2 marks per row (1 for area of study + 1 for career): Botany — study of plants — botanist/agricultural officer/horticulturist/plant scientist. Zoology — study of animals — zoologist/wildlife officer/veterinarian. Microbiology — study of microorganisms — microbiologist/medical laboratory technologist/food scientist. Biotechnology — use of living organisms in technology — biotech researcher/genetic engineer/pharmaceutical scientist.',
    tags: ['careers', 'fields-of-biology', 'vocational', 'table-completion'], learningObjective: 'Link fields of Biology to career pathways',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Introduction to Biology',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    questionText: 'State TWO reasons why learning Biology is important to learners in everyday life.',
    answerGuide: 'Award 1 mark each for any two of: (1) Helps understand how the human body works and how to maintain good health. (2) Provides knowledge for environmental conservation and sustainability. (3) Helps understand disease prevention and treatment. (4) Provides a foundation for careers in medicine, agriculture, research. (5) Helps understand food and nutrition for healthy living.',
    tags: ['importance-of-biology', 'everyday-life', 'health'], learningObjective: 'Explain the importance of studying Biology in everyday life',
  },

  // ── 1.2 Specimen Collection and Preservation ──────────────────────

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Specimen Collection and Preservation',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Identify TWO factors that should positively influence career choice in Biology, and state TWO factors that should NOT influence career choice.',
    answerGuide: 'Positive factors (1 mark each, any 2): Interest/passion in Biology; natural ability/aptitude; availability of training institutions; job market opportunities; personal values aligned with the field. Negative factors (1 mark each, any 2): Gender — Biology careers are not gender-specific; disability — should not prevent entry into most Biology fields; tribe/ethnicity; family pressure/tradition.',
    tags: ['career-choice', 'biology', 'gender', 'disability'], learningObjective: 'Identify appropriate and inappropriate factors for career choice in Biology',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Specimen Collection and Preservation',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'State FOUR precautions to observe when collecting biological specimens in the field.',
    answerGuide: 'Award 1 mark each for any four of: (1) Wear protective clothing — gloves, boots, long trousers to avoid injury or infection. (2) Do not touch specimens with bare hands — use forceps or tongs. (3) Handle living specimens gently to avoid injuring them. (4) Obtain permission before collecting from protected areas. (5) Collect only what is needed — avoid over-collecting. (6) Keep a safe distance from dangerous animals. (7) Wash hands after handling specimens. (8) Label specimens immediately after collection.',
    tags: ['precautions', 'specimen-collection', 'field-work', 'safety'], learningObjective: 'State safety precautions for biological specimen collection',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Specimen Collection and Preservation',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    questionText: 'Give THREE reasons why specimen collection and preservation are important in Biology.',
    answerGuide: 'Award 1 mark each for any three of: (1) Provides permanent reference material for future research and study. (2) Allows documentation of biodiversity and species distribution. (3) Enables comparison of specimens from different times and locations. (4) Provides material for teaching and education purposes. (5) Helps in identifying extinct or endangered species. (6) Preserves evidence of the original organism when the living specimen is no longer available.',
    tags: ['specimen-preservation', 'importance', 'biodiversity'], learningObjective: 'Explain the importance of specimen collection and preservation',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Specimen Collection and Preservation',
    questionType: 'structured', difficulty: 'medium', marks: 2,
    questionText: 'Name TWO preservatives used in animal specimen preservation.',
    answerGuide: 'Award 1 mark each for any two of: (1) Ethanol/alcohol — kills and preserves organisms by dehydration. (2) Formaldehyde/formalin — preserves by cross-linking proteins. (3) Glycerol — used for soft tissue preservation. (4) Phenol. Accept any valid biological preservative.',
    tags: ['preservatives', 'animal-specimens', 'ethanol', 'formaldehyde'], learningObjective: 'Identify preservatives used for animal specimens',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Specimen Collection and Preservation',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'State FOUR components that must appear on a biological specimen label.',
    answerGuide: 'Award 1 mark each for any four of: (1) Name of specimen (common and/or scientific name). (2) Date of collection. (3) Location/habitat where collected. (4) Name of collector. (5) Preservation method used. (6) Reference/catalogue number. (7) Sex/stage of organism (e.g. adult, larva).',
    tags: ['specimen-label', 'components', 'documentation'], learningObjective: 'Identify information required on a specimen label',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Specimen Collection and Preservation',
    questionType: 'structured', difficulty: 'medium', marks: 7,
    questionText: 'Describe SEVEN steps followed when preparing a plant specimen for a herbarium.',
    answerGuide: 'Award 1 mark each for: (1) Collect a complete plant or representative parts (leaves, flowers, fruits, roots). (2) Press the plant between blotting/newspaper paper while still fresh. (3) Place in a plant press — apply pressure using heavy books or a press. (4) Change the blotting/newspaper every 24 hours to absorb moisture. (5) Allow the plant to dry completely (1–2 weeks). (6) Mount the dried specimen on a herbarium sheet (card). (7) Attach a label with all relevant information (name, date, location, collector). Accept any seven valid steps in logical order.',
    tags: ['herbarium', 'plant-specimen', 'steps', 'preservation'], learningObjective: 'Describe steps for preparing a plant herbarium specimen',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Specimen Collection and Preservation',
    questionType: 'structured', difficulty: 'medium', marks: 2,
    questionText: 'What is a herbarium?',
    answerGuide: 'A herbarium is a collection of dried and preserved plant specimens (1 mark) that are systematically arranged and stored for scientific reference and study (1 mark).',
    tags: ['herbarium', 'definition', 'plants'], learningObjective: 'Define a herbarium',
  },

  // ── 1.3 Cell Structure and Specialisation ─────────────────────────

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    questionText: 'A student observed a cell under a microscope and noted the presence of a cell wall, a large central vacuole, and chloroplasts.\n(a) Is this a plant or an animal cell? (1 mark)\n(b) Give a reason for your answer based on the observations. (2 marks)',
    answerGuide: '(a) Plant cell (1 mark). (b) Plant cells have a rigid cell wall (cellulose) providing structure; a large central vacuole for storing water and maintaining turgor; and chloroplasts for photosynthesis — all three features are unique to plant cells and are absent in animal cells. Award 2 marks for any two correct reasons.',
    tags: ['plant-cell', 'animal-cell', 'cell-wall', 'chloroplast', 'vacuole'], learningObjective: 'Distinguish plant cells from animal cells based on observable features',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'easy', marks: 3,
    questionText: '(a) State the function of the mitochondria in a cell. (2 marks)\n(b) Name the process that takes place in the mitochondria to perform this function. (1 mark)',
    answerGuide: '(a) The mitochondria is the site of aerobic respiration (1 mark). It produces ATP (adenosine triphosphate) — the energy currency of the cell (1 mark). (b) Aerobic cellular respiration (1 mark). Accept "oxidative phosphorylation" or "Krebs cycle".',
    tags: ['mitochondria', 'respiration', 'ATP', 'energy', 'organelle'], learningObjective: 'State the function of the mitochondria and the process occurring there',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'medium', marks: 2,
    questionText: 'Explain the role of ribosomes in a cell.',
    answerGuide: 'Ribosomes are the sites of protein synthesis (1 mark). They translate mRNA (messenger RNA) to assemble amino acids into polypeptide chains/proteins (1 mark).',
    tags: ['ribosomes', 'protein-synthesis', 'mRNA', 'organelle'], learningObjective: 'Explain the function of ribosomes in protein synthesis',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    questionText: 'Why is the nucleus often referred to as the "control centre" of the cell?',
    answerGuide: 'The nucleus contains the genetic material — DNA (1 mark). DNA carries instructions/genes that control all cellular activities including protein synthesis, growth and reproduction (1 mark). The nucleus also controls cell division by directing when and how the cell divides (1 mark).',
    tags: ['nucleus', 'DNA', 'control-centre', 'cell-activities'], learningObjective: 'Explain why the nucleus is the control centre of the cell',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'medium', marks: 2,
    questionText: 'A cell was magnified 600 times using a light microscope whose eyepiece lens was ×20. What was the magnification of the objective lens? Show your working.',
    answerGuide: 'Formula: Total magnification = Eyepiece magnification × Objective magnification (1 mark). 600 = 20 × Objective magnification. Objective magnification = 600 ÷ 20 = ×30 (1 mark).',
    tags: ['magnification', 'calculation', 'microscope', 'eyepiece', 'objective'], learningObjective: 'Calculate objective lens magnification given total magnification and eyepiece power',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'State THREE differences between a light microscope and an electron microscope.',
    answerGuide: 'Award 2 marks each (1 mark per column) for any three differences:\n(1) Light microscope uses light rays / Electron microscope uses a beam of electrons.\n(2) Light microscope has lower resolution (cannot see details below 200nm) / Electron microscope has much higher resolution (can see structures below 1nm).\n(3) Light microscope can view living specimens / Electron microscope can only view dead/fixed specimens.\n(4) Light microscope is smaller and portable / Electron microscope is very large and expensive.\n(5) Light microscope produces colour images / Electron microscope produces black and white images.',
    tags: ['light-microscope', 'electron-microscope', 'comparison', 'resolution'], learningObjective: 'Compare light and electron microscopes',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Complete the table below by stating the use of each part of the microscope:\n| Part | Use |\n|------|-----|\n| Eyepiece lens | |\n| Objective lens | |\n| Diaphragm | |\n| Coarse adjustment knob | |',
    answerGuide: 'Eyepiece lens: magnifies the image produced by the objective lens (1 mark). Objective lens: magnifies the specimen and produces an initial magnified image (1 mark). Diaphragm: controls the amount of light entering the microscope (1 mark). Coarse adjustment knob: used for initial/rough focusing of the specimen (1 mark).',
    tags: ['microscope-parts', 'functions', 'table', 'eyepiece', 'diaphragm'], learningObjective: 'Identify and state the uses of microscope parts',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'medium', marks: 2,
    questionText: 'Explain the meaning of:\n(i) Magnification (1 mark)\n(ii) Resolution (1 mark)',
    answerGuide: '(i) Magnification: the ratio of the apparent size of an image to the actual size of the object (how many times an image is enlarged). (ii) Resolution: the ability of a microscope to distinguish two closely-positioned points as separate/distinct — the minimum distance between two points that can be seen as separate.',
    tags: ['magnification', 'resolution', 'microscopy', 'definitions'], learningObjective: 'Define magnification and resolution in the context of microscopy',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    questionText: 'What is a tissue? Give ONE example of a tissue from the human body and state its function.',
    answerGuide: 'A tissue is a group of similar cells (1 mark) that work together to perform a specific function (1 mark). Example: muscle tissue — contracts to produce movement (1 mark). Accept: nervous tissue — transmits electrical signals; epithelial tissue — lines body surfaces; connective tissue — supports and connects body parts.',
    tags: ['tissue', 'definition', 'muscle-tissue', 'nervous-tissue'], learningObjective: 'Define tissue and identify tissues in the human body',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'long_answer', difficulty: 'hard', marks: 20,
    questionText: '(a) Draw a large, well-labelled diagram of a typical plant cell as seen under an electron microscope. Label the following parts: cell wall, cell membrane, nucleus, cytoplasm, chloroplast, mitochondria, large central vacuole. (10 marks)\n(b) Describe the function of any FOUR of the labelled parts. (8 marks)\n(c) Explain how the shape and structure of a plant cell differs from that of an animal cell and give a reason for each difference. (2 marks)',
    answerGuide: '(a) Diagram: award marks for correct shape (rectangular), clearly drawn and labelled structures. Cell wall (1), cell membrane (1), nucleus with nuclear membrane (1), cytoplasm (1), chloroplast with grana (1), mitochondria (1), large central vacuole (1), endoplasmic reticulum/other organelles (1). Neat drawing (1), appropriate size and clear labels (1). (b) 2 marks each for any four: Cell wall — rigid support and shape to the cell; Cell membrane — selectively permeable, controls entry and exit; Nucleus — control centre, contains DNA directing all activities; Chloroplast — photosynthesis converting light to chemical energy; Mitochondria — aerobic respiration producing ATP energy; Vacuole — stores water/sap, maintains turgor pressure. (c) Plant cells are rectangular/box-shaped with rigid cell wall — for structural support of the plant; Animal cells are irregular/round — no rigid wall, allowing flexibility for movement. (1 mark per difference with reason).',
    tags: ['plant-cell', 'diagram', 'organelles', 'animal-cell', 'comparison', 'Section-B'], learningObjective: 'Draw and label a plant cell and compare it to an animal cell',
  },

  // ── 1.4 Chemicals of Life ──────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'medium', marks: 2,
    questionText: 'Name the two main types of nucleic acids.',
    answerGuide: '(1) DNA — Deoxyribonucleic Acid (1 mark). (2) RNA — Ribonucleic Acid (1 mark).',
    tags: ['nucleic-acids', 'DNA', 'RNA', 'chemicals-of-life'], learningObjective: 'Name the two main types of nucleic acids',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'medium', marks: 8,
    questionText: 'Complete the following table on biological molecules:\n| Biomolecule | Basic Building Block (Monomer) | Main Function in the Body | One Food Source |\n|---|---|---|---|\n| Carbohydrate | | Provide quick energy | |\n| Protein | | | Meat, Beans |\n| Lipid | Fatty Acids and Glycerol | | |',
    answerGuide: 'Carbohydrate: Monomer = glucose/monosaccharide (1 mark); Food source = bread/rice/maize/potatoes/ugali (1 mark). Protein: Monomer = amino acids (1 mark); Function = growth and repair/enzyme production/transport (1 mark); (food source already given). Lipid: Function = energy storage/insulation/making cell membranes (1 mark); Food source = cooking oil/butter/avocado/nuts (1 mark). Award 1 mark each for any 8 correct cells total. Deduct 0 for already-given cells.',
    tags: ['biomolecules', 'carbohydrates', 'proteins', 'lipids', 'table-completion'], learningObjective: 'Identify monomers, functions and sources of the main biological molecules',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Distinguish between diffusion and osmosis.',
    answerGuide: 'Diffusion: the movement of molecules/particles from a region of high concentration to a region of low concentration (1 mark); does not require a semi-permeable membrane (1 mark). Osmosis: the movement of WATER molecules specifically from a region of high water potential (dilute solution) to low water potential (concentrated solution) (1 mark); through a selectively/semi-permeable membrane only (1 mark). Award 4 marks total — 2 marks each.',
    tags: ['diffusion', 'osmosis', 'distinction', 'concentration-gradient', 'semi-permeable'], learningObjective: 'Distinguish between diffusion and osmosis',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'A red blood cell is placed in a beaker of distilled water.\n(a) Describe what will happen to the cell. (2 marks)\n(b) Explain why this happens. (3 marks)',
    answerGuide: '(a) The red blood cell will swell up (1 mark) and eventually burst/lyse (1 mark). (b) Distilled water is a hypotonic solution — it has a higher water potential than the cell contents (1 mark). Water moves by osmosis from the distilled water (high water potential) into the cell (low water potential) through the semi-permeable cell membrane (1 mark). As water continues to enter, the cell swells beyond its capacity and the membrane ruptures (haemolysis) (1 mark).',
    tags: ['osmosis', 'red-blood-cell', 'distilled-water', 'hypotonic', 'haemolysis'], learningObjective: 'Explain the effect of placing a red blood cell in distilled water using osmosis',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'A plant is not watered for two weeks. Its leaves begin to wilt. Explain why the leaves are wilting using your knowledge of water movement in plants.',
    answerGuide: 'When water is not supplied, the soil dries out — soil water potential decreases. The plant cannot absorb water from the soil by osmosis (1 mark). The plant loses water through transpiration via the stomata but cannot replace it (1 mark). Cells in leaves lose water to the surrounding cells and environment — the vacuoles shrink and cells lose turgor pressure (1 mark). Without turgor pressure, the cells cannot support the leaf — the leaf becomes flaccid and wilts (1 mark).',
    tags: ['wilting', 'turgor', 'osmosis', 'transpiration', 'water-movement'], learningObjective: 'Explain why plant leaves wilt when water is unavailable using osmosis',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'medium', marks: 1,
    questionText: 'What is the optimal pH for most human enzymes?',
    answerGuide: 'pH 7 / neutral pH (1 mark). Accept pH 6–8 as a range. Note: some enzymes have specific optimal pH e.g. pepsin (pH 2) in the stomach — but most cellular enzymes function optimally at neutral pH.',
    tags: ['enzyme', 'pH', 'optimal', 'conditions'], learningObjective: 'State the optimal pH for most human enzymes',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'easy', marks: 2,
    questionText: 'List TWO factors that can affect the rate of an enzyme-controlled reaction.',
    answerGuide: 'Award 1 mark each for any two of: (1) Temperature — increasing temperature increases rate until the optimum; beyond optimum the enzyme denatures. (2) pH — each enzyme has an optimum pH; deviation reduces activity. (3) Substrate concentration — higher concentration increases rate until all active sites are occupied. (4) Enzyme concentration — more enzyme increases rate until substrate is limiting. (5) Inhibitors — competitive or non-competitive inhibitors reduce enzyme activity.',
    tags: ['enzyme', 'factors', 'temperature', 'pH', 'substrate'], learningObjective: 'Identify factors that affect enzyme activity',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'easy', marks: 2,
    questionText: 'Name the enzyme found in saliva and state what substance it breaks down.',
    answerGuide: 'Enzyme: Salivary amylase / ptyalin (1 mark). Substance it breaks down: starch (polysaccharide) into maltose (disaccharide) (1 mark).',
    tags: ['salivary-amylase', 'saliva', 'starch', 'digestion', 'enzyme'], learningObjective: 'Identify the enzyme in saliva and its substrate',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'long_answer', difficulty: 'hard', marks: 20,
    questionText: '(a) Define the term enzyme and describe its chemical nature. (4 marks)\n(b) Using the example of salivary amylase and starch, explain the lock and key model of enzyme action. You may use a diagram to support your answer. (8 marks)\n(c) Design an experiment to investigate the effect of temperature on the activity of the enzyme catalase (found in potato or liver). Your answer should include: a hypothesis, a list of apparatus, a clear step-by-step method, and what you would measure to determine the rate of reaction. (8 marks)',
    answerGuide: '(a) Enzyme: a biological catalyst (1 mark) that speeds up chemical reactions without being used up in the process (1 mark). Chemical nature: enzymes are proteins (1 mark) made of chains of amino acids folded into a specific 3D shape with an active site (1 mark). (b) Lock and key model (8 marks): the enzyme (lock) has a specific active site with a unique 3D shape (2 marks); only the complementary substrate (key) — starch — can fit into the active site (2 marks); enzyme-substrate complex forms (1 mark); starch is broken down to maltose (1 mark); products released; enzyme unchanged and available for reuse (2 marks). Diagram showing enzyme + substrate → enzyme-substrate complex → products (up to 2 bonus marks if diagram used). (c) Hypothesis: as temperature increases, the rate of catalase activity increases up to an optimum temperature, then decreases as the enzyme denatures (2 marks). Apparatus: potato slices/liver, hydrogen peroxide, water baths at different temperatures (0°C, 20°C, 37°C, 60°C, 80°C), stopwatch, ruler, test tubes (2 marks). Method: cut equal-sized pieces of potato; place in water baths at different temperatures for 5 min; add equal volume of H₂O₂ to each; measure height of foam/time for a disc of potato to rise as measure of O₂ produced; repeat for reliability (2 marks). Measurement: volume/height of oxygen bubbles produced per minute OR time taken for potato disc to rise to surface (2 marks).',
    tags: ['enzyme', 'lock-and-key', 'catalase', 'experiment', 'temperature', 'Section-B'], learningObjective: 'Explain enzyme action using lock and key model and design a practical experiment',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'medium', marks: 2,
    questionText: 'Define the term homeostasis.',
    answerGuide: 'Homeostasis is the maintenance of a constant internal environment (1 mark) within the body despite changes in the external environment (1 mark).',
    tags: ['homeostasis', 'definition', 'internal-environment'], learningObjective: 'Define homeostasis',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'easy', marks: 2,
    questionText: 'Give ONE example of how the body maintains a constant internal environment.',
    answerGuide: 'Award 2 marks for any complete example: (1) Thermoregulation — the body maintains a constant temperature of 37°C through sweating when hot and shivering when cold. (2) Blood glucose regulation — insulin (produced by pancreas) lowers blood glucose when too high; glucagon raises it when too low. (3) Osmoregulation — the kidneys regulate water and salt concentration in the blood. Accept any complete example with mechanism.',
    tags: ['homeostasis', 'thermoregulation', 'blood-glucose', 'osmoregulation'], learningObjective: 'Give examples of homeostatic mechanisms in the human body',
  },

  // ══════════════════════════════════════════════════════════════════
  // STRAND 2: ANATOMY AND PHYSIOLOGY OF PLANTS
  // ══════════════════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Plants', subStrand: 'Nutrition in Plants (Photosynthesis)',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Write the overall equation for photosynthesis and identify where each stage takes place in the chloroplast.',
    answerGuide: 'Equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂ (2 marks — 1 for reactants, 1 for products). Light-dependent stage: occurs in the thylakoid membranes/grana — light splits water, producing ATP and NADPH (1 mark). Light-independent stage (Calvin cycle): occurs in the stroma — CO₂ is fixed using ATP and NADPH to produce glucose (1 mark).',
    tags: ['photosynthesis', 'equation', 'chloroplast', 'thylakoid', 'stroma'], learningObjective: 'Write the photosynthesis equation and identify where each stage occurs',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Plants', subStrand: 'Nutrition in Plants (Photosynthesis)',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'State FOUR factors that can limit the rate of photosynthesis in a maize plant growing in a Kenyan farm.',
    answerGuide: 'Award 1 mark each for any four of: (1) Light intensity — reduced light (e.g. cloud cover or shade from other plants) slows photosynthesis. (2) Carbon dioxide concentration — low CO₂ in air limits the Calvin cycle. (3) Water availability — drought conditions limit the supply of water as a raw material. (4) Temperature — very high (>40°C) or low (<10°C) temperatures reduce enzyme activity involved in photosynthesis. (5) Chlorophyll content — yellowing/chlorosis of leaves reduces ability to absorb light.',
    tags: ['photosynthesis', 'limiting-factors', 'light', 'temperature', 'CO2', 'Kenya'], learningObjective: 'Identify factors that limit the rate of photosynthesis',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Plants', subStrand: 'Transport in Plants',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Describe how water moves from the soil into the root hair cells and then up the xylem to the leaves.',
    answerGuide: 'Water in the soil has a higher water potential than inside the root hair cell (1 mark). Water enters the root hair by osmosis — from high water potential (soil) to low water potential (root hair) (1 mark). Water then moves through cortex cells by osmosis toward the xylem (1 mark). In the xylem, water is pulled up as a continuous column by the transpiration pull — evaporation of water from leaf stomata creates a negative pressure that pulls water upward (1 mark).',
    tags: ['water-transport', 'osmosis', 'xylem', 'transpiration-pull', 'root-hair'], learningObjective: 'Describe water movement from soil through the plant via osmosis and transpiration pull',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Plants', subStrand: 'Gaseous Exchange and Respiration in Plants',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Distinguish between aerobic and anaerobic respiration in plants. Give the equation for each.',
    answerGuide: 'Aerobic respiration: occurs in the presence of oxygen (1 mark). Equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (36–38 ATP) (1 mark). Anaerobic respiration (fermentation): occurs in the absence of oxygen (1 mark). Equation (in plants/yeast): C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ + ATP (2 ATP) (1 mark). Key difference: aerobic produces more ATP and complete breakdown; anaerobic produces less ATP and ethanol.',
    tags: ['aerobic-respiration', 'anaerobic-respiration', 'equation', 'ATP', 'plants'], learningObjective: 'Distinguish aerobic from anaerobic respiration with equations',
  },

  // ══════════════════════════════════════════════════════════════════
  // STRAND 3: ANATOMY AND PHYSIOLOGY OF ANIMALS
  // ══════════════════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Animals', subStrand: 'Nutrition in Animals (Digestion)',
    questionType: 'long_answer', difficulty: 'hard', marks: 20,
    questionText: '(a) List the main parts of the human alimentary canal in the correct order. (5 marks)\n(b) Describe the process of digestion that takes place in the stomach. Include in your answer: the type of food digested, the enzyme involved, and the role of hydrochloric acid. (8 marks)\n(c) Explain how the small intestine is structurally adapted to its function of absorption. (7 marks)',
    answerGuide: '(a) Correct order (1 mark each): Mouth → Oesophagus → Stomach → Small intestine (duodenum, jejunum, ileum) → Large intestine (colon) → Rectum → Anus. (b) Stomach digestion (8 marks): Food type: proteins/polypeptides digested in the stomach (1 mark). Enzyme: pepsin (protease) — produced as inactive pepsinogen, activated by HCl (2 marks). Role of HCl: provides acidic pH 2 optimal for pepsin activity (1 mark); kills bacteria in food preventing infection (1 mark); denatures proteins making them susceptible to enzyme action (1 mark). Stomach also churns food mechanically into chyme (1 mark). Gastric lipase — begins lipid digestion (1 mark). (c) Adaptations (7 marks): Long length — provides large surface area and time for absorption (1 mark); Villi — finger-like projections greatly increase surface area (1 mark); Microvilli (brush border) — further increase surface area (1 mark); Rich blood supply — maintains concentration gradient for efficient absorption (1 mark); Thin epithelial cells — short diffusion distance (1 mark); Lacteals — absorb fatty acids and glycerol into lymphatic system (1 mark); Goblet cells producing mucus — protect lining and aid movement of food (1 mark).',
    tags: ['digestion', 'alimentary-canal', 'stomach', 'small-intestine', 'adaptation', 'Section-B'], learningObjective: 'Describe digestion in the stomach and adaptations of the small intestine',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Animals', subStrand: 'Nutrition in Animals (Digestion)',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'List the main parts of the human alimentary canal in the correct order from mouth to anus.',
    answerGuide: 'Award 1 mark each for correct order: (1) Mouth/buccal cavity. (2) Oesophagus/gullet. (3) Stomach. (4) Small intestine (duodenum, jejunum, ileum). (5) Large intestine (caecum, colon, rectum). Accept "anus" as the exit point. Deduct 1 mark if order is incorrect.',
    tags: ['alimentary-canal', 'digestive-system', 'order', 'mouth-to-anus'], learningObjective: 'List the parts of the human alimentary canal in correct order',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Animals', subStrand: 'Transport in Animals',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'Describe the components of blood and state the function of each component.',
    answerGuide: 'Award 1 mark for naming + 1 mark for function (3 pairs): (1) Red blood cells (erythrocytes) — carry oxygen from lungs to tissues using haemoglobin; carry carbon dioxide back. (2) White blood cells (leucocytes) — fight infection by producing antibodies (lymphocytes) or engulfing pathogens (phagocytes). (3) Platelets (thrombocytes) — involved in blood clotting to prevent excess bleeding. (4) Plasma — liquid component that transports nutrients, hormones, waste products and antibodies. Award any 3 complete answers for 6 marks.',
    tags: ['blood', 'components', 'red-blood-cells', 'white-blood-cells', 'plasma', 'platelets'], learningObjective: 'Describe the components and functions of blood',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Animals', subStrand: 'Gaseous Exchange and Respiration in Animals',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Explain how the alveoli are adapted for efficient gaseous exchange in the human lungs.',
    answerGuide: 'Award 1 mark each for any four of: (1) Large surface area — millions of alveoli provide a huge surface for gas exchange. (2) Thin walls (one cell thick) — short diffusion distance for O₂ and CO₂. (3) Rich blood supply (capillary network) — maintains steep concentration gradient for rapid diffusion. (4) Moist surface — gases dissolve in the moisture to diffuse across the membrane. (5) Good ventilation — breathing constantly replenishes fresh air, maintaining concentration gradient.',
    tags: ['alveoli', 'gaseous-exchange', 'adaptation', 'diffusion', 'lungs'], learningObjective: 'Explain the adaptations of alveoli for efficient gaseous exchange',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Animals', subStrand: 'Gaseous Exchange and Respiration in Animals',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    questionText: 'Describe what happens during inhalation (breathing in) in the human respiratory system.',
    answerGuide: 'During inhalation: the diaphragm contracts and flattens (1 mark); the intercostal muscles contract, pulling the ribcage upward and outward (1 mark); the volume of the thoracic cavity increases, causing the air pressure inside the lungs to decrease below atmospheric pressure, so air rushes into the lungs (1 mark).',
    tags: ['inhalation', 'breathing', 'diaphragm', 'ribcage', 'pressure'], learningObjective: 'Describe the mechanism of inhalation in the human respiratory system',
  },

  // ── Additional structured questions ───────────────────────────────

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Explain why enzymes are described as "specific" in their action. Use the lock and key model to support your answer.',
    answerGuide: 'Each enzyme has a uniquely shaped active site (1 mark). Only a substrate with a complementary shape can fit into the active site (1 mark). Like a lock and key — only the correct key (substrate) fits the lock (enzyme active site) (1 mark). This means each enzyme can only catalyse one specific type of reaction e.g. amylase only breaks down starch, not proteins (1 mark).',
    tags: ['enzyme-specificity', 'active-site', 'lock-and-key', 'substrate'], learningObjective: 'Explain enzyme specificity using the lock and key model',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Chemicals of Life',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Explain the importance of water as a biological molecule. Give FOUR reasons.',
    answerGuide: 'Award 1 mark each for any four of: (1) Universal solvent — dissolves many substances, enabling chemical reactions in cells. (2) Transport medium — substances dissolve in blood plasma/sap for transport. (3) Reactant — used in hydrolysis reactions and photosynthesis. (4) Temperature regulation — high specific heat capacity prevents rapid temperature changes. (5) Lubrication — mucus and joint fluid reduce friction. (6) Habitat for aquatic organisms.',
    tags: ['water', 'biological-importance', 'solvent', 'transport'], learningObjective: 'Explain the biological importance of water',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Plants', subStrand: 'Transport in Plants',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Distinguish between the functions of xylem and phloem in plants.',
    answerGuide: 'Xylem (2 marks): transports water and dissolved mineral salts from the roots upward to the leaves and shoots (1 mark); made of dead hollow cells forming continuous tubes — movement is one-directional upward (1 mark). Phloem (2 marks): transports dissolved food/sugars (mainly sucrose) from the leaves (source) to other parts of the plant (sink) (1 mark); made of living sieve tube cells — movement is bidirectional (up and down) (1 mark).',
    tags: ['xylem', 'phloem', 'transport', 'distinction', 'plants'], learningObjective: 'Distinguish between xylem and phloem in terms of structure and function',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Explain the concept of cell specialisation. Give TWO examples of specialised cells in the human body and explain how their structure is adapted to their function.',
    answerGuide: 'Cell specialisation: the process by which cells develop specific structures and features to perform particular functions efficiently (1 mark). Example 1: Red blood cells — biconcave shape provides large surface area for oxygen loading; no nucleus, providing more space for haemoglobin (2 marks — 1 for structure + 1 for function adaptation). Example 2: Nerve cells (neurons) — long axons for transmitting electrical impulses over long distances; myelin sheath insulates and speeds up impulse conduction (1 mark).',
    tags: ['cell-specialisation', 'red-blood-cells', 'neurons', 'adaptation'], learningObjective: 'Explain cell specialisation with examples from the human body',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Cell Biology and Biodiversity', subStrand: 'Cell Structure and Specialisation',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    questionText: 'Describe the steps for preparing a temporary slide of onion epidermal cells for observation under a light microscope.',
    answerGuide: 'Award 1 mark each for any three steps in logical order: (1) Place a clean glass slide on the bench. (2) Add a drop of water or stain (e.g. iodine solution) to the centre of the slide. (3) Peel a thin layer of onion epidermis using forceps. (4) Place the epidermis on the drop of water on the slide, spreading it flat. (5) Lower a coverslip at an angle to avoid air bubbles. (6) Remove excess stain/water using blotting paper. (7) View under the microscope — start with low power objective then increase magnification.',
    tags: ['microscope', 'temporary-slide', 'onion', 'practical', 'steps'], learningObjective: 'Describe steps for preparing a temporary microscope slide',
  },

  {
    grade: 'Grade 10', subject: 'Biology',
    strand: 'Anatomy and Physiology of Animals', subStrand: 'Nutrition in Animals (Digestion)',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'Describe the role of THREE digestive enzymes in the human digestive system. For each, state where it is produced, what it acts on, and what product it produces.',
    answerGuide: 'Award 2 marks each (produced + substrate + product) for any three: (1) Salivary amylase — produced in salivary glands; acts on starch; produces maltose. (2) Pepsin — produced in stomach (as pepsinogen); acts on proteins; produces peptides/polypeptides. (3) Pancreatic lipase — produced in pancreas; acts on lipids/fats; produces fatty acids and glycerol. (4) Pancreatic amylase — pancreas; starch; maltose. (5) Trypsin — pancreas; proteins/polypeptides; shorter peptides. (6) Maltase — small intestine; maltose; glucose. Award 2 marks per enzyme with all three elements correct.',
    tags: ['digestive-enzymes', 'amylase', 'pepsin', 'lipase', 'digestion'], learningObjective: 'Describe digestive enzymes including where produced, substrate and product',
  },
];

async function seedBiology() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    let inserted = 0;
    let skipped = 0;

    for (const q of biologyQuestions) {
      const exists = await QuestionBank.findOne({
        questionText: q.questionText,
        subject: q.subject,
        grade: q.grade,
      });
      if (exists) {
        skipped++;
      } else {
        await QuestionBank.create(q);
        inserted++;
      }
    }

    console.log(`\n✅ Inserted ${inserted} new Biology questions`);
    console.log(`⏭️  Skipped ${skipped} duplicates`);

    // Breakdown by substrand
    const stats = await QuestionBank.aggregate([
      { $match: { subject: 'Biology', grade: 'Grade 10' } },
      { $group: { _id: '$subStrand', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    console.log('\nBiology Grade 10 — by sub-strand:');
    stats.forEach(s => console.log(`  ${s._id}: ${s.count}`));

    const total = await QuestionBank.countDocuments();
    console.log(`\n📚 Total questions in bank: ${total}`);
    console.log('\n🎉 Biology seed complete!');

  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedBiology();
