export interface Message {
  id?: string;
  sender: string;
  content: string;
  timestamp?: Date;
  type?: 'text' | 'file' | 'image';
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface User {
  username: string;
  token: string;
}