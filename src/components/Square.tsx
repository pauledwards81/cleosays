
import React from 'react';
import { cn } from '@/lib/utils';

interface SquareProps {
  id: number;
  active: boolean;
  highlighted: boolean;
  solved: boolean;
  onClick: (id: number) => void;
  disabled?: boolean;
}

const Square: React.FC<SquareProps> = ({ 
  id, 
  active, 
  highlighted, 
  solved, 
  onClick,
  disabled = false
}) => {
  return (
    <div
      className={cn(
        'aspect-square rounded-xl shadow-md flex items-center justify-center transition-all duration-150 square',
        active ? 'bg-primary scale-[0.97] border-2 border-white/20' : 
          highlighted ? 'bg-game-purple border-2 border-white/20' : 
            'bg-square border-2 border-transparent',
        solved ? 'bg-game-green border-2 border-white/20' : '',
        disabled ? 'cursor-not-allowed opacity-80' : 'select-none cursor-pointer hover:brightness-110'
      )}
      onClick={() => !disabled && onClick(id)}
    >
      {(active || highlighted || solved) && (
        <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse-subtle"></span>
      )}
    </div>
  );
};

export default Square;
