// export const QUESTION_TYPES = Object.freeze({
//     GENERAL: "general",
//     ELIGIBILITY: "eligibility",
//     REGISTRATION: "registration",
//     CLASSES: "classes",
//     OTHER: "other",
//   });

import { prospectiveByKey } from "./categories";
export const prospectiveStudentsQuestions = [
    {
        type: prospectiveByKey.general,
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
        type: prospectiveByKey.general,
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
        type: prospectiveByKey.general,
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
    {
        type: prospectiveByKey.general,
        question: "Can students take English assessment at another college and have it apply at Green River?",
        answer: {
            bullets: [
                {
                    text: "Yes, if students take assessment at another college a Green River Running Start Advisor will need to review the scores (scores must be less than two years old)."
                },
            ],
        }
    },

    {
        type: prospectiveByKey.general,
        question: "Can home and private schooled students participate in Running Start?",
        answer: {
            bullets: [
                {
                    text: "Yes. Students must enroll through the local public high school and must be considered a junior or senior. Students do not have to attend classes in the public high school in order to participate in Running Start. It is the responsibility of the public school district to establish grade placement criteria for homeschoolers who want to earn a high school diploma from a public high school. Some schools consider age appropriateness; others review credits and prior learning. In other cases, a standardized achievement test may be used in the absence of adequate documentation of a student's home-based education."
                },
            ],
        }
    },
    {
        type: prospectiveByKey.general,
        question: "How many terms can a student enroll in Running Start?",
        answer: {
            intro: "All qualified students can enroll for three terms (Fall, Winter, and Spring) during their junior year and three terms (Fall, Winter, and Spring) during their senior year. There are special circumstances that can allow students to:",
            bullets: [
                {
                    text: "Take up to 10 college credits the summer before their junior year.",
                },
                {
                    text: "Take up to 10 college credits the summer before their senior year."
                },
                {
                    text: "Continue in Running Start as a second-year senior if that student had previously participated in Running Start. Please contact the Running Start Office for details."
                }
            ]
        }
    },
    {
        type: prospectiveByKey.general,
        question: "Can Students attend Green River full-time or part-time?",
        answer: {
            bullets: [
                {
                    text: "Yes, students have a choice of attending full-time or part-time. The average credit load for Running Start students is 12-15 credits per term (approximately 3 classes). The maximum number of credits for which Running Start will cover tuition is 21 credits per term, providing you do not exceed the combined enrollment limit listed on your Running Start Enrollment Verification Form."
                }
            ]
        }
    },
    {
        type: prospectiveByKey.registration,
        question: "What happens if students miss the enrollment deadline?",
        answer: {
            bullets: [
                {
                    text: "The student will not be able to participate in the Running Start program for the term. Students must be enrolled in courses by the third day of the term."
                }
            ]
        }
    },
    {
        type: prospectiveByKey.registration,
        question: "My placement scores didn't accurately reflect my abilities…help!",
        answer: {
            bullets: [
                {
                    text: "Please visit the Placement section of our site for information on advising and placement. Most Running Start students place either through the high school transcripts or the WAMAP placement test.",
                    url: "https://www.greenriver.edu/students/academics/placement-testing-center/course-placement-options/"
                }
            ]
        }
    },
    {
        type: prospectiveByKey.classes,
        question: "Can students take online classes?",
        answer: {
            intro: "Yes. Running Start students will be treated as regular college students and enroll in regular college classes. Online courses are part of the normal delivery of college curriculum. While online (eLearning) classes give more scheduling flexibility, they can be challenging for some students. Before enrolling in an eLearning class students may want to ask themselves how well the following statements describe them: ",
            bullets: [
                {
                    text: "I feel comfortable using reading and writing as my primary means of communication and learning.",
                },
                {
                    text: "I feel I can learn in an environment where oral lectures are not the primary mode of learning."
                },
                {
                    text: "I am self-motivated and can work independently."
                },
                {
                    text: "I have no problem communicating with my instructor and other classmates through electronic means such as email and discussion boards."
                },
                {
                    text: "I have no problem asking questions when I don't understand something or need clarification.",
                },
                {
                    text: "I have or will have access to a computer with internet access on a regular basis."
                },
                {
                    text: "I feel comfortable in my keyboarding abilities."
                },
                {
                    text: "I feel comfortable with basic computer skills such as email, creating and saving files, and downloading files."
                },
                {
                    text: "I can dedicate approximately three hours of work per credit hour to my eLearning class."
                },
                {
                    text: "If your student answered ‘yes' to most of these questions, eLearning could be a good option for him/her!"
                },

            ]
        }
    },
    {
        type: prospectiveByKey.classes,
        question: "How do I know which classes at Green River apply toward high school graduation requirements?",
        answer: {
            bullets: [
                {
                    text: "Each district accepts different courses from Green River to meet specific graduation requirements. This means that the course required to complete U.S. History or Senior English will vary from district to district. Students must work with their high school counselor to identify their remaining high school graduation requirements prior to enrollment. High school graduation requirements are often listed on the term-based Enrollment Verification Form. Our department maintains a list of current equivalency guides on our website: District Equivalency Guide. Advisors will use the information provided during enrollment to help students plan out their high school graduation requirements."
                }
            ]
        }
    },
    {
        type: prospectiveByKey.classes,
        question: "Can students receive a degree from Green River at the same time they get their high school diploma?",
        answer: {
            bullets: [
                {
                    text: "Yes. This is possible but requires careful planning. Be sure to ask a Running Start advisor for help toward the planning of an AA degree. Students that do not plan to graduate from a public high school can ask the college to issue a State of Washington high school diploma upon completion of an associate degree."
                }
            ]
        }
    },
    {
        type: prospectiveByKey.classes,
        question: "Should students stay at Green River to finish my AA degree before transferring?",
        answer: {
            bullets: [{
                text: "There are advantages to finishing an AA degree before transferring to a 4-year university in Washington and some out-of-state institutions (universities which have “direct transfer agreements” with Green River; listed in the College Catalog). At some universities in Washington, it may be difficult to transfer with an assortment of credits if you do not complete an AA degree. This is a good question to ask the university to which you plan to transfer."
            }]
        }
    },
    {
        type: prospectiveByKey.classes,
        question: "Do Running Start classes transfer to other colleges/universities?",
        answer: {
            bullets: [{
                text: "College credits are transferable to Washington State public colleges and universities, and to most private colleges in the state. It is important for students to consult with college admissions representatives and departmental advisors as early as possible. Students should contact out-of-state colleges for their policies on accepting Running Start credits."
            }]
        }
    },
    {
        type: prospectiveByKey.classes,
        question: "What if my student doesn't graduate from high school? Can he/she still do Running Start?",
        answer: {
            bullets: [{
                text: "If your student doesn't graduate from high school with their class, he/she is still eligible to participate in Running Start. However, he/she can take only those classes required to earn the diploma through your high school. If he/she chooses to take classes outside those parameters, the student will be responsible for the tuition and fees. Students are not eligible for federal financial aid until they have a high school diploma or GED®. Make sure your student plans accordingly to finish their diploma with their class."
            }]
        }
    }


];
