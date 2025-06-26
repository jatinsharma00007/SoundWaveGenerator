import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Download, 
  Play, 
  MoveUp, 
  SquareDashedBottom, 
  FolderOpen,
  SlidersHorizontal,
  Book,
  Pause,
  VolumeX
} from 'lucide-react';
import { AudioCard } from '@/components/audio-card';
import { audioFilesData } from '@/lib/audio-data';
import { audioService } from '@/lib/audio-service';
import { audioExportService } from '@/lib/audio-export';

export default function AudioManager() {
  const [masterVolume, setMasterVolume] = useState([75]);
  const [sfxVolume, setSfxVolume] = useState([85]);
  const [ambientVolume, setAmbientVolume] = useState([40]);

  const standardSounds = audioFilesData.filter(file => file.category === 'standard');
  const ambientSounds = audioFilesData.filter(file => file.category === 'ambient');

  const handleMasterVolumeChange = (value: number[]) => {
    setMasterVolume(value);
    audioService.setMasterVolume(value[0] / 100);
  };

  const handleSfxVolumeChange = (value: number[]) => {
    setSfxVolume(value);
    audioService.setSfxVolume(value[0] / 100);
  };

  const handleAmbientVolumeChange = (value: number[]) => {
    setAmbientVolume(value);
    audioService.setAmbientVolume(value[0] / 100);
  };

  const handleStopAll = () => {
    audioService.stopAudio();
  };

  const handleMuteAll = () => {
    setMasterVolume([0]);
    audioService.setMasterVolume(0);
  };

  const handleExportAll = () => {
    // This would implement downloading all files as a zip
    console.log('Exporting all audio files...');
  };

  const handleTestAll = async () => {
    // Play a quick test of each sound in sequence
    for (const audioData of standardSounds.slice(0, 3)) {
      // This would trigger each audio card's play function
      console.log(`Testing ${audioData.filename}...`);
    }
  };

  return (
    <div className="min-h-screen bg-game-bg text-white">
      {/* Header */}
      <header className="bg-game-primary border-b border-game-neutral/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-game-secondary to-game-success rounded-lg flex items-center justify-center">
                <Music className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Rock Paper Scissors Battle</h1>
                <p className="text-sm text-game-neutral">Audio Asset Manager</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleExportAll}
                className="bg-game-secondary/10 hover:bg-game-secondary/20 text-game-secondary border border-game-secondary/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
              <Button 
                onClick={handleTestAll}
                className="bg-game-success/10 hover:bg-game-success/20 text-game-success border border-game-success/30"
              >
                <Play className="w-4 h-4 mr-2" />
                Test All
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Overview */}
        <div className="mb-8">
          <Card className="bg-game-primary/50 border-game-neutral/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-3">
                <FolderOpen className="text-game-secondary" />
                <span>Project Overview</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-game-bg/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-game-success mb-2">13</div>
                  <div className="text-game-neutral">Total Audio Files</div>
                </div>
                <div className="bg-game-bg/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-game-warning mb-2">2</div>
                  <div className="text-game-neutral">Folder Categories</div>
                </div>
                <div className="bg-game-bg/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-game-secondary mb-2">&lt; 500KB</div>
                  <div className="text-game-neutral">Max File Size</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Standard Sound Effects */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <MoveUp className="text-game-secondary text-xl" />
            <h2 className="text-2xl font-semibold">Standard Sound Effects</h2>
            <Badge className="bg-game-secondary/20 text-game-secondary border-game-secondary/30 font-mono">
              /assets/audio/
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardSounds.map((audioData) => (
              <AudioCard key={audioData.filename} audioData={audioData} />
            ))}
          </div>
        </section>

        {/* Ambient Loops */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <SquareDashedBottom className="text-game-warning text-xl" />
            <h2 className="text-2xl font-semibold">Ambient Loops</h2>
            <Badge className="bg-game-warning/20 text-game-warning border-game-warning/30 font-mono">
              /assets/audio/ambient/
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambientSounds.map((audioData) => (
              <AudioCard key={audioData.filename} audioData={audioData} />
            ))}
          </div>
        </section>

        {/* Global Controls */}
        <section className="mb-8">
          <Card className="bg-game-primary/50 border-game-neutral/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-3">
                <SlidersHorizontal className="text-game-secondary" />
                <span>Global Audio Controls</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-game-neutral mb-2">Master Volume</label>
                  <Slider
                    value={masterVolume}
                    onValueChange={handleMasterVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-game-neutral mt-1">
                    <span>0%</span>
                    <span>{masterVolume[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-game-neutral mb-2">SFX Volume</label>
                  <Slider
                    value={sfxVolume}
                    onValueChange={handleSfxVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-game-neutral mt-1">
                    <span>0%</span>
                    <span>{sfxVolume[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-game-neutral mb-2">Ambient Volume</label>
                  <Slider
                    value={ambientVolume}
                    onValueChange={handleAmbientVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-game-neutral mt-1">
                    <span>0%</span>
                    <span>{ambientVolume[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-2">
                  <Button
                    onClick={handleStopAll}
                    className="bg-game-secondary hover:bg-game-secondary/80 text-white"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause All
                  </Button>
                  <Button
                    onClick={handleMuteAll}
                    className="bg-game-warning hover:bg-game-warning/80 text-white"
                  >
                    <VolumeX className="w-4 h-4 mr-2" />
                    Mute All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Documentation */}
        <section className="mb-8">
          <Card className="bg-game-primary/50 border-game-neutral/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-3">
                <Book className="text-game-secondary" />
                <span>Project Documentation</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Folder Structure */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-game-success">Folder Structure</h3>
                  <div className="bg-game-bg rounded-lg p-4 font-mono text-sm">
                    <div className="text-game-neutral"># Project Root</div>
                    <div className="ml-0 text-white">📁 assets/</div>
                    <div className="ml-4 text-white">📁 audio/</div>
                    {standardSounds.map((sound) => (
                      <div key={sound.filename} className="ml-8 text-game-success">🎵 {sound.filename}</div>
                    ))}
                    <div className="ml-8 text-white">📁 ambient/</div>
                    {ambientSounds.map((sound) => (
                      <div key={sound.filename} className="ml-12 text-game-warning">🔄 {sound.filename}</div>
                    ))}
                  </div>
                </div>
                
                {/* Integration Guide */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-game-success">Integration Guide</h3>
                  <div className="bg-game-bg rounded-lg p-4">
                    <div className="text-sm text-game-neutral space-y-3">
                      <div>
                        <div className="font-semibold text-white mb-1">JavaScript Example:</div>
                        <code className="text-game-success text-xs block">
                          const audio = new Audio('./assets/audio/click.mp3');<br />
                          audio.play();
                        </code>
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">Volume Control:</div>
                        <code className="text-game-success text-xs block">
                          audio.volume = 0.7; // 70% volume
                        </code>
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">Loop Ambient:</div>
                        <code className="text-game-success text-xs block">
                          ambientAudio.loop = true;
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-game-primary border-t border-game-neutral/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-game-neutral">
            <div>
              <p>Rock Paper Scissors Battle - Audio Asset Manager</p>
              <p>Total project size: <span className="text-game-success">~4.8 MB</span> | Files ready for production</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hover:text-white transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download Package
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-white transition-colors">
                <Book className="w-4 h-4 mr-2" />
                View Source
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
