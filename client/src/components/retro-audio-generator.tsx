import { useState, useEffect } from 'react';
import { audioService } from '@/lib/audio-service';
import { RetroAudioFileData } from '@/lib/retro-audio-data';

interface RetroAudioGeneratorProps {
  audioData: RetroAudioFileData;
  onAudioGenerated: (buffer: AudioBuffer) => void;
}

export function RetroAudioGenerator({ audioData, onAudioGenerated }: RetroAudioGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateRetroAudio();
  }, [audioData]);

  const generateRetroAudio = async () => {
    setIsGenerating(true);
    try {
      let buffer: AudioBuffer;

      if (audioData.notes && audioData.notes.length > 0) {
        // Generate retro melody with arpeggios
        const noteDuration = audioData.duration / audioData.notes.length;
        buffer = audioService.generateRetroMelody(
          audioData.notes, 
          noteDuration, 
          audioData.arpeggio || false
        );
      } else if (audioData.frequency) {
        if (audioData.category === 'ambient' || audioData.chipType === 'noise') {
          // Generate retro noise-based sound for ambient or noise channels
          buffer = audioService.generateRetroNoise(
            audioData.duration, 
            audioData.frequency,
            'retro'
          );
        } else {
          // Generate retro tone with chip characteristics
          const waveType = getRetroWaveType(audioData);
          buffer = audioService.generateRetroTone(
            audioData.frequency, 
            audioData.duration, 
            waveType,
            audioData.pitchBend || false
          );
        }
      } else {
        // Default retro fallback - classic arcade beep
        buffer = audioService.generateRetroTone(440, audioData.duration, 'square');
      }

      onAudioGenerated(buffer);
    } catch (error) {
      console.error('Failed to generate retro audio:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getRetroWaveType = (data: RetroAudioFileData): OscillatorType => {
    switch (data.chipType) {
      case 'square1':
      case 'square2':
      case 'pulse':
        return 'square';
      case 'triangle':
        return 'triangle';
      case 'noise':
        return 'sawtooth'; // Closest approximation for noise
      default:
        return data.waveType || 'square';
    }
  };

  return null; // This is a logic-only component
}