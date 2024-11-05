import React, { useState } from 'react';
import { Activity, AlertTriangle, Heart, Waves, Plus, Settings, HelpCircle, Shield } from 'lucide-react';
import CrewMonitor from './CrewMonitor';
import AudioSettings from './AudioSettings';
import SystemManual from './SystemManual';
import CriticalAlerts from './CriticalAlerts';
import { CrewMember } from '../types';

const MonitoringSystem: React.FC = () => {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([
    { id: 1, name: 'Ellen Ripley', health: 10, stress: 0, active: true },
    { id: 2, name: 'Ash', health: 10, stress: 0, active: true },
    { id: 3, name: 'Dallas', health: 10, stress: 0, active: true },
    { id: 4, name: 'Kane', health: 10, stress: 0, active: true },
    { id: 5, name: 'Lambert', health: 10, stress: 0, active: true },
    { id: 6, name: 'Parker', health: 10, stress: 0, active: true },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const updateCrewMember = (id: number, updates: Partial<CrewMember>) => {
    setCrewMembers(prev =>
      prev.map(member =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const toggleCrewMember = (id: number) => {
    updateCrewMember(id, { active: !crewMembers.find(m => m.id === id)?.active });
  };

  const addNewMonitor = () => {
    const newId = Math.max(...crewMembers.map(m => m.id)) + 1;
    setCrewMembers(prev => [...prev, {
      id: newId,
      name: `Crew Member ${newId}`,
      health: 10,
      stress: 0,
      active: true
    }]);
  };

  // Separate active and inactive monitors
  const activeMonitors = crewMembers.filter(m => m.active);
  const inactiveMonitors = crewMembers.filter(m => !m.active);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg backdrop-blur-sm bg-opacity-90">
        <div className="max-w-[2000px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl font-bold tracking-wider text-cyan-400">
                ARES MONITORING
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm">Health</span>
              </div>
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">Stress</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span className="text-sm">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowManual(true)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title="System Manual"
                >
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Audio Settings"
                >
                  <Settings className="w-5 h-5 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>
          <CriticalAlerts crewMembers={crewMembers} />
          <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-800 to-transparent mt-4" />
        </div>
      </header>

      <main className="flex-1 pt-28 px-6 pb-20">
        <div className="space-y-8 max-w-[2000px] mx-auto">
          {/* Active Monitors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMonitors.map((member) => (
              <CrewMonitor
                key={member.id}
                crewMember={member}
                onUpdate={updateCrewMember}
                onToggle={toggleCrewMember}
              />
            ))}
            
            {/* Add Monitor Button */}
            <button
              onClick={addNewMonitor}
              className="h-[300px] bg-gray-800 bg-opacity-50 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center gap-4 hover:bg-opacity-60 hover:border-cyan-700 transition-all duration-300 group"
            >
              <Plus className="w-12 h-12 text-gray-600 group-hover:text-cyan-500 transition-colors" />
              <span className="text-gray-500 group-hover:text-cyan-500 transition-colors">Add New Monitor</span>
            </button>
          </div>

          {/* Inactive Monitors */}
          {inactiveMonitors.length > 0 && (
            <div className="border-t border-gray-800 pt-8 mb-8">
              <h2 className="text-gray-500 text-sm font-medium mb-4">Inactive Monitors</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {inactiveMonitors.map((member) => (
                  <CrewMonitor
                    key={member.id}
                    crewMember={member}
                    onUpdate={updateCrewMember}
                    onToggle={toggleCrewMember}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm border-t border-gray-800">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 max-w-[2000px] mx-auto">
          <Shield className="w-4 h-4" />
          <span>USCM ARES v1.0.1 - Weyland-Yutani Corporation</span>
        </div>
      </footer>

      <AudioSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <SystemManual isOpen={showManual} onClose={() => setShowManual(false)} />
    </div>
  );
};

export default MonitoringSystem;