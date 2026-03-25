import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  template: `
    <button type="button"
      [attr.aria-label]="ariaLabel()"
      (click)="clicked.emit()"
      class="rounded-full flex items-center justify-center transition-all duration-200 ease-in-out
             hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
             min-w-[44px] min-h-[44px]"
      [class]="size() === 'sm' ? 'p-1.5' : 'p-2'">
      <ng-content />
    </button>
  `
})
export class IconButtonComponent {
  ariaLabel = input.required<string>();
  size = input<'sm' | 'md'>('md');
  clicked = output<void>();
}
