import { Component, signal, computed, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { IconButtonComponent } from '../../../shared/components/icon-button/icon-button.component';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Conversation } from '../../../core/models/conversation.model';

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return days[d.getDay()];
}

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent, IconButtonComponent, ThemeToggleComponent, SkeletonComponent],
  template: `
    <div class="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">

      <!-- Header -->
      <div class="flex items-center gap-3 px-4 pt-4 pb-3 safe-top shrink-0">
        <!-- Logo -->
        <div class="flex items-center gap-2 flex-1">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="6" width="20" height="14" rx="4" fill="#6C63FF" opacity="0.85"/>
            <rect x="10" y="12" width="20" height="14" rx="4" fill="#6C63FF"/>
          </svg>
          <span class="font-bold text-lg text-zinc-900 dark:text-white tracking-tight">Connectly</span>
        </div>
        <app-theme-toggle />
        <app-icon-button ariaLabel="New conversation" (clicked)="newChat.emit()">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </app-icon-button>
      </div>

      <!-- Search -->
      <div class="px-4 pb-3 shrink-0">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
          </svg>
          <input [(ngModel)]="query" type="text" placeholder="Search conversations…"
            class="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 border-0
                   text-zinc-900 dark:text-zinc-100 placeholder-zinc-400
                   focus:ring-2 focus:ring-accent focus:outline-none transition-all duration-200" />
        </div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto">
        @if (loading()) {
          @for (i of [1,2,3,4]; track i) {
            <div class="flex items-center gap-3 px-4 py-3">
              <app-skeleton width="40px" height="40px" [rounded]="true" />
              <div class="flex-1 space-y-2">
                <app-skeleton width="60%" height="14px" />
                <app-skeleton width="80%" height="12px" />
              </div>
            </div>
          }
        } @else {
          @for (conv of filtered(); track conv.id) {
            <button (click)="select(conv)"
              class="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ease-in-out
                     hover:bg-zinc-100 dark:hover:bg-zinc-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent
                     relative border-l-[3px]"
              [class]="activeId() === conv.id
                ? 'bg-violet-50 dark:bg-zinc-800 border-accent'
                : 'border-transparent'">
              <app-avatar [name]="otherName(conv)" size="md" [showOnline]="false" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{{ otherName(conv) }}</span>
                  <span class="text-xs text-zinc-400 shrink-0">{{ formatTime(conv.createdAt) }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 mt-0.5">
                  <span class="text-xs text-zinc-400 truncate">{{ conv.lastMessage ?? 'Start a conversation' }}</span>
                  @if (unreadCount(conv) > 0) {
                    <span class="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-xs font-semibold flex items-center justify-center animate-badge-pop">
                      {{ unreadCount(conv) }}
                    </span>
                  }
                </div>
              </div>
            </button>
          }
          @if (!loading() && filtered().length === 0) {
            <p class="text-center text-sm text-zinc-400 py-12">No conversations found</p>
          }
        }
      </div>

      <!-- Current user footer -->
      <div class="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0 flex items-center gap-3">
        <app-avatar [name]="auth.user()?.username ?? 'Me'" size="sm" />
        <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate flex-1">{{ auth.user()?.username }}</span>
        <app-icon-button ariaLabel="Sign out" size="sm" (clicked)="auth.logout()">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </app-icon-button>
      </div>
    </div>
  `
})
export class ConversationListComponent {
  private api = inject(ApiService);
  auth = inject(AuthService);

  activeId = input<string | null>(null);
  selected = output<Conversation>();
  newChat = output<void>();

  conversations = signal<Conversation[]>([]);
  loading = signal(true);
  query = '';

  filtered = computed(() => {
    const q = this.query.toLowerCase();
    return q
      ? this.conversations().filter(c => this.otherName(c).toLowerCase().includes(q))
      : this.conversations();
  });

  formatTime = formatTime;

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const list = await this.api.get<Conversation[]>('/conversations');
      this.conversations.set(list);
    } finally {
      this.loading.set(false);
    }
  }

  otherName(conv: Conversation): string {
    const me = this.auth.user()?.id;
    return conv.participants.find(p => p.id !== me)?.username ?? 'Unknown';
  }

  unreadCount(_conv: Conversation): number { return 0; }

  select(conv: Conversation): void { this.selected.emit(conv); }
}
