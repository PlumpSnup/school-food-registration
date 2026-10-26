export const GRADES = [
  "FS1 / Pre-KG",
  "FS2 / KG1",
  "KG2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
] as const;

export const PLANS = {
  single: "Single meals",
  weekly: "Weekly plan",
  unsure: "Not sure yet",
} as const;

export type Plan = keyof typeof PLANS;
