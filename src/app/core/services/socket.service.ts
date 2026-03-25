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
  private socket!: Socket;

  readonly connected = signal(false);

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(environment.wsUrl, {
      auth: { token: this.auth.accessToken() },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity,
    });

    this.socket.on('connect', () => this.connected.set(true));
    this.socket.on('disconnect', () => this.connected.set(false));

    // Re-authenticate with fresh token on reconnect
    this.socket.io.on('reconnect', () => {
      this.socket.auth = { token: this.auth.accessToken() };
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
  }

  joinConversation(conversationId: string): void {
    this.socket.emit('join_conversation', conversationId);
  }

  sendMessage(conversationId: string, content: string): Promise<{ status: string; message: Message }> {
    return new Promise((resolve, reject) => {
      this.socket.emit('send_message', { conversationId, content }, (ack: { status: string; message: Message }) => {
        ack.status === 'ok' ? resolve(ack) : reject(new Error('Send failed'));
      });
    });
  }

  markDelivered(messageId: string): void {
    this.socket.emit('message_delivered', { messageId });
  }

  markRead(messageId: string): void {
    this.socket.emit('message_read', { messageId });
  }

  typingStart(conversationId: string): void {
    this.socket.emit('typing_start', { conversationId });
  }

  typingStop(conversationId: string): void {
    this.socket.emit('typing_stop', { conversationId });
  }

  onMessage(handler: (msg: Message) => void): () => void {
    this.socket.on('new_message', handler);
    return () => this.socket.off('new_message', handler);
  }

  onTyping(handler: (e: TypingEvent) => void): () => void {
    this.socket.on('typing', handler);
    return () => this.socket.off('typing', handler);
  }

  onStatusUpdate(handler: (e: StatusEvent) => void): () => void {
    this.socket.on('message_status', handler);
    return () => this.socket.off('message_status', handler);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
