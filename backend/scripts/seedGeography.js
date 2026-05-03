/**
 * ExamsForge — Geography Grade 10 Seed Script
 * Source: Real Grade 10 Geography papers 2026 (KCBE Senior School)
 * 100 questions covering all 3 strands:
 *   Strand 1: Practical Geography (Map Work, Statistics, GIS)
 *   Strand 2: Natural Systems and Processes (Rocks, Earth Movements, Vulcanicity, Earthquakes)
 *   Strand 3: Human and Economic Activities (Agriculture, Mining, Energy, Industry)
 *
 * Run on Render Shell:
 *   node scripts/seedGeography.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const QuestionBank = require('../models/QuestionBank');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/examsforge';

const questions = [

  // ══════════════════════════════════════════════════════
  // STRAND 1: PRACTICAL GEOGRAPHY
  // Sub-strand 1.0: Introduction to Geography
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Introduction to Geography',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Define Geography as a learning area.',
    answerGuide: 'Geography is the scientific study of the Earth as the home of humankind. It is the study of interrelationships between natural and human phenomena on the Earth\'s surface — 2 marks (1 for each key element).',
    tags: ['definition', 'introduction', 'branches'],
    learningObjective: 'Define Geography as a subject of study',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Introduction to Geography',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Name and briefly describe the THREE main branches of Geography.',
    answerGuide: '(1) Physical Geography — deals with the natural physical environment, covering geology, geomorphology, climatology, pedology, biogeography, hydrology — 1 mark. (2) Human and Economic Geography — study of people and their activities including mining, agriculture, industry, tourism — 1 mark. (3) Practical Geography — equips learners with practical skills covering map work, fieldwork, statistics, GIS, photograph interpretation — 1 mark.',
    tags: ['branches', 'physical', 'human', 'practical'],
    learningObjective: 'Identify the main branches of Geography',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Introduction to Geography',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'Name two physical features that can be identified in the natural environment during a Geography field trip.',
    answerGuide: 'Any 2 of: mountains/hills, valleys, rivers/lakes, plains/plateaus, escarpments, volcanic features, coastal features — 1 mark each.',
    tags: ['physical features', 'fieldwork', 'environment'],
    learningObjective: 'Identify physical features in the natural environment',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Introduction to Geography',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'State two aspects studied under Human Geography.',
    answerGuide: 'Any 2 of: population/settlement, agriculture, mining, energy, industry, trade, transport, tourism, forestry, fishing — 1 mark each.',
    tags: ['human geography', 'aspects'],
    learningObjective: 'Identify aspects studied under Human Geography',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Introduction to Geography',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'State two factors a learner should consider when choosing a Geography-related career.',
    answerGuide: 'Any 2 of: personal interest/passion; academic ability/grades; available job opportunities; market demand; financial rewards; skills and talents; availability of training institutions; parental guidance — 1 mark each.',
    tags: ['careers', 'geography', 'factors'],
    learningObjective: 'Identify factors to consider when choosing a Geography career',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Introduction to Geography',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Give two reasons why studying Geography is important.',
    answerGuide: 'Any 2 of: facilitates good relationships among nations; is a career subject; enables us to appreciate others\' ways of life; enables conservation of the environment; promotes wise use of resources; inculcates cooperation and patience; promotes tourism industry; develops spatial thinking skills — 1 mark each.',
    tags: ['importance', 'geography', 'reasons'],
    learningObjective: 'Explain the importance of studying Geography',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Introduction to Geography',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Explain the relationship between Geography and the following subjects:\n(a) Mathematics (2 marks)\n(b) History and Citizenship (2 marks)\n(c) Agriculture (2 marks)',
    answerGuide: '(a) Mathematics: mathematical techniques used to draw graphs, pie charts; formulae used to calculate distances, areas, population density, gradient — 2 marks. (b) History: uses geographical tools like maps, charts, graphs to show where past events occurred; helps trace movement of people — 2 marks. (c) Agriculture: Geography studies farming systems, their distribution, and factors affecting farming activities including climate, relief, soil types — 2 marks.',
    tags: ['relationship', 'interdisciplinary', 'maths', 'history', 'agriculture'],
    learningObjective: 'Explain the relationship between Geography and other subjects',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Introduction to Geography',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'Explain the relationship between Geography and Physics.',
    answerGuide: 'Geography uses Physics principles and formulae to calculate and describe aspects such as magnetic field, gravity, vibrations of the earth (seismology), velocity of waves — 2 marks.',
    tags: ['physics', 'relationship', 'geography'],
    learningObjective: 'Explain the relationship between Geography and Physics',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 1: PRACTICAL GEOGRAPHY
  // Sub-strand 1.1: Map Reading and Interpretation
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'short_answer', difficulty: 'easy', marks: 1,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Define a map.',
    answerGuide: 'A map is a drawing or representation of the Earth\'s surface or part of it, drawn to scale on a flat surface, showing selected features — 1 mark.',
    tags: ['map', 'definition', 'cartography'],
    learningObjective: 'Define a map',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'State two methods of representing relief on a topographical map.',
    answerGuide: 'Any 2 of: contour lines; hachures; layer/colour tinting; hill shading/spot shading; trigonometric stations/spot heights; cliff symbols — 1 mark each.',
    tags: ['relief', 'contours', 'topographic map', 'representation'],
    learningObjective: 'Describe methods of representing relief on topographic maps',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Identify and distinguish between TWO types of map scales.',
    answerGuide: 'Any 2 of: Statement/Direct scale (e.g. "1 cm represents 1 km") — states scale in words; Representative Fraction/RF scale (e.g. 1:50 000) — shows ratio of map distance to ground distance; Linear/Graphical scale — a drawn line divided into units — 1 mark each.',
    tags: ['map scale', 'RF', 'statement scale', 'linear scale'],
    learningObjective: 'Identify and use different types of map scales',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Convert the following Representative Fraction (RF) scale to a Direct Statement scale:\n1 : 50 000',
    answerGuide: '1 : 50 000 means 1 cm on the map = 50 000 cm on the ground — 1 mark. 50 000 cm ÷ 100 = 500 m — 1 mark. Therefore: 1 cm represents 500 m (or 0.5 km) — 1 mark.',
    tags: ['scale conversion', 'RF', 'direct statement', 'map scale'],
    learningObjective: 'Convert map scales from RF to direct statement',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'short_answer', difficulty: 'easy', marks: 1,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'A person who designs and reads maps is known as a ___________.',
    answerGuide: 'Cartographer — 1 mark.',
    tags: ['cartographer', 'map', 'career'],
    learningObjective: 'Identify the profession associated with map making',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Define the following map terms:\n(a) Contour interval (1 mark)\n(b) Spot height (1 mark)\n(c) Gradient (1 mark)',
    answerGuide: '(a) Contour interval: the vertical difference in height between two adjacent contour lines — 1 mark. (b) Spot height: the exact height of a specific point on a map, shown by a dot and a number — 1 mark. (c) Gradient: the steepness of a slope, calculated as vertical interval ÷ horizontal equivalent — 1 mark.',
    tags: ['contour interval', 'spot height', 'gradient', 'map terms'],
    learningObjective: 'Define key map reading terms',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'structured', difficulty: 'hard', marks: 3,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term', 'Mock'],
    questionText: 'Calculate the gradient between a ridge top at 1,640 m and a valley floor at 1,050 m if the horizontal distance between them is 3 km.',
    answerGuide: 'Vertical interval (VI) = 1,640 − 1,050 = 590 m — 1 mark. Horizontal equivalent (HE) = 3 km = 3,000 m — 1 mark. Gradient = VI/HE = 590/3000 = 1/5.08 ≈ 1 in 5 (or express as 1:5) — 1 mark.',
    tags: ['gradient', 'calculation', 'vertical interval', 'horizontal equivalent'],
    learningObjective: 'Calculate gradient from given map data',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'short_answer', difficulty: 'medium', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Describe the dendritic drainage pattern and state where it commonly occurs.',
    answerGuide: 'Dendritic drainage: tributaries join the main river at acute angles, resembling the branches of a tree — 1 mark. It occurs in areas of uniform geology/rock type (e.g. clay plains, horizontal sedimentary rocks) where the rock offers equal resistance — 1 mark.',
    tags: ['dendritic', 'drainage pattern', 'rivers'],
    learningObjective: 'Describe types of drainage patterns',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'short_answer', difficulty: 'medium', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Name the type of settlement pattern found in nucleated (clustered) settlements and state TWO factors that cause it.',
    answerGuide: 'Nucleated/clustered settlement — 1 mark (accept any synonym). Any 2 causes: need for security/defence; availability of water; fertile land; presence of a market or religious site; transport junction; mining site — 1 mark each.',
    tags: ['settlement', 'nucleated', 'clustered', 'factors'],
    learningObjective: 'Describe settlement patterns and their causes',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term'],
    questionText: 'Study the map extract of Kitale area and answer the following:\n(a) Name the type of settlement pattern shown around Kitale town. (1 mark)\n(b) Give ONE reason why this settlement pattern may have developed there. (1 mark)\n(c) State TWO economic activities likely to be found in the mapped area, giving ONE piece of map evidence for each. (2 marks)',
    answerGuide: '(a) Nucleated/linear settlement — 1 mark. (b) Any valid reason: transport junction; available services; fertile soils; water source; commercial centre — 1 mark. (c) Any 2 with evidence: agriculture (farms shown on map); trade (market symbols); transport (roads, railway); mining (mine symbols) — 1 mark each.',
    tags: ['settlement', 'Kitale', 'economic activities', 'map evidence'],
    learningObjective: 'Interpret settlement patterns and economic activities from a map',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'structured', difficulty: 'hard', marks: 5,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term', 'Mock'],
    questionText: 'Study the topographic map extract of Tambach (1:50,000 Sheet 90/3) and answer the following:\n(a) Identify TWO types of scale used on the map. (2 marks)\n(b) Identify THREE relief features found at grid square 0581. (3 marks)',
    answerGuide: '(a) Any 2 of: representative fraction scale (1:50,000); linear/graphical scale; statement scale — 1 mark each. (b) Any 3 relief features visible at that grid square e.g. hills, valleys, escarpments, ridges, plains — 1 mark each.',
    tags: ['Tambach', 'topographic map', 'relief features', 'scale'],
    learningObjective: 'Read and interpret topographic map features',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term'],
    questionText: 'State TWO uses of map reading and interpretation skills for national development.',
    answerGuide: 'Any 2 of: planning land use; infrastructure development (roads, railways); identifying settlement areas; managing natural resources; planning irrigation; disaster risk management; military purposes; boundary demarcation — 1 mark each.',
    tags: ['map reading', 'national development', 'uses'],
    learningObjective: 'Explain uses of map reading skills for national development',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 1: PRACTICAL GEOGRAPHY
  // Sub-strand 1.2: Statistical Methods
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Statistical Methods',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'A farmer harvested the following number of bags of maize over nine consecutive days:\n25, 30, 20, 25, 30, 40, 25, 35, 20\n(a) Calculate the mean number of bags harvested. (2 marks)\n(b) Determine the median of the data. (2 marks)\n(c) Identify the mode. (1 mark)',
    answerGuide: '(a) Mean = (25+30+20+25+30+40+25+35+20) ÷ 9 = 250 ÷ 9 = 27.8 bags — 2 marks (1 for adding, 1 for dividing correctly). (b) Arrange in order: 20, 20, 25, 25, 25, 30, 30, 35, 40; Median = 5th value = 25 bags — 2 marks (1 for arranging, 1 for correct answer). (c) Mode = 25 bags (appears 3 times) — 1 mark.',
    tags: ['mean', 'median', 'mode', 'statistics', 'calculation'],
    learningObjective: 'Calculate measures of central tendency from geographical data',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Statistical Methods',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'The table below shows the population of four towns in Nakuru County in 2023:\nMolo: 45,000; Njoro: 60,000; Naivasha: 85,000; Gilgil: 35,000\n(a) Construct a simple bar graph to represent this data. (4 marks)\n(b) State TWO merits of using a bar graph to present geographical data. (2 marks)',
    answerGuide: '(a) Correct title (1 mark); correct axes labels with units (1 mark); accurate bars drawn to scale (1 mark); bars evenly spaced (1 mark). (b) Any 2: easy to read and interpret; allows direct comparison between values; simple to construct; clear visual impression; easy to identify highest and lowest values — 1 mark each.',
    tags: ['bar graph', 'population', 'statistics', 'data presentation'],
    learningObjective: 'Construct and interpret bar graphs from geographical data',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Statistical Methods',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'State TWO methods of data collection used in geographical fieldwork OTHER THAN questionnaires.',
    answerGuide: 'Any 2 of: observation/field observation; interviews; photography; counting/tallying; measurement; sampling; documentary review; use of instruments (rain gauge, thermometer) — 1 mark each.',
    tags: ['data collection', 'fieldwork', 'methods'],
    learningObjective: 'Identify methods of data collection in fieldwork',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Statistical Methods',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'List TWO disadvantages of using questionnaires as a method of data collection in geographical fieldwork.',
    answerGuide: 'Any 2 of: some respondents may not answer honestly; low response rate for posted questionnaires; not suitable for illiterate respondents; time consuming to design; may be misinterpreted; some questions may be left unanswered — 1 mark each.',
    tags: ['questionnaires', 'disadvantages', 'data collection'],
    learningObjective: 'Evaluate the disadvantages of questionnaires in fieldwork',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Statistical Methods',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'Identify TWO methods of data presentation used in Geography.',
    answerGuide: 'Any 2 of: bar graphs; pie charts/divided circles; line graphs; dot maps; choropleth maps; proportional symbols; histograms; flow lines; tables; pictographs — 1 mark each.',
    tags: ['data presentation', 'graphs', 'statistics'],
    learningObjective: 'Identify methods of data presentation in Geography',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Statistical Methods',
    questionType: 'short_answer', difficulty: 'medium', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'Outline TWO limitations of using statistics to explain geographical facts.',
    answerGuide: 'Any 2 of: statistics may be outdated; may not show spatial distribution; may be misinterpreted; averages can be misleading; cannot show quality; data collection may have errors; may hide regional variations — 1 mark each.',
    tags: ['statistics', 'limitations', 'geography'],
    learningObjective: 'Evaluate limitations of statistical methods in Geography',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 1: PRACTICAL GEOGRAPHY
  // Sub-strand 1.3: GIS/GPS/Remote Sensing
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'GIS and Remote Sensing',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Geospatial technologies are divided into two main types. Name them.',
    answerGuide: '(1) Geographic Information Systems (GIS) — 1 mark. (2) Remote Sensing (including GPS) — 1 mark.',
    tags: ['GIS', 'remote sensing', 'geospatial technology'],
    learningObjective: 'Identify types of geospatial technologies',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'GIS and Remote Sensing',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: '(a) Define Geographic Information Systems (GIS). (2 marks)\n(b) State TWO uses of GIS in Kenya today. (2 marks)',
    answerGuide: '(a) GIS is a computer-based system designed to capture, store, manipulate, analyse, manage, and display spatial or geographical data — 2 marks. (b) Any 2: land use planning; disaster management; natural resource mapping; environmental monitoring; population mapping; infrastructure planning; disease surveillance; electoral mapping — 1 mark each.',
    tags: ['GIS', 'definition', 'uses', 'Kenya'],
    learningObjective: 'Define GIS and explain its uses in Kenya',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 2: NATURAL SYSTEMS AND PROCESSES
  // Sub-strand: Rocks
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Rocks',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: '(a) Name and explain the process by which igneous rocks are formed. (2 marks)\n(b) Describe the process of metamorphism and give ONE example each of:\n(i) A rock formed from an igneous rock by metamorphism (1 mark)\n(ii) A rock formed from a sedimentary rock by metamorphism (1 mark)\n(c) State TWO economic importances of rocks and minerals to Kenya. (1 mark)',
    answerGuide: '(a) Igneous rocks form through crystallisation of magma (molten rock): when magma cools and solidifies either inside the earth (intrusive) or on the surface (extrusive/volcanic) — 2 marks. (b) Metamorphism: transformation of existing rocks by heat, pressure, or chemical action: (i) Granite → Gneiss — 1 mark; (ii) Limestone → Marble or Shale → Slate — 1 mark. (c) Any 2: source of building materials (quarrying); tourism attraction (scenic features); source of minerals for mining; soil formation — 1 mark each.',
    tags: ['igneous rocks', 'metamorphic', 'rock cycle', 'formation'],
    learningObjective: 'Describe rock formation processes and economic importance',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Rocks',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Explain the difference between intrusive and extrusive igneous rocks, giving ONE example of each.',
    answerGuide: 'Intrusive/plutonic rocks: formed when magma cools slowly deep inside the earth; have large crystals due to slow cooling; e.g. granite — 1.5 marks. Extrusive/volcanic rocks: formed when lava cools rapidly on the earth\'s surface; have small crystals or glassy texture; e.g. basalt, obsidian, pumice — 1.5 marks.',
    tags: ['intrusive', 'extrusive', 'igneous', 'granite', 'basalt'],
    learningObjective: 'Distinguish between intrusive and extrusive igneous rocks',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Rocks',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term'],
    questionText: '(a) Define the term "soil profile" and draw a labelled diagram showing at least THREE horizons. (3 marks)\n(b) Describe THREE types of physical (mechanical) weathering, giving an example of where each commonly occurs in Kenya. (3 marks)',
    answerGuide: '(a) Soil profile: a vertical cross-section of soil from surface to bedrock showing layers called horizons — 1 mark. Diagram showing: O horizon (organic/humus), A horizon (topsoil), B horizon (subsoil), C horizon (parent material), R horizon (bedrock) — 2 marks for correct labelled diagram. (b) Any 3: Freeze-thaw/frost action (high altitude areas — Aberdares, Mt Kenya); Exfoliation/onion peeling (hot deserts — Northern Kenya); Block disintegration (arid areas); Root wedging (forests); Salt crystallisation (coastal areas) — 1 mark each.',
    tags: ['soil profile', 'horizons', 'weathering', 'physical weathering', 'Kenya'],
    learningObjective: 'Describe soil profile and types of physical weathering in Kenya',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Rocks',
    questionType: 'short_answer', difficulty: 'medium', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'Explain how climate influences the rate of chemical weathering.',
    answerGuide: 'High temperature increases the rate of chemical reactions (e.g. hydrolysis, oxidation) in rocks — 1 mark. High rainfall/humidity provides water for hydration and solution and carbonic acid for carbonation, speeding up chemical weathering — 1 mark.',
    tags: ['chemical weathering', 'climate', 'temperature', 'rainfall'],
    learningObjective: 'Explain the influence of climate on chemical weathering',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Rocks',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'State TWO ways in which human activities lead to soil degradation.',
    answerGuide: 'Any 2 of: deforestation leading to erosion; overgrazing removing vegetation cover; poor cultivation methods (ploughing on steep slopes); use of chemicals depleting soil nutrients; monoculture depleting specific nutrients; construction activities removing topsoil — 1 mark each.',
    tags: ['soil degradation', 'human activities', 'erosion'],
    learningObjective: 'Identify ways human activities cause soil degradation',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 2: NATURAL SYSTEMS AND PROCESSES
  // Sub-strand: Earth Movements and Folding
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Earth Movements',
    questionType: 'long_answer', difficulty: 'hard', marks: 8,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term', 'Mock'],
    questionText: 'Explain how the theory of plate tectonics accounts for the formation of the following:\n(a) Fold mountains (3 marks)\n(b) Ocean trenches (3 marks)\n(c) State TWO pieces of evidence that support the theory of plate tectonics. (2 marks)',
    answerGuide: '(a) Fold mountains: two continental plates converge/collide; the rock layers between them are compressed and buckled; layers fold upwards forming mountain chains e.g. Himalayas, Alps, Andes — 3 marks. (b) Ocean trenches: oceanic plate collides with continental plate; the denser oceanic crust subducts (sinks) under continental crust; forms a deep trench at subduction zone e.g. Mariana Trench — 3 marks. (c) Any 2: jigsaw fit of continents (especially Africa and S. America); similar fossil records on separated continents; similar rock types across oceans; mid-ocean ridges and seafloor spreading; palaeomagnetism evidence — 1 mark each.',
    tags: ['plate tectonics', 'fold mountains', 'ocean trenches', 'evidence'],
    learningObjective: 'Explain landform formation using plate tectonics theory',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Earth Movements',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: '(a) Name the layer of the Earth that is directly responsible for plate movement and explain the mechanism involved. (2 marks)\n(b) Explain why East Africa experiences frequent earthquake activity with reference to plate tectonics. (3 marks)\n(c) State ONE use of earthquake waves in studying the Earth\'s interior. (1 mark)',
    answerGuide: '(a) The asthenosphere (part of the upper mantle) — 1 mark; convection currents in the asthenosphere cause plates to move — 1 mark. (b) East Africa lies on the East African Rift System; the African plate is splitting apart (diverging) along this rift; the movement causes frequent tremors and earthquakes; the Rift Valley is a result of this rifting — 3 marks. (c) Seismic waves travel through the Earth and their speed and direction change at different layers, allowing scientists to determine the Earth\'s internal structure — 1 mark.',
    tags: ['asthenosphere', 'plate movement', 'East Africa', 'rift', 'earthquakes'],
    learningObjective: 'Explain plate movement and East African earthquake activity',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Earth Movements',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term'],
    questionText: '(a) Describe THREE effects of earthquakes on human settlements and the economy. (3 marks)\n(b) State TWO measures used to reduce the effects of earthquakes on human settlements. (2 marks)',
    answerGuide: '(a) Any 3: destruction of buildings and infrastructure; loss of life and injury; fires started by ruptured gas/electricity lines; tsunamis causing flooding of coastal areas; disruption of transport and communication; psychological trauma; economic losses — 1 mark each. (b) Any 2: construction of earthquake-proof buildings; early warning systems; evacuation plans; education and preparedness drills; zoning laws preventing construction in high-risk areas — 1 mark each.',
    tags: ['earthquake effects', 'settlements', 'management'],
    learningObjective: 'Describe effects of earthquakes and management measures',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 2: NATURAL SYSTEMS AND PROCESSES
  // Sub-strand: Vulcanicity
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Vulcanicity',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: '(a) Distinguish between intrusive and extrusive vulcanicity, giving ONE landform formed by each. (4 marks)\n(b) State TWO positive effects of volcanic activity. (2 marks)',
    answerGuide: '(a) Intrusive vulcanicity: magma solidifies BELOW the earth\'s surface without reaching it; forms landforms such as batholiths, sills, dykes, laccoliths — 2 marks. Extrusive vulcanicity: magma (lava) reaches the earth\'s SURFACE; forms landforms such as volcanoes, lava plateaus, calderas — 2 marks. (b) Any 2: fertile volcanic soils for agriculture; tourist attraction (e.g. Mt Kenya, Longonot); source of geothermal energy (e.g. Olkaria); minerals associated with volcanic activity; formation of lakes — 1 mark each.',
    tags: ['vulcanicity', 'intrusive', 'extrusive', 'landforms'],
    learningObjective: 'Distinguish between intrusive and extrusive vulcanicity',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Vulcanicity',
    questionType: 'short_answer', difficulty: 'medium', marks: 3,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'Name THREE extrusive volcanic features found in Kenya.',
    answerGuide: 'Any 3 of: Mount Kenya; Mount Elgon; Longonot; Suswa; Menengai Crater; Homa Hills; Nyambeni Hills; Chyulu Hills; lava plateau of Athi Plains — 1 mark each.',
    tags: ['volcanic features', 'Kenya', 'extrusive'],
    learningObjective: 'Identify volcanic features found in Kenya',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 2: NATURAL SYSTEMS AND PROCESSES
  // Sub-strand: Climatology / Weather
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Environmental Geography', substrand: 'Climate Change',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term', 'Mock'],
    questionText: 'Study a climate graph for Nairobi showing monthly rainfall and temperature:\n(a) Describe the annual rainfall distribution and total for Nairobi. (2 marks)\n(b) Describe the temperature range and pattern throughout the year. (2 marks)\n(c) Calculate the annual temperature range given: hottest month = 22°C, coolest month = 14°C. (2 marks)',
    answerGuide: '(a) Nairobi has bimodal (two rainy seasons) rainfall — 1 mark; long rains March–May; short rains October–December; annual total approximately 800–1,000 mm — 1 mark. (b) Temperatures are moderate throughout the year due to altitude; hottest months are February–March; coolest months are July–August — 2 marks. (c) Temperature range = highest − lowest = 22 − 14 = 8°C — 2 marks.',
    tags: ['climate', 'Nairobi', 'rainfall', 'temperature', 'climate graph'],
    learningObjective: 'Interpret and describe climate data from graphs',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Environmental Geography', substrand: 'Climate Change',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: '(a) Define the term "drought" and explain TWO causes of drought in Kenya. (3 marks)\n(b) State ONE management strategy for drought in Kenya. (1 mark)',
    answerGuide: '(a) Drought: a prolonged period of abnormally low rainfall leading to shortage of water for people, animals, and crops — 1 mark. Causes: any 2 of: deforestation reducing rainfall; El Niño/La Niña effects; clearing of vegetation; overgrazing; climate change — 1 mark each. (b) Any 1: irrigation schemes; water harvesting; drought-resistant crop varieties; early warning systems; food reserves/strategic food stores — 1 mark.',
    tags: ['drought', 'causes', 'Kenya', 'management'],
    learningObjective: 'Define drought and explain its causes in Kenya',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 2: NATURAL SYSTEMS AND PROCESSES
  // Sub-strand: Population Geography
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Population',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'Study the population data below and answer the questions:\nAge Group | Population (millions)\n0–14 years (Young dependants) | 18.6\n15–64 years (Working population) | 31.2\n65+ years (Old dependants) | 2.4\n\n(a) Define the term "population pyramid" and state what information it conveys. (2 marks)\n(b) Calculate the dependency ratio. (3 marks)',
    answerGuide: '(a) Population pyramid: a bar graph showing the age-sex structure of a population — 1 mark; it conveys the proportion of males and females in different age groups, birth rates, death rates, and age structure — 1 mark. (b) Dependency ratio = (dependants ÷ working population) × 100; Dependants = 18.6 + 2.4 = 21 million — 1 mark; DR = (21 ÷ 31.2) × 100 = 67.3 — 2 marks.',
    tags: ['population pyramid', 'dependency ratio', 'age structure', 'calculation'],
    learningObjective: 'Define population pyramid and calculate dependency ratio',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Population',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term'],
    questionText: '(a) State the stage of the Demographic Transition Model (DTM) most developing African countries are currently in and give TWO reasons. (3 marks)\n(b) Explain the meaning of "natural population increase". (2 marks)',
    answerGuide: '(a) Stage 2 or early Stage 3 — 1 mark. Reasons: high birth rates due to cultural practices/lack of family planning; declining death rates due to improved healthcare; rapid population growth — 1 mark each for any 2. (b) Natural population increase: the difference between birth rate and death rate — 1 mark; when birth rate exceeds death rate, the population grows naturally without counting migration — 1 mark.',
    tags: ['DTM', 'demographic transition', 'natural increase', 'Africa'],
    learningObjective: 'Interpret the Demographic Transition Model',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Population',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term'],
    questionText: '(a) Define the term "urbanisation" and identify THREE factors that have led to rapid urbanisation in Kenya. (3 marks)\n(b) Distinguish between "push factors" and "pull factors" in rural–urban migration, giving ONE example of each. (2 marks)',
    answerGuide: '(a) Urbanisation: the process by which an increasing proportion of a country\'s population lives in towns and cities — 1 mark. Factors: rural–urban migration; natural increase in urban population; industrialisation; improved transport/infrastructure; government policies — 1 mark each for any 2. (b) Push factors: negative conditions that drive people away from rural areas e.g. drought, poverty, lack of employment — 1 mark. Pull factors: positive attractions in urban areas e.g. employment opportunities, better schools/hospitals, entertainment — 1 mark.',
    tags: ['urbanisation', 'Kenya', 'push factors', 'pull factors', 'migration'],
    learningObjective: 'Explain urbanisation and rural-urban migration factors in Kenya',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Population',
    questionType: 'short_answer', difficulty: 'medium', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'State TWO problems caused by a high dependency ratio in a developing country like Kenya.',
    answerGuide: 'Any 2 of: strain on government social services (schools, hospitals); high government expenditure on social welfare; low savings and investment; high poverty levels; reduced economic growth; high tax burden on working population — 1 mark each.',
    tags: ['dependency ratio', 'problems', 'development', 'Kenya'],
    learningObjective: 'Explain problems caused by high dependency ratio',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 3: HUMAN AND ECONOMIC ACTIVITIES
  // Sub-strand: Agriculture
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Agriculture',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: '(a) Distinguish between subsistence farming and commercial farming. (2 marks)\n(b) State FOUR factors that influence the type of farming practised in an area. (4 marks)',
    answerGuide: '(a) Subsistence farming: food is grown primarily for consumption by the farmer\'s family; little or no surplus — 1 mark. Commercial farming: crops/livestock are produced mainly for sale/profit; on a large scale — 1 mark. (b) Any 4: climate (rainfall and temperature); relief/topography; soil type and fertility; market availability; capital/finance; labour availability; government policies; transport/infrastructure; technology — 1 mark each.',
    tags: ['subsistence farming', 'commercial farming', 'factors', 'agriculture'],
    learningObjective: 'Distinguish farming types and identify factors influencing farming',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Agriculture',
    questionType: 'structured', difficulty: 'medium', marks: 8,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term', 'Mock'],
    questionText: '(a) Describe the characteristics of plantation farming as practised in Kenya. (4 marks)\n(b) Identify THREE crops grown on plantations in Kenya and state the main growing area for each. (3 marks)\n(c) State ONE problem facing plantation farming in Kenya. (1 mark)',
    answerGuide: '(a) Any 4: large scale monoculture; high capital investment; employed/paid labour; use of modern technology and machinery; production mainly for export; located near processing factories; well organised management — 1 mark each. (b) Any 3: Tea (Kericho/Nandi Hills); Coffee (Central Kenya/Thika); Sisal (Athi Plains/Tana River); Sugarcane (Kisumu/Mumias); Pyrethrum (Rift Valley) — 1 mark each. (c) Any 1: fluctuating world market prices; land pressure; labour disputes; soil exhaustion; competition from other countries — 1 mark.',
    tags: ['plantation farming', 'Kenya', 'tea', 'coffee', 'sisal', 'monoculture'],
    learningObjective: 'Describe plantation farming in Kenya',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Agriculture',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: '(a) Define the term "irrigation" and state TWO reasons why irrigation is practised in Kenya. (3 marks)\n(b) Name THREE irrigation schemes in Kenya and state the crop grown at each. (3 marks)',
    answerGuide: '(a) Irrigation: the artificial application of water to land to support crop growth — 1 mark. Reasons: to cultivate arid/semi-arid areas (ASAL); to increase crop production; to grow crops year-round regardless of rainfall season — 1 mark each for any 2. (b) Any 3: Mwea Tebere (rice); Perkerra (onions/irrigated farming); Hola/Tana Delta (rice/cotton); Galole (horticultural crops); Bura Irrigation Scheme (cotton/maize) — 1 mark each.',
    tags: ['irrigation', 'Kenya', 'schemes', 'crops', 'ASAL'],
    learningObjective: 'Explain irrigation farming in Kenya',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Agriculture',
    questionType: 'structured', difficulty: 'hard', marks: 10,
    isActive: true, timesUsed: 0,
    examType: ['End Term', 'Mock', 'Pre-Mock'],
    questionText: '(a) Explain FIVE factors that have favoured the growing of tea in the highlands of Kenya. (5 marks)\n(b) Describe the processing of tea from the farm to the finished product. (5 marks)',
    answerGuide: '(a) Any 5: well distributed rainfall (1,200–1,500mm); cool temperatures (14–26°C); deep, well-drained acidic soils; high altitude (1,500–2,700m); gentle to moderate slopes; heavy morning dew; available labour in highlands — 1 mark each. (b) Plucking two leaves and a bud; withering in troughs to reduce moisture; cutting, tearing, and curling (CTC)/rolling; fermentation/oxidation (changes colour to copper); drying/firing to remove moisture; sorting/grading; packaging — 1 mark each for any 5.',
    tags: ['tea farming', 'Kenya', 'highlands', 'processing', 'factors'],
    learningObjective: 'Explain tea farming and processing in Kenya',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 3: HUMAN AND ECONOMIC ACTIVITIES
  // Sub-strand: Mining
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Mining',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: '(a) Name THREE minerals mined in Kenya and state the main location where each is mined. (3 marks)\n(b) State THREE problems facing the mining industry in Kenya. (3 marks)',
    answerGuide: '(a) Any 3: Soda ash (Lake Magadi); Fluorspar (Kerio Valley); Salt (Malindi/Lake Magadi); Rubies/gemstones (Taita Hills); Limestone (Bamburi/Athi River); Gold (Migori/Western Kenya); Carbon dioxide (Esageri, Rift Valley) — 1 mark each. (b) Any 3: inadequate capital; lack of skilled labour; poor infrastructure; fluctuating mineral prices; environmental degradation; exhaustion of mineral deposits; competition from imported minerals — 1 mark each.',
    tags: ['mining', 'Kenya', 'minerals', 'problems'],
    learningObjective: 'Identify minerals mined in Kenya and challenges of mining',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Mining',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: '(a) Distinguish between open cast mining and shaft mining. (2 marks)\n(b) State ONE advantage of open cast mining over shaft mining. (1 mark)\n(c) State ONE disadvantage of open cast mining. (1 mark)',
    answerGuide: '(a) Open cast/surface mining: removal of minerals lying near the surface by stripping away overlying soil/rock — 1 mark. Shaft mining: sinking vertical shafts and horizontal tunnels to reach minerals deep underground — 1 mark. (b) Any 1: cheaper to operate; easier to use heavy machinery; safer (no underground dangers) — 1 mark. (c) Any 1: causes landscape scars; displaces communities; leads to soil erosion; difficult land reclamation — 1 mark.',
    tags: ['open cast mining', 'shaft mining', 'methods', 'advantages'],
    learningObjective: 'Distinguish between methods of mining',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 3: HUMAN AND ECONOMIC ACTIVITIES
  // Sub-strand: Energy
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Energy',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: '(a) Distinguish between renewable and non-renewable sources of energy, giving TWO examples of each. (4 marks)\n(b) State TWO advantages of geothermal energy as a source of power in Kenya. (2 marks)',
    answerGuide: '(a) Renewable energy: can be replenished naturally and used repeatedly; examples: solar, wind, hydroelectric, geothermal, biomass — 2 marks. Non-renewable energy: finite resources that cannot be replaced once used; examples: petroleum/oil, coal, natural gas, nuclear — 2 marks. (b) Any 2: clean/environmentally friendly; readily available (Kenya is in the Rift Valley); reliable and consistent output; reduces dependence on oil imports; creates employment; Kenya has Olkaria (largest geothermal plant in Africa) — 1 mark each.',
    tags: ['renewable energy', 'non-renewable', 'geothermal', 'Kenya', 'Olkaria'],
    learningObjective: 'Distinguish energy types and explain geothermal energy in Kenya',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Energy',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term'],
    questionText: '(a) Name THREE dams used to generate hydroelectric power (HEP) in Kenya. (3 marks)\n(b) State THREE conditions that favour the generation of HEP in Kenya. (3 marks)',
    answerGuide: '(a) Any 3: Masinga Dam; Kamburu Dam; Kindaruma Dam; Kiambere Dam; Gitaru Dam; Turkwel Gorge Dam; Sondu-Miriu — 1 mark each. (b) Any 3: fast-flowing rivers with large volume; suitable sites for dam construction (narrow gorges); reliable rainfall to maintain river flow; presence of escarpments creating waterfalls; government investment in infrastructure — 1 mark each.',
    tags: ['HEP', 'hydroelectric power', 'Kenya', 'dams', 'conditions'],
    learningObjective: 'Describe HEP generation in Kenya',
  },

  // ══════════════════════════════════════════════════════
  // STRAND 3: HUMAN AND ECONOMIC ACTIVITIES
  // Sub-strand: Industry
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Industry',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: '(a) Distinguish between light and heavy industries, giving ONE example of each found in Kenya. (4 marks)\n(b) State TWO factors that have led to the concentration of industries in Nairobi. (2 marks)',
    answerGuide: '(a) Light industries: use light raw materials; produce consumer goods; require less capital; e.g. textile/clothing industry, food processing, electronics assembly — 2 marks. Heavy industries: process bulky/heavy raw materials; require large capital investment; produce heavy goods; e.g. steel manufacturing, cement production, oil refining (Mombasa) — 2 marks. (b) Any 2: large market (population centre); good transport network; available labour force; government presence; financial/banking services; water supply; existing infrastructure — 1 mark each.',
    tags: ['light industry', 'heavy industry', 'Nairobi', 'Kenya', 'industrial location'],
    learningObjective: 'Distinguish between light and heavy industries in Kenya',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Industry',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    isActive: true, timesUsed: 0,
    examType: ['Midterm', 'End Term'],
    questionText: '(a) State FOUR factors that influence the location of an industry. (4 marks)\n(b) Give ONE example of an industry in Kenya that was located near its raw material source. (1 mark)',
    answerGuide: '(a) Any 4: availability of raw materials; power/energy supply; transport and communication; labour supply; market proximity; capital/finance; government policy; water supply; land availability; security — 1 mark each. (b) Any valid example: sugar factory (Mumias/Kisumu near sugarcane); cement factory (Athi River/Bamburi near limestone); tea factory (Kericho near tea plantations); Fluorspar processing plant (Kerio Valley) — 1 mark.',
    tags: ['industrial location', 'factors', 'Kenya', 'raw materials'],
    learningObjective: 'Identify factors influencing industrial location',
  },

  // ══════════════════════════════════════════════════════
  // LONG ANSWER / COMPREHENSIVE QUESTIONS
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Environmental Geography', substrand: 'Environmental Management',
    questionType: 'long_answer', difficulty: 'hard', marks: 10,
    isActive: true, timesUsed: 0,
    examType: ['End Term', 'Mock', 'Pre-Mock'],
    questionText: 'Climate change is one of the greatest environmental challenges facing Kenya today.\n(a) Define climate change. (2 marks)\n(b) Identify THREE human causes of climate change. (3 marks)\n(c) Describe FIVE effects of climate change on Kenya\'s environment and economy. (5 marks)',
    answerGuide: '(a) Long-term alteration of global temperature and weather patterns mainly due to human activities since industrialisation — 2 marks. (b) Any 3: burning fossil fuels releasing CO₂/greenhouse gases; deforestation reducing carbon absorption; industrial emissions; agricultural practices (methane from livestock); urbanisation and transport — 1 mark each. (c) Any 5: reduced rainfall and prolonged droughts affecting crop production; flooding in low-lying areas; melting glaciers on Mt Kenya; sea level rise affecting coastal areas (Mombasa); loss of biodiversity; disruption to tourism; food insecurity; spread of disease vectors; displacement of communities — 1 mark each.',
    tags: ['climate change', 'causes', 'effects', 'Kenya', 'environment'],
    learningObjective: 'Analyse causes and effects of climate change on Kenya',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Earth Movements',
    questionType: 'long_answer', difficulty: 'hard', marks: 10,
    isActive: true, timesUsed: 0,
    examType: ['End Term', 'Mock', 'Pre-Mock'],
    questionText: '(a) Describe the formation of the Great Rift Valley in East Africa. (5 marks)\n(b) Explain FIVE ways in which the Rift Valley is important to Kenya. (5 marks)',
    answerGuide: '(a) The Rift Valley formed due to tensional forces in the Earth\'s crust — 1 mark; the crust was pulled apart along parallel faults — 1 mark; the middle block (horst) sank down (graben) between the two fault escarpments — 1 mark; the process occurred over millions of years — 1 mark; accompanied by volcanic activity that created features like Mt Longonot and Menengai — 1 mark. (b) Any 5: geothermal energy (Olkaria); tourism (scenic features, wildlife, Rift Valley lakes); mineral resources (soda ash at Lake Magadi, fluorspar); agriculture (fertile valley floor soils); fresh water (Lakes Naivasha, Baringo); fishing (lakes in the rift); transport corridor — 1 mark each.',
    tags: ['Rift Valley', 'East Africa', 'formation', 'importance', 'Kenya'],
    learningObjective: 'Describe the Rift Valley formation and its importance to Kenya',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Population',
    questionType: 'long_answer', difficulty: 'hard', marks: 10,
    isActive: true, timesUsed: 0,
    examType: ['End Term', 'Mock', 'Pre-Mock'],
    questionText: '(a) Explain FIVE factors that influence the distribution of population in Kenya. (5 marks)\n(b) State FIVE problems caused by rapid population growth in Kenya. (5 marks)',
    answerGuide: '(a) Any 5: climate (people avoid arid/semi-arid areas); relief (highlands more densely populated); soils (fertile soils attract settlement); water availability; historical factors; government policy; economic activities; security; disease and pests — 1 mark each. (b) Any 5: high unemployment; shortage of social services (schools/hospitals); pressure on land; food insecurity/famine; environmental degradation; high dependency ratio; poor housing/slums; rising crime rates; strain on infrastructure — 1 mark each.',
    tags: ['population distribution', 'Kenya', 'factors', 'rapid growth', 'problems'],
    learningObjective: 'Explain population distribution and problems of growth in Kenya',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Agriculture',
    questionType: 'long_answer', difficulty: 'hard', marks: 10,
    isActive: true, timesUsed: 0,
    examType: ['End Term', 'Mock', 'Pre-Mock'],
    questionText: '(a) Explain FIVE reasons why food security remains a challenge in Kenya. (5 marks)\n(b) Describe FIVE measures the Kenyan government has taken to improve food security. (5 marks)',
    answerGuide: '(a) Any 5: unpredictable and inadequate rainfall; rapid population growth; poor farming methods/technology; land subdivision and fragmentation; post-harvest losses; poverty and lack of capital; climate change; soil degradation/erosion; insecurity in farming areas; pests and diseases — 1 mark each. (b) Any 5: irrigation schemes (Mwea, Bura, Hola); green revolution/improved seeds; fertiliser subsidies; establishment of NCPB for food reserves; agricultural extension services; land reform; food for work programmes; school feeding programmes; promotion of drought-resistant crops — 1 mark each.',
    tags: ['food security', 'Kenya', 'challenges', 'government measures'],
    learningObjective: 'Analyse food security challenges and government responses in Kenya',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'long_answer', difficulty: 'hard', marks: 10,
    isActive: true, timesUsed: 0,
    examType: ['End Term', 'Mock', 'Pre-Mock'],
    questionText: 'You have been provided with a topographic map extract of the Tambach area (1:50,000).\n(a) Give the six-figure grid reference for:\n(i) The school symbol on the map (1 mark)\n(ii) The trig station (1 mark)\n(b) Measure the length of dry weather road D329 from Chebokokwa junction to the northern edge of the map. Show your working. (2 marks)\n(c) Explain how THREE factors shown on the map have influenced settlement in the area. (3 marks)\n(d) State TWO drainage features visible in the area and name the drainage pattern. (2 marks)\n(e) Calculate the distance in km between Kitale town and Mwanda village using map scale 1:50,000. If the measured map distance is 4.5 cm, show your working. (1 mark)',
    answerGuide: '(a)(i) & (ii) Accept any valid 6-figure grid reference following correct method — 1 mark each. (b) Distance measured on map × scale = actual distance; e.g. if measured 6 cm: 6 × 50,000 = 300,000 cm = 3,000 m = 3 km — 2 marks. (c) Any 3: relief (settlements on gentler slopes); water (settlements near rivers); roads (settlements along transport routes); fertile soil — 1 mark each. (d) Any 2 drainage features; dendritic pattern — 2 marks. (e) 4.5 cm × 50,000 = 225,000 cm = 2,250 m = 2.25 km — 1 mark.',
    tags: ['topographic map', 'six-figure grid reference', 'distance measurement', 'settlement', 'drainage'],
    learningObjective: 'Read and interpret topographic map features comprehensively',
  },

  // ══════════════════════════════════════════════════════
  // ADDITIONAL SHORT ANSWER QUESTIONS
  // ══════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Map Reading and Interpretation',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'State TWO uses of map scales.',
    answerGuide: 'Any 2 of: to calculate actual distances from map measurements; to compare size of features; to understand the level of detail shown; to convert map distances to real-world distances; to calculate areas — 1 mark each.',
    tags: ['map scale', 'uses'],
    learningObjective: 'Explain uses of map scales',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Map Work and Fieldwork', substrand: 'Statistical Methods',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'Convert 34°89.143\'W into degrees, minutes and seconds.',
    answerGuide: '34° is degrees — 1 mark. 89.143\' means 89 minutes — 1 mark. 0.143 × 60 = 8.58 seconds ≈ 8.6 seconds — 1 mark. Answer: 34°89\'8.6"W.',
    tags: ['coordinates', 'degrees minutes seconds', 'conversion'],
    learningObjective: 'Convert geographical coordinates',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Rocks',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'State TWO economic importances of rocks and minerals to Kenya.',
    answerGuide: 'Any 2 of: source of raw materials for construction (granite, limestone, sand); support mining industry earning export revenue; tourism (scenic volcanic features); source of geothermal energy; formation of fertile soils — 1 mark each.',
    tags: ['rocks', 'minerals', 'economic importance', 'Kenya'],
    learningObjective: 'Explain economic importance of rocks and minerals',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Mining',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'State TWO negative effects of mining on the environment.',
    answerGuide: 'Any 2 of: landscape disfigurement/scars; soil and water pollution; destruction of vegetation; displacement of communities; air pollution (dust); land subsidence; water table interference — 1 mark each.',
    tags: ['mining', 'environmental effects', 'pollution'],
    learningObjective: 'Identify negative environmental effects of mining',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Human Geography', substrand: 'Energy',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm'],
    questionText: 'State TWO environmental effects of large hydroelectric power dams.',
    answerGuide: 'Any 2 of: flooding of upstream areas/displacement of communities; change in river ecosystem below the dam; reduced silt deposition downstream; risk of dam failure/flooding; loss of biodiversity in flooded areas; changes in local climate — 1 mark each.',
    tags: ['HEP', 'environmental effects', 'dams'],
    learningObjective: 'Identify environmental effects of HEP dams',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Environmental Geography', substrand: 'Environmental Management',
    questionType: 'short_answer', difficulty: 'medium', marks: 3,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'State THREE ways in which deforestation contributes to environmental degradation in Kenya.',
    answerGuide: 'Any 3 of: soil erosion (no roots to hold soil); reduced rainfall (fewer trees to attract clouds); flooding (reduced water absorption); loss of biodiversity; desertification; silting of rivers/dams; climate change (fewer carbon sinks); disruption of water cycle — 1 mark each.',
    tags: ['deforestation', 'environmental degradation', 'Kenya', 'soil erosion'],
    learningObjective: 'Explain how deforestation causes environmental degradation',
  },
  {
    grade: 'Grade 10', subject: 'Geography',
    strand: 'Physical Geography', substrand: 'Introduction to Geography',
    questionType: 'short_answer', difficulty: 'easy', marks: 4,
    isActive: true, timesUsed: 0,
    examType: ['CAT', 'Midterm', 'End Term'],
    questionText: 'State FOUR importance of studying Geography.',
    answerGuide: 'Any 4 of: facilitates good international relations; career development opportunities; enables appreciation of other cultures; promotes environmental conservation; wise use of resources; develops spatial thinking; promotes tourism; supports agricultural planning; aids disaster preparedness; promotes national development — 1 mark each.',
    tags: ['importance', 'geography', 'career', 'conservation'],
    learningObjective: 'Explain the importance of studying Geography',
  },
];

async function seedGeography() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingCount = await QuestionBank.countDocuments({ subject: 'Geography', grade: 'Grade 10' });
    console.log(`📊 Existing Geography Grade 10 questions: ${existingCount}`);

    const inserted = await QuestionBank.insertMany(questions, { ordered: false });
    console.log(`\n✅ Inserted ${inserted.length} Geography Grade 10 questions`);

    // Breakdown by strand
    const strands = {};
    inserted.forEach(q => {
      strands[q.substrand] = (strands[q.substrand] || 0) + 1;
    });

    console.log('\n📊 Questions by sub-strand:');
    Object.entries(strands).sort().forEach(([s, c]) => console.log(`  ${s}: ${c}`));

    const total = await QuestionBank.countDocuments();
    console.log(`\n📚 Total questions in bank: ${total}`);
    console.log('\n🎉 Geography seed complete! Generate a Geography exam to see the improvement.');

  } catch (err) {
    if (err.code === 11000) {
      console.log('⚠️  Some duplicates skipped — normal on re-run.');
    } else {
      console.error('❌ Error:', err.message);
      process.exit(1);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

seedGeography();
