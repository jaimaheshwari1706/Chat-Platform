import { Component, input, output, signal, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="send()" class="flex items-center gap-3 p-4 bg-gray-900 border-t border-gray-800">
      <input
        [(ngModel)]="text"
        name="message"
        (input)="onInput()"
        (keydown.enter)="$event.preventDefault(); send()"
        placeholder="Type a message…"
        autocomplete="off"
        class="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
      <button type="submit" [disabled]="!text.trim()"
        class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition">
        Send
      </button>
    </form>
  `
})
export class MessageInputComponent implements OnDestroy {
  private socket = inject(SocketService);

  conversationId = input.required<string>();
  sent = output<string>();

  text = '';
  private isTyping = signal(false);
  private typingTimer: ReturnType<typeof setTimeout> | null = null;

  onInput(): void {
    if (!this.isTyping()) {
      this.isTyping.set(true);
      this.socket.typingStart(this.conversationId());
    }
    if (this.typingTimer) clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.isTyping.set(false);
      this.socket.typingStop(this.conversationId());
    }, 1000);
  }

  send(): void {
    const content = this.text.trim();
    if (!content) return;
    this.text = '';
    if (this.typingTimer) clearTimeout(this.typingTimer);
    if (this.isTyping()) {
      this.isTyping.set(false);
      this.socket.typingStop(this.conversationId());
    }
    this.sent.emit(content);
  }

  ngOnDestroy(): void {
    if (this.typingTimer) clearTimeout(this.typingTimer);
  }
}
