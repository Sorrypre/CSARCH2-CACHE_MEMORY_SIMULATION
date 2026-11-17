import { describe, test, expect, vi, beforeEach } from "vitest";
import { CacheSimulator, isPowerOfTwo } from "../src/core/CacheSimulator";
import { LRU, MRU, selectVictim } from "../src/core/Policies";
import { NON_LOAD_THROUGH, LOAD_THROUGH } from "../src/core/StatsCalculator";

// Helper functions to generate sequences matching the specification
function generateSequentialSequence(n) {
    const sequence = []; 
     
    for (let repeat = 0; repeat < 2; repeat++) {
        for (let block = 0; block < 2 * n; block++) {
            sequence.push(block)
        }
    }
    return sequence;
}

function generateMidRepeatSequence(n) {
    const sequence = [];

    for (let block = 0; block <= n - 1; block++) {
        sequence.push(block);
    }

    for (let repeat = 0; repeat < 2; repeat++) {
        for (let block = 0; block <= (2 * n) - 1; block++) {
            sequence.push(block);
        }
    }
    for (let block = n - 1; block >= 0; block--) {
        sequence.push(block);
    }
    for (let repeat = 0; repeat < 2; repeat++) {
        for (let block = (2 * n) - 1; block >= 0; block--) {
            sequence.push(block);
        }
    }
    return sequence;
}

function generateRandomSequence(length = 64, mainMemorySize = 1024) {
    const sequence = [];

    for (let i = 0; i < length; i++) {
        const randomBlock = Math.floor(Math.random() * mainMemorySize)
        sequence.push(randomBlock);
    }
    return sequence;
}

describe('Sequence Tests (4-Way BSA: LRU vs MRU', () => {
    const n = 4;
    const blockSize = 2

    test('Test 1: Sequential sequence', () => {
        const seq = generateSequentialSequence(n);
        expect(seq).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7]);

        const lruSim = new CacheSimulator(n, blockSize, NON_LOAD_THROUGH, LRU);
        const mruSim = new CacheSimulator(n, blockSize, NON_LOAD_THROUGH, MRU);

        lruSim.run(seq);
        mruSim.run(seq);

        //EXPECTED: LRU suffers 100% misses on 2n sequential loops
        expect(lruSim.cache_hits).toBe(0);
        expect(lruSim.cache_misses).toBe(16);

        //EXPECTED: MRU retains block 0, 1, 2, 7
        expect(mruSim.cache_hits).toBe(4);
        expect(mruSim.cache_misses).toBe(12);

        //EXPECTED: MRU has more hits than the LRU
        expect(mruSim.cache_hits).toBeGreaterThan(lruSim.cache_hits);
    });

    test('Test 2: Mid-Repeat Blocks Sequence', () => {
        const seq = generateMidRepeatSequence(n);
        expect(seq).toEqual([0, 1, 2, 3, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0]);

        const lruSim = new CacheSimulator(n, blockSize, NON_LOAD_THROUGH, LRU);
        const mruSim = new CacheSimulator(n, blockSize, NON_LOAD_THROUGH, MRU);

        const lruSnapshots = lruSim.run(seq);
        const mruSnapshots = mruSim.run(seq);

        //EXPECTED: HIT on 5,6,7,8
        expect(lruSim.cache_hits).toBe(4);
        expect(lruSim.cache_misses).toBe(36);

        //EXPECTED: HIT on 5,6,7,8,13,14,15,20,23,24,26,30,31,33,37,38,40
        expect(mruSim.cache_hits).toBe(17);
        expect(mruSim.cache_misses).toBe(23);

        expect(lruSnapshots).toHaveLength(seq.length);
        expect(mruSnapshots).toHaveLength(seq.length);

        expect(lruSim.cache_hits + lruSim.cache_misses).toBe(seq.length);
        expect(mruSim.cache_hits + mruSim.cache_misses).toBe(seq.length);
    });
    test('Test 3: Random Sequence', () => {
        const seq = generateRandomSequence()
        expect(seq).toHaveLength(64) //we cannot check the actual values cause its random but we can check the length
        expect(seq.every((block) => block >= 0 && block < 1024)).toBe(true);

        const lruSim = new CacheSimulator(16, 16, LOAD_THROUGH, LRU);
        const mruSim = new CacheSimulator(16, 16, LOAD_THROUGH, LRU);

        lruSim.run(seq);
        mruSim.run(seq);

        expect(lruSim.cache_hits + lruSim.cache_misses).toBe(seq.length);
        expect(mruSim.cache_hits + mruSim.cache_misses).toBe(seq.length)
    });

});