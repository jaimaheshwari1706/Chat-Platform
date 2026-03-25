import { Component, input, signal, computed, inject, effect, ElementRef, viewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { SocketService, TypingEvent } from '../../../core/services/socket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Message, MessagesPage } from '../../../core/models/message.model';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { MessageInputComponent } from '../message-input/message-input.component';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, MessageBubbleComponent, MessageInputComponent],
  template: `
    <div class="flex flex-col h-full">
      <div #scrollContainer class="flex-1 overflow-y-auto p-4 space-y-1">
        @if (loading()) {
          <p class="text-center text-gray-500 text-sm py-4">Loading messages…</p>
        }
        @for (msg of messages(); track msg.id) {
          <app-message-bubble [message]="msg" />
        }
        @if (typingLabel()) {
          <p class="text-xs text-gray-400 italic px-2">{{ typingLabel() }}</p>
        }
      </div>
      <app-message-input [conversationId]="conversationId()" (sent)="onSend($event)" />
    </div>
  `
})
export class ChatWindowComponent implements OnDestroy {
  private api = inject(ApiService);
  private socket = inject(SocketService);
  private auth = inject(AuthService);

  conversationId = input.required<string>();

  messages = signal<Message[]>([]);
  loading = signal(false);
  private typingUsers = signal<Map<string, boolean>>(new Map());
  private offMessage!: () => void;
  private offTyping!: () => void;
  private offStatus!: () => void;

  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  typingLabel = computed(() => {
    const others = [...this.typingUsers().entries()]
      .filter(([id, typing]) => typing && id !== this.auth.user()?.id)
      .map(([id]) => id);
    return others.length ? `${others.join(', ')} ${others.length === 1 ? 'is' : 'are'} typing…` : '';
  });

  constructor() {
    effect(() => {
      const id = this.conversationId();
      if (id) this.init(id);
    });
  }

  private async init(conversationId: string): Promise<void> {
    this.messages.set([]);
    this.loading.set(true);
    this.offMessage?.();
    this.offTyping?.();
    this.offStatus?.();

    this.socket.joinConversation(conversationId);

    this.offMessage = this.socket.onMessage((msg) => {
      if (msg.conversationId !== conversationId) return;
      this.messages.update((prev) => [...prev, msg]);
      this.socket.markDelivered(msg.id);
      this.scrollToBottom();
    });

    this.offTyping = this.socket.onTyping((e: TypingEvent) => {
      if (e.conversationId !== conversationId) return;
      this.typingUsers.update((m) => { const n = new Map(m); n.set(e.userId, e.typing); return n; });
    });

    this.offStatus = this.socket.onStatusUpdate((e) => {
      this.messages.update((prev) =>
        prev.map((m) => m.id === e.messageId ? { ...m, status: e.status } : m)
      );
    });

    try {
      const page = await this.api.get<MessagesPage>(`/conversations/${conversationId}/messages`);
      this.messages.set(page.messages);
      page.messages
        .filter((m) => m.sender.id !== this.auth.user()?.id && m.status === 'delivered')
        .forEach((m) => this.socket.markRead(m.id));
    } finally {
      this.loading.set(false);
      this.scrollToBottom();
    }
  }

  async onSend(content: string): Promise<void> {
    const ack = await this.socket.sendMessage(this.conversationId(), content);
    this.messages.update((prev) => [...prev, ack.message]);
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.scrollContainer()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }

  ngOnDestroy(): void {
    this.offMessage?.();
    this.offTyping?.();
    this.offStatus?.();
  }
}
