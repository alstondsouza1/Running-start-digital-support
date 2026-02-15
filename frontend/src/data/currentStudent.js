// frontend/src/data/currentStudent.js

export const currentStudentsQuestions = [
  // =====================================================
  // DATES & DEADLINES
  // =====================================================

  {
    type: "dates-deadlines",
    question: "What happens if I miss the enrollment deadline?",
    answer: {
      bullets: [
        {
          text:
            "You will not be able to participate in Running Start for that term. You must be enrolled by the third day of the term.",
        },
      ],
    },
  },

  {
    type: "dates-deadlines",
    question: "What if my records are blocked when I try to enroll in classes?",
    answer: {
      intro: "Ask yourself the following questions:",
      bullets: [
        { text: "Have I submitted my Enrollment Verification form?" },
        { text: "Did I meet Academic Standards last term (GPA 2.0+)?" },
        { text: "Do I have outstanding fines or parking tickets?" },
      ],
    },
  },

  // =====================================================
  // FEE WAIVER & BOOK LOAN
  // =====================================================

  {
    type: "fee-waiver-book-loan",
    question: "How does the Running Start fee waiver work?",
    answer: {
      bullets: [
        {
          text:
            "Your high school counselor approves your credits each term.",
        },
        {
          text:
            "Running Start covers tuition for eligible college-level courses.",
        },
        {
          text:
            "Students are responsible for some fees, books, and transportation.",
        },
      ],
    },
  },

  {
    type: "fee-waiver-book-loan",
    question: "What happens if I drop a class after receiving books?",
    answer: {
      bullets: [
        {
          text:
            "You may be required to return borrowed books immediately.",
        },
        {
          text:
            "Dropping classes could impact your eligibility and responsibilities.",
        },
      ],
    },
  },

  // =====================================================
  // HOW TO PLAN CLASSES
  // =====================================================

  {
    type: "how-to-plan-classes",
    question: "What classes am I allowed to take as a Running Start student?",
    answer: {
      bullets: [
        {
          text:
            "You may take college-level courses (100-level or higher).",
        },
        {
          text:
            "Your high school counselor must approve your schedule each term.",
        },
      ],
    },
  },

  {
    type: "how-to-plan-classes",
    question: "Can I take online classes?",
    answer: {
      intro: "Online classes require strong time management skills. Consider:",
      bullets: [
        { text: "Am I self-motivated?" },
        { text: "Can I manage deadlines independently?" },
        { text: "Do I have reliable internet access?" },
      ],
    },
  },

  // =====================================================
  // CAMPUS RESOURCES
  // =====================================================

  {
    type: "campus-resources",
    question: "Where can I get advising help?",
    answer: {
      bullets: [
        {
          text:
            "You can contact the Running Start office for program-specific advising.",
        },
        {
          text:
            "General academic advising is also available through Green River College.",
        },
      ],
    },
  },

  {
    type: "campus-resources",
    question: "What is FERPA and how does it affect my records?",
    answer: {
      bullets: [
        {
          text:
            "FERPA protects your educational records and limits who can access them.",
        },
        {
          text:
            "Parents cannot access your grades unless you give written permission.",
        },
      ],
    },
  },
];
