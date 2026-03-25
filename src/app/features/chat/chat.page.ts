import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SocketService } from '../../core/services/socket.service';
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
        <app-conversation-list #convList
          (select)="openConversation($event)"
          (newChat)="showSearch.set(true)" />
      </div>

      <div class="flex-1">
        @if (activeConversationId()) {
          <app-chat-window [conversationId]="activeConversationId()!" />
        } @else {
          <div class="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        }
      </div>

      @if (showSearch()) {
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <app-user-search
            (close)="showSearch.set(false)"
            (conversationStarted)="onNewConversation($event)" />
        </div>
      }

      <button (click)="auth.logout()"
        class="absolute top-4 right-4 text-gray-400 hover:text-white text-xs">
        Sign out
      </button>
    </div>
  `
})
export class ChatPageComponent implements OnInit {
  auth = inject(AuthService);
  private socket = inject(SocketService);

  convList = viewChild(ConversationListComponent);
  activeConversationId = signal<string | null>(null);
  showSearch = signal(false);

  ngOnInit(): void {
    this.socket.connect();
  }

  openConversation(id: string): void {
    this.activeConversationId.set(id);
    this.convList()?.setActive(id);
  }

  async onNewConversation(id: string): Promise<void> {
    await this.convList()?.ngOnInit();
    this.openConversation(id);
  }
}
