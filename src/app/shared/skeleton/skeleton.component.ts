import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div [ngStyle]="{width:width, height:height, borderRadius:rounded}" class="bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>`
})
export class SkeletonComponent{
  @Input() width = '100%';
  @Input() height = '12px';
  @Input() rounded = '8px';
}
