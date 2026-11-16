import { selectVictim } from "./Policies.js";

export class CacheSimulator {
    /*
    This class simulates a cache memory system.
    It takes in the number of blocks, block size, and read policy as parameters.
    The cache size is calculated based on the number of blocks and block size.
     */
    constructor(numberOfBlocks, blockSize, readPolicy, replacementPolicy) {
        if (numberOfBlocks < 4 || !isPowerOfTwo(numberOfBlocks)) {
            throw new Error("numberOfBlocks must be at least 4 and a power of two.");
        }

        if (blockSize < 2 || !isPowerOfTwo(blockSize)) {
        throw new Error("blockSize must be at least 2 and a power of two.");
        }

        this.numberOfBlocks = numberOfBlocks;
        this.blockSize = blockSize;
        this.readPolicy = readPolicy;
        this.replacementPolicy = replacementPolicy;      // default replacement policy is LRU

        this.mainMemory = 1024          //1024 bytes of main memory
        this.associativity = 4          //4-way block set associative cache
        this.cacheSize = this.numberOfBlocks * this.blockSize;
        this.numOfSets = this.numberOfBlocks / this.associativity;

        this.reset()
    }


    /*
    This method resets the cache simulator to its initial state.
     */
    reset() {
        this.step = 0; // Step counter to track the order of accesses
        this.cache_hits = 0; // Counter for cache hits
        this.cache_misses = 0; // Counter for cache misses
        this.snapshots = []; // Array to store snapshots of the cache state

        this.cache = Array.from({ length: this.numOfSets }, () =>
            Array.from({ length: this.associativity }, () => ({
                valid: false,
                tag: null,
                lastUsed: 0,
                blockNumber: null,
            }))
        );
    }

    /*
    This method runs a sequence of block accesses on the cache simulator.
     */
    run(sequence) {
        this.reset(); // Reset the cache before running the sequence

        for (const blockNumber of sequence) {
            this.accessBlock(blockNumber)
        }

        return this.snapshots; // Return the snapshots of the cache state
    }

    /*
    Helper function to record the state of the cache after each access.
        blockNumber: The block number being accessed.
        setIndex: The index of the set in the cache.
        tag: The tag of the block being accessed.
        way: The way (0-3) in the set where the block is stored.
        status: "HIT" or "MISS" indicating whether the access was a hit or a miss.

     */
    recordSnapshot({ blockNumber, setIndex, tag, way, status, evictedBlock }) {
        const cacheGridCopy = structuredClone(this.cache); // Deep copy of the cache state
        let logMessage = "";

        if (status === "HIT") {
            logMessage = `Step ${this.step}: Access Block ${blockNumber} (Set ${setIndex}, Tag ${tag}) - HIT [Way ${way}]`;
        } else if (status === "MISS" && evictedBlock != null) {
            logMessage = `Step ${this.step}: Access Block ${blockNumber} (Set ${setIndex}, Tag ${tag}) - MISS [Evicted Block ${evictedBlock} at Way ${way}]`;
        } else {
            logMessage = `Step ${this.step}: Access Block ${blockNumber} (Set ${setIndex}, Tag ${tag}) - MISS [Loaded into empty Way ${way}]`;
        }

        this.snapshots.push({
            step: this.step,
            blockNumber,
            setIndex,
            tag,
            way,
            status,
            evictedBlock,
            logMessage,
            cacheGrid: cacheGridCopy,
        });
    }

    /*
    This method simulates accessing a block in the cache.
    The block number is the index of the block in the main memory.
     */
    accessBlock(blockNumber) {
        if (blockNumber < 0 || blockNumber >= this.mainMemory) {
            throw new Error(`Block number ${blockNumber} is out of bounds (0–1023).`);
            }
        this.step += 1; // Increment the step counter for each access

        const setIndex = blockNumber % this.numOfSets;
        const tag = Math.floor(blockNumber / this.numOfSets);
        const set = this.cache[setIndex];

        //Check if Cache Hit
        const hitIndex = set.findIndex((block) => block.valid && block.tag === tag);
        if (hitIndex !== -1) {
            set[hitIndex].lastUsed = this.step;
            this.cache_hits += 1;
            this.recordSnapshot({ blockNumber, setIndex, tag, way: hitIndex, status: "HIT", evictedBlock: null });
            return true;
        }

        //Cache Miss
        this.cache_misses += 1; // Increment the miss counter

        // Find an empty block in the set
        const emptyBlockIndex = set.findIndex((block) => !block.valid);

        if (emptyBlockIndex !== -1) {
            set[emptyBlockIndex] = {
                valid: true,
                tag,
                lastUsed: this.step,
                blockNumber,
            };
            this.recordSnapshot({ blockNumber, setIndex, tag, way: emptyBlockIndex, status: "MISS", evictedBlock: null });
        } else {
            // Cache Miss & Set Full: Evict via LRU or MRU
            const victimWay = selectVictim(set, this.replacementPolicy);
            const evictedBlock = set[victimWay].blockNumber;

            set[victimWay] = {
                valid: true,
                tag,
                lastUsed: this.step,
                blockNumber,
            };
            this.recordSnapshot({ blockNumber, setIndex, tag, way: victimWay, status: "MISS", evictedBlock });
        }
        return false;
    }
}

/*
This function checks if a given number is a power of two.
 */
const isPowerOfTwo = (n) => {
    return n > 0 && (n & (n - 1)) === 0;
}