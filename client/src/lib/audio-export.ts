import { audioService } from './audio-service';
import { audioFilesData } from './audio-data';

export class AudioExportService {
  private generatedBuffers: Map<string, AudioBuffer> = new Map();

  async generateAllAudioFiles(): Promise<Map<string, AudioBuffer>> {
    const buffers = new Map<string, AudioBuffer>();

    for (const audioData of audioFilesData) {
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

        buffers.set(audioData.filename, buffer);
      } catch (error) {
        console.error(`Failed to generate ${audioData.filename}:`, error);
      }
    }

    this.generatedBuffers = buffers;
    return buffers;
  }

  async exportAsZip(): Promise<Blob> {
    if (this.generatedBuffers.size === 0) {
      await this.generateAllAudioFiles();
    }

    // Create a simple archive structure
    const files: { name: string; data: Uint8Array }[] = [];
    
    const fileNames = Array.from(this.generatedBuffers.keys());
    for (const filename of fileNames) {
      const buffer = this.generatedBuffers.get(filename);
      if (!buffer) continue;
      
      const audioData = audioFilesData.find(a => a.filename === filename);
      const wavData = audioService.audioBufferToWav(buffer);
      const mp3Name = filename.replace('.mp3', '.wav'); // Export as WAV for now
      
      const path = audioData?.category === 'ambient' 
        ? `assets/audio/ambient/${mp3Name}`
        : `assets/audio/${mp3Name}`;
      
      files.push({
        name: path,
        data: new Uint8Array(wavData)
      });
    }

    // Add README.md
    const readmeContent = this.generateReadmeContent();
    files.push({
      name: 'README.md',
      data: new TextEncoder().encode(readmeContent)
    });

    // Create a simple zip-like structure (for now, just return the first file as blob)
    // In a real implementation, you'd use a zip library like JSZip
    return new Blob(files.map(f => f.data), { type: 'application/octet-stream' });
  }

  downloadFile(filename: string): void {
    const buffer = this.generatedBuffers.get(filename);
    if (buffer) {
      audioService.downloadAudioFile(buffer, filename);
    }
  }

  downloadAllAsZip(): void {
    this.exportAsZip().then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rock-paper-scissors-audio-assets.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  private generateReadmeContent(): string {
    const standardSounds = audioFilesData.filter(f => f.category === 'standard');
    const ambientSounds = audioFilesData.filter(f => f.category === 'ambient');

    return `# Rock Paper Scissors Battle - Audio Assets

This package contains all audio files required for the Rock Paper Scissors Battle game.

## Overview

This audio asset collection provides ${audioFilesData.length} essential sound effects designed specifically for an engaging Rock Paper Scissors Battle game experience. All files are optimized for web use and organized for easy integration.

## File Structure

\`\`\`
assets/
└── audio/
    ├── ${standardSounds.map(s => s.filename).join('\n    ├── ')}
    └── ambient/
        ├── ${ambientSounds.map(s => s.filename).join('\n        ├── ')}
\`\`\`

## Standard Sound Effects (/assets/audio/)

${standardSounds.map(sound => `### ${sound.filename}
- **Description**: ${sound.description}
- **Usage**: ${sound.usage}
- **Duration**: ${sound.duration}s
- **Category**: Standard SFX`).join('\n\n')}

## Ambient Loops (/assets/audio/ambient/)

${ambientSounds.map(sound => `### ${sound.filename}
- **Description**: ${sound.description}
- **Usage**: ${sound.usage}
- **Duration**: ${sound.duration}s${sound.isLoop ? ' (Loop)' : ''}
- **Category**: Ambient Background`).join('\n\n')}

## Integration Guide

### Basic JavaScript Implementation

\`\`\`javascript
// Load and play a sound effect
const clickSound = new Audio('./assets/audio/click.mp3');
clickSound.play();

// Set volume (0.0 to 1.0)
clickSound.volume = 0.7;

// For ambient loops
const ambientHum = new Audio('./assets/audio/ambient/hum.mp3');
ambientHum.loop = true;
ambientHum.volume = 0.3;
ambientHum.play();
\`\`\`

### React Implementation

\`\`\`javascript
import { useEffect, useRef } from 'react';

function useAudio(src, volume = 1.0) {
  const audioRef = useRef(new Audio(src));
  
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);
  
  const play = () => audioRef.current.play();
  const pause = () => audioRef.current.pause();
  
  return { play, pause };
}

// Usage in component
function GameComponent() {
  const { play: playClick } = useAudio('./assets/audio/click.mp3', 0.8);
  const { play: playWin } = useAudio('./assets/audio/win.mp3', 0.9);
  
  return (
    <button onClick={() => { playClick(); /* game logic */ }}>
      Play Game
    </button>
  );
}
\`\`\`

## File Specifications

- **Format**: WAV (44.1kHz, 16-bit, Stereo)
- **Compatibility**: All modern browsers and game engines
- **File Size**: Optimized for web delivery (< 500KB per file)
- **Licensing**: Royalty-free, generated content

## Performance Tips

1. **Preload Important Sounds**: Load click and win/lose sounds immediately
2. **Volume Management**: Use different volume levels for SFX vs ambient
3. **Memory Management**: Unload unused ambient tracks when not needed
4. **Browser Compatibility**: Test autoplay policies in target browsers

## Version

Generated on ${new Date().toLocaleDateString()}
Total Files: ${audioFilesData.length}
Categories: 2 (Standard SFX, Ambient Loops)

---

For technical support or customization requests, refer to the main game documentation.
`;
  }
}

export const audioExportService = new AudioExportService();