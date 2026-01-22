
export type Gender = 'Man' | 'Woman' | 'Non-binary' | 'Everyone';

export interface UserPreferences {
  gender: Gender;
  interestedIn: Gender;
  radius: number; // in miles
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  preferences: UserPreferences;
  reputation: number; // 0-100
  badges: string[]; // Badge IDs
  status: 'idle' | 'searching' | 'chatting';
  currentChatId?: string;
  lastAdSeenAt?: number;
  matchCount: number;
  completedChats: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export type ChatStatus = 'active' | 'decision' | 'saved' | 'ended';

export interface ChatSession {
  id: string;
  users: [string, string]; // user IDs
  startedAt: number;
  expiresAt: number;
  status: ChatStatus;
  decisions: Record<string, 'save' | 'pass' | null>;
  messages: Message[];
  lastMessageAt: number;
}

export interface AppState {
  currentUser: UserProfile | null;
  activeChat: ChatSession | null;
  savedChats: ChatSession[];
  queue: string[]; // user IDs
}
