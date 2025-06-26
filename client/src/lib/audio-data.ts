export interface AudioFileData {
  filename: string;
  category: 'standard' | 'ambient';
  description: string;
  usage: string;
  icon: string;
  colorScheme: string;
  isLoop?: boolean;
  frequency?: number;
  waveType?: OscillatorType;
  duration: number;
  notes?: number[];
}

export const audioFilesData: AudioFileData[] = [
  // Standard Sound Effects
  {
    filename: 'click.mp3',
    category: 'standard',
    description: 'Button click sound',
    usage: 'Triggered on all button interactions',
    icon: 'mouse-pointer',
    colorScheme: 'secondary',
    frequency: 800,
    waveType: 'square',
    duration: 0.1,
  },
  {
    filename: 'win.mp3',
    category: 'standard',
    description: 'Round victory sound',
    usage: 'Player wins a single round',
    icon: 'trophy',
    colorScheme: 'success',
    notes: [523, 659, 784, 1047], // C, E, G, C
    duration: 1.2,
  },
  {
    filename: 'lose.mp3',
    category: 'standard',
    description: 'Round defeat sound',
    usage: 'Player loses a single round',
    icon: 'x',
    colorScheme: 'error',
    frequency: 200,
    waveType: 'sawtooth',
    duration: 0.8,
  },
  {
    filename: 'draw.mp3',
    category: 'standard',
    description: 'Round tie sound',
    usage: 'Round ends in a tie',
    icon: 'equal',
    colorScheme: 'warning',
    frequency: 440,
    waveType: 'sine',
    duration: 0.6,
  },
  {
    filename: 'gameStart.mp3',
    category: 'standard',
    description: 'Game initialization',
    usage: 'When new game session begins',
    icon: 'flag',
    colorScheme: 'secondary',
    notes: [392, 523, 659], // G, C, E
    duration: 1.5,
  },
  {
    filename: 'gameWin.mp3',
    category: 'standard',
    description: 'Complete game victory',
    usage: 'Player wins the entire game',
    icon: 'crown',
    colorScheme: 'success',
    notes: [523, 659, 784, 1047, 1319], // Victory fanfare
    duration: 2.5,
  },
  {
    filename: 'gameLose.mp3',
    category: 'standard',
    description: 'Complete game defeat',
    usage: 'Player loses the entire game',
    icon: 'skull',
    colorScheme: 'error',
    frequency: 150,
    waveType: 'sawtooth',
    duration: 2.0,
  },
  {
    filename: 'gameDraw.mp3',
    category: 'standard',
    description: 'Game ends in tie',
    usage: 'Game ends with no winner',
    icon: 'minus',
    colorScheme: 'warning',
    frequency: 330,
    waveType: 'triangle',
    duration: 1.8,
  },
  {
    filename: 'countdown.mp3',
    category: 'standard',
    description: 'Countdown ticking',
    usage: 'During countdown sequences',
    icon: 'clock',
    colorScheme: 'secondary',
    frequency: 1000,
    waveType: 'sine',
    duration: 3.0,
  },
  {
    filename: 'tick.mp3',
    category: 'standard',
    description: 'Per-second tick',
    usage: 'Each second during countdown',
    icon: 'clock-3',
    colorScheme: 'neutral',
    frequency: 800,
    waveType: 'square',
    duration: 0.1,
  },
  {
    filename: 'timeUp.mp3',
    category: 'standard',
    description: 'Countdown ends',
    usage: 'When time runs out',
    icon: 'alarm-clock',
    colorScheme: 'error',
    frequency: 600,
    waveType: 'triangle',
    duration: 1.0,
  },
  {
    filename: 'bonusRound.mp3',
    category: 'standard',
    description: 'Bonus round begins',
    usage: 'Special bonus round activation',
    icon: 'star',
    colorScheme: 'warning',
    notes: [659, 784, 880, 1047], // Special bonus melody
    duration: 2.0,
  },
  {
    filename: 'chaos.mp3',
    category: 'standard',
    description: 'Chaos mode activation',
    usage: 'When chaos mode is triggered',
    icon: 'zap',
    colorScheme: 'error',
    frequency: 100,
    waveType: 'sawtooth',
    duration: 1.5,
  },
  // Ambient Loops
  {
    filename: 'hum.mp3',
    category: 'ambient',
    description: 'Electric ambient hum',
    usage: 'Background atmosphere during gameplay',
    icon: 'zap',
    colorScheme: 'neutral',
    frequency: 60,
    waveType: 'sine',
    duration: 10.0,
    isLoop: true,
  },
  {
    filename: 'wind.mp3',
    category: 'ambient',
    description: 'Ambient wind sound',
    usage: 'Atmospheric wind during dramatic moments',
    icon: 'wind',
    colorScheme: 'cyan',
    frequency: 200,
    waveType: 'sine',
    duration: 15.0,
    isLoop: true,
  },
  {
    filename: 'lo-fi-loop.mp3',
    category: 'ambient',
    description: 'Retro lo-fi music',
    usage: 'Background music for relaxed gameplay',
    icon: 'disc',
    colorScheme: 'purple',
    notes: [220, 277, 330, 370], // Lo-fi chord progression
    duration: 20.0,
    isLoop: true,
  },
];
