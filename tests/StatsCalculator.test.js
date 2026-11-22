import { describe, test, expect } from 'vitest';
import { calculateStats } from '../src/core/StatsCalculator.js'; // Adjust path to match your folder structure
import { CacheSimulator } from '../src/core/CacheSimulator.js';
import { ReadPolicy, ReplacementPolicy } from "../src/core/Constants";

describe('StatsCalculator - calculateStats', () => {
    // 1. Edge Case: Zero Total Accesses (Prevents division-by-zero NaN)
    test('returns all zeros when totalAccesses is 0', () => {
        const stats = calculateStats({
            cacheHits: 0,
            cacheMisses: 0,
            blockSize: 4,
            readPolicy: ReadPolicy.NON_LOAD_THROUGH,
        });

        expect(stats).toEqual({
            totalAccesses: 0,
            cacheHits: 0,
            cacheMisses: 0,
            hitRate: 0,
            missRate: 0,
            missPenalty: 0,
            averageMemoryAccessTime: 0,
            totalMemoryAccessTime: 0,
        });
    });

    // 2. Non-Load-Through Policy Calculation
    test('computes Non-load-through metrics accurately with default access times', () => {
        // Default: cacheAccessTime = 1, memoryAccessTime = 10
        // missPenalty = 1 + (10 * 4) + 1 = 42
        // hitRate = 4 / 16 = 0.25, missRate = 12 / 16 = 0.75
        // Average Memory Access Time = (0.25 * 1) + (0.75 * 42) = 31.75
        // Total = (4 * 1) + (12 * 42) = 508
        const stats = calculateStats({
            cacheHits: 4,
            cacheMisses: 12,
            blockSize: 4,
            readPolicy: ReadPolicy.NON_LOAD_THROUGH,
        });

        expect(stats.totalAccesses).toBe(16);
        expect(stats.hitRate).toBe(0.25);
        expect(stats.missRate).toBe(0.75);
        expect(stats.missPenalty).toBe(42);
        expect(stats.averageMemoryAccessTime).toBeCloseTo(31.75);
        expect(stats.totalMemoryAccessTime).toBe(508);
    });

    // 3. Load-Through Policy Calculation
    test('computes Load-through metrics accurately and outperforms Non-load-through', () => {
        // Default: cacheAccessTime = 1, memoryAccessTime = 10
        // missPenalty = 1 + 10 = 11 (independent of blockSize)
        // Average Memory Access Time = (0.25 * 1) + (0.75 * 11) = 8.5
        // Total = (4 * 1) + (12 * 11) = 136
        const nonLoadStats = calculateStats({
            cacheHits: 4,
            cacheMisses: 12,
            blockSize: 4,
            readPolicy: ReadPolicy.NON_LOAD_THROUGH,
        });

        const loadStats = calculateStats({
            cacheHits: 4,
            cacheMisses: 12,
            blockSize: 4,
            readPolicy: ReadPolicy.LOAD_THROUGH,
        });

        expect(loadStats.missPenalty).toBe(11);
        expect(loadStats.averageMemoryAccessTime).toBeCloseTo(8.5);
        expect(loadStats.totalMemoryAccessTime).toBe(136);

        // Load-through must always have lower access times than Non-load-through when misses > 0
        expect(loadStats.averageMemoryAccessTime).toBeLessThan(nonLoadStats.averageMemoryAccessTime);
        expect(loadStats.totalMemoryAccessTime).toBeLessThan(nonLoadStats.totalMemoryAccessTime);
    });

    // 4. Boundary Cases: 100% Hits and 100% Misses
    test('handles 100% hit rate and 100% miss rate boundaries', () => {
        const allHits = calculateStats({
            cacheHits: 10,
            cacheMisses: 0,
            blockSize: 8,
            readPolicy: ReadPolicy.NON_LOAD_THROUGH,
        });

        expect(allHits.hitRate).toBe(1);
        expect(allHits.missRate).toBe(0);
        expect(allHits.averageMemoryAccessTime).toBe(1);
        expect(allHits.totalMemoryAccessTime).toBe(10);

        const allMisses = calculateStats({
            cacheHits: 0,
            cacheMisses: 10,
            blockSize: 8,
            readPolicy: ReadPolicy.LOAD_THROUGH,
        });

        expect(allMisses.hitRate).toBe(0);
        expect(allMisses.missRate).toBe(1);
        expect(allMisses.averageMemoryAccessTime).toBe(11);
        expect(allMisses.totalMemoryAccessTime).toBe(110);
    });

    // 5. Custom Access Times
    test('respects custom cacheAccessTime and memoryAccessTime overrides', () => {
        // missPenalty = 2 + (20 * 2) + 2 = 44
        // AMAT = (0.5 * 2) + (0.5 * 44) = 23
        // Total = (2 * 2) + (2 * 44) = 92
        const stats = calculateStats({
            cacheHits: 2,
            cacheMisses: 2,
            blockSize: 2,
            readPolicy: ReadPolicy.NON_LOAD_THROUGH,
            cacheAccessTime: 2,
            memoryAccessTime: 20,
        });

        expect(stats.missPenalty).toBe(44);
        expect(stats.averageMemoryAccessTime).toBe(23);
        expect(stats.totalMemoryAccessTime).toBe(92);
    });

    // 6. End-to-End Integration with CacheSimulator
    test('integrates cleanly with CacheSimulator simulation results', () => {
        const sim = new CacheSimulator(4, 2, ReadPolicy.NON_LOAD_THROUGH, ReplacementPolicy.MRU);
        sim.run([0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7]); // 4 hits, 12 misses

        const stats = calculateStats({
            cacheHits: sim.cache_hits,
            cacheMisses: sim.cache_misses,
            blockSize: sim.blockSize,
            readPolicy: sim.readPolicy,
        });

        expect(stats.totalAccesses).toBe(16);
        expect(stats.hitRate).toBe(0.25);
        expect(stats.missPenalty).toBe(22); // 1 + (10 * 2) + 1
        expect(stats.averageMemoryAccessTime).toBeCloseTo(16.75);
        expect(stats.totalMemoryAccessTime).toBe(268);
    });
});