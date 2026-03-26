import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
  template: `
    <app-icon-button ariaLabel="Toggle theme" (clicked)="theme.toggle()">
      <ng-container *ngIf="theme.dark(); else light">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z"/>
        </svg>
      </ng-container>
      <ng-template #light>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
      </ng-template>
    </app-icon-button>
  `
})
export class ThemeToggleComponent {
  theme = inject(ThemeService);
}
