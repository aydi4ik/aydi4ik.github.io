
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { engine } from './services/vibeEngine';
import { AppState, UserProfile } from './types';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Matching from './screens/Matching';
import Chat from './screens/Chat';
import ChatsList from './screens/ChatsList';
import Reputation from './screens/Reputation';
import Settings from './screens/Settings';

// Navigation Icons (using standard SVGs for simplicity)
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ChatsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const ReputationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;

const Layout: React.FC<{ children: React.ReactNode; showNav: boolean }> = ({ children, showNav }) => {
  const location = useLocation();
  const activeClass = "text-indigo-400";
  const inactiveClass = "text-slate-500 hover:text-slate-300";

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-950 text-slate-50 overflow-hidden border-x border-slate-900 shadow-2xl">
      <main className="flex-1 overflow-y-auto relative p-4">
        {children}
      </main>
      {showNav && (
        <nav className="h-16 flex items-center justify-around bg-slate-900/80 backdrop-blur-md border-t border-slate-800 safe-bottom">
          <Link to="/" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/' ? activeClass : inactiveClass}`}>
            <HomeIcon />
            <span className="text-[10px] uppercase font-bold tracking-widest">Home</span>
          </Link>
          <Link to="/chats" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/chats' ? activeClass : inactiveClass}`}>
            <ChatsIcon />
            <span className="text-[10px] uppercase font-bold tracking-widest">Chats</span>
          </Link>
          <Link to="/reputation" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/reputation' ? activeClass : inactiveClass}`}>
            <ReputationIcon />
            <span className="text-[10px] uppercase font-bold tracking-widest">Rep</span>
          </Link>
          <Link to="/settings" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/settings' ? activeClass : inactiveClass}`}>
            <SettingsIcon />
            <span className="text-[10px] uppercase font-bold tracking-widest">More</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>(engine.getState());

  useEffect(() => {
    return engine.subscribe(() => setState({ ...engine.getState() }));
  }, []);

  const { currentUser, activeChat } = state;

  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={currentUser ? <Navigate to="/" /> : <Onboarding />} />
        <Route path="/" element={
          !currentUser ? <Navigate to="/onboarding" /> : (
            activeChat ? <Navigate to="/chat" /> : (
              currentUser.status === 'searching' ? <Navigate to="/matching" /> : (
                <Layout showNav><Home user={currentUser} /></Layout>
              )
            )
          )
        } />
        <Route path="/matching" element={
          !currentUser ? <Navigate to="/onboarding" /> : (
            currentUser.status !== 'searching' ? <Navigate to="/" /> : (
              <Layout showNav={false}><Matching /></Layout>
            )
          )
        } />
        <Route path="/chat" element={
          !currentUser || !activeChat ? <Navigate to="/" /> : (
            <Layout showNav={false}><Chat chat={activeChat} user={currentUser} /></Layout>
          )
        } />
        <Route path="/chats" element={
          !currentUser ? <Navigate to="/onboarding" /> : (
            <Layout showNav><ChatsList user={currentUser} savedChats={state.savedChats} /></Layout>
          )
        } />
        <Route path="/reputation" element={
          !currentUser ? <Navigate to="/onboarding" /> : (
            <Layout showNav><Reputation user={currentUser} /></Layout>
          )
        } />
        <Route path="/settings" element={
          !currentUser ? <Navigate to="/onboarding" /> : (
            <Layout showNav><Settings user={currentUser} /></Layout>
          )
        } />
      </Routes>
    </Router>
  );
}
