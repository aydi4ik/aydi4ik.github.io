
import React, { useState } from 'react';
import { engine } from '../services/vibeEngine';
import { UserProfile, Gender } from '../types';

const Onboarding: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<Gender>('Man');
  const [interestedIn, setInterestedIn] = useState<Gender>('Woman');
  const [is18, setIs18] = useState(false);

  const handleStart = () => {
    if (!nickname || !is18) return;

    const newUser: UserProfile = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      nickname,
      preferences: {
        gender,
        interestedIn,
        radius: 25
      },
      reputation: 80, // Default good reputation
      badges: [],
      status: 'idle',
      matchCount: 0,
      completedChats: 0
    };

    engine.setUser(newUser);
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 bg-slate-950 text-slate-50 justify-center">
      <div className="mb-12">
        <h1 className="text-5xl font-black italic tracking-tighter text-indigo-500 mb-2">VIBE.</h1>
        <p className="text-slate-400 text-lg">Real conversations, no scrolling.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300 uppercase tracking-widest">Nickname</label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="e.g. Sunny"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300 uppercase tracking-widest">I am a</label>
            <select
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 focus:outline-none transition-all appearance-none"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
            >
              <option value="Man">Man</option>
              <option value="Woman">Woman</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300 uppercase tracking-widest">Interested In</label>
            <select
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 focus:outline-none transition-all appearance-none"
              value={interestedIn}
              onChange={(e) => setInterestedIn(e.target.value as Gender)}
            >
              <option value="Man">Men</option>
              <option value="Woman">Women</option>
              <option value="Everyone">Everyone</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-2xl">
          <input
            type="checkbox"
            id="ageCheck"
            className="w-6 h-6 rounded-lg bg-slate-800 border-slate-700 text-indigo-500 focus:ring-indigo-500"
            checked={is18}
            onChange={(e) => setIs18(e.target.checked)}
          />
          <label htmlFor="ageCheck" className="text-sm text-slate-400">
            I confirm I am 18+ and agree to talk respectfully.
          </label>
        </div>

        <button
          disabled={!nickname || !is18}
          onClick={handleStart}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-3xl text-xl transition-all shadow-lg shadow-indigo-900/20"
        >
          Let's Go
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500 px-8">
        We use approximate location to find nearby people. Your exact position is never shared.
      </p>
    </div>
  );
};

export default Onboarding;
