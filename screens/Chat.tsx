
import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, UserProfile } from '../types';
import { engine } from '../services/vibeEngine';
import { GHOST_TIMEOUT_MS, AUTO_END_TIMEOUT_MS } from '../constants';

interface ChatProps {
  chat: ChatSession;
  user: UserProfile;
}

const Chat: React.FC<ChatProps> = ({ chat, user }) => {
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const partnerId = chat.users.find(id => id !== user.id);
  const isExpired = Date.now() > chat.expiresAt;

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, chat.expiresAt - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) {
        setShowDecision(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [chat.expiresAt]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [chat.messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      engine.sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const myDecision = chat.decisions[user.id];

  if (showDecision || myDecision) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-8">
        <h2 className="text-4xl font-black mb-4">Vibe Check.</h2>
        <p className="text-slate-400 mb-12">5 minutes are up! Did you connect with them?</p>
        
        {myDecision ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">{myDecision === 'save' ? '✅' : '👋'}</span>
            </div>
            <p className="text-indigo-400 font-bold uppercase tracking-widest">Waiting for their response...</p>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <button
              onClick={() => engine.submitDecision('save')}
              className="w-full bg-indigo-600 py-6 rounded-3xl text-xl font-bold shadow-xl shadow-indigo-900/20 active:scale-95 transition-all"
            >
              Save Connection
            </button>
            <button
              onClick={() => engine.submitDecision('pass')}
              className="w-full bg-slate-900 text-slate-400 py-6 rounded-3xl text-xl font-bold active:scale-95 transition-all"
            >
              End / Just Passing
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full"></div>
          <div>
            <span className="block font-bold text-sm">Nearby Person</span>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">0.8 miles away</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${timeLeft < 30000 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-slate-800 text-slate-300'}`}>
            {formatTime(timeLeft)}
          </div>
          <button onClick={() => setShowDecision(true)} className="text-slate-500 hover:text-slate-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {chat.messages.length === 0 && (
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-dashed border-slate-800 text-center my-8">
            <span className="text-3xl block mb-2">🧊</span>
            <p className="text-slate-400 text-sm">Icebreaker: What's the last song you had on repeat?</p>
          </div>
        )}
        
        {chat.messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 safe-bottom">
        <div className="flex items-center gap-2 bg-slate-900 rounded-3xl p-1 pl-4 border border-slate-800 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
