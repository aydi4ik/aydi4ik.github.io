
import { UserProfile, ChatSession, Message, AppState } from '../types';
import { CHAT_DURATION_MS } from '../constants';

// Simulated Real-time Messaging & Event system using BroadcastChannel
// This allows two browser tabs to talk to each other as different users.
const channel = new BroadcastChannel('vibe_network');

class VibeEngine {
  private state: AppState = {
    currentUser: null,
    activeChat: null,
    savedChats: [],
    queue: []
  };

  private listeners: (() => void)[] = [];

  constructor() {
    this.loadState();
    channel.onmessage = (event) => {
      this.handleRemoteEvent(event.data);
    };
  }

  private loadState() {
    const saved = localStorage.getItem('vibe_state');
    if (saved) {
      this.state = JSON.parse(saved);
    }
  }

  private saveState() {
    localStorage.setItem('vibe_state', JSON.stringify(this.state));
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  subscribe(l: () => void) {
    this.listeners.push(l);
    return () => { this.listeners = this.listeners.filter(i => i !== l); };
  }

  getState() {
    return this.state;
  }

  setUser(user: UserProfile) {
    this.state.currentUser = user;
    this.saveState();
  }

  private handleRemoteEvent(data: any) {
    const { type, payload } = data;
    const myId = this.state.currentUser?.id;

    switch (type) {
      case 'JOIN_QUEUE':
        if (!this.state.queue.includes(payload.userId)) {
          this.state.queue.push(payload.userId);
          this.checkMatches();
        }
        break;
      case 'LEAVE_QUEUE':
        this.state.queue = this.state.queue.filter(id => id !== payload.userId);
        break;
      case 'MATCH_FOUND':
        if (payload.user1Id === myId || payload.user2Id === myId) {
          this.state.activeChat = payload.chat;
          this.state.queue = this.state.queue.filter(id => id !== payload.user1Id && id !== payload.user2Id);
          if (this.state.currentUser) {
            this.state.currentUser.status = 'chatting';
            this.state.currentUser.matchCount++;
          }
          this.saveState();
        }
        break;
      case 'NEW_MESSAGE':
        if (this.state.activeChat?.id === payload.chatId) {
          this.state.activeChat.messages.push(payload.message);
          this.state.activeChat.lastMessageAt = payload.message.timestamp;
          this.saveState();
        }
        break;
      case 'CHAT_DECISION':
        if (this.state.activeChat?.id === payload.chatId) {
          this.state.activeChat.decisions[payload.userId] = payload.decision;
          this.checkFinalDecision();
          this.saveState();
        }
        break;
    }
  }

  joinQueue() {
    if (!this.state.currentUser) return;
    this.state.currentUser.status = 'searching';
    this.state.queue.push(this.state.currentUser.id);
    channel.postMessage({ type: 'JOIN_QUEUE', payload: { userId: this.state.currentUser.id } });
    this.saveState();
    this.checkMatches();
  }

  leaveQueue() {
    if (!this.state.currentUser) return;
    this.state.currentUser.status = 'idle';
    this.state.queue = this.state.queue.filter(id => id !== this.state.currentUser?.id);
    channel.postMessage({ type: 'LEAVE_QUEUE', payload: { userId: this.state.currentUser.id } });
    this.saveState();
  }

  sendMessage(text: string) {
    if (!this.state.activeChat || !this.state.currentUser) return;
    const msg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: this.state.currentUser.id,
      text,
      timestamp: Date.now()
    };
    this.state.activeChat.messages.push(msg);
    this.state.activeChat.lastMessageAt = msg.timestamp;
    channel.postMessage({ type: 'NEW_MESSAGE', payload: { chatId: this.state.activeChat.id, message: msg } });
    this.saveState();
  }

  submitDecision(decision: 'save' | 'pass') {
    if (!this.state.activeChat || !this.state.currentUser) return;
    this.state.activeChat.decisions[this.state.currentUser.id] = decision;
    channel.postMessage({ 
      type: 'CHAT_DECISION', 
      payload: { 
        chatId: this.state.activeChat.id, 
        userId: this.state.currentUser.id, 
        decision 
      } 
    });
    this.checkFinalDecision();
    this.saveState();
  }

  private checkMatches() {
    const myId = this.state.currentUser?.id;
    if (!myId || this.state.currentUser?.status !== 'searching') return;

    // In a real app, this logic happens on the server.
    // For MVP simulation, the first person who sees 2+ people in the queue creates the match.
    if (this.state.queue.length >= 2) {
      const others = this.state.queue.filter(id => id !== myId);
      if (others.length > 0) {
        const targetId = others[0];
        const chat: ChatSession = {
          id: `chat_${Date.now()}`,
          users: [myId, targetId],
          startedAt: Date.now(),
          expiresAt: Date.now() + CHAT_DURATION_MS,
          status: 'active',
          decisions: { [myId]: null, [targetId]: null },
          messages: [],
          lastMessageAt: Date.now()
        };
        
        channel.postMessage({ 
          type: 'MATCH_FOUND', 
          payload: { user1Id: myId, user2Id: targetId, chat } 
        });
        
        // Trigger for self too
        this.handleRemoteEvent({ 
          type: 'MATCH_FOUND', 
          payload: { user1Id: myId, user2Id: targetId, chat } 
        });
      }
    }
  }

  private checkFinalDecision() {
    if (!this.state.activeChat) return;
    const { decisions, users } = this.state.activeChat;
    const d1 = decisions[users[0]];
    const d2 = decisions[users[1]];

    if (d1 && d2) {
      if (d1 === 'save' && d2 === 'save') {
        this.state.activeChat.status = 'saved';
        this.state.savedChats.push({ ...this.state.activeChat });
        if (this.state.currentUser) this.state.currentUser.completedChats++;
      } else {
        this.state.activeChat.status = 'ended';
      }
      this.state.activeChat = null;
      if (this.state.currentUser) this.state.currentUser.status = 'idle';
    }
  }

  resetAll() {
    localStorage.removeItem('vibe_state');
    location.reload();
  }
}

export const engine = new VibeEngine();
