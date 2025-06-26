# Rock Paper Scissors Battle - Complete Audio Assets

This package contains all audio files required for the Rock Paper Scissors Battle game, including both modern and retro versions.

## Overview

This comprehensive audio asset collection provides 26 sound effects (13 modern + 13 retro) designed specifically for an engaging Rock Paper Scissors Battle game experience. The package includes modern MP3 versions and authentic retro arcade-style WAV versions inspired by classic sound chips.

## File Structure

```
assets/
├── audio/                    # Modern audio files
│   ├── click.mp3
│   ├── win.mp3
│   ├── lose.mp3
│   ├── draw.mp3
│   ├── gameStart.mp3
│   ├── gameWin.mp3
│   ├── gameLose.mp3
│   ├── gameDraw.mp3
│   ├── countdown.mp3
│   ├── tick.mp3
│   ├── timeUp.mp3
│   ├── bonusRound.mp3
│   ├── chaos.mp3
│   └── ambient/
│       ├── hum.mp3
│       ├── wind.mp3
│       └── lo-fi-loop.mp3
└── retro/                   # Retro 8-bit versions
    ├── click.wav
    ├── win.wav
    ├── lose.wav
    ├── draw.wav
    ├── gameStart.wav
    ├── gameWin.wav
    ├── gameLose.wav
    ├── gameDraw.wav
    ├── countdown.wav
    ├── tick.wav
    ├── timeUp.wav
    ├── bonusRound.wav
    ├── chaos.wav
    └── ambient/
        ├── hum.wav
        ├── wind.wav
        └── lo-fi-loop.wav
```

## Modern Audio (/assets/audio/)

### Standard Sound Effects
- **click.mp3** - Button click sound (0.1s)
- **win.mp3** - Round victory sound (1.2s)
- **lose.mp3** - Round defeat sound (0.8s)
- **draw.mp3** - Round tie sound (0.6s)
- **gameStart.mp3** - Game initialization (1.5s)
- **gameWin.mp3** - Complete game victory (2.5s)
- **gameLose.mp3** - Complete game defeat (2.0s)
- **gameDraw.mp3** - Game ends in tie (1.8s)
- **countdown.mp3** - Countdown ticking (3.0s)
- **tick.mp3** - Per-second tick (0.1s)
- **timeUp.mp3** - Countdown ends (1.0s)
- **bonusRound.mp3** - Bonus round begins (2.0s)
- **chaos.mp3** - Chaos mode activation (1.5s)

### Ambient Loops (/assets/audio/ambient/)
- **hum.mp3** - Electric ambient hum (10.0s loop)
- **wind.mp3** - Ambient wind sound (15.0s loop)
- **lo-fi-loop.mp3** - Retro lo-fi music (20.0s loop)

## Retro Audio (/assets/retro/)

All retro versions maintain the same filenames and durations as their modern counterparts but use authentic 8-bit sound chip synthesis:

### Sound Chip Styles
- **NES Style** - Square wave channels with duty cycles
- **Game Boy Style** - 4-bit quantization with sharp envelopes
- **C64 Style** - Classic computer sound synthesis
- **Arcade Style** - High-frequency square waves with rapid attack/decay

### Technical Specifications
- **Format**: WAV (22.05kHz or 16.384kHz)
- **Bit Depth**: 8-bit with period-appropriate quantization
- **Channels**: Stereo
- **File Size**: Smaller than modern versions
- **Compatibility**: All modern browsers and retro game engines

## Integration Examples

### Basic Usage

```javascript
// Modern audio
const modernClick = new Audio('./assets/audio/click.mp3');
modernClick.play();

// Retro audio
const retroClick = new Audio('./assets/retro/click.wav');
retroClick.play();
```

### Audio Manager with Style Switching

```javascript
class GameAudioManager {
  constructor() {
    this.retroMode = false;
    this.sounds = {};
    this.loadSounds();
  }
  
  loadSounds() {
    const soundNames = ['click', 'win', 'lose', 'draw'];
    soundNames.forEach(name => {
      this.sounds[name] = {
        modern: new Audio(`./assets/audio/${name}.mp3`),
        retro: new Audio(`./assets/retro/${name}.wav`)
      };
    });
  }
  
  playSound(name) {
    const style = this.retroMode ? 'retro' : 'modern';
    this.sounds[name][style].play();
  }
  
  toggleRetroMode() {
    this.retroMode = !this.retroMode;
    console.log(`Audio style: ${this.retroMode ? 'Retro 8-bit' : 'Modern'}`);
  }
}

// Usage
const audioManager = new GameAudioManager();
audioManager.playSound('click');          // Plays modern version
audioManager.toggleRetroMode();
audioManager.playSound('click');          // Plays retro version
```

### Volume and Loop Management

```javascript
// Set volumes for different categories
const sfxVolume = 0.8;
const ambientVolume = 0.4;

// Standard effects
const winSound = new Audio('./assets/audio/win.mp3');
winSound.volume = sfxVolume;

// Ambient loops
const backgroundHum = new Audio('./assets/audio/ambient/hum.mp3');
backgroundHum.volume = ambientVolume;
backgroundHum.loop = true;
backgroundHum.play();

// Retro ambient
const retroHum = new Audio('./assets/retro/ambient/hum.wav');
retroHum.volume = ambientVolume * 0.9; // Slightly lower for retro
retroHum.loop = true;
```

## Performance Recommendations

1. **Preload Critical Sounds**: Load click, win, lose sounds on game init
2. **Volume Balance**: Retro sounds may appear louder due to sharp waveforms
3. **Memory Management**: Unload unused ambient tracks when switching modes
4. **Browser Compatibility**: Both MP3 and WAV formats supported in all modern browsers

## File Size Optimization

- Modern files: Optimized MP3 encoding for web delivery
- Retro files: Lower sample rates reduce file sizes further
- All files under 500KB for fast loading
- Total package size: ~9.6MB for complete collection

## Licensing

All audio files are procedurally generated and royalty-free. Safe for commercial use in games and applications.

## Version History

- **v2.0** - Added complete retro audio collection with 4 sound chip styles
- **v1.0** - Initial modern audio collection with 13 essential game sounds

---

For technical implementation details, see the audio manager interface documentation.

