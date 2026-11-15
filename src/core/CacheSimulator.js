class CacheSimulator {
    /*
    This class simulates a cache memory system.
    It takes in the number of blocks, block size, and read policy as parameters.
    The cache size is calculated based on the number of blocks and block size.
     */
    constructor(numberOfBlocks, blockSize, readPolicy, replacementPolicy) {
        if (numberOfBlocks < 4 && !isPowerOfTwo(numberOfBlocks)) {
            throw new Error("Number of blocks must be at least 4 and a power of two.");
        }

        if (blockSize < 2 && !isPowerOfTwo(blockSize)) {
        throw new Error("Block size must be at least 2 and a power of two.");
        }

        this.numberOfBlocks = numberOfBlocks;
        this.blockSize = blockSize;
        this.readPolicy = readPolicy;
        replacementPolicy = "LRU"; // default replacement policy is LRU
    }

    mainMemory = 1024  //1024 bytes of main memory
    cacheSize = this.numberOfBlocks * this.blockSize;
    numOfSets = this.cacheSize / this.blockSize;
}

/*
This function checks if a given number is a power of two.
 */
const isPowerOfTwo = (n) => {
    return n > 0 && (n & (n - 1)) === 0;
}