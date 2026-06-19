import { apiClient } from './apiClient';
import { CONVERSATIONS } from '../../data/conversations';
import { MESSAGES } from '../../data/messages';

const ALL_CONVS = CONVERSATIONS as unknown as unknown as any[];
// Mutable in-session store
const msgStore: any[] = [...(MESSAGES as unknown as unknown as any[])];

export const messagesService = {
  async getConversations(patientId: string) {
    return (await apiClient(() => {
      return ALL_CONVS.map(conv => {
        const convMsgs = msgStore.filter(m => m.conversationId === conv.id)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const last = convMsgs[0];
        const unread = convMsgs.filter(m => m.role === 'assistant' && !m.read).length;
        return { ...conv, lastMessage: last?.text ?? '', lastTimestamp: last?.timestamp ?? '', unreadCount: unread };
      });
    }, { delay: 600, errorProbability: 0 })).data;
  },

  async getMessages(conversationId: string) {
    return (await apiClient(() =>
      msgStore.filter(m => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      { delay: 500 }
    )).data;
  },

  async sendMessage(conversationId: string, text: string, senderId: string, senderName: string, senderAvatar: string) {
    return (await apiClient(() => {
      const newMsg = {
        id: `msg-${Date.now()}`,
        conversationId, senderId, senderName, senderAvatar,
        role: 'user', text,
        timestamp: new Date().toISOString(),
        read: true,
      };
      msgStore.push(newMsg);
      return newMsg;
    }, { delay: 300, errorProbability: 0.01 })).data;
  },

  async markConversationRead(conversationId: string) {
    return (await apiClient(() => {
      msgStore.filter(m => m.conversationId === conversationId).forEach(m => { m.read = true; });
      return { success: true };
    }, { delay: 200, errorProbability: 0 })).data;
  },
};
