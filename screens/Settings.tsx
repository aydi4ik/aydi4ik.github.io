
import React from 'react';
import { UserProfile } from '../types';
import { engine } from '../services/vibeEngine';

const Settings: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className="h-full py-4 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6">Settings</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold">Nickname</p>
              <p className="text-xs text-slate-500">{user.nickname}</p>
            </div>
            <button className="text-indigo-400 text-xs font-bold uppercase">Edit</button>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold">Preferences</p>
              <p className="text-xs text-slate-500">Interested in {user.preferences.interestedIn}</p>
            </div>
            <button className="text-indigo-400 text-xs font-bold uppercase">Change</button>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Account</h3>
        <div className="space-y-2">
           <button className="w-full p-4 bg-slate-900 rounded-2xl text-left font-medium text-slate-300">Privacy Policy</button>
           <button className="w-full p-4 bg-slate-900 rounded-2xl text-left font-medium text-slate-300">Terms of Service</button>
           <button 
             onClick={() => engine.resetAll()}
             className="w-full p-4 bg-red-950/20 text-red-500 border border-red-900/30 rounded-2xl text-left font-bold"
            >
             Reset Profile / Data
           </button>
        </div>
      </div>

      <div className="text-center py-8 opacity-30 text-[10px] uppercase font-bold tracking-[0.2em]">
        VIBE MVP v1.0.0
      </div>
    </div>
  );
};

export default Settings;
