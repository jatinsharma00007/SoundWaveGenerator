import { useState, useEffect } from 'react';
import { audioService } from '@/lib/audio-service';
import { AudioFileData } from '@/lib/audio-data';

interface AudioGeneratorProps {
  audioData: AudioFileData;
  onAudioGenerated: (buffer: AudioBuffer) => void;
}

export function AudioGenerator({ audioData, onAudioGenerated }: AudioGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    generateAudio();
  }, [audioData]);

  const generateAudio = async () => {
    setIsGenerating(true);
    try {
      let buffer: AudioBuffer;

      if (audioData.notes && audioData.notes.length > 0) {
        // Generate melody
        const noteDuration = audioData.duration / audioData.notes.length;
        buffer = audioService.generateMelody(audioData.notes, noteDuration);
      } else if (audioData.frequency) {
        if (audioData.category === 'ambient' || audioData.filename.includes('wind') || audioData.filename.includes('chaos')) {
          // Generate noise-based sound for ambient or special effects
          buffer = audioService.generateNoiseSound(audioData.duration, audioData.frequency);
        } else {
          // Generate simple tone
          buffer = audioService.generateTone(
            audioData.frequency, 
            audioData.duration, 
            audioData.waveType || 'sine'
          );
        }
      } else {
        // Default fallback
        buffer = audioService.generateTone(440, audioData.duration, 'sine');
      }

      setAudioBuffer(buffer);
      onAudioGenerated(buffer);
    } catch (error) {
      console.error('Failed to generate audio:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return null; // This is a logic-only component
}
