// Specs Constraints
export const MAIN_MEMORY_BLOCKS = 1024;
export const MAX_CACHE_BLOCKS = MAIN_MEMORY_BLOCKS / 2;    // 512

// Constants
// Javascript has no enum so we are just going to use Object. freeze
// Source: https://www.geeksforgeeks.org/javascript/enums-in-javascript/
export const ReadPolicy = Object.freeze({
    NON_LOAD_THROUGH: "non-load-through",
    LOAD_THROUGH: "load-through"
});

export const ReplacementPolicy = Object.freeze({
   LRU: "LRU",
   MRU: "MRU" 
});

export const AccessStatus = Object.freeze({
    MISS: "MISS",
    HIT: "HIT"
});