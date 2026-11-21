/**
 * Policies.js
 * -----------------------------------------------------------------------------
 * Replacement policies for the 4-Way Block Set Associative (BSA) cache.
 *
 * `lastUsed` is a timestamp: the simulator's step counter at the moment the line
 * was last loaded or hit. A bigger number means "used more recently". Because the
 * step counter goes up by 1 on every access, no two valid lines in a set can ever
 * share the same lastUsed value, so there are never ties to break.
 */

import { ReplacementPolicy } from "./Constants";

/**
 * Pick which way (0-3) to evict from a FULL set.
 *
 *   ReplacementPolicy.LRU -> the line with the SMALLEST lastUsed (oldest use)
 *   ReplacementPolicy.MRU -> the line with the LARGEST  lastUsed (newest use)
 *
 * @param {Array}  set    - the 4 lines of one cache set
 * @param {string} policy - "ReplacementPolicy.LRU" or "ReplacementPolicy.MRU"
 * @returns {number} index of the way that should be replaced
 */
export function selectVictim(set, policy) {
    if (policy !== ReplacementPolicy.LRU && policy !== ReplacementPolicy.MRU) {
        throw new Error(`Unknown replacement policy: ${policy}`);
    }

    let victim = 0; // start by assuming way 0 is the victim

    for (let way = 1; way < set.length; way++) {
        const candidate = set[way].lastUsed;
        const current = set[victim].lastUsed;

        // ReplacementPolicy.LRU keeps the smallest timestamp, ReplacementPolicy.MRU keeps the largest.
        const isBetterVictim = policy === ReplacementPolicy.LRU ? candidate < current : candidate > current;

        if (isBetterVictim) victim = way;
    }

    return victim;
}