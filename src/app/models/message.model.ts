export interface Message {
  id?: string;
  sender: string;
  content: string;
  timestamp?: Date;
}

export interface User {
  username: string;
  token: string;
}