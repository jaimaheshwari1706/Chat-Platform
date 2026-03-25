import { User } from './user.model';

export interface Conversation {
  id: string;
  participants: User[];
  createdAt: string;
  lastMessage?: string;
}
