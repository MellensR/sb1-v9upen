import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CrewMember } from '../types';

interface CriticalAlertsProps {
  crewMembers: CrewMember[];
}

const CriticalAlerts: React.FC<CriticalAlertsProps> = ({ crewMembers }) => {
  const criticalCrewMembers = crewMembers.filter(
    member => (member.active && (member.health <= 3 || member.stress >= 8))
  );

  if (criticalCrewMembers.length === 0) return null;

  const alerts = criticalCrewMembers.map(member => {
    const messages = [];
    if (member.health <= 3) {
      messages.push(`${member.name} - CRITICAL HEALTH`);
    }
    if (member.stress >= 8) {
      messages.push(`${member.name} - CRITICAL STRESS`);
    }
    return messages;
  }).flat();

  const alertText = alerts.join(' • ');

  return (
    <div className="mt-4 bg-gradient-to-r from-red-950 via-red-900 to-red-950 rounded-lg border border-red-800">
      <div className="relative flex items-center gap-3 overflow-hidden py-2 px-4">
        <div className="flex-shrink-0 flex items-center gap-2 pr-4 border-r border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
          <span className="font-bold text-red-200 uppercase tracking-wider">Critical Alert</span>
        </div>
        <div className="relative flex overflow-x-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap flex items-center text-red-200 font-medium">
            <span className="mx-4">{alertText}</span>
            <span className="mx-4">{alertText}</span>
            <span className="mx-4">{alertText}</span>
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center text-red-200 font-medium">
            <span className="mx-4">{alertText}</span>
            <span className="mx-4">{alertText}</span>
            <span className="mx-4">{alertText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlerts;