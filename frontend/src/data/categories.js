export const categorySets = {
  current: [
    {
      id: "fee-waiver-book-loan",
      name: "Fee Waiver & Book Loan",
      description: "Fee waiver steps, book loan info, and related support",
    },
    {
      id: "how-to-plan-classes",
      name: "How to Plan Classes",
      description: "Advising, planning schedules, and choosing classes",
    },
    {
      id: "dates-deadlines",
      name: "Dates & Deadlines",
      description: "Enrollment deadlines, important dates, and term timelines",
    },
    {
      id: "campus-resources",
      name: "Campus Resources",
      description: "Support services, offices, and student resources at GRC",
    },
  ],

  prospective: [
    {
      id: "general",
      name: "General Questions",
      description: "Program overview, eligibility, and participation basics",
    },
    {
      id: "enrollment",
      name: "Enrollment",
      description: "Deadlines, placement, and getting registered",
    },
    {
      id: "classes",
      name: "Classes",
      description: "Allowed courses, online learning, transfer, and degrees",
    },
    {
      id: "other",
      name: "Other",
      description: "Moving districts, FERPA, and parent/guardian info",
    },
  ],  
};

// lookup by id for code that needs categorySets.prospective.[id]
export const prospectiveByKey = Object.fromEntries(
  categorySets.prospective.map((c) => [c.id, c])
);
