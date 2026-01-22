
import React from 'react';
import { UserProfile } from '../types';
import { BADGES } from '../constants';

const Reputation: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className="h-full py-4 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-2">Your Reputation</h2>
      <p className="text-slate-400 text-sm mb-8">Good vibes get you matched with better people faster.</p>

      <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[2rem] text-center mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
        <div className="relative z-10">
          <span className="text-6xl font-black text-indigo-400">{user.reputation}%</span>
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-300/60 mt-2">Vibe Score</p>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4 px-1">Badges Earned</h3>
      {user.badges.length === 0 ? (
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center text-slate-500 mb-10">
          No badges yet. Complete chats and get mutual saves to earn them!
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-10">
          {user.badges.map(badgeId => {
            const badge = BADGES[badgeId];
            return (
              <div key={badgeId} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                <span className="text-3xl block mb-2">{badge.icon}</span>
                <p className="font-bold text-xs mb-1">{badge.name}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{badge.description}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold mb-4 px-1">Private Stats</h3>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <span className="block text-xl font-bold">{user.matchCount}</span>
              <span className="text-[10px] uppercase text-slate-500 font-bold">Total Matches</span>
           </div>
           <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <span className="block text-xl font-bold">{user.completedChats}</span>
              <span className="text-[10px] uppercase text-slate-500 font-bold">Mutual Saves</span>
           </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-slate-900/30 rounded-xl border border-slate-800/50">
        <p className="text-[10px] text-slate-500 italic">
          Tip: High churn (ending matches too quickly) temporarily lowers your queue priority.
        </p>
      </div>
    </div>
  );
};

export default Reputation;
