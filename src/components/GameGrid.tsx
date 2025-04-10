
import React, { useMemo } from 'react';
import Square from './Square';
import { useGame } from '@/context/game/GameContext';
import { Square as SquareType } from '@/context/game/types';
import { LEVELS } from '@/utils/levels';

const GameGrid: React.FC = () => {
  const { level, squares, handleSquareClick, isUserTurn, isRevealing } = useGame();
  
  const gridSize = useMemo(() => {
    if (level > 0 && level <= LEVELS.length) {
      return LEVELS[level - 1].gridSize;
    }
    return 3; // Default grid size
  }, [level]);
  
  const gridTemplateColumns = `repeat(${gridSize}, minmax(0, 1fr))`;
  
  return (
    <div 
      className="w-full max-w-md mx-auto grid gap-3 p-5 bg-card/50 backdrop-blur-sm rounded-xl border border-white/10 shadow-md"
      style={{ gridTemplateColumns }}
    >
      {squares.map((square: SquareType) => (
        <Square
          key={square.id}
          id={square.id}
          active={square.active}
          highlighted={square.highlighted}
          solved={square.solved}
          onClick={handleSquareClick}
          disabled={!isUserTurn || isRevealing}
        />
      ))}
    </div>
  );
};

export default GameGrid;
