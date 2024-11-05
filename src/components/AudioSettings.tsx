import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X, Play } from 'lucide-react';
import { AudioManager } from '../utils/AudioManager';

interface AudioSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AudioSettings: React.FC<AudioSettingsProps> = ({ isOpen, onClose }) => {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioManager = AudioManager.getInstance();
    audioManager.setVolume(volume);
    audioManager.setEnabled(enabled);
  }, [volume, enabled]);

  const handleTestSound = async () => {
    if (isPlaying) return;
    
    const audioManager = AudioManager.getInstance();
    setIsPlaying(true);
    await audioManager.play('flatline', true);
    setTimeout(() => {
      setIsPlaying(false);
      audioManager.stop('flatline');
    }, 1000); // Play for 1 second
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-cyan-900 rounded-lg max-w-md w-full">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio Settings
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Enable/Disable Audio */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">System Audio</span>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enabled ? 'bg-cyan-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Volume</span>
                <span className="text-sm text-gray-500">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full"
                disabled={!enabled}
              />
            </div>

            {/* Test Sound */}
            <div>
              <button
                onClick={handleTestSound}
                disabled={!enabled || isPlaying}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                  enabled
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>{isPlaying ? 'Playing...' : 'Test Flatline'}</span>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Plays a sample flatline sound to test your settings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioSettings;