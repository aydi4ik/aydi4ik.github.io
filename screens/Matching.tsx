
import React, { useEffect, useState } from 'react';
import { engine } from '../services/vibeEngine';

const Matching: React.FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="relative mb-12">
        <div className="w-32 h-32 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl animate-pulse">🛰️</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4">Finding someone nearby{dots}</h2>
      <p className="text-slate-400 max-w-xs mx-auto mb-12">
        We're looking for someone who matches your vibe and is ready to talk right now.
      </p>

      <div className="w-full max-w-xs space-y-3">
        <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-500 uppercase tracking-widest font-bold">
           Queue Tip: Be respectful and kind.
        </div>
        <button
          onClick={() => engine.leaveQueue()}
          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-4 rounded-2xl transition-all"
        >
          Cancel Search
        </button>
      </div>

      {/* Dev Helper */}
      <div className="mt-12 p-4 border border-dashed border-indigo-900 rounded-xl">
        <p className="text-[10px] text-indigo-400 mb-2 font-mono">DEBUG: TEST MULTI-TAB</p>
        <button 
          onClick={() => {
            // Simulate another user joining
            const fakeId = 'bot_' + Math.random().toString(36).substr(2, 5);
            const channel = new BroadcastChannel('vibe_network');
            channel.postMessage({ type: 'JOIN_QUEUE', payload: { userId: fakeId } });
          }}
          className="text-[10px] bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded"
        >
          Simulate Remote User
        </button>
      </div>
    </div>
  );
};

export default Matching;
