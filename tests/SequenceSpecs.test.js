import { describe, test, expect, vi, beforeEach } from "vitest";
import { CacheSimulator, isPowerOfTwo } from "../src/core/CacheSimulator";
import { LRU, MRU, selectVictim } from "../src/core/Policies";
import { NON_LOAD_THROUGH, LOAD_THROUGH } from "../src/core/StatsCalculator";

// Helper functions to generate sequences matching the specification
function generateSequentialSequence(n) {
    const sequence = []; 
     
    for (let repeat = 0; repeat < 2; repeat++) {
        for (let block = 0; block < 2 * n; block++) {
            sequence.push()
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