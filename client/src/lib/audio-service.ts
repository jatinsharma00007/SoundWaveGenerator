export class AudioService {
  private audioContext: AudioContext | null = null;
  private currentlyPlaying: Map<string, AudioBufferSourceNode> = new Map();
  private masterVolume = 0.75;
  private sfxVolume = 0.85;
  private ambientVolume = 0.4;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Web Audio API not supported:', error);
    }
  }

  async resumeAudioContext() {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  generateTone(frequency: number, duration: number, waveType: OscillatorType = 'sine'): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        let sample = 0;
        
        switch (waveType) {
          case 'sine':
            sample = Math.sin(2 * Math.PI * frequency * t);
            break;
          case 'square':
            sample = Math.sign(Math.sin(2 * Math.PI * frequency * t));
            break;
          case 'sawtooth':
            sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
            break;
          case 'triangle':
            sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
            break;
        }
        
        // Apply envelope for smoother sound
        const envelope = Math.exp(-t * 2);
        channelData[i] = sample * envelope * 0.3;
      }
    }

    return buffer;
  }

  generateMelody(notes: number[], noteDuration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const totalDuration = notes.length * noteDuration;
    const length = sampleRate * totalDuration;
    const buffer = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      notes.forEach((frequency, noteIndex) => {
        const startSample = noteIndex * noteDuration * sampleRate;
        const endSample = Math.min((noteIndex + 1) * noteDuration * sampleRate, length);
        
        for (let i = startSample; i < endSample; i++) {
          const t = (i - startSample) / sampleRate;
          const sample = Math.sin(2 * Math.PI * frequency * t);
          const envelope = Math.exp(-t * 3);
          channelData[i] = sample * envelope * 0.2;
        }
      });
    }

    return buffer;
  }

  generateNoiseSound(duration: number, frequency: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1) * 0.1;
        const tone = Math.sin(2 * Math.PI * frequency * t) * 0.3;
        const envelope = Math.exp(-t * 1.5);
        channelData[i] = (noise + tone) * envelope;
      }
    }

    return buffer;
  }

  async playAudioBuffer(buffer: AudioBuffer, filename: string, category: 'standard' | 'ambient' = 'standard'): Promise<void> {
    if (!this.audioContext) return;

    await this.resumeAudioContext();

    // Stop any currently playing audio with the same filename
    this.stopAudio(filename);

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Set volume based on category
    const categoryVolume = category === 'ambient' ? this.ambientVolume : this.sfxVolume;
    gainNode.gain.value = this.masterVolume * categoryVolume;

    source.start();
    this.currentlyPlaying.set(filename, source);

    source.onended = () => {
      this.currentlyPlaying.delete(filename);
    };
  }

  stopAudio(filename?: string) {
    if (filename) {
      const source = this.currentlyPlaying.get(filename);
      if (source) {
        source.stop();
        this.currentlyPlaying.delete(filename);
      }
    } else {
      // Stop all audio
      this.currentlyPlaying.forEach(source => source.stop());
      this.currentlyPlaying.clear();
    }
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setAmbientVolume(volume: number) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  getSfxVolume(): number {
    return this.sfxVolume;
  }

  getAmbientVolume(): number {
    return this.ambientVolume;
  }

  isPlaying(filename: string): boolean {
    return this.currentlyPlaying.has(filename);
  }

  audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    // Convert audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  downloadAudioFile(buffer: AudioBuffer, filename: string) {
    const wavData = this.audioBufferToWav(buffer);
    const blob = new Blob([wavData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace('.mp3', '.wav');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const audioService = new AudioService();
