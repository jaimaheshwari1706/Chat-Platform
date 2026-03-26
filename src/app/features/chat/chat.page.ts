import { Component, signal, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SocketService } from '../../core/services/socket.service';
import { ConversationService } from '../../core/services/conversation.service';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { UserSearchComponent } from '../user-search/user-search.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ConversationListComponent, ChatWindowComponent, UserSearchComponent],
  template: `
    <div class="flex h-screen bg-gray-950 relative">
      <div class="w-72 shrink-0">
        <app-conversation-list #convList (select)="openConversation($any($event))" (newChat)="showSearch.set(true)"></app-conversation-list>
      </div>

      <div class="flex-1">
        <app-chat-window *ngIf="activeConversationId()" [conversationId]="activeConversationId()!"></app-chat-window>
        <div *ngIf="!activeConversationId()" class="flex items-center justify-center h-full text-gray-500">Select a conversation to start chatting</div>
      </div>

      <div *ngIf="showSearch()" class="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
        <app-user-search (close)="showSearch.set(false)" (userSelected)="createConversation($event)"></app-user-search>
      </div>

      <button (click)="auth.logout()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-xs">Sign out</button>
    </div>
  `
})
export class ChatPageComponent implements OnInit {
  auth = inject(AuthService);
  private socket = inject(SocketService);
  private conversationService = inject(ConversationService);

  @ViewChild(ConversationListComponent) convList?: ConversationListComponent;
  activeConversationId = signal<string | null>(null);
  showSearch = signal(false);

  ngOnInit(): void {
    this.socket.connect();
  }

  openConversation(id: string | { id: string }): void {
    const conversationId = typeof id === 'string' ? id : id.id;
    this.activeConversationId.set(conversationId);
  }

  createConversation(participantId: string): void {
    this.conversationService.create({ participantId }).subscribe({
      next: (conversation) => {
        this.showSearch.set(false);
        this.openConversation(conversation.id);
      },
      error: (err) => console.error('Failed to create conversation', err)
    });
  }
}
