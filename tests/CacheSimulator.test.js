import { describe, test, expect, vi, beforeEach } from "vitest";
import { CacheSimulator, isPowerOfTwo } from "../src/core/CacheSimulator";
import { selectVictim } from "../src/core/Policies";

// Design of the test follow standard QA patterns
// AAA 
// Arrange
// Act
// Assert

// Added clearMocks: true in vite.config.js so that I do not have to call clearAllMocks() before every test

// Test for isPowerOfTwo function
describe('isPowerOfTwo', () => {
    test('should return true with valid powers of 2', () => {
        expect(isPowerOfTwo(1)).toBe(true);
        expect(isPowerOfTwo(1024)).toBe(true);
        expect(isPowerOfTwo(1073741824)).toBe(true)
    });
    test('should return false with invalid powers of 2', () => {
        expect(isPowerOfTwo(6)).toBe(false);
        expect(isPowerOfTwo(7)).toBe(false);
        expect(isPowerOfTwo(21)).toBe(false);
    });
    test('should return false with zero and negative numbers', () => {
        expect(isPowerOfTwo(0)).toBe(false);
        expect(isPowerOfTwo(-2)).toBe(false);
    });
});

