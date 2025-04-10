
import { useCallback } from 'react';
import { getLevelData, generateRandomPattern, LEVELS } from '@/utils/levels';
import { Square } from './types';

interface PatternActionsProps {
  level: number;
  setCurrentPattern: React.Dispatch<React.SetStateAction<number[]>>;
  completedPatterns: Set<string>;
  setSquares: React.Dispatch<React.SetStateAction<Square[]>>;
}

export const usePatternActions = ({ 
  level, 
  setCurrentPattern, 
  completedPatterns, 
  setSquares 
}: PatternActionsProps) => {
  
  // Initialize squares based on current level
  const initializeSquares = useCallback((currentLevel: number) => {
    const levelData = getLevelData(currentLevel);
    const totalSquares = levelData.gridSize * levelData.gridSize;
    
    const newSquares = Array(totalSquares).fill(null).map((_, index) => ({
      id: index,
      active: false,
      highlighted: false,
      solved: false
    }));
    
    setSquares(newSquares);
  }, [setSquares]);

  // Generate a unique pattern for the level
  const generateLevelPattern = useCallback((currentLevel: number) => {
    const levelData = getLevelData(currentLevel);
    let pattern: number[] = [];
    
    if (currentLevel <= LEVELS.length) {
      // Use predefined patterns for early levels
      console.log(`Using predefined pattern for level ${currentLevel}`);
      pattern = [...levelData.pattern];
    } else {
      // Generate a random pattern for later levels, avoiding previous patterns
      console.log(`Generating random pattern for level ${currentLevel}`);
      const patternKey = Array.from(completedPatterns).join('|');
      const lastCompletedPattern = patternKey.split('|').pop()?.split(',').map(Number) || [];
      
      pattern = generateRandomPattern(
        levelData.gridSize,
        levelData.pattern.length,
        lastCompletedPattern
      );
    }
    
    setCurrentPattern(pattern);
    return pattern;
  }, [completedPatterns, setCurrentPattern]);

  return {
    initializeSquares,
    generateLevelPattern
  };
};
