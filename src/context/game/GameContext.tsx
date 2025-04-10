
import React, { createContext, useContext } from 'react';
import { useGameState } from './useGameState';
import { useGameFlow } from './useGameFlow';
import { usePatternActions } from './usePatternActions';
import { useSquareActions } from './useSquareActions';
import { Square } from './types';

interface GameContextType {
  // State
  level: number;
  score: number;
  highScore: number;
  lives: number;
  squares: Square[];
  isPlaying: boolean;
  isRevealing: boolean;
  isUserTurn: boolean;
  currentPatternIndex: number;
  
  // Actions
  startGame: () => void;
  handleSquareClick: (id: number) => void;
  revealPattern: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    level, setLevel,
    score, setScore,
    highScore, setHighScore,
    lives, setLives,
    squares, setSquares,
    isPlaying, setIsPlaying,
    isRevealing, setIsRevealing,
    isUserTurn, setIsUserTurn,
    userPattern, setUserPattern,
    currentPatternIndex, setCurrentPatternIndex,
    currentPattern, setCurrentPattern,
    completedPatterns, setCompletedPatterns
  } = useGameState();

  const { initializeSquares, generateLevelPattern } = usePatternActions({ 
    level, 
    setCurrentPattern, 
    completedPatterns, 
    setSquares 
  });

  const { activateSquare } = useSquareActions({ 
    setSquares 
  });

  const { 
    startGame, 
    revealPattern,
    handleSquareClick
  } = useGameFlow({
    level, setLevel,
    score, setScore,
    highScore, setHighScore,
    lives, setLives,
    squares, setSquares,
    isPlaying, setIsPlaying,
    isRevealing, setIsRevealing,
    isUserTurn, setIsUserTurn,
    userPattern, setUserPattern,
    currentPatternIndex, setCurrentPatternIndex,
    currentPattern, setCurrentPattern,
    completedPatterns, setCompletedPatterns,
    initializeSquares,
    generateLevelPattern,
    activateSquare
  });

  const value = {
    level,
    score,
    highScore,
    lives,
    squares,
    isPlaying,
    isRevealing,
    isUserTurn,
    currentPatternIndex,
    startGame,
    handleSquareClick,
    revealPattern
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
