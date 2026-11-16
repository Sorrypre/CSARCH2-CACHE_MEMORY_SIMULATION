import { describe, test, expect, vi, beforeEach } from "vitest";
import { CacheSimulator, isPowerOfTwo } from "../src/core/CacheSimulator";
import { LRU, MRU, selectVictim } from "../src/core/Policies";

// Design of the test follow standard QA patterns
// AAA 
// Arrange
// Act
// Assert

// Added clearMocks: true in vite.config.js so that I do not have to call clearAllMocks() before every test

vi.mock('../src/core/Policies', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual, // keep original constraints except selectVictim which is mocked
        selectVictim: vi.fn()
    };
});

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

describe('CacheSimulator', () => {
    describe('constructor', () => {
        test('initializes cache geometry correctly', () => {
            // Simulated Cache Memory: 8 blocks, blockSize 4, 4-way associative so 2 sets
            const simulatedCache = new CacheSimulator(8, 4, 'read-through', LRU);

            expect(simulatedCache.cacheSize).toBe(32); // 8 * 4 = 32
            expect(simulatedCache.numOfSets).toBe(2); // 8 / 4 (4 way associative) = 2
            expect(simulatedCache.cache.length).toBe(2); // must be the same as the number of sets
            expect(simulatedCache.cache[0].length).toBe(4); // Check first set to contain 4 cache lines
        });
        test('does not throw an error for valid numberOfBlocks or blockSize', () => {
            expect(() => new CacheSimulator(4, 8, 'read-through', LRU)).not.toThrow();
            expect(() => new CacheSimulator(512, 8, 'read-through', LRU)).not.toThrow();
            expect(() => new CacheSimulator(4, 512, 'read-through', LRU)).not.toThrow();
            expect(() => new CacheSimulator(8, 8, 'read-through', LRU)).not.toThrow();
        });
        test('throws an error for invalid numberOfBlocks or blockSize', () => {
            expect(() => new CacheSimulator(2, 4, 'read-through', LRU)).toThrow(); // invalid number of block 2 < 4
            expect(() => new CacheSimulator(8, 1, 'read-through', LRU)).toThrow(); // invalid block size 1 < 2
            expect(() => new CacheSimulator(6, 4, 'read-through', LRU)).toThrow(); // invalid number of block, not a power of 2
            expect(() => new CacheSimulator(8, 3, 'read-through', LRU)).toThrow(); // invalid block size, not a power of 2
        });
        test('throws an error for number of cache blocks at or exceeding 1024 blocks (main memory block size)', () => {
            expect(() => new CacheSimulator(1024, 8, 'read-through', LRU)).toThrow();
            expect(() => new CacheSimulator(2048, 8, 'read-through', LRU)).toThrow();
        });
        describe('accessBlock bounds', () => {
            test('throws an error when blockNumber is out of bounds (0-1023)', () => {
                const simulatedCache = new CacheSimulator(8, 4, 'read-through', LRU);
                expect(() => simulatedCache.accessBlock(-1)).toThrow('out of bounds');
                expect(() => simulatedCache.accessBlock(1024)).toThrow('out of bounds');
                expect(() => simulatedCache.accessBlock(0)).not.toThrow('out of bounds');
                expect(() => simulatedCache.accessBlock(1023)).not.toThrow('out of bounds');
            });
        });

        describe('hits, misses, and set mapping', () => {
            test('register a MISS on a cold start and a HIT on subsequent access', () => {
                const simulatedCache = new CacheSimulator(8, 4, 'read-through', LRU);
                
                const firstAccess = simulatedCache.accessBlock(4); // Set 0, even, Tag 2 is MISS
                expect(firstAccess).toBe(false);
                expect(simulatedCache.cache_misses).toBe(1); // count of miss updated to 1
                expect(simulatedCache.cache_hits).toBe(0); // no hits yet

                const secondAccess = simulatedCache.accessBlock(4); // Access the previous missed block, HIT
                expect(secondAccess).toBe(true);
                expect(simulatedCache.cache_misses).toBe(1);
                expect(simulatedCache.cache_hits).toBe(1); // now there is a HIT
                expect(simulatedCache.cache[0][0].lastUsed).toBe(2)
            });
        });
        describe('eviction behavior', () => {
            test('evicts the victim way chosen by selectVictim when a set is full', () => {
                const simulatedCache = new CacheSimulator(8, 4, 'read-through', LRU);
                selectVictim.mockReturnValue(2) //force eviction at Way 2 to isolate

                // 0,2,4,6 all go to set 0
                simulatedCache.accessBlock(0);
                simulatedCache.accessBlock(2);
                simulatedCache.accessBlock(4); // this will be the one evicted because we forced it
                simulatedCache.accessBlock(6);


                const result = simulatedCache.accessBlock(8);

                expect(result).toBe(false);
                expect(selectVictim).toHaveBeenCalledTimes(1);
                expect(simulatedCache.cache[0][2].blockNumber).toBe(8);
                expect(simulatedCache.snapshots.at(-1).evictedBlock).toBe(4) //last item which is most recent snapshot [sim.snapshots.length - 1]
                expect(simulatedCache.snapshots.at(-1).logMessage).toContain('Evicted Block 4 at Way 2'); // Verify log message
            });
        })
    })
})

