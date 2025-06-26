import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Download, 
  MousePointer, 
  Trophy, 
  X, 
  Equal, 
  Flag, 
  Crown, 
  Skull, 
  Minus, 
  Clock, 
  Clock3, 
  AlarmClock, 
  Star, 
  Zap, 
  Wind, 
  Disc,
  Cpu
} from 'lucide-react';
import { audioService } from '@/lib/audio-service';
import { RetroAudioGenerator } from './retro-audio-generator';
import { RetroAudioFileData } from '@/lib/retro-audio-data';

const iconMap = {
  'mouse-pointer': MousePointer,
  'trophy': Trophy,
  'x': X,
  'equal': Equal,
  'flag': Flag,
  'crown': Crown,
  'skull': Skull,
  'minus': Minus,
  'clock': Clock,
  'clock-3': Clock3,
  'alarm-clock': AlarmClock,
  'star': Star,
  'zap': Zap,
  'wind': Wind,
  'disc': Disc,
};

const colorSchemes = {
  secondary: 'hsl(207, 90%, 54%)',
  success: 'hsl(142, 76%, 36%)',
  error: 'hsl(0, 84%, 60%)',
  warning: 'hsl(38, 92%, 50%)',
  neutral: 'hsl(215, 20%, 65%)',
  cyan: 'hsl(189, 94%, 43%)',
  purple: 'hsl(262, 83%, 58%)',
};

const retroColors = {
  arcade: 'hsl(45, 100%, 55%)',
  nes: 'hsl(0, 100%, 65%)',
  gameboy: 'hsl(120, 50%, 45%)',
  c64: 'hsl(240, 80%, 60%)',
};

interface RetroAudioCardProps {
  audioData: RetroAudioFileData;
}

export function RetroAudioCard({ audioData }: RetroAudioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [progress, setProgress] = useState(0);

  const IconComponent = iconMap[audioData.icon as keyof typeof iconMap] || Play;
  const colorScheme = colorSchemes[audioData.colorScheme as keyof typeof colorSchemes];
  const retroColor = retroColors[audioData.retroStyle];

  useEffect(() => {
    const checkPlayingStatus = () => {
      const playing = audioService.isPlaying(`retro_${audioData.filename}`);
      setIsPlaying(playing);
      if (!playing) {
        setProgress(0);
      }
    };

    const interval = setInterval(checkPlayingStatus, 100);
    return () => clearInterval(interval);
  }, [audioData.filename]);

  const handlePlay = async () => {
    if (!audioBuffer) return;

    if (isPlaying) {
      audioService.stopAudio(`retro_${audioData.filename}`);
      setIsPlaying(false);
      setProgress(0);
    } else {
      await audioService.playAudioBuffer(audioBuffer, `retro_${audioData.filename}`, audioData.category);
      setIsPlaying(true);
      
      // Simulate progress for visual feedback
      const duration = audioData.duration * 1000;
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min((elapsed / duration) * 100, 100);
        setProgress(progressPercent);
        
        if (progressPercent >= 100) {
          clearInterval(progressInterval);
          setProgress(0);
        }
      }, 50);
    }
  };

  const handleDownload = () => {
    if (audioBuffer) {
      const retroFilename = `retro_${audioData.filename}`;
      audioService.downloadAudioFile(audioBuffer, retroFilename);
    }
  };

  const formatFileSize = (buffer: AudioBuffer | null): string => {
    if (!buffer) return '0 KB';
    const sizeInBytes = buffer.length * buffer.numberOfChannels * 2; // 16-bit samples
    const sizeInKB = Math.round(sizeInBytes / 1024);
    return `${sizeInKB} KB`;
  };

  const formatDuration = (duration: number): string => {
    if (audioData.isLoop) return '∞';
    return `${duration.toFixed(1)}s`;
  };

  const getChipBadgeColor = (chipType: string) => {
    switch (chipType) {
      case 'square1':
      case 'square2': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'triangle': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'noise': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'pulse': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-game-primary/40 border-game-neutral/30 hover:border-game-secondary/50 transition-all duration-300 relative overflow-hidden">
      <RetroAudioGenerator 
        audioData={audioData} 
        onAudioGenerated={setAudioBuffer}
      />
      
      {/* Retro styling overlay */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${retroColor} 0%, transparent 70%)`,
        }}
      />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center relative"
              style={{ backgroundColor: `${colorScheme}20` }}
            >
              <IconComponent 
                className="w-5 h-5"
                style={{ color: colorScheme }}
              />
              <Cpu 
                className="w-3 h-3 absolute -top-1 -right-1"
                style={{ color: retroColor }}
              />
            </div>
            <div>
              <h3 className="font-semibold font-mono">retro_{audioData.filename}</h3>
              <p className="text-sm text-muted-foreground">{audioData.description}</p>
              <p className="text-xs text-game-neutral">Style: {audioData.retroStyle.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getChipBadgeColor(audioData.chipType)}>
              {audioData.chipType.toUpperCase()}
            </Badge>
            {audioData.isLoop && (
              <Badge variant="outline" className="text-xs bg-game-warning/20 text-game-warning border-game-warning/30">
                LOOP
              </Badge>
            )}
            {audioData.arpeggio && (
              <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                ARP
              </Badge>
            )}
            {audioData.pitchBend && (
              <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                BEND
              </Badge>
            )}
            <Badge variant="outline" className="text-xs bg-game-success/20 text-game-success border-game-success/30">
              {formatFileSize(audioBuffer)}
            </Badge>
          </div>
        </div>

        {/* Retro waveform visualization */}
        <div className="mb-4">
          <div className="w-full bg-game-bg rounded-lg h-12 flex items-center justify-center mb-3 relative overflow-hidden">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-none transition-all duration-200"
                  style={{
                    backgroundColor: retroColor,
                    height: `${Math.random() * 25 + 8}px`,
                    opacity: progress > (i * 6.25) ? 1 : 0.4,
                    filter: 'contrast(1.2) saturate(1.5)',
                  }}
                />
              ))}
            </div>
            {progress > 0 && (
              <div 
                className="absolute top-0 left-0 h-full transition-all duration-100"
                style={{ 
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${retroColor}20 0%, ${retroColor}10 100%)`,
                }}
              />
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              onClick={handlePlay}
              disabled={!audioBuffer}
              className="w-10 h-10 rounded-lg p-0 border-2"
              style={{ 
                backgroundColor: retroColor,
                borderColor: retroColor,
                color: 'white'
              }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <div className="flex-1 text-center">
              <div className="text-sm font-mono" style={{ color: retroColor }}>
                {audioData.chipType.toUpperCase()} • {audioData.retroStyle.toUpperCase()}
              </div>
            </div>
            
            <span className="text-sm text-muted-foreground font-mono min-w-[3rem]">
              {formatDuration(audioData.duration)}
            </span>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              disabled={!audioBuffer}
              className="w-8 h-8 p-0"
              style={{ borderColor: retroColor }}
            >
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <div>
            <strong>Usage:</strong> {audioData.usage}
          </div>
          <div>
            <strong>Format:</strong> Retro 8-bit WAV, 22kHz{audioData.isLoop ? ', Seamless Loop' : ''}
          </div>
          <div>
            <strong>Chip:</strong> {audioData.chipType} channel • {audioData.retroStyle} style
          </div>
        </div>
      </CardContent>
    </Card>
  );
}