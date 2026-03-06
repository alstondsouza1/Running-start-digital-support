import pool from "../db/db.js";
import dotenv from "dotenv";

dotenv.config();

export const prospectiveStudentsQuestions = [
  {
    type: "general",
    question: "What is the Running Start Program?",
    answer: {
      bullets: [
        {
          text: "Running Start allows eligible high school juniors and seniors to earn college-level credit tuition-free. The school district pays tuition for up to 21 credits per term if approved by the student’s high school counselor.",
        },
        {
          text: "Books, fees, supplies, tuition for additional credits, and transportation are the student’s responsibility. Classes are limited to college-level courses (100 or above).",
        },
        {
          text: "Students may enroll in both high school and college classes, or only college classes, depending on high school graduation requirements. Students earn both high school and college credit for classes taken at Green River.",
        },
        {
          text: "High school graduation requirements are determined by each school district. Generally, one 5-credit college class equals one high school unit.",
        },
      ],
    },
  },

  {
    type: "general",
    question: "How do I know if Running Start is right for me?",
    answer: {
      intro: "Running Start is a good fit for students who:",
      bullets: [
        { text: "Are ready for the challenge of college-level coursework." },
        { text: "Are motivated to participate in the college environment and possess the maturity to do so." },
        { text: "Seek academic challenges not available at their high school." },
        {
          text: "View Program Benefits and Considerations.",
          url: "https://www.greenriver.edu/students/academics/running-start/prospective-running-start-students/benefits-and-considerations.html",
        },
      ],
    },
  },

  {
    type: "general",
    question: "How do students qualify for Running Start?",
    answer: {
      intro: "Prospective students must meet the following criteria:",
      bullets: [
        {
          text: "Be enrolled through a public high school/district. Homeschooled and private school students should contact their local school district for enrollment procedures.",
        },
        {
          text: "Be a junior or senior, according to district grade-level placement policies.",
        },
        {
          text: "Be eligible for ENGL& 101 (see Course Placement Options for assessment and placement options).",
          url: "https://www.greenriver.edu/students/academics/placement-testing-center/course-placement-options/index.html",
        },
        {
          text: "Be 16 upon admission to the program, or turn 16 during the first term of enrollment in Running Start.",
        },
      ],
    },
  },

  {
    type: "general",
    question: "Can students take English assessment at another college and have it apply at Green River?",
    answer: {
      bullets: [
        { text: "Yes. If a student takes assessment at another college, a Green River Running Start Advisor must review the scores." },
        { text: "Scores must be less than two years old." },
      ],
    },
  },

  {
    type: "general",
    question: "Can home and private schooled students participate in Running Start?",
    answer: {
      bullets: [
        { text: "Yes. Students must enroll through the local public high school and must be considered a junior or senior." },
        { text: "Students do not have to attend classes in the public high school to participate in Running Start." },
        { text: "Public school districts determine grade placement criteria for homeschool students who want to earn a public high school diploma (this may be based on age, credits/prior learning, or standardized achievement tests)." },
      ],
    },
  },

  {
    type: "general",
    question: "How many terms can a student enroll in Running Start?",
    answer: {
      bullets: [
        { text: "Qualified students can enroll for three terms (Fall, Winter, Spring) during junior year and three terms (Fall, Winter, Spring) during senior year." },
        { text: "Special circumstances may allow students to take up to 10 college credits the summer before junior year." },
        { text: "Special circumstances may allow students to take up to 10 college credits the summer before senior year." },
        { text: "Students may continue in Running Start as a second-year senior if they previously participated. Contact the Running Start Office for details." },
      ],
    },
  },

  {
    type: "general",
    question: "Can students attend Green River full-time or part-time?",
    answer: {
      bullets: [
        { text: "Yes. Students may attend full-time or part-time. The average credit load is 12–15 credits per term (about 3 classes)." },
        { text: "Running Start will cover tuition for up to 21 credits per term as long as students do not exceed the combined enrollment limit listed on the Enrollment Verification Form." },
      ],
    },
  },

  {
    type: "enrollment",
    question: "What happens if students miss the enrollment deadline?",
    answer: {
      bullets: [
        { text: "The student will not be able to participate in Running Start for the term. Students must be enrolled in courses by the third day of the term." },
      ],
    },
  },

  {
    type: "enrollment",
    question: "My placement scores didn't accurately reflect my abilities…help!",
    answer: {
      bullets: [
        { text: "Visit the Placement section of the site for advising and placement information." },
        { text: "Most Running Start students place using high school transcripts or the WAMAP placement test." },
      ],
    },
  },

  {
    type: "classes",
    question: "What classes are students not allowed to take?",
    answer: {
      intro: "Students may take any classes they wish, but Running Start pays only for college-level courses (100 or higher). Running Start does not cover:",
      bullets: [
        { text: "Read 104, Engl 100" },
        { text: "Math 0xx (anything below 100-level)" },
        { text: "Any course that starts with BASIC, ELL, HSC, or TS" },
        { text: "Any class below 100-level" },
      ],
    },
  },

  {
    type: "other",
    question: "What if my family moves or changes school districts?",
    answer: {
      bullets: [
        { text: "Let the Running Start department know immediately." },
        { text: "Have the counselor at the new school fill out a new Enrollment Verification Form and submit it to the office." },
        { text: "Changing districts could impact high school graduation requirements." },
      ],
    },
  },
];

async function seedFutureStudentFAQs() {
  try {
    console.log("Using DB:", process.env.DB_NAME);

    let sortOrderByType = {};

    for (const faq of prospectiveStudentsQuestions) {
      const { type, question, answer } = faq;

      if (!sortOrderByType[type]) {
        sortOrderByType[type] = 1;
      }

      await pool.query(
        "INSERT INTO faq (audience, type, question, answer, sort_order) VALUES (?, ?, ?, ?, ?)",
        ["future", type, question, JSON.stringify(answer), sortOrderByType[type]]
      );

      sortOrderByType[type]++;
    }

    console.log(`Seeded ${prospectiveStudentsQuestions.length} future student FAQ entries successfully!`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedFutureStudentFAQs();