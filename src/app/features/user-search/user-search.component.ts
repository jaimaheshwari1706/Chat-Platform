import { Component, signal, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models/user.model';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent],
  template: `
    <div class="bg-gray-900 rounded-2xl p-4 w-80 shadow-xl">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-white font-semibold">New conversation</h3>
        <button (click)="close.emit()" class="text-gray-400 hover:text-white">✕</button>
      </div>
      <input [(ngModel)]="query" (ngModelChange)="search($event)" placeholder="Search users…"
        class="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-3" />

      @if (loading()) {
        <p class="text-gray-500 text-sm text-center py-2">Searching…</p>
      }
      @for (user of results(); track user.id) {
        <button (click)="startConversation(user)"
          class="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800 transition text-left">
          <app-avatar [username]="user.username" [avatarUrl]="user.avatarUrl" size="sm" />
          <span class="text-white text-sm">{{ user.username }}</span>
        </button>
      }
    </div>
  `
})
export class UserSearchComponent {
  private api = inject(ApiService);

  close = output<void>();
  conversationStarted = output<string>();

  query = '';
  results = signal<User[]>([]);
  loading = signal(false);
  private debounce: ReturnType<typeof setTimeout> | null = null;

  search(q: string): void {
    if (this.debounce) clearTimeout(this.debounce);
    if (!q.trim()) { this.results.set([]); return; }
    this.debounce = setTimeout(async () => {
      this.loading.set(true);
      try {
        const users = await this.api.get<User[]>('/users/search', { q });
        this.results.set(users);
      } finally {
        this.loading.set(false);
      }
    }, 300);
  }

  async startConversation(user: User): Promise<void> {
    const res = await this.api.post<{ id: string }>('/conversations', { participantId: user.id });
    this.conversationStarted.emit(res.id);
    this.close.emit();
  }
}
