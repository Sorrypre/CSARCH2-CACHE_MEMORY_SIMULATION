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
}

/*
This function checks if a given number is a power of two.
 */
const isPowerOfTwo = (n) => {
    return n > 0 && (n & (n - 1)) === 0;
}