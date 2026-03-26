import { Component, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '../../shared/avatar/avatar.component';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent],
  template: `
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" (click)="close.emit()"></div>
    <div class="relative bg-white dark:bg-zinc-900 w-full max-w-xl mx-4 rounded-xl shadow-lg">
      <div class="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <input [(ngModel)]="q" placeholder="Search users" class="w-full pl-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 focus-visible:outline-accent transition-all" />
        <button aria-label="Close" (click)="close.emit()" class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">✕</button>
      </div>
      <div class="p-4">
        <div *ngIf="results().length === 0" class="text-center text-zinc-400 py-8">
          <svg class="mx-auto mb-3" width="80" height="80" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="10" r="6" stroke="#cbd5e1" stroke-width="2" fill="none"/></svg>
          <div>No users found</div>
        </div>
        <div *ngFor="let u of results()" class="flex items-center justify-between gap-3 py-2">
          <div class="flex items-center gap-3">
            <app-avatar [name]="u.name" [size]="40"></app-avatar>
            <div>
              <div class="font-semibold">{{u.name}}</div>
              <div class="text-xs text-zinc-400">{{u.email}}</div>
            </div>
          </div>
          <button class="bg-accent text-white px-3 py-1 rounded-xl" (click)="userSelected.emit(u.id)">Message</button>
        </div>
      </div>
    </div>
  </div>
  `
})
export class UserSearchComponent{
  @Output() close = new EventEmitter<void>();
  @Output() userSelected = new EventEmitter<string>();

  q = '';
  users = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Bob Lee', email: 'bob@example.com' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Cecilia Brown', email: 'cecilia@example.com' }
  ];

  results = computed(() => {
    const q = this.q?.toLowerCase?.() || '';
    if(!q) return this.users;
    return this.users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  });
}
