
import { useCallback, useEffect } from 'react';
import { playSuccessSound, playErrorSound, playLevelCompleteSound } from '@/utils/audio';
import { Square } from './types';

interface GameFlowProps {
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  highScore: number;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  lives: number;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  squares: Square[];
  setSquares: React.Dispatch<React.SetStateAction<Square[]>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isRevealing: boolean;
  setIsRevealing: React.Dispatch<React.SetStateAction<boolean>>;
  isUserTurn: boolean;
  setIsUserTurn: React.Dispatch<React.SetStateAction<boolean>>;
  userPattern: number[];
  setUserPattern: React.Dispatch<React.SetStateAction<number[]>>;
  currentPatternIndex: number;
  setCurrentPatternIndex: React.Dispatch<React.SetStateAction<number>>;
  currentPattern: number[];
  setCurrentPattern: React.Dispatch<React.SetStateAction<number[]>>;
  completedPatterns: Set<string>;
  setCompletedPatterns: React.Dispatch<React.SetStateAction<Set<string>>>;
  initializeSquares: (level: number) => void;
  generateLevelPattern: (level: number) => number[];
  activateSquare: (id: number, duration?: number) => void;
}

export const useGameFlow = ({
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
}: GameFlowProps) => {

  // Initialize the game when the level changes
  useEffect(() => {
    if (level > 0) {
      initializeSquares(level);
    }
  }, [level, initializeSquares]);

  // Define revealPattern first before it's used in startGame
  const revealPattern = useCallback(() => {
    console.log(`Revealing pattern. isPlaying: ${isPlaying}, pattern length: ${currentPattern.length}`);
    
    // Safety check to ensure we have a valid game state
    if (!isPlaying) {
      console.log("Game is not in playing state, setting to playing before revealing");
      setIsPlaying(true);
    }
    
    // If pattern is empty, regenerate it
    if (!currentPattern || currentPattern.length === 0) {
      console.log("Pattern is empty, regenerating pattern for level:", level);
      const newPattern = generateLevelPattern(level);
      setCurrentPattern(newPattern);
      
      // Wait for pattern to be updated in state before continuing
      setTimeout(() => {
        console.log("Pattern regenerated:", newPattern);
        revealPatternSequence(newPattern);
      }, 100);
      return;
    }
    
    // If we have a pattern, reveal it
    revealPatternSequence(currentPattern);
  }, [
    activateSquare, 
    currentPattern, 
    generateLevelPattern, 
    isPlaying, 
    level, 
    setCurrentPattern,
    setIsPlaying
  ]);
  
  // Helper function to reveal the pattern sequence
  const revealPatternSequence = useCallback((pattern: number[]) => {
    setIsRevealing(true);
    setIsUserTurn(false);
    
    // Reset user pattern
    setUserPattern([]);
    setCurrentPatternIndex(0);
    
    const revealSquare = async () => {
      for (let i = 0; i < pattern.length; i++) {
        const squareId = pattern[i];
        
        await new Promise<void>(resolve => {
          setTimeout(() => {
            activateSquare(squareId, 300);
            resolve();
          }, 330);
        });
      }
      
      // After revealing the pattern, let the user try
      setTimeout(() => {
        console.log("Pattern revealed, user turn now");
        setIsRevealing(false);
        setIsUserTurn(true);
      }, 400);
    };
    
    // Start the sequence
    revealSquare();
  }, [
    activateSquare,
    setCurrentPatternIndex,
    setIsRevealing,
    setIsUserTurn,
    setUserPattern
  ]);

  // Now startGame can safely use revealPattern
  const startGame = useCallback(() => {
    console.log("Starting new game...");
    // First, update all state variables
    setIsPlaying(true);
    setScore(0);
    setLevel(1);
    setLives(5);
    setUserPattern([]);
    setCurrentPatternIndex(0);
    setCompletedPatterns(new Set());
    setIsUserTurn(false);
    setIsRevealing(false);
    
    // Initialize squares first
    initializeSquares(1);
    
    // Generate the pattern for the first level
    const initialPattern = generateLevelPattern(1);
    setCurrentPattern(initialPattern);
    console.log("Initial pattern generated:", initialPattern);
    
    // Set timeout to allow state updates to complete
    setTimeout(() => {
      // Start pattern reveal with the now-available pattern
      revealPatternSequence(initialPattern);
    }, 500);
  }, [
    generateLevelPattern, 
    setCompletedPatterns, 
    setCurrentPatternIndex, 
    setCurrentPattern,
    setIsPlaying, 
    setLevel, 
    setLives, 
    setScore, 
    setUserPattern,
    setIsUserTurn,
    setIsRevealing,
    initializeSquares,
    revealPatternSequence
  ]);

  const handleSquareClick = useCallback((id: number) => {
    if (!isPlaying || isRevealing || !isUserTurn) return;
    
    activateSquare(id, 300);
    
    const expectedId = currentPattern[currentPatternIndex];
    
    if (id === expectedId) {
      // Correct square!
      setCurrentPatternIndex(prev => prev + 1);
      
      // Add to user pattern
      setUserPattern(prev => [...prev, id]);
      
      // Check if pattern is complete
      if (currentPatternIndex + 1 >= currentPattern.length) {
        // Mark pattern as solved
        setSquares(prev => 
          prev.map(square => ({
            ...square,
            solved: currentPattern.includes(square.id)
          }))
        );
        
        // Play success sound
        playSuccessSound();
        
        // Add the completed pattern to our set to avoid repeats
        setCompletedPatterns(prev => {
          const updated = new Set(prev);
          updated.add(currentPattern.join(','));
          return updated;
        });
        
        // Add score
        const levelPoints = level * 10;
        const newScore = score + levelPoints;
        setScore(newScore);
        
        // Update high score if needed
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        
        // Move to next level or finish game
        setTimeout(() => {
          if (level < 100) { // Set a reasonable maximum level
            playLevelCompleteSound();
            setLevel(prev => prev + 1);
            setUserPattern([]);
            setCurrentPatternIndex(0);
            setIsUserTurn(false);
            
            // Reset solved state
            setSquares(prev => 
              prev.map(square => ({
                ...square,
                solved: false
              }))
            );
            
            // Show next pattern after transition
            setTimeout(() => {
              const newPattern = generateLevelPattern(level + 1);
              setCurrentPattern(newPattern);
              setTimeout(() => {
                revealPatternSequence(newPattern);
              }, 100);
            }, 1000);
          } else {
            // Game completed!
            setIsPlaying(false);
            playLevelCompleteSound();
            // Could add game completion logic here
          }
        }, 1000);
      }
    } else {
      // Wrong square - lose a life
      playErrorSound();
      setLives(prev => prev - 1);
      
      // Check if game over
      if (lives <= 1) {
        // Game over - player lost all lives
        setTimeout(() => {
          setIsPlaying(false);
        }, 1000);
      } else {
        // Reset level
        setTimeout(() => {
          // Reset user pattern
          setUserPattern([]);
          setCurrentPatternIndex(0);
          
          // Reveal pattern again
          revealPattern();
        }, 1000);
      }
    }
  }, [
    activateSquare, currentPattern, currentPatternIndex, generateLevelPattern, highScore, isPlaying, 
    isRevealing, isUserTurn, level, lives, revealPattern, revealPatternSequence, score, 
    setCompletedPatterns, setCurrentPatternIndex, setHighScore, setIsPlaying, 
    setIsUserTurn, setLevel, setLives, setScore, setSquares, setUserPattern
  ]);

  return {
    startGame,
    revealPattern,
    handleSquareClick
  };
};
