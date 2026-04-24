```js
/**
 * ExamsForge - Exam Blueprint Configuration
 * File: /backend/engine/examBlueprint.js
 *
 * Defines how exams are structured per subject.
 * Controls:
 * - Sections
 * - Marks
 * - Difficulty distribution
 * - Strand coverage
 */

module.exports = {

  // -------------------------------
  // 📘 MATHEMATICS
  // -------------------------------
  Mathematics: {
    totalMarks: 50,
    sections: [

      {
        name: "Section A",
        type: "short_answer",
        questions: 10,
        marks: 20,
        difficulty: {
          easy: 70,
          medium: 30
        },
        strands: [
          "Numbers and Algebra",
          "Statistics and Probability"
        ]
      },

      {
        name: "Section B",
        type: "structured",
        questions: 5,
        marks: 30,
        difficulty: {
          medium: 60,
          hard: 40
        },
        strands: [
          "Measurement and Geometry",
          "Trigonometry"
        ]
      }

    ]
  },

  // -------------------------------
  // 🧬 BIOLOGY
  // -------------------------------
  Biology: {
    totalMarks: 50,
    sections: [

      {
        name: "Section A",
        type: "short_answer",
        questions: 10,
        marks: 20,
        difficulty: {
          easy: 60,
          medium: 40
        },
        strands: [
          "Cell Biology",
          "Nutrition"
        ]
      },

      {
        name: "Section B",
        type: "structured",
        questions: 5,
        marks: 30,
        difficulty: {
          medium: 50,
          hard: 50
        },
        strands: [
          "Gaseous Exchange",
          "Ecology",
          "Genetics and Heredity"
        ]
      }

    ]
  },

  // -------------------------------
  // ⚗️ CHEMISTRY
  // -------------------------------
  Chemistry: {
    totalMarks: 50,
    sections: [

      {
        name: "Section A",
        type: "short_answer",
        questions: 10,
        marks: 20,
        difficulty: {
          easy: 60,
          medium: 40
        },
        strands: [
          "Acids, Bases and Salts",
          "Stoichiometry"
        ]
      },

      {
        name: "Section B",
        type: "structured",
        questions: 5,
        marks: 30,
        difficulty: {
          medium: 50,
          hard: 50
        },
        strands: [
          "Reaction Kinetics",
          "Organic Chemistry"
        ]
      }

    ]
  },

  // -------------------------------
  // ⚙️ PHYSICS
  // -------------------------------
  Physics: {
    totalMarks: 50,
    sections: [

      {
        name: "Section A",
        type: "short_answer",
        questions: 10,
        marks: 20,
        difficulty: {
          easy: 60,
          medium: 40
        },
        strands: [
          "Mechanics",
          "Waves"
        ]
      },

      {
        name: "Section B",
        type: "structured",
        questions: 5,
        marks: 30,
        difficulty: {
          medium: 50,
          hard: 50
        },
        strands: [
          "Circular Motion",
          "Electricity",
          "Nuclear Physics"
        ]
      }

    ]
  },

  // -------------------------------
  // 🌍 GEOGRAPHY
  // -------------------------------
  Geography: {
    totalMarks: 50,
    sections: [

      {
        name: "Section A",
        type: "short_answer",
        questions: 10,
        marks: 20,
        difficulty: {
          easy: 70,
          medium: 30
        },
        strands: [
          "Physical Geography"
        ]
      },

      {
        name: "Section B",
        type: "structured",
        questions: 5,
        marks: 30,
        difficulty: {
          medium: 50,
          hard: 50
        },
        strands: [
          "Environmental Management",
          "Human Geography"
        ]
      }

    ]
  },

  // -------------------------------
  // 📖 CRE
  // -------------------------------
  CRE: {
    totalMarks: 50,
    sections: [

      {
        name: "Section A",
        type: "short_answer",
        questions: 10,
        marks: 20,
        difficulty: {
          easy: 70,
          medium: 30
        },
        strands: [
          "The Old Testament",
          "The New Testament"
        ]
      },

      {
        name: "Section B",
        type: "structured",
        questions: 5,
        marks: 30,
        difficulty: {
          medium: 50,
          hard: 50
        },
        strands: [
          "Church in Action",
          "Christian Living Today"
        ]
      }

    ]
  }

};
```
