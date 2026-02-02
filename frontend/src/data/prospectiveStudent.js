export const QUESTION_TYPES = Object.freeze({
    GENERAL: "general",
    ELIGIBILITY: "eligibility",
    REGISTRATION: "registration",
    CLASSES: "classes",
    OTHER: "other",
  });
  
  export const prospectiveStudentsQuestions = [
    {
      type: QUESTION_TYPES.GENERAL,
      question: "What is the Running Start Program?",
      answer: {
        bullets: [
          {
            text:
              "The Running Start program was created by the state legislature in the early 1990s as an opportunity for eligible high school juniors and seniors to earn college-level credit, tuition free. The school district pays the tuition charge for up to 21 credits per term if approved by the students' high school counselor. Books, fees, supplies, tuition for additional credits and transportation to the college are your responsibility. Please view the costs of Running Start for more information. Classes taken at the college as part of the Running Start Program are limited to college level courses (numbered 100 or above). Students may enroll simultaneously in high school and college classes or exclusively in college classes. This is often determined by high school graduation requirements.",
          },
        ],
      },
    },
    {
      type: QUESTION_TYPES.GENERAL,
      question: "How do I know if Running Start is right for me?",
      answer: {
        intro: "Running Start is a good fit for students who:",
        bullets: [
          { text: "Are ready for the challenge of college-level coursework." },
          { text: "Are motivated to participate in the college environment and possess the maturity to do so." },
          { text: "Seek academic challenges not available at their high school." },
          {
            text: "View Program Benefits and Considerations",
            url: "https://greenriver.edu/students/academics/running-start/prospective-running-start-students/benefits-and-considerations.html",
          },
        ],
      },
    },
    {
      type: QUESTION_TYPES.ELIGIBILITY,
      question: "How do students qualify for Running Start?",
      answer: {
        intro: "Prospective students must meet the following criteria:",
        bullets: [
          {
            text:
              "Be enrolled through a public high school/district. Homeschooled and private school students are encouraged to contact their local school district for instructions on their enrollment procedures.",
          },
          {
            text:
              "Be a junior or senior, according to grade level placement policies of the district the student is enrolled through.",
          },
          {
            text:
              "Be eligible for ENGL& 101. (visit Course Placement Options for assessment and placement options.)",
            url: "https://greenriver.edu/students/academics/running-start/prospective-running-start-students/eligibility-for-running-start.html",
          },
        ],
      },
    },
  ];
  