import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateService } from '../../../core/services/update.service';

@Component({
  selector: 'app-update-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="svc.showUpdate()" class="fixed top-0 left-0 right-0 bg-violet-600 text-white flex items-center justify-between px-4 py-2 z-50">
      <div>A new version is available.</div>
      <div class="flex items-center gap-2">
        <button (click)="refresh()" class="px-3 py-1 bg-white text-violet-600 rounded">Refresh</button>
        <button (click)="dismiss()" class="text-white">✕</button>
      </div>
    </div>
  `
})
export class UpdateBannerComponent{
  svc = inject(UpdateService);
  refresh(){ document.location.reload(); }
  dismiss(){ this.svc.showUpdate.set(false); }
}
