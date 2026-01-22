
import React from 'react';
import { ChatSession, UserProfile } from '../types';

interface ChatsListProps {
  user: UserProfile;
  savedChats: ChatSession[];
}

const ChatsList: React.FC<ChatsListProps> = ({ user, savedChats }) => {
  return (
    <div className="h-full py-4">
      <h2 className="text-3xl font-bold mb-6">Connections</h2>
      
      {savedChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-2/3 text-center px-8 opacity-50">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <p className="text-slate-400">No saved connections yet.<br/>Start a vibe to find one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedChats.map((chat) => (
             <div key={chat.id} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:bg-slate-900 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl">
                  ✨
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold truncate">Vibe Connection</h3>
                    <span className="text-[10px] text-slate-500">
                      {new Date(chat.startedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'Start chatting...'}
                  </p>
                </div>
             </div>
          ))}
        </div>
      )}

      {savedChats.length > 0 && (
         <div className="mt-12 text-center text-xs text-slate-500">
            Connections here are permanent.<br/>You can now exchange contact info if you both agree.
         </div>
      )}
    </div>
  );
};

export default ChatsList;
