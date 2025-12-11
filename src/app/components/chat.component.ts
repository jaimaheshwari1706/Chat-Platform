import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { WebSocketService } from '../services/websocket.service';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-screen bg-gray-100">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <h1 class="text-xl font-semibold text-gray-900">Chat Room</h1>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">Welcome, {{currentUser?.username}}</span>
          <button
            (click)="logout()"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4" #messagesContainer>
        <div
          *ngFor="let message of messages"
          class="flex"
          [ngClass]="{'justify-end': message.sender === currentUser?.username, 'justify-start': message.sender !== currentUser?.username}"
        >
          <div
            class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
            [ngClass]="{
              'bg-blue-500 text-white': message.sender === currentUser?.username,
              'bg-white text-gray-900 border': message.sender !== currentUser?.username
            }"
          >
            <div *ngIf="message.sender !== currentUser?.username" class="text-xs text-gray-500 mb-1">
              {{message.sender}}
            </div>
            <div>{{message.content}}</div>
            <div class="text-xs mt-1 opacity-75">
              {{formatTime(message.timestamp)}}
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="bg-white border-t border-gray-200 px-4 py-3">
        <form (ngSubmit)="sendMessage()" class="flex space-x-2">
          <input
            [(ngModel)]="newMessage"
            name="message"
            type="text"
            placeholder="Type your message..."
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            [disabled]="!newMessage.trim()"
            class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage = '';
  currentUser: any;

  constructor(
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private router: Router,
    private http: HttpClient
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Load recent messages
    this.http.get<Message[]>('http://localhost:8080/api/messages').subscribe({
      next: (messages) => {
        this.webSocketService.setMessages(messages.reverse());
      }
    });

    // Connect to WebSocket
    this.webSocketService.connect();
    
    // Subscribe to messages
    this.webSocketService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.currentUser) {
      const message: Message = {
        sender: this.currentUser.username,
        content: this.newMessage.trim()
      };
      
      this.webSocketService.sendMessage(message);
      this.newMessage = '';
    }
  }

  logout(): void {
    this.webSocketService.disconnect();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatTime(timestamp?: Date): string {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  }
}