const QUESTION_TYPES = {
    ENROLLMENT: "enrollment",
    CLASSES: "classes",
    GENERAL: "general",
    OTHER : ""
};
const prospectiveStudentsQuestions = [
    {
        type: QUESTION_TYPES.GENERAL,
        question: "What is the Running Start Program?",
        answer: {
            bullets: [
                {
                    text: "The Running Start program was created by the state legislature in the early 1990s as an opportunity for eligible high school juniors and seniors to earn college-level credit, tuition free. The school district pays the tuition charge for up to 21 credits per term if approved by the students' high school counselor. Books, fees, supplies, tuition for additional credits and transportation to the college are your responsibility. Please view the costs of Running Start for more information. Classes taken at the college as part of the Running Start Program are limited to college level courses (numbered 100 or above). Students may enroll simultaneously in high school and college classes or exclusively in college classes. This is often determined by high school graduation requirements."
                }
            ]
        }
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
                    url: "https://greenriver.edu/students/academics/running-start/prospective-running-start-students/benefits-and-considerations.html"
                }
            ]
        }
    },
    {
        type: QUESTION_TYPES.GENERAL,
        question: "How do students qualify for Running Start?",
        answer: {
            intro: "Prospective students must meet the following criteria:",
            bullets: [
                { text: "Be enrolled through a public high school/district. Homeschooled and private school students are encouraged to contact their local school district for instructions on their enrollment procedures." },
                { text: "Be a junior or senior, according to grade level placement policies of the district the student is enrolled through." },
                {
                    text: "Be eligible for ENGL& 101. (visit Course Placement Options for assessment and placement options.)",
                    url: "https://greenriver.edu/students/academics/running-start/prospective-running-start-students/eligibility-for-running-start.html"
                },
            ]
        }
    },
    {
        type: QUESTION_TYPES.GENERAL,
        question: "Can students take English assessment at another college and have it apply at Green River?",
        answer: {
            bullets: [
                {
                    text: "Yes, if students take assessment at another college a Green River Running Start Advisor will need to review the scores (scores must be less than two years old)."
                }
            ]
        }
    },
    {
        type: QUESTION_TYPES.GENERAL,
        question: "Can home and private schooled students participate in Running Start?",
        answer: {
            bullets: [
                {
                    text: "Yes. Students must enroll through the local public high school and must be considered a junior or senior. Students do not have to attend classes in the public high school in order to participate in Running Start. It is the responsibility of the public school district to establish grade placement criteria for homeschoolers who want to earn a high school diploma from a public high school. Some schools consider age appropriateness; others review credits and prior learning. In other cases, a standardized achievement test may be used in the absence of adequate documentation of a student's home-based education."
                }
            ]
        }
    },
    {
        type: QUESTION_TYPES.GENERAL,
        question: "How many terms can a student enroll in Running Start?",
        answer: {
            intro: "All qualified students can enroll for three terms (Fall, Winter, and Spring) during their junior year and three terms (Fall, Winter, and Spring) during their senior year. There are special circumstances that can allow students to:",
            bullets: [
                { text: "Take up to 10 college credits the summer before their junior year." },
                { text: "Take up to 10 college credits the summer before their senior year." },
                {
                    text: "Continue in Running Start as a second-year senior if that student had previously participated in Running Start. Please contact the Running Start Office for details."
                }
            ]
        }
    },
        {
        type: QUESTION_TYPES.GENERAL,
        question: "Can Students attend Green River full-time or part-time?",
        answer: {
            bullets: [
                {
                    text: "Yes, students have a choice of attending full-time or part-time. The average credit load for Running Start students is 12-15 credits per term (approximately 3 classes). The maximum number of credits for which Running Start will cover tuition is 21 credits per term, providing you do not exceed the combined enrollment limit listed on your Running Start Enrollment Verification Form."
                }
            ]
        }
    }


];


