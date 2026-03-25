import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../core/models/message.model';
import { AuthService } from '../../../core/services/auth.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  template: `
    <div class="flex mb-2" [class.justify-end]="isMine()">
      <div class="max-w-xs lg:max-w-md">
        @if (!isMine()) {
          <p class="text-xs text-gray-400 mb-1 ml-1">{{ message().sender.username }}</p>
        }
        <div class="px-4 py-2 rounded-2xl text-sm"
          [class]="isMine() ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-800 text-gray-100 rounded-bl-sm'">
          {{ message().content }}
        </div>
        <div class="flex items-center gap-1 mt-0.5" [class.justify-end]="isMine()">
          <span class="text-xs text-gray-500">{{ message().createdAt | timeAgo }}</span>
          @if (isMine()) {
            <span [innerHTML]="statusIcon()" class="text-xs leading-none"></span>
          }
        </div>
      </div>
    </div>
  `
})
export class MessageBubbleComponent {
  private auth = inject(AuthService);
  message = input.required<Message>();

  isMine = computed(() => this.message().sender.id === this.auth.user()?.id);

  statusIcon = computed(() => {
    switch (this.message().status) {
      case 'sent':      return '<span class="text-gray-400">✓</span>';
      case 'delivered': return '<span class="text-gray-400">✓✓</span>';
      case 'read':      return '<span class="text-blue-400">✓✓</span>';
    }
  });
}
