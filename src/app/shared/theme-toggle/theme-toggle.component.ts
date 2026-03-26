import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `<button aria-label="Toggle theme" (click)="toggle()" class="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200">{{theme.dark() ? '🌙' : '☀️'}}</button>`
})
export class ThemeToggleComponent{
  private svc = inject(ThemeService);
  theme = this.svc;
  toggle(){ this.svc.toggle(); }
}
