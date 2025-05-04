export type StrengthLabel =
  | "very-weak"
  | "weak"
  | "fair"
  | "good"
  | "strong";

export interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: StrengthLabel;
}

/**
 * Basic password‑strength estimator.
 * Scoring rules (adder per criterion):
 *   • length ≥  8  → 1
 *   • length ≥ 12  → 1 (stacks with the first)
 *   • mixed case   → 1
 *   • numbers      → 1
 *   • symbols      → 1
 *
 */
export function evaluatePassword(pw: string): StrengthResult {
  let score = 0;
  const feedback: string[] = [];

  if (pw.length >= 8) {
    score += 1;
  } else {
    feedback.push("at least 8 characters");
  }
  if (pw.length >= 12) {
    score += 1;
  } else {
    feedback.push("12+ characters for extra strength");
  }

  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) {
    score += 1;
  } else {
    feedback.push("mix upper and lower case");
  }

  if (/\d/.test(pw)) {
    score += 1;
  } else {
    feedback.push("include numbers");
  }

  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) {
    score += 1;
  } else {
    feedback.push("add a symbol");
  }

  const labelMap: StrengthLabel[] = [
    "very-weak",
    "weak",
    "fair",
    "good",
    "strong",
  ];
  const cappedScore = Math.min(score, 4) as StrengthResult["score"];

  return {
    score: cappedScore,
    label: labelMap[cappedScore]
  };
}
