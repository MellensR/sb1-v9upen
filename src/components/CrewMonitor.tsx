import React, { useState, useEffect } from 'react';
import { Heart, Waves, Power, Volume2, VolumeX, Edit2, Check, Skull } from 'lucide-react';
import { CrewMember } from '../types';
import HealthGraph from './HealthGraph';
import { AudioManager } from '../utils/AudioManager';

interface CrewMonitorProps {
  crewMember: CrewMember;
  onUpdate: (id: number, updates: Partial<CrewMember>) => void;
  onToggle: (id: number) => void;
}

const CrewMonitor: React.FC<CrewMonitorProps> = ({
  crewMember,
  onUpdate,
  onToggle,
}) => {
  const { id, name, health, stress, active } = crewMember;
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [prevHealth, setPrevHealth] = useState(health);

  useEffect(() => {
    const audioManager = AudioManager.getInstance();
    audioManager.initialize();
  }, []);

  useEffect(() => {
    const audioManager = AudioManager.getInstance();
    if (health === 0 && prevHealth > 0) {
      if (soundEnabled) {
        audioManager.play('flatline', true);
      }
    } else if (health > 0 && prevHealth === 0) {
      audioManager.stop('flatline');
    }
    setPrevHealth(health);
  }, [health, prevHealth, soundEnabled]);

  useEffect(() => {
    const audioManager = AudioManager.getInstance();
    if (!soundEnabled) {
      audioManager.stop('flatline');
    } else if (health === 0) {
      audioManager.play('flatline', true);
    }
  }, [soundEnabled, health]);

  useEffect(() => {
    return () => {
      const audioManager = AudioManager.getInstance();
      audioManager.stopAll();
    };
  }, []);

  const handleHealthChange = (value: number) => {
    onUpdate(id, { health: value });
  };

  const handleStressChange = (value: number) => {
    onUpdate(id, { stress: value });
  };

  const handleNameSubmit = () => {
    if (editedName.trim()) {
      onUpdate(id, { name: editedName.trim() });
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setEditedName(name);
      setIsEditing(false);
    }
  };

  if (!active) {
    return (
      <button
        onClick={() => onToggle(id)}
        className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-700 flex items-center justify-between w-full hover:bg-opacity-60 transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <Power className="w-4 h-4 text-gray-600 group-hover:text-cyan-500" />
          <span className="text-gray-500 group-hover:text-cyan-500 text-sm truncate">{name}</span>
        </div>
        <div className="flex items-center gap-2 text-red-900">
          <Skull className="w-4 h-4" />
          <span className="text-xs font-medium">KIA</span>
        </div>
      </button>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border ${health === 0 ? 'border-red-900' : 'border-gray-700'} relative`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="bg-gray-700 text-xl font-semibold tracking-wide rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 flex-1"
                autoFocus
              />
              <button
                onClick={handleNameSubmit}
                className="p-1 hover:bg-gray-700 rounded text-cyan-400"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold tracking-wide">{name}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-700 rounded opacity-50 hover:opacity-100"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-gray-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={() => onToggle(id)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Power className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Heart className={`w-5 h-5 ${health === 0 ? 'text-red-500' : 'text-green-500'}`} />
              <span className="text-sm">Health: {health}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              health === 0 ? 'bg-red-900 text-red-100' :
              health <= 3 ? 'bg-orange-900 text-orange-100' :
              'bg-green-900 text-green-100'
            }`}>
              {health === 0 ? 'FLATLINED' :
               health <= 3 ? 'CRITICAL' :
               'STABLE'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={health}
            onChange={(e) => handleHealthChange(Number(e.target.value))}
            className="w-full"
          />
          <HealthGraph value={health} type="health" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Waves className={`w-5 h-5 ${
                stress >= 8 ? 'text-red-500' :
                stress >= 5 ? 'text-yellow-500' :
                'text-blue-500'
              }`} />
              <span className="text-sm">Stress: {stress}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              stress >= 8 ? 'bg-red-900 text-red-100' :
              stress >= 5 ? 'bg-yellow-900 text-yellow-100' :
              'bg-blue-900 text-blue-100'
            }`}>
              {stress >= 8 ? 'PANIC' :
               stress >= 5 ? 'STRESSED' :
               'CALM'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={stress}
            onChange={(e) => handleStressChange(Number(e.target.value))}
            className="w-full"
          />
          <HealthGraph value={stress} type="stress" />
        </div>
      </div>
    </div>
  );
};

export default CrewMonitor;