// Helper functions to generate sequences matching the specification
export function generateSequentialSequence(n) {
    const sequence = []; 
     
    for (let repeat = 0; repeat < 2; repeat++) {
        for (let block = 0; block < 2 * n; block++) {
            sequence.push(block)
        }
    }
    return sequence;
}

export function generateMidRepeatSequence(n) {
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

export function generateRandomSequence(length = 64, mainMemorySize = 1024) {
    const sequence = [];

    for (let i = 0; i < length; i++) {
        const randomBlock = Math.floor(Math.random() * mainMemorySize)
        sequence.push(randomBlock);
    }
    return sequence;
}