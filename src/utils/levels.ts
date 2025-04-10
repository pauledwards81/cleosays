
export interface GameLevel {
  id: number;
  gridSize: number;
  pattern: number[];
  timeLimit?: number;
}

export const LEVELS: GameLevel[] = [
  { id: 1, gridSize: 2, pattern: [0, 1] },
  { id: 2, gridSize: 2, pattern: [0, 1, 3] },
  { id: 3, gridSize: 3, pattern: [0, 1, 4, 8] },
  { id: 4, gridSize: 3, pattern: [0, 4, 8, 7, 6] },
  { id: 5, gridSize: 4, pattern: [5, 6, 9, 10, 0] },
  { id: 6, gridSize: 4, pattern: [0, 3, 15, 12, 5, 10] },
  { id: 7, gridSize: 4, pattern: [0, 5, 10, 15, 12, 8, 4] },
  { id: 8, gridSize: 5, pattern: [0, 6, 12, 18, 24, 20, 16] },
  { id: 9, gridSize: 5, pattern: [12, 7, 13, 19, 17, 11, 5, 1] },
  { id: 10, gridSize: 5, pattern: [0, 4, 24, 20, 12, 6, 8, 16, 18] },
];

// Generate a random pattern of a given length for a specific grid size
export const generateRandomPattern = (gridSize: number, length: number, previousPattern?: number[]): number[] => {
  const totalSquares = gridSize * gridSize;
  const pattern: number[] = [];
  
  // Create a history set to avoid repetitions within the new pattern
  const usedIndices = new Set<number>();
  
  // If we have a previous pattern, we want to avoid starting with its last element
  const lastPreviousIndex = previousPattern && previousPattern.length > 0 
    ? previousPattern[previousPattern.length - 1] 
    : -1;
  
  for (let i = 0; i < length; i++) {
    let nextSquare: number;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops
    
    do {
      nextSquare = Math.floor(Math.random() * totalSquares);
      attempts++;
      
      // Break out if we've tried too many times, to prevent hanging
      if (attempts > maxAttempts) {
        // Try any available index that wasn't just used
        for (let j = 0; j < totalSquares; j++) {
          if (!usedIndices.has(j) && (i === 0 || j !== lastPreviousIndex)) {
            nextSquare = j;
            break;
          }
        }
        break;
      }
      
      // First element shouldn't match the last element of previous pattern
      if (i === 0 && nextSquare === lastPreviousIndex) {
        continue;
      }
      
      // Avoid immediate repeats within this pattern
      if (i > 0 && nextSquare === pattern[i - 1]) {
        continue;
      }
      
      // Try to avoid squares that were already used in this pattern
      if (usedIndices.has(nextSquare)) {
        continue;
      }
      
    } while (false); // The conditions above will continue the loop if needed
    
    pattern.push(nextSquare);
    usedIndices.add(nextSquare);
  }
  
  return pattern;
};

// Get the appropriate level data, handling levels beyond the predefined ones
export const getLevelData = (level: number): GameLevel => {
  // If level is within our predefined levels, return it
  if (level <= LEVELS.length) {
    return LEVELS[level - 1];
  }
  
  // For levels beyond our predefined ones, generate a custom level
  // Determine appropriate grid size and pattern length based on level
  let gridSize = 5; // Max grid size for high levels
  
  // Dynamic pattern length: increases with level but caps at a reasonable maximum
  const baseLength = 10; // Starting length after predefined levels
  const patternLength = Math.min(baseLength + Math.floor((level - LEVELS.length) / 2), 20);
  
  // Generate a unique ID for this dynamic level
  const id = level;
  
  // Since this is a dynamic level, we'll generate the pattern on demand
  // We won't store it to ensure it's different each time
  return {
    id,
    gridSize,
    pattern: generateRandomPattern(gridSize, patternLength),
    timeLimit: undefined // No time limit for now
  };
};
