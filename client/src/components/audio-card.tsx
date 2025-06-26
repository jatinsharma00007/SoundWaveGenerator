import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  Disc
} from 'lucide-react';
import { audioService } from '@/lib/audio-service';
import { AudioGenerator } from './audio-generator';
import { AudioFileData } from '@/lib/audio-data';

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

interface AudioCardProps {
  audioData: AudioFileData;
}

export function AudioCard({ audioData }: AudioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState(0);

  const IconComponent = iconMap[audioData.icon as keyof typeof iconMap] || Play;
  const colorScheme = colorSchemes[audioData.colorScheme as keyof typeof colorSchemes];

  useEffect(() => {
    const checkPlayingStatus = () => {
      const playing = audioService.isPlaying(audioData.filename);
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
      audioService.stopAudio(audioData.filename);
      setIsPlaying(false);
      setProgress(0);
    } else {
      await audioService.playAudioBuffer(audioBuffer, audioData.filename, audioData.category);
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
      audioService.downloadAudioFile(audioBuffer, audioData.filename);
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

  return (
    <Card className="bg-game-primary/30 border-game-neutral/20 hover:border-game-secondary/40 transition-all duration-300">
      <AudioGenerator 
        audioData={audioData} 
        onAudioGenerated={setAudioBuffer}
      />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${colorScheme}20` }}
            >
              <IconComponent 
                className="w-5 h-5"
                style={{ color: colorScheme }}
              />
            </div>
            <div>
              <h3 className="font-semibold font-mono">{audioData.filename}</h3>
              <p className="text-sm text-muted-foreground">{audioData.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {audioData.isLoop && (
              <Badge variant="outline" className="text-xs bg-game-warning/20 text-game-warning border-game-warning/30">
                LOOP
              </Badge>
            )}
            <Badge variant="outline" className="text-xs bg-game-success/20 text-game-success border-game-success/30">
              {formatFileSize(audioBuffer)}
            </Badge>
          </div>
        </div>

        {/* Waveform Visualization */}
        <div className="mb-4">
          <div className="w-full bg-game-bg rounded-lg h-12 flex items-center justify-center mb-3 relative overflow-hidden">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: colorScheme,
                    height: `${Math.random() * 30 + 10}px`,
                    opacity: progress > (i * 5) ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
            {progress > 0 && (
              <div 
                className="absolute top-0 left-0 h-full bg-game-secondary/20 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              onClick={handlePlay}
              disabled={!audioBuffer}
              className="w-10 h-10 rounded-full p-0"
              style={{ 
                backgroundColor: colorScheme,
                color: 'white'
              }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <div className="flex-1">
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
              />
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
            <strong>Format:</strong> MP3, 44.1kHz, Stereo{audioData.isLoop ? ', Seamless Loop' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
