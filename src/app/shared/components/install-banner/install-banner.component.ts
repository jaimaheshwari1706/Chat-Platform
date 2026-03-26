import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallPromptService } from '../../../core/services/install-prompt.service';

@Component({
  selector: 'app-install-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="can() && !dismissed()" class="p-3 bg-white dark:bg-zinc-800 rounded-xl shadow flex items-center gap-3">
      <div class="flex-1">⬇️ Install ChatApp</div>
      <div class="flex items-center gap-2">
        <button (click)="install()" class="bg-accent text-white px-3 py-1 rounded">Install</button>
        <button (click)="hide()">✕</button>
      </div>
    </div>
  `
})
export class InstallBannerComponent{
  private svc = inject(InstallPromptService);
  can = this.svc.canInstall;
  dismissed = signal(!!localStorage.getItem('chatapp_install_dismissed'));

  install(){ this.svc.install(); localStorage.setItem('chatapp_install_dismissed','1'); this.dismissed.set(true); }
  hide(){ localStorage.setItem('chatapp_install_dismissed','1'); this.dismissed.set(true); }
}
