import { apiClient } from './apiClient';
import { CONVERSATIONS_DOCTOR } from '../../data/conversationsDoctor';
import { MESSAGES } from '../../data/messages';
import { MESSAGES_DOCTOR } from '../../data/messagesDoctor';

const ALL_CONVS = CONVERSATIONS_DOCTOR as unknown as any[];
const STORAGE_KEY = 'mediconnect_shared_messages_v1';

const getMsgStore = (): any[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  
  const combined = [...(MESSAGES as unknown as any[]), ...(MESSAGES_DOCTOR as unknown as any[])];
  const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
  return unique;
};

const saveMsgStore = (store: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {}
};

export const messagesServiceDoctor = {
  async getConversations(doctorId: string) {
    return (await apiClient(() => {
      const store = getMsgStore();
      return ALL_CONVS.map(conv => {
        const msgs = store.filter(m => m.conversationId === conv.id)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const unread = msgs.filter(m => m.role === 'user' && !m.read).length;
        return { ...conv, lastMessage: msgs[0]?.text ?? '', lastTimestamp: msgs[0]?.timestamp ?? '', unreadCount: unread };
      });
    }, { delay: 500, errorProbability: 0 })).data;
  },

  async getMessages(conversationId: string) {
    return (await apiClient(() => {
      const store = getMsgStore();
      return store.filter(m => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, { delay: 400 })).data;
  },

  async send(conversationId: string, text: string) {
    return (await apiClient(() => {
      const store = getMsgStore();
      const msg = {
        id: `dmsg-${Date.now()}`,
        conversationId, senderId: 'u-doctor-1',
        senderName: 'Dr. Carlos Mendoza',
        senderAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza',
        role: 'doctor', text,
        timestamp: new Date().toISOString(), read: true,
      };
      store.push(msg);
      saveMsgStore(store);
      return msg;
    }, { delay: 300, errorProbability: 0.01 })).data;
  },
};
