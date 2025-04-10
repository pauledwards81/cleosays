
import { useState, useEffect } from 'react';
import { Square, GameState } from './types';
import { getLevelData } from '@/utils/levels';

export const useGameState = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [squares, setSquares] = useState<Square[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [currentPattern, setCurrentPattern] = useState<number[]>([]);
  const [completedPatterns, setCompletedPatterns] = useState<Set<string>>(new Set());

  // Load high score from local storage
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem('squaresHighScore');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
      
      // Pre-initialize the first level squares
      const levelData = getLevelData(1);
      const totalSquares = levelData.gridSize * levelData.gridSize;
      
      const newSquares = Array(totalSquares).fill(null).map((_, index) => ({
        id: index,
        active: false,
        highlighted: false,
        solved: false
      }));
      
      setSquares(newSquares);
    } catch (error) {
      console.error("Error loading high score:", error);
    }
  }, []);

  // Save high score to local storage when it changes
  useEffect(() => {
    localStorage.setItem('squaresHighScore', highScore.toString());
  }, [highScore]);

  return {
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
  };
};
