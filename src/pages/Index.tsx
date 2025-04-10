
import React, { useEffect } from 'react';
import { GameProvider } from '@/context/game/GameContext';
import GameGrid from '@/components/GameGrid';
import GameStatus from '@/components/GameStatus';
import GameControls from '@/components/GameControls';
import AdComponent from '@/components/AdComponent';
import { getAudioContext, ensureAudioContext } from '@/utils/audio';
import { Gamepad } from 'lucide-react';

const Index = () => {
  // Initialize audio context with a user gesture
  useEffect(() => {
    const handleFirstInteraction = () => {
      ensureAudioContext();
      
      // Remove event listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    
    // Add event listeners for user interaction
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);
  
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/70 flex flex-col justify-between py-4 px-2">
        <header className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-2 float-element">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Gamepad className="w-7 h-7 text-game-purple" />
              <h1 className="text-4xl font-extrabold text-center tracking-tight mb-1 bg-gradient-to-r from-game-purple to-game-blue bg-clip-text text-transparent">
                Cleo Says
              </h1>
              <Gamepad className="w-7 h-7 text-game-blue" />
            </div>
            <p className="text-sm font-medium text-muted-foreground text-center mb-3">
              Watch and repeat the pattern to level up!
            </p>
          </div>
          {/* Top banner ad */}
          <AdComponent 
            adSlot="1234567890" 
            adFormat="horizontal" 
            className="mt-2 mb-3" 
            style={{ minHeight: '90px' }}
          />
        </header>
        
        <main className="flex-1 flex flex-col justify-center items-center px-4 space-y-4">
          <GameStatus />
          <GameGrid />
          <GameControls />
          {/* Middle banner ad */}
          <AdComponent 
            adSlot="0987654321" 
            adFormat="rectangle" 
            className="my-3" 
            style={{ minHeight: '250px', maxWidth: '300px' }}
          />
        </main>
        
        <footer className="w-full max-w-md mx-auto px-4 pt-4 pb-3">
          <p className="text-xs text-muted-foreground text-center mb-2 font-bold">
            🔊 Turn on your sound for the full experience
          </p>
          {/* Bottom banner ad */}
          <AdComponent 
            adSlot="1122334455" 
            adFormat="horizontal" 
            className="mt-2" 
            style={{ minHeight: '90px' }}
          />
        </footer>
      </div>
    </GameProvider>
  );
};

export default Index;
