import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { WebSocketService } from '../services/websocket.service';
import { Message } from '../models/message.model';
import { Subject, debounceTime } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-4 py-3 shadow-lg">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-white">Connectly</h1>
              <p class="text-xs text-gray-400">{{onlineUsers.length}} online</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <div class="flex items-center space-x-2 bg-gray-700/50 rounded-full px-3 py-1">
              <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold text-xs">{{currentUser?.username?.charAt(0)?.toUpperCase()}}</span>
              </div>
              <span class="text-sm text-gray-200">{{currentUser?.username}}</span>
            </div>
            
            <button
              (click)="logout()"
              class="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div 
        class="flex-1 overflow-y-auto px-4 py-2" 
        #messagesContainer
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        [ngClass]="{'border-4 border-dashed border-purple-500 bg-purple-900/20': isDragOver}"
      >
        <div class="space-y-3">
          <div
            *ngFor="let message of messages; let i = index"
            class="flex"
            [ngClass]="{
              'justify-end': message.sender === currentUser?.username,
              'justify-start': message.sender !== currentUser?.username
            }"
          >
            <div class="max-w-xs lg:max-w-md">
              <!-- Sender name (only for received messages) -->
              <div *ngIf="message.sender !== currentUser?.username" class="text-xs text-gray-400 mb-1 px-3">
                {{message.sender}}
              </div>
              
              <div 
                class="px-4 py-3 rounded-2xl shadow-lg relative backdrop-blur-sm"
                [ngClass]="{
                  'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md': message.sender === currentUser?.username,
                  'bg-gray-800/80 text-gray-100 border border-gray-700/50 rounded-bl-md': message.sender !== currentUser?.username
                }"
              >
                <!-- Text Message -->
                <p *ngIf="message.type !== 'file'" class="text-sm leading-relaxed">{{message.content}}</p>
                
                <!-- File Message -->
                <div *ngIf="message.type === 'file'" class="space-y-2">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">{{message.fileName}}</span>
                  </div>
                  <p class="text-xs opacity-75">{{formatFileSize(message.fileSize)}}</p>
                  <p *ngIf="message.content" class="text-sm">{{message.content}}</p>
                </div>
                
                <!-- Time -->
                <div class="text-xs mt-2 opacity-70">
                  {{formatTime(message.timestamp)}}
                </div>
                
                <!-- Reactions -->
                <div *ngIf="message.reactions && message.reactions.length > 0" class="flex flex-wrap gap-1 mt-2">
                  <span 
                    *ngFor="let reaction of message.reactions" 
                    class="bg-gray-700/50 px-2 py-1 rounded-full text-xs flex items-center space-x-1"
                  >
                    <span>{{reaction.emoji}}</span>
                    <span>{{reaction.count}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div *ngIf="typingUsers.length > 0" class="flex justify-start">
            <div class="bg-gray-800/80 rounded-2xl px-4 py-3 shadow-lg border border-gray-700/50">
              <div class="flex items-center space-x-2">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-sm text-gray-300">{{typingUsers.join(', ')}} typing...</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Drag & Drop Overlay -->
        <div *ngIf="isDragOver" class="absolute inset-0 bg-purple-900/50 flex items-center justify-center z-10">
          <div class="text-center text-white">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="text-xl font-semibold">Drop files here</p>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 px-4 py-3">
        <!-- File Preview -->
        <div *ngIf="selectedFile" class="mb-3 p-3 bg-gray-700/50 rounded-lg flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <p class="text-white font-medium text-sm">{{selectedFile.name}}</p>
              <p class="text-gray-400 text-xs">{{formatFileSize(selectedFile.size)}}</p>
            </div>
          </div>
          <button (click)="removeSelectedFile()" class="text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form (ngSubmit)="sendMessage()" class="flex items-center space-x-3">
          <!-- Attachment Button -->
          <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" />
          <button 
            type="button" 
            (click)="fileInput.click()"
            class="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
          </button>
          
          <!-- Message Input -->
          <div class="flex-1 relative">
            <input
              [(ngModel)]="newMessage"
              (input)="onTyping()"
              (keydown.enter)="sendMessage()"
              name="message"
              type="text"
              placeholder="Type a message..."
              class="w-full bg-gray-700/50 border border-gray-600 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            
            <!-- Emoji Button -->
            <button 
              type="button" 
              (click)="showEmojiPicker = !showEmojiPicker"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
            
            <!-- Emoji Picker -->
            <div *ngIf="showEmojiPicker" class="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-3 shadow-xl border border-gray-700">
              <div class="grid grid-cols-6 gap-2">
                <button 
                  *ngFor="let emoji of emojis" 
                  type="button"
                  (click)="addEmoji(emoji)"
                  class="text-xl hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  {{emoji}}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Send Button -->
          <button
            type="submit"
            [disabled]="!newMessage.trim() && !selectedFile"
            class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  messages: Message[] = [];
  newMessage = '';
  currentUser: any;
  isTyping = false;
  typingUsers: string[] = [];
  onlineUsers: string[] = [];
  private typingSubject = new Subject<void>();
  showEmojiPicker = false;
  selectedFile: File | null = null;
  isDragOver = false;
  
  emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉'];

  constructor(
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private router: Router,
    private http: HttpClient
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    console.log('Chat component initialized for user:', this.currentUser);
    
    // Connect to WebSocket first
    this.webSocketService.connect();
    
    // Subscribe to messages
    this.webSocketService.messages$.subscribe(messages => {
      console.log('Received messages:', messages);
      this.messages = messages;
    });
    
    // Subscribe to typing indicators
    this.webSocketService.typingUsers$.subscribe(users => {
      this.typingUsers = users.filter(user => user !== this.currentUser?.username);
    });
    
    // Subscribe to online users
    this.webSocketService.onlineUsers$.subscribe(users => {
      this.onlineUsers = users;
      console.log('Online users:', users);
    });
    
    // Setup typing debounce
    this.typingSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.webSocketService.stopTyping(this.currentUser?.username);
      this.isTyping = false;
    });
  }
  
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  sendMessage(): void {
    if ((this.newMessage.trim() || this.selectedFile) && this.currentUser) {
      const message: Message = {
        sender: this.currentUser.username,
        content: this.newMessage.trim(),
        type: this.selectedFile ? 'file' : 'text',
        fileName: this.selectedFile?.name,
        fileSize: this.selectedFile?.size
      };
      
      console.log('Sending message:', message);
      
      if (this.selectedFile) {
        this.uploadFile(this.selectedFile, message);
      } else {
        this.webSocketService.sendMessage(message);
      }
      
      this.newMessage = '';
      this.selectedFile = null;
      this.showEmojiPicker = false;
      this.webSocketService.stopTyping(this.currentUser?.username);
      this.isTyping = false;
    }
  }
  
  onTyping(): void {
    if (!this.isTyping) {
      this.webSocketService.startTyping(this.currentUser?.username);
      this.isTyping = true;
    }
    this.typingSubject.next();
  }
  
  addEmoji(emoji: string): void {
    this.newMessage += emoji;
    this.showEmojiPicker = false;
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      this.selectedFile = file;
    }
  }
  
  removeSelectedFile(): void {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size <= 10 * 1024 * 1024) {
        this.selectedFile = file;
      }
    }
  }
  
  uploadFile(file: File, message: Message): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sender', message.sender);
    
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    this.http.post(`${environment.apiUrl}/upload`, formData, { headers }).subscribe({
      next: (response: any) => {
        message.fileUrl = response.fileUrl;
        this.webSocketService.sendMessage(message);
      },
      error: (error) => {
        console.error('File upload failed:', error);
      }
    });
  }
  
  reactToMessage(messageId: string, emoji: string): void {
    this.webSocketService.sendReaction(messageId, emoji, this.currentUser?.username);
  }
  
  formatFileSize(bytes?: number): string {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
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