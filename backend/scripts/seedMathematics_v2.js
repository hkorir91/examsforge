/**
 * ExamsForge — Question Bank Seed Script
 * Grade 10 Mathematics & Essential Mathematics
 * Source: Human teacher exam — Competence Kenya Examination and Assessment Board
 * Run: node backend/scripts/seedMathematics.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const QuestionBank = require('../models/QuestionBank');

const MONGODB_URI = process.env.MONGODB_URI;

const questions = [

  // ── NUMBERS AND ALGEBRA ──────────────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Indices and Logarithms',
    questionText: 'Classify the following numbers as odd, even, prime or composite: (a) 17  (b) 24  (c) 1',
    answerGuide: '(a) 17 — Prime and Odd (1 mark)\n(b) 24 — Even and Composite (1 mark)\n(c) 1 — Neither prime nor composite, Odd (1 mark)',
    marks: 3, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Indices and Logarithms',
    questionText: 'Classify the following as rational or irrational numbers:\n√2, 0.25, π, 7/9\nPresent your answer in a table with two columns: Rational Numbers and Irrational Numbers.',
    answerGuide: 'Rational: 0.25, 7/9 (1 mark each)\nIrrational: √2, π (1 mark each)\nTotal 4 marks',
    marks: 4, difficulty: 'easy', questionType: 'structured',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Indices and Logarithms',
    questionText: 'Find the reciprocal of: (a) 5  (b) 2/3',
    answerGuide: '(a) Reciprocal of 5 = 1/5 (1 mark)\n(b) Reciprocal of 2/3 = 3/2 (1 mark)',
    marks: 2, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Indices and Logarithms',
    questionText: 'Express the following in index form:\n(a) 81\n(b) 1/16',
    answerGuide: '(a) 81 = 3⁴ (1 mark)\n(b) 1/16 = 2⁻⁴ or (1/2)⁴ (1 mark)',
    marks: 2, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Indices and Logarithms',
    questionText: 'Simplify using laws of indices:\n(2³ × 2⁵) ÷ 2⁴',
    answerGuide: '2³ × 2⁵ = 2⁸ (1 mark)\n2⁸ ÷ 2⁴ = 2⁴ (1 mark)\n2⁴ = 16 (1 mark)',
    marks: 3, difficulty: 'medium', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Indices and Logarithms',
    questionText: 'Evaluate: log₁₀ 1000',
    answerGuide: 'log₁₀ 1000 = log₁₀ 10³ = 3 (2 marks)',
    marks: 2, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Indices and Logarithms',
    questionText: 'Using logarithms, evaluate: (4.2 × 0.35) ÷ 0.007',
    answerGuide: 'log(4.2) = 0.6232, log(0.35) = 1̄.5441, log(0.007) = 3̄.8451\nlog numerator = 0.6232 + 1̄.5441 = 0.1673\n0.1673 − 3̄.8451 = 2.3222\nantilog(2.3222) = 210 (3 marks — award marks for method)',
    marks: 3, difficulty: 'hard', questionType: 'structured',
    examType: ['End Term', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Indices and Logarithms',
    questionText: 'State THREE applications of logarithms in real life.',
    answerGuide: 'Any 3 of: Measuring earthquake intensity (Richter scale); Measuring sound intensity (decibels); pH scale in chemistry; Radioactive decay calculations; Compound interest calculations. 1 mark each.',
    marks: 3, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  // ── QUADRATIC EXPRESSIONS ────────────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Quadratic Equations',
    questionText: 'Nafula drew a rectangle with length (x + 5) cm and width (x − 2) cm.\n(a) Form a quadratic expression for the area of the rectangle. (2 marks)\n(b) Find the area when x = 3. (2 marks)',
    answerGuide: '(a) Area = (x+5)(x−2) = x² + 3x − 10 (2 marks — 1 for expansion, 1 for simplification)\n(b) When x=3: Area = 9 + 9 − 10 = 8 cm² (2 marks)',
    marks: 4, difficulty: 'medium', questionType: 'structured',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Quadratic Equations',
    questionText: 'Expand and simplify: (x + 3)(x – 4)',
    answerGuide: '(x+3)(x-4) = x² − 4x + 3x − 12 = x² − x − 12 (3 marks — 1 for expansion, 1 for collecting terms, 1 for final answer)',
    marks: 3, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Quadratic Equations',
    questionText: 'Factorise completely: x² – 7x + 10',
    answerGuide: 'Find factors of 10 that add to −7: −5 and −2\nx² − 7x + 10 = (x − 5)(x − 2) (3 marks)',
    marks: 3, difficulty: 'medium', questionType: 'short_answer',
    examType: ['CAT', 'Midterm', 'End Term'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Quadratic Equations',
    questionText: 'Solve the quadratic equation: x² – 5x – 6 = 0',
    answerGuide: 'Factorise: (x−6)(x+1) = 0\nx = 6 or x = −1 (3 marks — 1 for factorising, 1 for each root)',
    marks: 3, difficulty: 'medium', questionType: 'short_answer',
    examType: ['CAT', 'Midterm', 'End Term'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Numbers and Algebra', substrand: 'Quadratic Equations',
    questionText: 'A ball is thrown upward. Its height h metres after t seconds is given by: h = –t² + 4t\n(a) Write the equation in standard form. (2 marks)\n(b) Find when the ball hits the ground (h = 0). (2 marks)',
    answerGuide: '(a) h = −t² + 4t or t² − 4t + h = 0 (2 marks)\n(b) 0 = −t² + 4t → t(4−t) = 0 → t = 0 or t = 4 seconds (2 marks — ball hits ground at t = 4s)',
    marks: 4, difficulty: 'hard', questionType: 'structured',
    examType: ['Midterm', 'End Term'], term: 'Term 1',
  },

  // ── MEASUREMENT AND GEOMETRY ─────────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Similarity and Enlargement',
    questionText: 'Define similarity as used in Mathematics.',
    answerGuide: 'Two figures are similar if they have the same shape but different sizes; corresponding angles are equal and corresponding sides are in the same ratio (2 marks)',
    marks: 2, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Similarity and Enlargement',
    questionText: 'State TWO real-life applications of enlargement.',
    answerGuide: 'Any 2 of: Maps and scale drawings; Photography and printing; Projectors/cinema; Microscopy; Architectural blueprints. 2 marks each.',
    marks: 4, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Similarity and Enlargement',
    questionText: 'The image of P(0, 2) under an enlargement with scale factor 3 is P¹(4, 6). Find the coordinates of the centre of enlargement.',
    answerGuide: 'Let centre be (a, b)\nUsing: P¹ = centre + k(P − centre)\n(4,6) = (a,b) + 3[(0,2) − (a,b)]\nSolving: a = 2, b = 0\nCentre of enlargement = (2, 0) (2 marks)',
    marks: 2, difficulty: 'hard', questionType: 'short_answer',
    examType: ['End Term', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Similarity and Enlargement',
    questionText: 'A model of a building is made using a scale 1:500.\n(a) Find the actual height of a room that is 5 cm on the model. (2 marks)\n(b) A room has a floor area of 36 m². Find the corresponding area on the model in cm². (3 marks)',
    answerGuide: '(a) Actual height = 5 × 500 = 2500 cm = 25 m (2 marks)\n(b) Scale factor = 1:500, area scale = 1:250000\n36 m² = 360000 cm²\nModel area = 360000 ÷ 250000 = 1.44 cm² (3 marks)',
    marks: 5, difficulty: 'hard', questionType: 'structured',
    examType: ['End Term', 'Mock'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Similarity and Enlargement',
    questionText: 'In triangle ABD, BA is parallel to CE. Given that BA = 9 cm, CE = 4 cm and AE = 3 cm, find the length of DE.',
    answerGuide: 'Triangles ABD and CED are similar (AA)\nDE/AE = CE/BA\nDE/3 = 4/9\nDE = 12/9 = 4/3 = 1.33 cm (3 marks)',
    marks: 3, difficulty: 'hard', questionType: 'short_answer',
    examType: ['End Term', 'Mock'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Similarity and Enlargement',
    questionText: 'The surface areas of two similar bottles are 12 cm² and 108 cm² respectively. If the larger bottle has a volume of 810 cm³, find the volume of the smaller bottle.',
    answerGuide: 'Linear scale factor: √(12/108) = √(1/9) = 1/3\nVolume scale factor: (1/3)³ = 1/27\nVolume of smaller = 810 ÷ 27 = 30 cm³ (3 marks)',
    marks: 3, difficulty: 'hard', questionType: 'structured',
    examType: ['End Term', 'Mock'], term: 'Term 1',
  },

  // ── TRANSFORMATIONS ──────────────────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Transformation Geometry',
    questionText: 'State TWO properties of reflection.',
    answerGuide: 'Any 2 of: Object and image are equidistant from mirror line; Line joining object to image is perpendicular to mirror line; Object and image are congruent; Orientation is reversed. 2 marks each.',
    marks: 2, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Transformation Geometry',
    questionText: 'Name TWO triangle congruence tests.',
    answerGuide: 'Any 2 of: SSS (Side-Side-Side); SAS (Side-Angle-Side); AAS (Angle-Angle-Side); RHS (Right angle-Hypotenuse-Side). 1 mark each.',
    marks: 2, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Transformation Geometry',
    questionText: 'A\'(3, −3) is the image of A(−1, −5) under a reflection. Find the equation of the mirror line in the form ax + by + c = 0.',
    answerGuide: 'Midpoint of AA\' = ((−1+3)/2, (−5+−3)/2) = (1, −4)\nGradient AA\' = (−3−(−5))/(3−(−1)) = 2/4 = 1/2\nGradient of mirror line = −2 (perpendicular)\ny − (−4) = −2(x − 1)\ny + 4 = −2x + 2\n2x + y + 2 = 0 (5 marks)',
    marks: 5, difficulty: 'hard', questionType: 'structured',
    examType: ['End Term', 'Mock'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Transformation Geometry',
    questionText: 'On a Cartesian plane:\n(a) Plot and draw triangle ABC where A(1,2), B(1,6), C(5,5). (2 marks)\n(b) Draw A\'B\'C\', the image of ABC after reflection on the line y = x. (2 marks)\n(c) Draw A\"B\"C\", the image of A\'B\'C\' after rotation through −180° about the origin. (2 marks)',
    answerGuide: '(a) Correct plotting of A(1,2) B(1,6) C(5,5) — 2 marks\n(b) Reflection y=x: A\'(2,1) B\'(6,1) C\'(5,5) — 2 marks\n(c) Rotation −180°: A\"(−2,−1) B\"(−6,−1) C\"(−5,−5) — 2 marks',
    marks: 6, difficulty: 'hard', questionType: 'long_answer',
    examType: ['End Term', 'Mock'], term: 'Term 1',
  },

  // ── BEARINGS ─────────────────────────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Trigonometry',
    questionText: 'Three planes A, B and C leave airport P simultaneously at 9:30 am.\n- Plane A flies on bearing 070° at 400 km/h\n- Plane B flies on bearing 290° at 500 km/h\n- Plane C flies on bearing 162° at 300 km/h\n(a) Using scale 1 cm : 200 km, show by scale drawing the positions of the three planes after 3 hours. (4 marks)\n(b) After 3 hours, B turns and heads straight to A\'s position at the same speed. How long does it take B to reach A? (3 marks)\n(c) Find the bearing and distance of B from C after the first 3 hours. (2 marks)',
    answerGuide: '(a) Distances after 3h: A = 1200 km (6cm), B = 1500 km (7.5cm), C = 900 km (4.5cm). Correct bearings and plotting — 4 marks\n(b) Measure BA from diagram, divide by 500 km/h — 3 marks\n(c) Measure BC distance and bearing from diagram — 2 marks',
    marks: 9, difficulty: 'hard', questionType: 'long_answer',
    examType: ['End Term', 'Mock'], term: 'Term 1',
  },

  // ── ROTATIONAL SYMMETRY ───────────────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Transformation Geometry',
    questionText: 'Find the order of rotational symmetry of:\n(a) A square\n(b) An equilateral triangle',
    answerGuide: '(a) Square: order 4 (2 marks)\n(b) Equilateral triangle: order 3 (2 marks)',
    marks: 4, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Transformation Geometry',
    questionText: 'Explain how rotation shows congruence.',
    answerGuide: 'Under rotation, the object and its image are congruent because: all lengths are preserved; all angles are preserved; the shape and size remain unchanged. Only the position/orientation changes. (4 marks — 2 for definition, 2 for explanation of preserved properties)',
    marks: 4, difficulty: 'medium', questionType: 'short_answer',
    examType: ['Midterm', 'End Term'], term: 'Term 1',
  },

  // ── ESSENTIAL MATHEMATICS ────────────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'Essential Mathematics',
    strand: 'Number and Operations', substrand: 'Whole Numbers and Integers',
    questionText: 'Classify the following numbers as odd, even, prime or composite:\n(a) 17  (b) 24  (c) 1',
    answerGuide: '(a) 17 — Prime and Odd (1 mark)\n(b) 24 — Even and Composite (1 mark)\n(c) 1 — Neither prime nor composite (1 mark)',
    marks: 3, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Essential Mathematics',
    strand: 'Number and Operations', substrand: 'Fractions and Decimals',
    questionText: 'Classify the following as rational or irrational:\n√2, 0.25, π, 7/9',
    answerGuide: 'Rational: 0.25, 7/9 (1 mark each)\nIrrational: √2, π (1 mark each)',
    marks: 4, difficulty: 'easy', questionType: 'structured',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Essential Mathematics',
    strand: 'Number and Operations', substrand: 'Fractions and Decimals',
    questionText: 'Find the reciprocal of: (a) 5  (b) 2/3',
    answerGuide: '(a) 1/5 (1 mark)\n(b) 3/2 (1 mark)',
    marks: 2, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Essential Mathematics',
    strand: 'Algebra and Graphs', substrand: 'Algebraic Expressions',
    questionText: 'Expand and simplify: (x + 3)(x – 4)',
    answerGuide: '(x+3)(x-4) = x² − x − 12 (3 marks)',
    marks: 3, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Essential Mathematics',
    strand: 'Algebra and Graphs', substrand: 'Algebraic Expressions',
    questionText: 'Factorise completely: x² – 7x + 10',
    answerGuide: '(x − 5)(x − 2) (3 marks)',
    marks: 3, difficulty: 'medium', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Essential Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Similarity and Scale',
    questionText: 'Define similarity.',
    answerGuide: 'Two figures are similar if they have the same shape but different sizes, with equal corresponding angles and proportional corresponding sides. (2 marks)',
    marks: 2, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Essential Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Similarity and Scale',
    questionText: 'A model of a building uses a scale of 1:500. A room is 5 cm on the model. Find the actual height of the room in metres.',
    answerGuide: 'Actual height = 5 × 500 = 2500 cm = 25 m (2 marks)',
    marks: 2, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Essential Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Transformation Geometry',
    questionText: 'State TWO properties of reflection.',
    answerGuide: 'Object and image are equidistant from the mirror line; line joining object to image is perpendicular to the mirror line. (2 marks)',
    marks: 2, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT'], term: 'Term 1',
  },

  {
    grade: 'Grade 10', subject: 'Essential Mathematics',
    strand: 'Measurement and Geometry', substrand: 'Transformation Geometry',
    questionText: 'Find the order of rotational symmetry of: (a) a square  (b) an equilateral triangle',
    answerGuide: '(a) 4 (2 marks)  (b) 3 (2 marks)',
    marks: 4, difficulty: 'easy', questionType: 'short_answer',
    examType: ['CAT', 'Midterm'], term: 'Term 1',
  },

];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    let added = 0, skipped = 0;

    for (const q of questions) {
      const exists = await QuestionBank.findOne({
        grade: q.grade,
        subject: q.subject,
        questionText: q.questionText,
      });

      if (!exists) {
        await QuestionBank.create({
          ...q,
          isActive: true,
          timesUsed: 0,
          source: 'human_exam',
          verified: true,
        });
        added++;
      } else {
        skipped++;
      }
    }

    console.log(`✅ Done! Added: ${added} | Skipped (already exist): ${skipped}`);
    console.log(`Total Mathematics questions in bank: ${added + skipped}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
