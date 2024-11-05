import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import StartScreen from './components/StartScreen';
import MonitoringSystem from './components/MonitoringSystem';
import { AudioManager } from './utils/AudioManager';

function App() {
  const [started, setStarted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const audioManager = AudioManager.getInstance();
        await audioManager.initialize();
        setAudioInitialized(true);
      } catch (error) {
        console.error('Audio initialization failed:', error);
      }
    };

    initAudio();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {!started ? (
        <StartScreen onStart={() => setStarted(true)} />
      ) : (
        <MonitoringSystem />
      )}
      
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm border-t border-gray-800">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>USCM ARES v1.0.1 - Weyland-Yutani Corporation</span>
        </div>
      </footer>
    </div>
  );
}

export default App;