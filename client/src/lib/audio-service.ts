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

  generateRetroTone(frequency: number, duration: number, waveType: OscillatorType = 'square', pitchBend: boolean = false): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        let currentFreq = frequency;
        
        // Add pitch bend for retro effect
        if (pitchBend) {
          const bendAmount = Math.sin(t * 4) * 0.1;
          currentFreq = frequency * (1 + bendAmount);
        }
        
        let sample = 0;
        
        switch (waveType) {
          case 'square':
            sample = Math.sign(Math.sin(2 * Math.PI * currentFreq * t));
            break;
          case 'triangle':
            const trianglePhase = (t * currentFreq) % 1;
            sample = trianglePhase < 0.5 ? 4 * trianglePhase - 1 : 3 - 4 * trianglePhase;
            break;
          case 'sawtooth':
            sample = 2 * ((t * currentFreq) % 1) - 1;
            break;
          default:
            sample = Math.sin(2 * Math.PI * currentFreq * t);
        }
        
        // Apply 8-bit style quantization
        sample = Math.round(sample * 15) / 15;
        
        // Retro-style envelope with sharp attack/decay
        let envelope = 1;
        const attackTime = 0.02;
        const decayTime = duration * 0.3;
        
        if (t < attackTime) {
          envelope = t / attackTime;
        } else if (t > duration - decayTime) {
          envelope = (duration - t) / decayTime;
        }
        
        channelData[i] = sample * envelope * 0.4;
      }
    }

    return buffer;
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

  generateRetroMelody(notes: number[], noteDuration: number, useArpeggio: boolean = false): AudioBuffer {
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
          let currentFreq = frequency;
          
          // Add arpeggio effect for some notes
          if (useArpeggio && noteIndex % 2 === 0) {
            const arpeggioRate = 8;
            const arpeggioNotes = [1, 1.25, 1.5]; // Major triad
            const arpeggioIndex = Math.floor(t * arpeggioRate) % arpeggioNotes.length;
            currentFreq = frequency * arpeggioNotes[arpeggioIndex];
          }
          
          // Use square wave for retro sound
          let sample = Math.sign(Math.sin(2 * Math.PI * currentFreq * t));
          
          // 8-bit quantization
          sample = Math.round(sample * 15) / 15;
          
          // Sharp retro envelope
          let envelope = 1;
          const noteProgress = t / noteDuration;
          if (noteProgress > 0.8) {
            envelope = (1 - noteProgress) / 0.2;
          }
          
          channelData[i] = sample * envelope * 0.3;
        }
      });
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

  generateRetroNoise(duration: number, frequency: number, noiseType: 'white' | 'pink' | 'retro' = 'retro'): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        let noise = 0;
        
        if (noiseType === 'retro') {
          // Generate 8-bit style noise with periodic patterns
          const period = Math.floor(sampleRate / frequency);
          const phase = i % period;
          noise = (Math.random() * 2 - 1);
          
          // Quantize to 8-bit levels
          noise = Math.round(noise * 7) / 7;
          
          // Add some periodic structure for retro feel
          if (phase < period * 0.3) {
            noise *= 0.7;
          }
        } else if (noiseType === 'pink') {
          // Pink noise approximation
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          noise = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          b6 = white * 0.115926;
        } else {
          // White noise
          noise = Math.random() * 2 - 1;
        }
        
        // Mix with tone for character
        const tone = Math.sin(2 * Math.PI * frequency * t) * 0.3;
        let sample = noise * 0.7 + tone;
        
        // Apply retro-style envelope
        let envelope = 1;
        const fadeIn = Math.min(t / 0.1, 1);
        const fadeOut = Math.min((duration - t) / 0.1, 1);
        envelope = Math.min(fadeIn, fadeOut);
        
        channelData[i] = sample * envelope * 0.2;
      }
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
