
import { useCallback } from 'react';
import { playTone } from '@/utils/audio';
import { Square } from './types';

interface SquareActionsProps {
  setSquares: React.Dispatch<React.SetStateAction<Square[]>>;
}

export const useSquareActions = ({ setSquares }: SquareActionsProps) => {
  const activateSquare = useCallback((id: number, duration = 400) => {
    console.log(`Activating square ${id}`);
    // Update squares state to activate the clicked square
    setSquares(prev => 
      prev.map(square => 
        square.id === id 
          ? { ...square, active: true, highlighted: true } 
          : square
      )
    );
    
    // Play sound based on square ID
    playTone(id);
    
    // Deactivate after animation
    setTimeout(() => {
      setSquares(prev => 
        prev.map(square => 
          square.id === id 
            ? { ...square, active: false, highlighted: false } 
            : square
        )
      );
    }, duration);
  }, [setSquares]);

  return {
    activateSquare
  };
};
