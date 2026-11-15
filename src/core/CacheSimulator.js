class CacheSimulator {
    /*
    This class simulates a cache memory system.
    It takes in the number of blocks, block size, and read policy as parameters.
    The cache size is calculated based on the number of blocks and block size.
     */
    constructor(numberOfBlocks, blockSize, readPolicy, replacementPolicy) {
        if (numberOfBlocks < 4 && !isPowerOfTwo(numberOfBlocks)) {
            throw new Error("numberOfBlocks must be at least 4 and a power of two.");
        }

        if (blockSize < 2 && !isPowerOfTwo(blockSize)) {
        throw new Error("blockSize must be at least 2 and a power of two.");
        }

        this.numberOfBlocks = numberOfBlocks;
        this.blockSize = blockSize;
        this.readPolicy = readPolicy;
        replacementPolicy = "LRU";      // default replacement policy is LRU
        this.mainMemory = 1024          //1024 bytes of main memory
        this.cacheSize = this.numberOfBlocks * this.blockSize;
        this.numOfSets = this.cacheSize / this.blockSize;
        this.associativity = 4          //4-way block set associative cache

        this.cache = Array.from({ length: this.numOfSets }, () =>
            Array.from({ length: this.associativity }, () => ({
                valid: false,           // Indicates if the cache block is valid
                tag: null,              //Indicates the tag of the cache block
                lastUsed: 0,            //Indicates the last time the cache block was used
                blockNumber: null,      //Indicates the block number of the cache block
            }))
        );
    }

    /*
    This method simulates accessing a block in the cache.
    The block number is the index of the block in the main memory.
     */
    accessBlock(blockNumber) {
        if (blockNumber < 0 || blockNumber >= this.mainMemory / this.blockSize) {
            throw new Error("Block number is out of bounds.");
        }
        this.step += 1; // Increment the step counter for each access

        const setIndex = blockNumber % this.numOfSets;
        const tag = Math.floor(blockNumber / this.numOfSets);
        const set = this.cache[this.setIndex];

        // Check if the block is already in the cache
        const isHit = set.findIndex((block) => block.valid && block.tag === tag);
        if (isHit !== -1) {
            // Cache hit
            set[isHit].lastUsed = this.step; // Update the last used time
            this.cache_hits += 1; // Increment the hit counter
            return true; // Return true for a cache hit
        }

        //Cache Miss
        this.cache_misses += 1; // Increment the miss counter

        // Find an empty block in the set
        const emptyBlockIndex = set.findIndex((block) => !block.valid);

        if (emptyBlockIndex !== -1) {
            // If there is an empty block, use it
            set[emptyBlockIndex] = {
                valid: true,
                tag: tag,
                lastUsed: this.step,
                blockNumber: blockNumber,
            };
        } else {
            // Set is full, replace a block based on the replacement policy
            // INSERT LRU and MRU replacement function here
        }
    }
}

/*
This function checks if a given number is a power of two.
 */
const isPowerOfTwo = (n) => {
    return n > 0 && (n & (n - 1)) === 0;
}