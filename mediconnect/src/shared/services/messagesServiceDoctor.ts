import { apiClient } from './apiClient';
import { CONVERSATIONS_DOCTOR } from '../../data/conversationsDoctor';
import { MESSAGES_DOCTOR } from '../../data/messagesDoctor';

const ALL_CONVS = CONVERSATIONS_DOCTOR as unknown as unknown as any[];
const msgStore: any[] = [...(MESSAGES_DOCTOR as unknown as unknown as any[])];

export const messagesServiceDoctor = {
  async getConversations(doctorId: string) {
    return (await apiClient(() =>
      ALL_CONVS.map(conv => {
        const msgs = msgStore.filter(m => m.conversationId === conv.id)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const unread = msgs.filter(m => m.role === 'user' && !m.read).length;
        return { ...conv, lastMessage: msgs[0]?.text ?? '', lastTimestamp: msgs[0]?.timestamp ?? '', unreadCount: unread };
      }),
      { delay: 500, errorProbability: 0 }
    )).data;
  },

  async getMessages(conversationId: string) {
    return (await apiClient(() =>
      msgStore.filter(m => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      { delay: 400 }
    )).data;
  },

  async send(conversationId: string, text: string) {
    return (await apiClient(() => {
      const msg = {
        id: `dmsg-${Date.now()}`,
        conversationId, senderId: 'u-doctor-1',
        senderName: 'Dr. Carlos Mendoza',
        senderAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza',
        role: 'doctor', text,
        timestamp: new Date().toISOString(), read: true,
      };
      msgStore.push(msg);
      return msg;
    }, { delay: 300, errorProbability: 0.01 })).data;
  },
};
