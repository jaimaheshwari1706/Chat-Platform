import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineService } from '../../../core/services/offline.service';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div *ngIf="offline.isOnline() === false" class="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center py-2 z-40 transform -translate-y-full animate-slide-down">
    You are offline. Messages will send when reconnected.
  </div>
  `,
  styles: [`.animate-slide-down{animation: slide-down 300ms ease-out forwards}@media (prefers-reduced-motion: no-preference){@keyframes slide-down{from{transform:translateY(-100%)}to{transform:translateY(0)}}}`]
})
export class OfflineBannerComponent{
  offline = inject(OfflineService);
}
