import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: any = null;
  private consumers = 0;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private typingUsersSubject = new BehaviorSubject<string[]>([]);
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  
  public messages$ = this.messagesSubject.asObservable();
  public typingUsers$ = this.typingUsersSubject.asObservable();
  public onlineUsers$ = this.onlineUsersSubject.asObservable();

  constructor(private ngZone: NgZone, private http: HttpClient) {}

  connect(): void {
    this.consumers++;
    console.log('WebSocket consumers count:', this.consumers);

    if (this.socket?.readyState === 1) return;
    
    this.socket = new SockJS(environment.wsUrl);
    
    this.socket.onopen = () => {
      console.log('SockJS connected');
      this.socket.send('CONNECT\naccept-version:1.2,1.1,1.0\nheart-beat:0,0\n\n\0');
      
      // Load message history
      this.loadMessageHistory();
    };
    
    this.socket.onmessage = (event: any) => {
      console.log('Raw message received:', event.data);
      
      if (event.data.startsWith('CONNECTED')) {
        console.log('STOMP connected');
        return;
      }
      
      if (event.data.startsWith('MESSAGE')) {
        const lines = event.data.split('\n');
        let destination = '';
        let bodyStart = -1;
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].startsWith('destination:')) {
            destination = lines[i].substring(12);
          }
          if (lines[i] === '') {
            bodyStart = i + 1;
            break;
          }
        }
        
        if (bodyStart >= 0 && lines[bodyStart]) {
          const body = lines[bodyStart].replace(/\0$/, '');
          console.log('Message - Destination:', destination, 'Body:', body);
          
          try {
            if (destination === '/topic/messages') {
              const receivedMessage: Message = JSON.parse(body);
              if (!receivedMessage.timestamp) {
                receivedMessage.timestamp = new Date();
              }
              
              this.ngZone.run(() => {
                const currentMessages = this.messagesSubject.value;
                this.messagesSubject.next([...currentMessages, receivedMessage]);
                console.log('✅ Message added to UI!');
              });
            }
            
            else if (destination === '/topic/online') {
              const onlineData = JSON.parse(body);
              this.ngZone.run(() => this.onlineUsersSubject.next(onlineData.users));
            }
            
            else if (destination === '/topic/typing') {
              const typingData = JSON.parse(body);
              this.ngZone.run(() => this.typingUsersSubject.next(typingData.users));
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        }
      }
    };
    
    this.socket.onerror = (error: any) => {
      console.error('WebSocket error:', error);
    };
    
    this.socket.onclose = () => {
      console.log('WebSocket closed');
    };
  }

  sendMessage(message: Message): void {
    console.log('sendMessage called with:', message);
    
    if (this.socket && this.socket.readyState === 1) {
      const stompMessage = `SEND\ndestination:/app/chat\n\n${JSON.stringify(message)}\0`;
      this.socket.send(stompMessage);
      console.log('Message sent via WebSocket');
    }
  }
  
  startTyping(username: string): void {
    if (this.socket && this.socket.readyState === 1) {
      const stompMessage = `SEND\ndestination:/app/typing/start\n\n${JSON.stringify({ username })}\0`;
      this.socket.send(stompMessage);
    }
  }
  
  stopTyping(username: string): void {
    if (this.socket && this.socket.readyState === 1) {
      const stompMessage = `SEND\ndestination:/app/typing/stop\n\n${JSON.stringify({ username })}\0`;
      this.socket.send(stompMessage);
    }
  }
  
  sendReaction(messageId: string, emoji: string, username: string): void {
    if (this.socket && this.socket.readyState === 1) {
      const stompMessage = `SEND\ndestination:/app/reaction\n\n${JSON.stringify({ messageId, emoji, username })}\0`;
      this.socket.send(stompMessage);
    }
  }

  disconnect(): void {
    if (this.consumers > 0) {
      this.consumers--;
    }
    console.log('WebSocket consumers count:', this.consumers);

    if (this.consumers === 0 && this.socket) {
      this.socket.close();
    }
  }

  setMessages(messages: Message[]): void {
    this.messagesSubject.next(messages);
  }
  
  setOnlineUsers(users: string[]): void {
    this.onlineUsersSubject.next(users);
  }
  
  private loadMessageHistory(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get<Message[]>(`${environment.apiUrl}/messages`, { headers }).subscribe({
      next: (messages) => {
        this.ngZone.run(() => {
          this.messagesSubject.next(messages);
          console.log('Message history loaded:', messages.length);
        });
      },
      error: (error) => {
        console.error('Failed to load message history:', error);
      }
    });
  }
}