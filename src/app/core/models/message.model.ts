export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  status: MessageStatus;
  createdAt: string;
  sender: { id: string; username: string };
}

export interface MessagesPage {
  messages: Message[];
  nextCursor: string | null;
}
