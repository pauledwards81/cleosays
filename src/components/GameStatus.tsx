
import React from 'react';
import { useGame } from '@/context/game/GameContext';
import { Heart, Trophy, Star, Zap } from 'lucide-react';

const GameStatus: React.FC = () => {
  const { level, score, highScore, lives, isPlaying, isUserTurn, isRevealing } = useGame();
  
  // Generate hearts based on remaining lives
  const renderLives = () => {
    return Array(5).fill(0).map((_, index) => (
      <Heart 
        key={index} 
        className={`w-6 h-6 transition-all duration-300 ${
          index < lives 
            ? 'text-red-500 fill-red-500 drop-shadow-md' 
            : 'text-gray-600 opacity-50'
        }`}
      />
    ));
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-white/10 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 text-game-orange fill-game-orange" />
            <p className="text-xs uppercase font-bold tracking-wide text-muted-foreground">Level</p>
          </div>
          <p className="text-3xl font-bold tracking-tight glow-text">{level}</p>
        </div>
        
        <div className="space-y-1 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <Trophy className="w-5 h-5 text-game-purple fill-game-purple" />
            <p className="text-xs uppercase font-bold tracking-wide text-muted-foreground">Score</p>
          </div>
          <p className="text-3xl font-bold tracking-tight glow-text">{score}</p>
        </div>
      </div>
      
      <div className="flex justify-center my-3 px-2 py-1 bg-muted/30 backdrop-blur-sm rounded-lg">
        {renderLives()}
      </div>
      
      <div className="text-center my-3 py-2 rounded-lg bg-muted/30 backdrop-filter backdrop-blur-sm">
        {!isPlaying ? (
          <p className="text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-game-orange" /> Press play to begin
          </p>
        ) : isRevealing ? (
          <p className="text-sm font-bold uppercase tracking-wide animate-pulse-subtle flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-game-blue" /> Watch the pattern...
          </p>
        ) : isUserTurn ? (
          <p className="text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-game-green" /> Repeat the pattern
          </p>
        ) : (
          <p className="text-sm font-bold uppercase tracking-wide animate-pulse-subtle flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-game-purple" /> Get ready...
          </p>
        )}
      </div>
      
      <div className="text-xs font-medium text-center mt-4 flex items-center justify-center gap-1.5">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <span>High Score: <span className="font-bold">{highScore}</span></span>
      </div>
    </div>
  );
};

export default GameStatus;
