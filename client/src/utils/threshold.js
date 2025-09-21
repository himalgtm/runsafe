export function thresholdsFor(profile = {}) {
  const sensitive =
    profile.asthma || profile.cardio || profile.pregnant || profile.child || profile.older;
  // Return AQI cutoffs for the UI
  return sensitive
    ? { good: 0, caution: 80, avoid: 120 }   // tighter
    : { good: 0, caution: 100, avoid: 150 }; // standard-ish
}
