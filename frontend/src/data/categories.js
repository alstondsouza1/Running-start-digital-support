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
      id: "how-to-get-started",
      name: "How to Get Started",
      description: "Steps to begin, enrollment basics, and first-time guidance",
    },
    {
      id: "cost-financial-assistance",
      name: "Cost and Financial Assistance",
      description: "Costs, fees, waivers, and financial help options",
    },
    {
      id: "dates-deadlines",
      name: "Dates & Deadlines",
      description: "Key deadlines, timelines, and important dates",
    },
    {
      id: "life-as-a-running-start-student",
      name: "Life as a Running Start Student",
      description: "What to expect, workload, campus life, and readiness",
    },
  ],
};

// lookup by id for code that needs categorySets.prospective.[id]
export const prospectiveByKey = Object.fromEntries(
  categorySets.prospective.map((c) => [c.id, c])
);
