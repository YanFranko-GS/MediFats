import { apiClient } from './apiClient';
import { CONVERSATIONS } from '../../data/conversations';
import { MESSAGES } from '../../data/messages';
import { MESSAGES_DOCTOR } from '../../data/messagesDoctor';

const ALL_CONVS = CONVERSATIONS as unknown as any[];
const STORAGE_KEY = 'mediconnect_shared_messages_v1';

const getMsgStore = (): any[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  
  // Combine both message sources on first load to get the full history
  const combined = [...(MESSAGES as unknown as any[]), ...(MESSAGES_DOCTOR as unknown as any[])];
  // Deduplicate by ID just in case
  const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
  return unique;
};

const saveMsgStore = (store: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {}
};

export const messagesService = {
  async getConversations(patientId: string) {
    return (await apiClient(() => {
      const store = getMsgStore();
      return ALL_CONVS.map(conv => {
        const convMsgs = store.filter(m => m.conversationId === conv.id)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const last = convMsgs[0];
        const unread = convMsgs.filter(m => m.role !== 'user' && !m.read).length;
        return { ...conv, lastMessage: last?.text ?? '', lastTimestamp: last?.timestamp ?? '', unreadCount: unread };
      });
    }, { delay: 600, errorProbability: 0 })).data;
  },

  async getMessages(conversationId: string) {
    return (await apiClient(() => {
      const store = getMsgStore();
      return store.filter(m => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, { delay: 500 })).data;
  },

  async sendMessage(conversationId: string, text: string, senderId: string, senderName: string, senderAvatar: string) {
    return (await apiClient(() => {
      const store = getMsgStore();
      const newMsg = {
        id: `msg-${Date.now()}`,
        conversationId, senderId, senderName, senderAvatar,
        role: 'user', text,
        timestamp: new Date().toISOString(),
        read: true,
      };
      store.push(newMsg);
      saveMsgStore(store);
      return newMsg;
    }, { delay: 300, errorProbability: 0.01 })).data;
  },

  async markConversationRead(conversationId: string) {
    return (await apiClient(() => {
      const store = getMsgStore();
      store.filter(m => m.conversationId === conversationId).forEach(m => { m.read = true; });
      saveMsgStore(store);
      return { success: true };
    }, { delay: 200, errorProbability: 0 })).data;
  },
};
