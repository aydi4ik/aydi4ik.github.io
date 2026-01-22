
import React from 'react';
import { UserProfile } from '../types';
import { engine } from '../services/vibeEngine';

interface HomeProps {
  user: UserProfile;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full py-8">
      <div className="text-center mt-10">
        <p className="text-indigo-400 font-medium mb-2">Welcome back,</p>
        <h2 className="text-4xl font-bold tracking-tight">{user.nickname}</h2>
      </div>

      <div className="flex flex-col items-center gap-8 w-full px-4">
        <div className="relative group cursor-pointer" onClick={() => engine.joinQueue()}>
          <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl group-active:scale-110 transition-transform"></div>
          <button
            className="relative w-64 h-64 bg-indigo-600 rounded-full flex flex-col items-center justify-center border-4 border-indigo-400/30 shadow-2xl shadow-indigo-900 active:scale-95 transition-transform"
          >
            <span className="text-4xl mb-2">⚡</span>
            <span className="text-xl font-black uppercase tracking-widest text-white">Connect</span>
            <span className="text-xs font-bold text-indigo-200 mt-1">AVAILABLE NOW</span>
          </button>
        </div>
        
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 text-center w-full">
          <p className="text-slate-400 text-sm leading-relaxed">
            1 active chat at a time.<br/>
            Quality connections, no distractions.
          </p>
        </div>
      </div>

      <div className="flex gap-4 w-full">
         <div className="flex-1 p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
            <span className="block text-2xl font-bold">{user.reputation}%</span>
            <span className="text-[10px] uppercase text-slate-500 font-bold">Reputation</span>
         </div>
         <div className="flex-1 p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
            <span className="block text-2xl font-bold">{user.matchCount}</span>
            <span className="text-[10px] uppercase text-slate-500 font-bold">Matches</span>
         </div>
      </div>
    </div>
  );
};

export default Home;
