export function ieltsRound(score: number | null | undefined): number {
  if (score === null || score === undefined || isNaN(score)) {
    return 0.0;
  }

  // Get the integer and decimal parts
  const integerPart = Math.floor(score);
  let decimalPart = score - integerPart;
  
  // Round to 2 decimal places to handle floating point precision
  decimalPart = Math.round(decimalPart * 100) / 100;
  
  // Apply IELTS rounding rules
  if (decimalPart === 0.0 || decimalPart === 0.5) {
    // No change needed
    return integerPart + decimalPart;
  } else if (decimalPart === 0.25) {
    // Round up to .5
    return integerPart + 0.5;
  } else if (decimalPart === 0.75) {
    // Round up to next whole number
    return integerPart + 1.0;
  } else if (decimalPart === 0.2 || decimalPart === 0.3) {
    // Round down to .0
    return integerPart;
  } else if (decimalPart === 0.7 || decimalPart === 0.8) {
    // Round up to .5
    return integerPart + 0.5;
  } else if (decimalPart < 0.25) {
    // Round down to .0 (for values like .1, .15)
    return integerPart;
  } else if (decimalPart < 0.5) {
    // Round up to .5 (for values like .35, .4, .45)
    return integerPart + 0.5;
  } else if (decimalPart < 0.75) {
    // Round down to .5 (for values like .55, .6, .65)
    return integerPart + 0.5;
  } else {
    // Round up to next whole number (for values like .85, .9, .95)
    return integerPart + 1.0;
  }
}

/**
 * Format a score using IELTS rounding and display format.
 * Shows whole numbers without decimal (e.g., "7") and half scores with one decimal (e.g., "7.5").
 */
export function formatIeltsScore(score: number | null | undefined): string {
  const roundedScore = ieltsRound(score);
  
  // If it's a whole number, show without decimal
  if (roundedScore % 1 === 0) {
    return roundedScore.toString();
  }
  
  // Otherwise show with one decimal place
  return roundedScore.toFixed(1);
}

/**
 * Test cases for IELTS rounding - useful for debugging
 */
export const ieltsRoundingTestCases = [
  { input: 7.25, expected: 7.5 },
  { input: 7.2, expected: 7.0 },
  { input: 7.3, expected: 7.5 },
  { input: 7.75, expected: 8.0 },
  { input: 7.8, expected: 8.0 },
  { input: 7.0, expected: 7.0 },
  { input: 7.5, expected: 7.5 },
  { input: 6.1, expected: 6.0 },
  { input: 6.15, expected: 6.0 },
  { input: 6.35, expected: 6.5 },
  { input: 6.4, expected: 6.5 },
  { input: 6.45, expected: 6.5 },
  { input: 6.55, expected: 6.5 },
  { input: 6.6, expected: 6.5 },
  { input: 6.65, expected: 6.5 },
  { input: 6.85, expected: 7.0 },
  { input: 6.9, expected: 7.0 },
  { input: 6.95, expected: 7.0 },
];

/**
 * Run test cases to verify IELTS rounding implementation
 */
export function testIeltsRounding(): boolean {
  console.log('🧪 Testing IELTS Rounding...');
  
  let passed = 0;
  let failed = 0;
  
  ieltsRoundingTestCases.forEach(({ input, expected }) => {
    const result = ieltsRound(input);
    const success = result === expected;
    
    if (success) {
      passed++;
    } else {
      failed++;
      console.error(`❌ FAIL: ${input} → ${result} (expected ${expected})`);
    }
  });
  
  const total = ieltsRoundingTestCases.length;
  console.log(`✅ IELTS Rounding Tests: ${passed}/${total} passed, ${failed} failed`);
  
  return failed === 0;
}