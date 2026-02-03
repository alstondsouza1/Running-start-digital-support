export const categorySets = {
  current: [
    {
      id: "enrollment",
      name: "Enrollment",
      description: "Registration holds, deadlines, and schedule changes",
    },
    {
      id: "classes",
      name: "Classes",
      description: "What you can take, online learning, transfer credits",
    },
    {
      id: "records-support",
      name: "Records & Support",
      description: "Blocked records, placement help, advising steps",
    },
    {
      id: "policies",
      name: "Policies & Other",
      description: "FERPA, moving districts, general program rules",
    },
  ],

  prospective: [
    {
      id: "general",
      name: "General Questions",
      description: "What Running Start is and whether it's a good fit",
    },
    {
      id: "eligibility",
      name: "Eligibility",
      description: "Who qualifies, age/grade, placement requirements",
    },
    {
      id: "registration",
      name: "Registration & Enrollment",
      description: "Deadlines, assessment, how to start the process",
    },
    {
      id: "classes",
      name: "Classes & Credits",
      description: "Allowed courses, online classes, credit transfer",
    },
    {
      id: "other",
      name: "Other",
      description: "Questions non-directly related to other categories",
    },
  ],
};

// Lookup by id for code that needs categorySets.prospective.[id]
export const prospectiveByKey = Object.fromEntries(
  categorySets.prospective.map((c) => [c.id, c])
);
