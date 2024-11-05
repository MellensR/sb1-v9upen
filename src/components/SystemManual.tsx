import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface SystemManualProps {
  isOpen: boolean;
  onClose: () => void;
}

const SystemManual: React.FC<SystemManualProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-cyan-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              ARES System Manual
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-gray-300">
            <section className="space-y-2">
              <h3 className="text-cyan-400 font-semibold">SYSTEM OVERVIEW</h3>
              <p className="text-sm">
                The Advanced Resource & Emergency System (ARES) is a state-of-the-art combat medical monitoring platform developed by Weyland-Yutani for the Colonial Marines. It provides real-time health and psychological status tracking for deployed personnel.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-cyan-400 font-semibold">MONITOR FUNCTIONS</h3>
              <div className="text-sm space-y-2">
                <p>
                  <span className="text-green-400">■</span> <strong>Health Monitor:</strong> Tracks vital signs and physical condition. Critical alerts trigger at 30% or below.
                </p>
                <p>
                  <span className="text-yellow-400">■</span> <strong>Stress Monitor:</strong> Measures psychological stability and combat stress levels. High readings may indicate imminent psychological breakdown.
                </p>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-cyan-400 font-semibold">OPERATIONAL GUIDELINES</h3>
              <div className="text-sm space-y-2">
                <p>1. Monitor activation requires manual authorization for each crew member.</p>
                <p>2. Inactive monitors can be reactivated from the storage bay at any time.</p>
                <p>3. Combat Medical Technicians can adjust readings using the provided controls.</p>
                <p>4. Audio alerts can be toggled for individual monitors as needed.</p>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-cyan-400 font-semibold">EMERGENCY PROTOCOLS</h3>
              <div className="text-sm space-y-2">
                <p>
                  <span className="text-red-500">CRITICAL:</span> Health readings below 30% require immediate medical intervention.
                </p>
                <p>
                  <span className="text-red-500">PANIC:</span> Stress levels above 80% indicate severe psychological distress. Implement Order 966 if necessary.
                </p>
              </div>
            </section>

            <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
              WARNING: Failure to monitor crew vital signs during xenomorph encounters has resulted in 78% higher casualty rates. Stay frosty.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemManual;