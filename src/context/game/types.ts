
export interface Square {
  id: number;
  active: boolean;
  highlighted: boolean;
  solved: boolean;
}

export interface GameState {
  level: number;
  score: number;
  highScore: number;
  lives: number;
  squares: Square[];
  isPlaying: boolean;
  isRevealing: boolean;
  isUserTurn: boolean;
  userPattern: number[];
  currentPatternIndex: number;
  currentPattern: number[];
  completedPatterns: Set<string>;
}
