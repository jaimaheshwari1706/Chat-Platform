import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Message, MessageStatus } from '../models/message.model';

export interface TypingEvent { userId: string; conversationId: string; typing: boolean; }
export interface StatusEvent { messageId: string; status: MessageStatus; }

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private auth = inject(AuthService);
  private socket: Socket | null = null;
  private currentConversationId: string | null = null;

  readonly connected = signal(false);
  readonly reconnecting = signal(false);

  private attempt = 0;
  private maxDelay = 30_000;

  connect(): void {
    if (this.socket?.connected) return;
    this.attempt = 0;
    this.doConnect();
  }

  private doConnect(){
    this.reconnecting.set(this.attempt > 0);
    const token = localStorage.getItem('token') ?? localStorage.getItem('accessToken');
    const socket = io(environment.wsUrl, {
      auth: {
        token: localStorage.getItem('token') ?? localStorage.getItem('accessToken')
      },
      reconnection: false
    });
    this.socket = socket;

    socket.on('connect', () => {
      socket.emit('authenticate', { token });
      this.connected.set(true);
      this.attempt = 0;
      this.reconnecting.set(false);
    });

    socket.on('disconnect', () => {
      this.connected.set(false);
      this.scheduleReconnect();
    });
  }

  private scheduleReconnect(){
    this.attempt++;
    const delay = Math.min(1000 * Math.pow(2, this.attempt - 1), this.maxDelay);
    this.reconnecting.set(true);
    setTimeout(() => this.doConnect(), delay);
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.connected.set(false);
    this.reconnecting.set(false);
  }

  joinConversation(conversationId: string): void {
    this.currentConversationId = conversationId;
    this.socket?.emit('join_conversation', conversationId);
  }

  sendMessage(conversationId: string, content: string): Promise<{ status: string; messageId: string }> {
    return new Promise((resolve, reject) => {
      const payload = { conversationId, content };
      this.socket?.emit('send_message', payload, (ack: { status: string; messageId: string }) => {
        if (ack.status === 'sent') {
          console.log('Message sent, id:', ack.messageId);
          resolve(ack);
          return;
        }
        reject(new Error('Send failed'));
      });
      if(!this.socket) reject(new Error('Socket not connected'));
    });
  }

  markDelivered(messageId: string): void {
    this.socket?.emit('message_delivered', { messageId });
  }

  markRead(messageId: string): void {
    if (!this.currentConversationId) return;
    this.socket?.emit('messages_read', {
      conversationId: this.currentConversationId,
      upToMessageId: messageId
    });
  }

  typingStart(conversationId: string): void {
    this.socket?.emit('typing_start', { conversationId });
  }

  typingStop(conversationId: string): void {
    this.socket?.emit('typing_stop', { conversationId });
  }

  onMessage(handler: (msg: Message) => void): () => void {
    this.socket?.on('new_message', handler);
    return () => this.socket?.off('new_message', handler) || (()=>{});
  }

  onTyping(handler: (e: TypingEvent) => void): () => void {
    this.socket?.on('typing', handler);
    return () => this.socket?.off('typing', handler) || (()=>{});
  }

  onStatusUpdate(handler: (e: StatusEvent) => void): () => void {
    this.socket?.on('status_update', handler);
    return () => this.socket?.off('status_update', handler) || (()=>{});
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
