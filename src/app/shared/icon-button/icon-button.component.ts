import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'icon-button',
  standalone: true,
  imports: [CommonModule],
  template: `<button [attr.aria-label]="ariaLabel" class="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"><ng-content></ng-content></button>`
})
export class IconButtonComponent{
  @Input() ariaLabel = 'button';
}
