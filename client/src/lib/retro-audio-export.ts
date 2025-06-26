import { audioService } from './audio-service';
import { retroAudioFilesData, RetroAudioFileData } from './retro-audio-data';

export class RetroAudioExportService {
  private generatedRetroBuffers: Map<string, AudioBuffer> = new Map();

  async generateAllRetroAudioFiles(): Promise<Map<string, AudioBuffer>> {
    const buffers = new Map<string, AudioBuffer>();

    for (const audioData of retroAudioFilesData) {
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
            const waveType = this.getRetroWaveType(audioData);
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

        buffers.set(audioData.filename, buffer);
      } catch (error) {
        console.error(`Failed to generate retro ${audioData.filename}:`, error);
      }
    }

    this.generatedRetroBuffers = buffers;
    return buffers;
  }

  private getRetroWaveType(data: RetroAudioFileData): OscillatorType {
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
  }

  async exportRetroAsZip(): Promise<Blob> {
    if (this.generatedRetroBuffers.size === 0) {
      await this.generateAllRetroAudioFiles();
    }

    // Create retro archive structure
    const files: { name: string; data: Uint8Array }[] = [];
    
    const fileNames = Array.from(this.generatedRetroBuffers.keys());
    for (const filename of fileNames) {
      const buffer = this.generatedRetroBuffers.get(filename);
      if (!buffer) continue;
      
      const audioData = retroAudioFilesData.find(a => a.filename === filename);
      const wavData = audioService.audioBufferToWav(buffer);
      const wavName = filename.replace('.mp3', '.wav');
      
      const path = audioData?.category === 'ambient' 
        ? `assets/retro/ambient/${wavName}`
        : `assets/retro/${wavName}`;
      
      files.push({
        name: path,
        data: new Uint8Array(wavData)
      });
    }

    // Add retro README.md
    const readmeContent = this.generateRetroReadmeContent();
    files.push({
      name: 'retro_README.md',
      data: new TextEncoder().encode(readmeContent)
    });

    // Return combined data as blob
    return new Blob(files.map(f => f.data), { type: 'application/octet-stream' });
  }

  downloadRetroFile(filename: string): void {
    const buffer = this.generatedRetroBuffers.get(filename);
    if (buffer) {
      const retroFilename = `retro_${filename}`;
      audioService.downloadAudioFile(buffer, retroFilename);
    }
  }

  downloadAllRetroAsZip(): void {
    this.exportRetroAsZip().then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rock-paper-scissors-retro-audio-assets.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  private generateRetroReadmeContent(): string {
    const standardSounds = retroAudioFilesData.filter(f => f.category === 'standard');
    const ambientSounds = retroAudioFilesData.filter(f => f.category === 'ambient');

    return `# Rock Paper Scissors Battle - Retro Audio Assets

This package contains retro arcade-style versions of all audio files for the Rock Paper Scissors Battle game.

## Overview

This collection provides ${retroAudioFilesData.length} retro 8-bit/16-bit audio effects designed to replicate classic arcade sound chips including NES, Game Boy, C64, and arcade systems. All files maintain the same durations and usage as their modern counterparts while delivering authentic retro gaming sound.

## File Structure

\`\`\`
assets/
└── retro/
    ├── ${standardSounds.map(s => s.filename).join('\n    ├── ')}
    └── ambient/
        ├── ${ambientSounds.map(s => s.filename).join('\n        ├── ')}
\`\`\`

## Retro Sound Effects (/assets/retro/)

${standardSounds.map(sound => `### ${sound.filename}
- **Description**: ${sound.description}
- **Usage**: ${sound.usage}
- **Duration**: ${sound.duration}s
- **Retro Style**: ${sound.retroStyle.toUpperCase()}
- **Chip Channel**: ${sound.chipType.toUpperCase()}
- **Effects**: ${[
  sound.pitchBend ? 'Pitch Bend' : null,
  sound.arpeggio ? 'Arpeggio' : null,
  sound.dutyCycle ? `Duty Cycle ${sound.dutyCycle}` : null
].filter(Boolean).join(', ') || 'None'}`).join('\n\n')}

## Retro Ambient Loops (/assets/retro/ambient/)

${ambientSounds.map(sound => `### ${sound.filename}
- **Description**: ${sound.description}
- **Usage**: ${sound.usage}
- **Duration**: ${sound.duration}s${sound.isLoop ? ' (Loop)' : ''}
- **Retro Style**: ${sound.retroStyle.toUpperCase()}
- **Chip Channel**: ${sound.chipType.toUpperCase()}`).join('\n\n')}

## Sound Chip Specifications

### NES (Nintendo Entertainment System)
- 2 Square wave channels (duty cycles: 12.5%, 25%, 50%, 75%)
- 1 Triangle wave channel
- 1 Noise channel
- 8-bit audio at 22.05kHz

### Game Boy
- 2 Square wave channels with volume envelope
- 1 Wave pattern channel
- 1 Noise channel
- 4-bit audio at 16.384kHz

### C64 (Commodore 64)
- 3 Oscillators (square, triangle, sawtooth, noise)
- Filter with cutoff and resonance
- 8-bit audio at 22.05kHz

### Arcade
- Multiple sound channels
- Sharp attack/decay envelopes
- High-frequency square waves
- 8-bit quantization

## Integration Guide

### Basic JavaScript Implementation

\`\`\`javascript
// Load and play retro sound effects
const retroClick = new Audio('./assets/retro/click.wav');
retroClick.play();

// Set volume for retro sounds
retroClick.volume = 0.8;

// For retro ambient loops
const retroHum = new Audio('./assets/retro/ambient/hum.wav');
retroHum.loop = true;
retroHum.volume = 0.4;
retroHum.play();
\`\`\`

### Switching Between Modern and Retro

\`\`\`javascript
class AudioManager {
  constructor() {
    this.retroMode = false;
    this.sounds = {
      click: {
        modern: new Audio('./assets/audio/click.mp3'),
        retro: new Audio('./assets/retro/click.wav')
      }
    };
  }
  
  playSound(name) {
    const soundSet = this.retroMode ? 'retro' : 'modern';
    this.sounds[name][soundSet].play();
  }
  
  toggleRetroMode() {
    this.retroMode = !this.retroMode;
  }
}
\`\`\`

## Technical Details

- **Format**: WAV (22.05kHz or 16.384kHz, 8-bit/4-bit quantization)
- **Compatibility**: All modern browsers and retro game engines
- **Authenticity**: Based on actual sound chip limitations and characteristics
- **File Size**: Smaller than modern versions due to lower sample rates

## Sound Design Notes

1. **Square Waves**: Used for most melody and effect sounds
2. **Triangle Waves**: Bass tones and some ambient sounds  
3. **Noise Channel**: Percussion, wind, and special effects
4. **Quantization**: Audio samples reduced to period-appropriate bit depths
5. **Envelopes**: Sharp attack/decay patterns typical of retro sound chips

## Performance Tips

1. **Preload Critical Sounds**: Load click and win/lose sounds immediately
2. **Volume Balance**: Retro sounds may seem louder due to sharp waveforms
3. **Browser Compatibility**: All modern browsers support WAV playback
4. **Memory Efficiency**: Retro files are smaller and load faster

## Version

Generated on ${new Date().toLocaleDateString()}
Total Retro Files: ${retroAudioFilesData.length}
Sound Chip Styles: NES, Game Boy, C64, Arcade
Channels Used: Square, Triangle, Noise, Pulse

---

For modern audio versions, see the main audio assets package.
`;
  }
}

export const retroAudioExportService = new RetroAudioExportService();