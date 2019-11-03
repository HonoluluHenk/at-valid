/**
 * For use in tests that need number veeeery close to a specific threshold.
 * Usage e.g.: const actual = someNumber + VERY_SMALL_NUMBER.
 * Background: adding/substracting just Number.EPSILON ist not enough since the result might get truncated
 * and EPSILON is lost.
 * In empirical studies :), 3 * EPSILON is enough to bypass this effect.
 */
export const VERY_SMALL_NUMBER = 3 * Number.EPSILON;
