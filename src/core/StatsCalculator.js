import { ReadPolicy } from "./Constants";

export function calculateStats({
    cacheHits,
    cacheMisses,
    blockSize,
    readPolicy,
    cacheAccessTime = 1, // default cache access time in cycles 1ns
    memoryAccessTime = 10, // default main memory access time in cycles 10ns
    }) {

    if (readPolicy !== ReadPolicy.NON_LOAD_THROUGH && readPolicy !== ReadPolicy.LOAD_THROUGH) {
        throw new Error(`Unknown read policy: ${readPolicy}`);
    }

    if (cacheHits < 0 || cacheMisses < 0) {
        throw new Error("cacheHits and cacheMisses cannot be negative.");
    }

    if (blockSize < 2) {
        throw new Error("blockSize must be at least 2.");
    }

    if (cacheAccessTime < 0 || memoryAccessTime < 0) {
        throw new Error("Access times cannot be negative.");
    }

    const totalAccesses = cacheHits + cacheMisses;

    if (totalAccesses === 0) {
        return {
            totalAccesses: 0,
            cacheHits: 0,
            cacheMisses: 0,
            hitRate: 0,
            missRate: 0,
            missPenalty: 0,
            averageMemoryAccessTime: 0,
            totalMemoryAccessTime: 0,
        };
    }

    const hitRate = cacheHits / totalAccesses;
    const missRate = cacheMisses / totalAccesses;

    let missPenalty = 0;
    if (readPolicy === ReadPolicy.NON_LOAD_THROUGH) {
        missPenalty = cacheAccessTime + (memoryAccessTime * blockSize) + cacheAccessTime;
    }
    else if (readPolicy === ReadPolicy.LOAD_THROUGH) {
        // load-through policy
        missPenalty = cacheAccessTime + memoryAccessTime;
    }

    const averageMemoryAccessTime = (hitRate * cacheAccessTime) + (missRate * missPenalty);
    const totalMemoryAccessTime = (cacheHits * cacheAccessTime) + (cacheMisses * missPenalty);

    return {
        totalAccesses: totalAccesses,
        cacheHits: cacheHits,
        cacheMisses: cacheMisses,
        hitRate: hitRate,
        missRate: missRate,
        missPenalty: missPenalty,
        averageMemoryAccessTime: averageMemoryAccessTime,
        totalMemoryAccessTime: totalMemoryAccessTime,
    }
}