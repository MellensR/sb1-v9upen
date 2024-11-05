import React, { useState } from 'react';
import { Shield, Power, AlertCircle, Lock } from 'lucide-react';
import SystemManual from './SystemManual';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [showManual, setShowManual] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-10">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="aspect-square border border-cyan-500/20" />
        ))}
      </div>

      <div className="text-center relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-16 h-16 text-cyan-400" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-wider text-cyan-400 mb-4">
          A.R.E.S.
        </h1>
        
        <div className="text-xl md:text-2xl text-gray-400 mb-8 space-y-2">
          <p>Advanced Resource & Emergency System</p>
          <p className="text-sm text-gray-500">United States Colonial Marine Corps</p>
        </div>

        <div className="space-y-4 mb-12">
          <p className="text-gray-400">
            Combat medical monitoring and emergency response system.
            Authorized personnel only.
          </p>
          <p className="text-sm text-gray-500">
            USCM Regulation 34-178B: All marine units must maintain active biosign monitoring during deployment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-2 h-12 px-8 font-medium tracking-wide text-white transition duration-300 rounded-lg focus-visible:outline-none whitespace-nowrap bg-cyan-950 hover:bg-cyan-900 focus:bg-cyan-900"
          >
            <Power className="w-5 h-5" />
            <span>INITIALIZE SYSTEM</span>
            <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-800 opacity-30 blur group-hover:opacity-40 transition" />
          </button>

          <button
            onClick={() => setShowManual(true)}
            className="group relative inline-flex items-center justify-center gap-2 h-12 px-8 font-medium tracking-wide text-white transition duration-300 rounded-lg focus-visible:outline-none whitespace-nowrap border border-cyan-800 hover:bg-cyan-950/50"
          >
            <AlertCircle className="w-5 h-5" />
            <span>SYSTEM MANUAL</span>
          </button>
        </div>

        <button
          onClick={() => setShowPrivacy(true)}
          className="mt-8 text-sm text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-2 mx-auto"
        >
          <Lock className="w-4 h-4" />
          <span>Security & Privacy Protocol</span>
        </button>
      </div>

      <SystemManual isOpen={showManual} onClose={() => setShowManual(false)} />

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-cyan-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security & Privacy Protocol
                </h2>
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="p-1 hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-gray-300">
                <section className="space-y-2">
                  <h3 className="text-cyan-400 font-semibold">SECURITY CLASSIFICATION</h3>
                  <p className="text-sm">
                    ARES biosign data is classified as LEVEL 3 RESTRICTED under USCM Information Security Protocol 23-A. Unauthorized access or transmission of monitor data is punishable under Colonial Military Code.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-cyan-400 font-semibold">DATA COLLECTION</h3>
                  <div className="text-sm space-y-2">
                    <p>The following biometric data is collected and encrypted:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Vital signs and physical health metrics</li>
                      <li>Psychological stress indicators</li>
                      <li>Neural pattern analysis</li>
                      <li>Combat readiness assessment</li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-cyan-400 font-semibold">ENCRYPTION PROTOCOL</h3>
                  <div className="text-sm space-y-2">
                    <p>All data is protected using:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Military-grade quantum encryption</li>
                      <li>Secure neural-link transmission</li>
                      <li>Automated data purge on unauthorized access</li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-cyan-400 font-semibold">DATA SHARING</h3>
                  <div className="text-sm space-y-2">
                    <p>Biosign data is shared with:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>USCM Medical Command</li>
                      <li>Unit Combat Medical Officers</li>
                      <li>Weyland-Yutani Research Division (anonymized)</li>
                    </ul>
                  </div>
                </section>

                <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
                  NOTICE: This system operates under the authority of the United Americas Allied Command, pursuant to Colonial Administration Resolution 2179-C.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        <div className="text-xs text-gray-600 font-mono">
          SECURITY LEVEL: ALPHA • ENCRYPTION: ENABLED • NODE: SULACO-127
        </div>
      </div>
    </div>
  );
};

export default StartScreen;