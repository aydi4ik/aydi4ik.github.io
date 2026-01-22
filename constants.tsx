
import React from 'react';
import { Badge } from './types';

export const BADGES: Record<string, Badge> = {
  'great_vibes': {
    id: 'great_vibes',
    name: 'Great Vibes',
    icon: '✨',
    description: 'Consistently receives mutual saves.'
  },
  'steady_talker': {
    id: 'steady_talker',
    name: 'Steady Talker',
    icon: '💬',
    description: 'Completes 5-minute chats regularly.'
  },
  'chill_energy': {
    id: 'chill_energy',
    name: 'Chill Energy',
    icon: '🍃',
    description: 'No reports and friendly engagement.'
  }
};

export const CHAT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
export const GHOST_TIMEOUT_MS = 60 * 1000; // 60 seconds
export const AUTO_END_TIMEOUT_MS = 90 * 1000; // 90 seconds
export const AD_COOLDOWN_MATCHES = 3;
