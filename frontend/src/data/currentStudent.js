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
        {
          text:
            "Have I submitted my Enrollment Verification form for this term?",
        },
        {
          text:
            "Did I meet Academic Standards last term (GPA must be 2.0 or higher)?",
        },
        {
          text:
            "Do I have any outstanding fines or parking tickets in ctcLink?",
        },
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
            "Your high school counselor approves your credits each term using the Enrollment Verification form.",
        },
        {
          text:
            "Running Start covers tuition for eligible college-level courses (100-level or higher).",
        },
        {
          text:
            "You may still be responsible for fees, books, supplies, and transportation.",
        },
      ],
    },
  },

  {
    type: "fee-waiver-book-loan",
    question: "What books are covered under the book loan program?",
    answer: {
      bullets: [
        {
          text:
            "The book loan program typically supports required course materials for approved Running Start classes.",
        },
        {
          text:
            "Optional materials may not be included in the loan program.",
        },
      ],
    },
  },
];
