export const NON_LOAD_THROUGH = "non-load-through";
export const LOAD_THROUGH = "load-through";

export function calculateStats({
    cacheHits,
    cacheMisses,
    blockSize,
    readPolicy,
    cacheAccessTime = 1, // default cache access time in cycles 1ns
    memoryAccessTime = 10, // default main memory access time in cycles 10ns
    }) {
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
    if (readPolicy === NON_LOAD_THROUGH) {
        missPenalty = cacheAccessTime + (memoryAccessTime * blockSize) + cacheAccessTime;
    }
    else if (readPolicy === LOAD_THROUGH) {
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