// ─────────────────────────────────────────────────────────────────────────────
// curriculumData.js — CBC Senior School Grade 10–12 Curriculum Data
// Grade 10: Available ✅ | Grade 11: Blocked 🔒 | Grade 12: Blocked 🔒
// ─────────────────────────────────────────────────────────────────────────────

// ── Grade Availability ───────────────────────────────────────────────────────
export const GRADE_STATUS = {
  'Grade 10': {
    active: true,
    label: 'Grade 10',
    note: 'Available Now ✅',
    launchDate: null,
  },
  'Grade 11': {
    active: false,
    label: 'Grade 11',
    note: 'Available January 2027 🔒',
    launchDate: 'January 2027',
  },
  'Grade 12': {
    active: false,
    label: 'Grade 12',
    note: 'Available January 2028 🔒',
    launchDate: 'January 2028',
  },
}

// ── Exam Types ────────────────────────────────────────────────────────────────
export const EXAM_TYPES = ['CAT', 'Midterm', 'End Term', 'End Year', 'Pre-Mock', 'Mock', 'Series']

// ── CAT marks options (30–40 only) ────────────────────────────────────────────
export const CAT_MARKS_OPTIONS = [30, 35, 40]

// ── Full exam marks by subject (for End Term, End Year, Mock, Pre-Mock, Series) ─
export const FULL_EXAM_MARKS = {
  'English': 80,
  'Literature in English': 80,
  'Kiswahili': 80,
  'Fasihi ya Kiswahili': 80,
  'Biology': 80,
  'Physics': 80,
  'General Science': 80,
  'Chemistry': 80,
  'Applied Agriculture': 90,
  // All other subjects default to 100
}

export function getSubjectFullMarks(subject) {
  return FULL_EXAM_MARKS[subject] || 100
}

// Midterm: approximately half the full exam marks, rounded to nearest 5
export function getSubjectMidtermMarks(subject) {
  const full = getSubjectFullMarks(subject)
  return Math.round((full / 2) / 5) * 5
}

// Returns correct marks for given exam type
export function getExamTypeMarks(subject, examType) {
  if (['End Term', 'End Year', 'Mock', 'Pre-Mock', 'Series'].includes(examType)) {
    return getSubjectFullMarks(subject)
  }
  if (examType === 'Midterm') {
    return getSubjectMidtermMarks(subject)
  }
  return null // CAT: teacher chooses 30-40
}

// ── Terms ─────────────────────────────────────────────────────────────────────
export const TERMS = ['Term 1', 'Term 2', 'Term 3']

// ── Kenyan names for question scenarios ──────────────────────────────────────
export const KENYAN_NAMES = [
  'Wanjiku', 'Kipchoge', 'Baraka', 'Amina', 'Otieno', 'Njeri', 'Kamau',
  'Achieng', 'Mutua', 'Chebet', 'Odhiambo', 'Mwangi', 'Zawadi', 'Koech',
  'Kimani', 'Auma', 'Nduta', 'Waweru', 'Simiyu', 'Juma', 'Nafula', 'Ouma',
  'Kanini', 'Rotich', 'Adhiambo', 'Maina', 'Chepkorir', 'Onyango',
]

export const KENYAN_SCHOOLS = [
  "Mang'u Senior School", 'Alliance Senior School', 'Starehe Senior School',
  'Precious Blood Senior School', 'Maranda Senior School', 'Ngara Senior School',
  'Strathmore Senior School', 'Highway Senior School', 'Moi Senior School Nairobi',
  'Kaplamboi Senior School', 'Thika Senior School', 'St. Mary\'s Senior School',
  'Kenya High Senior School', 'Lenana Senior School', 'Upper Hill Senior School',
  'Nakuru Senior School', 'Kisumu Senior School', 'Eldoret Senior School',
]

export const KENYAN_PLACES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Thika', 'Nakuru', 'Nyeri',
  'Kakamega', 'Machakos', 'Garissa', 'Kitale', 'Kericho', 'Embu', 'Meru',
  'Kisii', 'Kilifi', 'Nanyuki', 'Isiolo', 'Wajir', 'Marsabit',
]

// ── Subjects per pathway ───────────────────────────────────────────────────────
export const STEM_SUBJECTS = [
  'Mathematics',
  'Essential Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'General Science',
  'Applied Agriculture',
  'Computer Studies',
  'Geography',
]

export const SOCIAL_SCIENCE_SUBJECTS = [
  'Geography',
  'History & Citizenship',
  'CRE',
  'IRE',
  'HRE',
  'Business Studies',
  'English',
  'Literature in English',
  'Kiswahili',
  'Fasihi ya Kiswahili',
  'ICT',
  'CSL',
  'Physical Education',
  'French',
  'German',
  'Mandarin',
]

// ── CBC Curriculum Data ────────────────────────────────────────────────────────
// Structure: CBC_CURRICULUM[grade][subject] = array of strands
// SUBSTRANDS[strand] = array of substrands

export const CBC_CURRICULUM = {
  'Grade 10': {
    subjects: [
      'Mathematics',
      'Essential Mathematics',
      'Biology',
      'Chemistry',
      'Physics',
      'General Science',
      'Applied Agriculture',
      'Computer Studies',
      'Geography',
      'History & Citizenship',
      'CRE',
      'IRE',
      'HRE',
      'Business Studies',
      'English',
      'Literature in English',
      'Kiswahili',
      'Fasihi ya Kiswahili',
      'ICT',
      'CSL',
      'Physical Education',
      'French',
      'German',
      'Mandarin',
    ],
    strands: {
      'Mathematics': [
        'Numbers',
        'Algebra',
        'Geometry',
        'Measurements',
        'Statistics and Probability',
      ],
      'Essential Mathematics': [
        'Numbers',
        'Algebra',
        'Geometry',
        'Measurements',
        'Statistics and Probability',
      ],
      'Biology': [
        'Introduction to Biology',
        'Cell Biology',
        'Classification of Living Things',
        'Nutrition in Plants and Animals',
        'Gaseous Exchange and Respiration',
        'Transport in Animals and Plants',
        'Excretion in Animals and Plants',
        'Reproduction in Plants and Animals',
        'Ecology and Environment',
      ],
      'Chemistry': [
        'Introduction to Chemistry',
        'States of Matter',
        'Atomic Structure',
        'The Periodic Table',
        'Chemical Bonding',
        'Acids, Bases and Salts',
        'Organic Chemistry',
        'Carbon and Its Compounds',
      ],
      'Physics': [
        'Introduction to Physics',
        'Mechanics',
        'Pressure in Solids, Liquids and Gases',
        'Thermal Physics',
        'Light and Optics',
        'Waves and Sound',
        'Electricity and Magnetism',
        'Uniform Circular Motion',
      ],
      'General Science': [
        'Scientific Investigation',
        'Matter and Its Properties',
        'Living Things and Their Environment',
        'Forces and Motion',
        'Energy and Its Transformations',
        'Earth and Space',
        'Chemistry in Daily Life',
      ],
      'Applied Agriculture': [
        'Land and Its Uses',
        'Soil Science',
        'Crop Production and Management',
        'Land Preparation and Planting',
        'Crop Nursery Management',
        'Livestock Production',
        'Farm Structures and Management',
        'Agricultural Mechanization',
      ],
      'Computer Studies': [
        'Introduction to ICT',
        'Computer Hardware and Software',
        'Operating Systems',
        'Word Processing',
        'Spreadsheets',
        'Internet and Communication',
        'Digital Safety and Ethics',
        'Database Management',
      ],
      'Geography': [
        'Introduction to Geography',
        'Map Work and Fieldwork',
        'Internal Land-forming Processes',
        'External Land-forming Processes',
        'Weather and Climate',
        'Water and Drainage',
        'Population and Settlement',
        'Agriculture and Food Security',
        'Environmental Conservation',
      ],
      'History & Citizenship': [
        'Introduction to History and Citizenship',
        'Peoples and Cultures of Kenya',
        'Contacts and Interactions',
        'Colonialism and Resistance in Kenya',
        'The Struggle for Independence',
        'Independent Kenya',
        'Governance and Democracy',
        'Public Resources and Citizenship',
      ],
      'CRE': [
        'The Bible',
        'Creation and the Environment',
        'The Patriarchs and Their Faith',
        'The Exodus and the Covenant',
        'The Monarchy and Prophethood',
        'The Life and Teachings of Jesus Christ',
        'The Early Church',
        'Christian Living and Ethics',
      ],
      'IRE': [
        'The Quran (Al-Quran)',
        'Hadith and Sunnah',
        'Pillars of Islam (Arkan-ul-Islam)',
        'Pillars of Faith (Arkan-ul-Iman)',
        'Islamic Ethics and Social Teachings',
        'Islamic History and Civilization',
        'Fiqh (Islamic Jurisprudence)',
      ],
      'HRE': [
        'Hinduism — Trimurti and Dashavatars',
        'Jainism — Tirthankaras',
        'Buddhism — Teachings of Buddha',
        'Hindu Ethics and Social Values',
        'Jain Philosophy and Way of Life',
        'Buddhist Philosophy and Meditation',
        'Community Service and Religious Duty',
      ],
      'Business Studies': [
        'Money and Its Functions',
        'Financial Goals and Planning',
        'Budgeting in Business',
        'Banking and Financial Institutions',
        'Business Organisation and Management',
        'Consumer Education and Rights',
        'Entrepreneurship',
      ],
      'English': [
        'Listening and Speaking',
        'Reading Comprehension',
        'Grammar and Language Use',
        'Writing Skills',
        'Oral Literature',
      ],
      'Literature in English': [
        'Oral Literature',
        'Drama and Play',
        'Poetry',
        'Prose and Novel',
        'Literary Criticism and Analysis',
      ],
      'Kiswahili': [
        'Kusikiliza na Kuzungumza',
        'Kusoma',
        'Sarufi na Matumizi ya Lugha',
        'Kuandika',
        'Fasihi ya Kiswahili',
      ],
      'Fasihi ya Kiswahili': [
        'Fasihi Simulizi',
        'Mashairi',
        'Hadithi Fupi',
        'Riwaya',
        'Tamthilia',
      ],
      'ICT': [
        'Introduction to ICT',
        'Computer Hardware and Software',
        'Operating Systems',
        'Word Processing Applications',
        'Spreadsheet Applications',
        'Internet and Email Communication',
        'Digital Safety and Cyber Security',
        'Multimedia and Presentations',
      ],
      'CSL': [
        'Introduction to Community Service Learning',
        'Planning CSL Projects',
        'Implementing CSL Activities',
        'Leadership and Teamwork in CSL',
        'Reflection and Assessment in CSL',
        'Citizenship and National Values',
      ],
      'Physical Education': [
        'Athletics and Track Events',
        'Field Events',
        'Ball Games and Team Sports',
        'Indoor Games and Racket Sports',
        'Health and Fitness',
        'Swimming and Water Safety',
        'Outdoor and Adventure Activities',
      ],
      'French': [
        'Oral Communication (Expression Orale)',
        'Reading Comprehension (Compréhension Écrite)',
        'Grammar (Grammaire)',
        'Writing Skills (Expression Écrite)',
        'French Culture and Civilization',
      ],
      'German': [
        'Oral Communication (Mündliche Kommunikation)',
        'Reading Comprehension (Leseverstehen)',
        'Grammar (Grammatik)',
        'Writing Skills (Schreiben)',
        'German Culture and Society',
      ],
      'Mandarin': [
        'Oral Communication',
        'Reading Comprehension',
        'Writing and Characters',
        'Grammar and Structure',
        'Chinese Culture and Civilization',
      ],
    },
  },

  'Grade 11': {
    subjects: [], // Blocked — see GRADE_STATUS
    strands: {},
  },

  'Grade 12': {
    subjects: [], // Blocked — see GRADE_STATUS
    strands: {},
  },
}

// ── Substrands ────────────────────────────────────────────────────────────────
export const SUBSTRANDS = {
  // Mathematics
  'Numbers': [
    'Integers and Rational Numbers', 'Surds and Indices',
    'Logarithms', 'Commercial Arithmetic', 'Sequences and Series',
  ],
  'Algebra': [
    'Algebraic Expressions', 'Linear Equations and Inequalities',
    'Quadratic Equations', 'Simultaneous Equations', 'Polynomials',
  ],
  'Geometry': [
    'Angles and Triangles', 'Circle Theorems', 'Constructions',
    'Transformation', 'Coordinate Geometry', 'Vectors',
  ],
  'Measurements': [
    'Area and Perimeter', 'Volume and Surface Area',
    'Scale Drawing and Maps', 'Trigonometry', 'Bearings',
  ],
  'Statistics and Probability': [
    'Data Representation', 'Measures of Central Tendency',
    'Measures of Dispersion', 'Probability', 'Set Theory',
  ],

  // Biology
  'Introduction to Biology': [
    'Branches of Biology', 'Careers in Biology',
    'Biological Equipment and Safety', 'Scientific Method in Biology',
  ],
  'Cell Biology': [
    'Cell Structure and Function', 'Cell Types (Prokaryotic and Eukaryotic)',
    'Cell Division', 'Microscopy and Laboratory Techniques',
    'Levels of Organization', 'Specialized Cells',
  ],
  'Classification of Living Things': [
    'Principles of Classification', 'Kingdom Monera and Fungi',
    'Kingdom Plantae', 'Kingdom Animalia', 'Binomial Nomenclature',
  ],
  'Nutrition in Plants and Animals': [
    'Photosynthesis', 'Mineral Salts in Plants',
    'Human Digestive System', 'Digestion and Absorption',
    'Balanced Diet and Malnutrition',
  ],
  'Gaseous Exchange and Respiration': [
    'Aerobic and Anaerobic Respiration', 'Human Respiratory System',
    'Gaseous Exchange in Plants', 'Breathing Mechanism',
  ],
  'Transport in Animals and Plants': [
    'Blood and Blood Groups', 'The Human Heart',
    'Circulatory System', 'Lymphatic System',
    'Transpiration and Osmosis', 'Absorption in Roots',
  ],
  'Excretion in Animals and Plants': [
    'Human Excretory System', 'Kidney Structure and Function',
    'Excretion in Plants', 'Homeostasis',
  ],
  'Reproduction in Plants and Animals': [
    'Sexual and Asexual Reproduction', 'Pollination and Fertilization',
    'Human Reproductive System', 'Sexually Transmitted Infections',
    'Seed Germination',
  ],
  'Ecology and Environment': [
    'Ecosystems and Food Chains', 'Biodiversity and Conservation',
    'Human Activities and the Environment', 'Pollution',
  ],

  // Chemistry
  'Introduction to Chemistry': [
    'Branches and Careers in Chemistry', 'Laboratory Safety',
    'Apparatus and Measurements', 'Applications of Chemistry',
  ],
  'States of Matter': [
    'Properties of Solids, Liquids and Gases', 'Changes of State',
    'Diffusion and Brownian Motion',
  ],
  'Atomic Structure': [
    'Sub-atomic Particles', 'Atomic Number and Mass Number',
    'Electron Configuration', 'Isotopes and Their Uses',
  ],
  'The Periodic Table': [
    'Periods and Groups', 'Trends in the Periodic Table',
    'Alkali Metals', 'Halogens', 'Noble Gases', 'Transition Metals',
  ],
  'Chemical Bonding': [
    'Ionic Bonding', 'Covalent Bonding', 'Metallic Bonding',
    'Chemical Formulae', 'Balancing Equations',
  ],
  'Acids, Bases and Salts': [
    'Properties of Acids and Bases', 'pH Scale',
    'Neutralization Reactions', 'Preparation of Salts',
  ],
  'Organic Chemistry': [
    'Alkanes and Alkenes', 'Alcohols and Carboxylic Acids',
    'Polymers', 'Fuels and Energy',
  ],

  // Physics
  'Introduction to Physics': [
    'Branches and Careers in Physics', 'Measurement and SI Units',
    'Scalar and Vector Quantities', 'Scientific Notation',
  ],
  'Mechanics': [
    'Velocity and Acceleration', 'Newton\'s Laws of Motion',
    'Friction and Circular Motion', 'Work, Energy and Power',
    'Simple Machines', 'Elasticity and Hooke\'s Law',
  ],
  'Pressure in Solids, Liquids and Gases': [
    'Pressure in Solids', 'Pressure in Fluids',
    'Atmospheric Pressure', 'Pascal\'s Principle',
    'Archimedes\' Principle', 'Boyle\'s Law',
  ],
  'Thermal Physics': [
    'Temperature and Heat', 'Thermal Expansion',
    'Heat Transfer', 'Gas Laws',
  ],
  'Electricity and Magnetism': [
    'Static Electricity', 'Electric Current and Circuits',
    'Ohm\'s Law', 'Magnetism', 'Electromagnetic Induction',
  ],

  // Applied Agriculture
  'Land and Its Uses': [
    'Types of Land Tenure', 'Land Evaluation',
    'Factors Affecting Land Productivity', 'Sustainable Land Use',
  ],
  'Soil Science': [
    'Soil Formation and Profile', 'Soil Texture and Structure',
    'Soil pH and Fertility', 'Soil Erosion and Conservation',
    'Soil Water',
  ],
  'Crop Production and Management': [
    'Field Crop Production', 'Horticultural Crops',
    'Crop Pests and Diseases', 'Organic Farming',
  ],
  'Land Preparation and Planting': [
    'Primary and Secondary Cultivation', 'Conservation Tillage',
    'Planting Methods and Spacing', 'Seedbed Preparation',
  ],
  'Crop Nursery Management': [
    'Nursery Site Selection', 'Nursery Bed Preparation',
    'Transplanting', 'Seedling Care',
  ],
  'Livestock Production': [
    'Cattle Breeds and Management', 'Poultry Farming',
    'Goat and Sheep Farming', 'Feeds and Feeding',
    'Animal Diseases and Health',
  ],

  // Geography
  'Introduction to Geography': [
    'Branches of Geography', 'Importance of Geography',
    'Geography and Careers', 'Geography and Other Subjects',
  ],
  'Map Work and Fieldwork': [
    'Types of Maps', 'Map Reading and Interpretation',
    'Grid References', 'Relief Representation',
    'Field Data Collection Methods',
  ],
  'Internal Land-forming Processes': [
    'Plate Tectonics', 'Volcanicity',
    'Faulting and Folding', 'Earthquakes', 'Features of East African Rift Valley',
  ],
  'External Land-forming Processes': [
    'River Processes and Features', 'Wind Erosion and Deposition',
    'Glaciation', 'Marine Action', 'Weathering Types',
  ],
  'Weather and Climate': [
    'Elements of Weather', 'Climate Types in Kenya',
    'Factors Influencing Climate', 'Climate Change',
    'Measuring Weather Elements',
  ],
  'Water and Drainage': [
    'Water Cycle', 'River Systems', 'Lakes in Kenya',
    'Water Resources and Management', 'Underground Water',
  ],
  'Population and Settlement': [
    'Population Distribution', 'Population Growth',
    'Migration', 'Settlement Patterns', 'Urbanization',
  ],

  // History & Citizenship
  'Peoples and Cultures of Kenya': [
    'Cushitic Peoples', 'Bantu Peoples', 'Nilotic Peoples',
    'Migration into Kenya', 'Cultural Diversity and Cohesion',
  ],
  'Colonialism and Resistance in Kenya': [
    'Establishment of Colonial Rule', 'Colonial Administrative Systems',
    'African Resistance to Colonial Rule', 'Economic Impact of Colonialism',
  ],
  'The Struggle for Independence': [
    'Rise of Nationalism', 'Political Parties', 'Lancaster House Conferences',
    'The Road to Independence 1963',
  ],
  'Independent Kenya': [
    'Post-Independence Challenges', 'Economic Development',
    'Constitutional Changes', 'Kenya\'s Foreign Policy',
  ],
  'Governance and Democracy': [
    'Structure of Government', 'The Constitution of Kenya 2010',
    'Elections and Electoral Process', 'IEBC and Electoral Management',
    'Devolution in Kenya',
  ],
  'Public Resources and Citizenship': [
    'Types of Public Resources', 'Importance of Public Resources',
    'Sustainable Use of Public Resources', 'Responsible Citizenship',
    'Rights and Responsibilities',
  ],

  // CRE
  'The Bible': [
    'Books of the Old Testament', 'Books of the New Testament',
    'The Bible as Word of God', 'Literary Forms in the Bible',
    'How to Study the Bible',
  ],
  'Creation and the Environment': [
    'The Creation Narrative', 'The Fall of Man',
    'Human Stewardship of the Environment', 'Environmental Conservation',
  ],
  'The Exodus and the Covenant': [
    'Moses and the Plagues of Egypt', 'The Passover',
    'The Exodus Journey', 'The Sinai Covenant',
    'The Ten Commandments',
  ],
  'The Life and Teachings of Jesus Christ': [
    'The Infancy of Jesus', 'The Galilean Ministry',
    'The Miracles of Jesus', 'Parables of Jesus',
    'The Passion, Death and Resurrection',
  ],
  'Christian Living and Ethics': [
    'The Holy Spirit and the Church', 'Christian Values',
    'Social Justice and Service', 'Stewardship',
  ],

  // IRE
  'The Quran (Al-Quran)': [
    'Compilation of the Quran', 'Diacriticalisation',
    'Types of Quranic Verses', 'Asbabu al-nuzuul', 'Tajweed Rules',
  ],
  'Hadith and Sunnah': [
    'Definition and Types of Hadith', 'Isnad and Matn',
    'Qualities of a Muhaddith', 'Importance of Hadith',
  ],
  'Pillars of Islam (Arkan-ul-Islam)': [
    'Shahadah', 'Salah', 'Zakat', 'Sawm', 'Hajj',
  ],
  'Islamic Ethics and Social Teachings': [
    'Character and Conduct (Akhlaq)', 'Family Values in Islam',
    'Responsibilities to Society', 'Islamic Economic Ethics',
  ],

  // HRE
  'Hinduism — Trimurti and Dashavatars': [
    'Brahma, Vishnu and Shiva', 'The Ten Avatars of Vishnu',
    'Lessons from Dashavatars', 'Hindu Worship and Rituals',
  ],
  'Jainism — Tirthankaras': [
    'The Twenty-Four Tirthankaras', 'Contributions of Tirthankaras',
    'Jain Principles: Ahimsa, Satya, Asteya', 'Jain Way of Life',
  ],
  'Buddhism — Teachings of Buddha': [
    'Life of Siddhartha Gautama', 'The Four Noble Truths',
    'The Eightfold Path', 'Paramitmas', 'Buddhist Social Ethics',
  ],

  // Business Studies
  'Money and Its Functions': [
    'Functions of Money', 'Kenyan Currency Features',
    'Supply and Demand for Money', 'Role of Central Bank of Kenya',
  ],
  'Financial Goals and Planning': [
    'Setting SMART Financial Goals', 'Short-term and Long-term Goals',
    'Ethical Practices in Finance', 'Financial Decision Making',
  ],
  'Budgeting in Business': [
    'Importance of Budgeting', 'Types of Budgets',
    'Preparing a Business Budget', 'Surplus and Deficit Budgets',
  ],
  'Banking and Financial Institutions': [
    'Types of Bank Accounts', 'Banking Services in Kenya',
    'Mobile Money Services', 'Credit and Loans', 'Trends in Banking',
  ],

  // English
  'Listening and Speaking': [
    'Oral Presentations', 'Listening Comprehension',
    'Pronunciation and Fluency', 'Debate and Discussion',
  ],
  'Reading Comprehension': [
    'Comprehension Strategies', 'Summary Writing',
    'Vocabulary in Context', 'Reading for Information',
  ],
  'Grammar and Language Use': [
    'Parts of Speech', 'Tenses and Aspect', 'Sentence Structure',
    'Punctuation and Spelling', 'Direct and Reported Speech',
  ],
  'Writing Skills': [
    'Creative Writing', 'Formal and Informal Letters',
    'Report Writing', 'Essay Writing', 'Summary Writing',
  ],

  // Literature in English
  'Oral Literature': [
    'Folktales and Myths', 'Proverbs and Riddles',
    'Songs and Chants', 'Characteristics of Oral Literature',
  ],
  'Drama and Play': [
    'Elements of Drama', 'Themes in Drama',
    'Characterization', 'Stage Directions',
  ],
  'Poetry': [
    'Forms of Poetry', 'Poetic Devices', 'Themes in Poetry',
    'Interpretation of Poems',
  ],
  'Prose and Novel': [
    'Plot and Setting', 'Characterization', 'Themes and Issues',
    'Narrative Techniques',
  ],

  // Kiswahili
  'Kusikiliza na Kuzungumza': [
    'Uwasilishaji wa Mdomo', 'Kusikiliza kwa Makini',
    'Mazungumzo na Mdahalo',
  ],
  'Kusoma': [
    'Ufahamu wa Kusoma', 'Mkakati wa Kusoma',
    'Muhtasari wa Maandishi',
  ],
  'Sarufi na Matumizi ya Lugha': [
    'Nomino na Vivumishi', 'Vitenzi na Nyakati',
    'Sentensi na Muundo Wake', 'Viunganishi',
  ],
  'Kuandika': [
    'Insha ya Ubunifu', 'Barua Rasmi na Zisizo Rasmi',
    'Ripoti na Taarifa', 'Muhtasari',
  ],

  // Fasihi ya Kiswahili
  'Fasihi Simulizi': [
    'Hadithi za Kimapokeo', 'Methali na Vitendawili',
    'Nyimbo za Kimapokeo', 'Sifa za Fasihi Simulizi',
  ],
  'Mashairi': [
    'Aina za Mashairi', 'Vipengele vya Mashairi',
    'Dhamira za Mashairi', 'Uchanganuzi wa Mashairi',
  ],

  // ICT / Computer Studies
  'Introduction to ICT': [
    'Definition and Uses of ICT', 'ICT Devices and Functions',
    'Impact of ICT on Society',
  ],
  'Computer Hardware and Software': [
    'Input and Output Devices', 'Storage Devices',
    'System and Application Software', 'Computer Maintenance',
  ],
  'Operating Systems': [
    'Functions of an OS', 'Types of Operating Systems',
    'File Management', 'User Interface',
  ],
  'Word Processing Applications': [
    'Creating and Formatting Documents', 'Tables and Graphics',
    'Mail Merge', 'Document Security',
  ],
  'Spreadsheet Applications': [
    'Creating Spreadsheets', 'Formulas and Functions',
    'Charts and Graphs', 'Data Analysis',
  ],
  'Internet and Email Communication': [
    'Internet Browsing', 'Email Etiquette',
    'Social Media', 'Online Safety',
  ],
  'Digital Safety and Cyber Security': [
    'Cyberbullying', 'Data Privacy',
    'Malware and Viruses', 'Safe Internet Use',
  ],

  // CSL
  'Introduction to Community Service Learning': [
    'Definition and Principles of CSL', 'CSL vs Community Service',
    'Benefits of CSL',
  ],
  'Planning CSL Projects': [
    'Identifying Community Needs', 'Setting CSL Objectives',
    'Planning Activities and Resources',
  ],
  'Leadership and Teamwork in CSL': [
    'Leadership Styles', 'Roles in a CSL Team',
    'Conflict Resolution', 'Responsible Citizenship',
  ],

  // Physical Education
  'Athletics and Track Events': [
    'Running Techniques', 'Relay Races',
    'Hurdles', 'Rules and Safety in Athletics',
  ],
  'Ball Games and Team Sports': [
    'Football and Volleyball', 'Basketball and Netball',
    'Hockey', 'Team Tactics and Rules',
  ],
  'Health and Fitness': [
    'Physical Fitness Components', 'Exercise and Health',
    'Nutrition and Sport', 'First Aid in Sports',
  ],

  // Languages
  'Oral Communication (Expression Orale)': [
    'Greetings and Introductions', 'Daily Conversations',
    'Listening Comprehension',
  ],
  'Reading Comprehension (Compréhension Écrite)': [
    'Reading Short Texts', 'Vocabulary in Context', 'Summary',
  ],
  'Grammar (Grammaire)': [
    'Articles and Nouns', 'Verb Tenses', 'Adjectives and Adverbs',
    'Sentence Construction',
  ],
  'Writing Skills (Expression Écrite)': [
    'Paragraphs and Short Essays', 'Formal Letters', 'Descriptive Writing',
  ],
}

// ── Marks and Questions Options ───────────────────────────────────────────────
export const MARKS_OPTIONS = [
  30, 35, 40, 50, 60, 70, 80, 90, 100
]

export const QUESTIONS_OPTIONS = [
  5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 21, 25
]
