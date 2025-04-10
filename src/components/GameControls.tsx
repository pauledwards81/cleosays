
import React from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/game/GameContext';
import { Gamepad, ZapIcon } from 'lucide-react';

const GameControls: React.FC = () => {
  const { isPlaying, startGame, revealPattern, isRevealing, isUserTurn } = useGame();
  
  const handleRevealPattern = () => {
    console.log("Show pattern button clicked");
    revealPattern();
  };
  
  const handleStartGame = () => {
    console.log("Play button clicked");
    startGame();
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center space-y-3">
      {!isPlaying ? (
        <Button 
          onClick={handleStartGame}
          className="w-full max-w-xs animate-fade-in transition-all bg-gradient-to-r from-game-purple to-game-blue text-white font-bold text-lg uppercase tracking-wider shadow-game hover:shadow-glow border border-white/10"
          size="lg"
        >
          <Gamepad className="w-5 h-5 mr-2" /> Play Now
        </Button>
      ) : (
        <Button 
          onClick={handleRevealPattern}
          className="w-full max-w-xs bg-muted hover:bg-muted/80 font-bold tracking-wide uppercase border border-white/10"
          size="default"
          disabled={isRevealing || !isUserTurn}
        >
          <ZapIcon className="w-4 h-4 mr-2" /> Show Pattern Again
        </Button>
      )}
    </div>
  );
};

export default GameControls;
