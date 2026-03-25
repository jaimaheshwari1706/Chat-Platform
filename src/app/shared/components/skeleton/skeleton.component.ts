import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div class="animate-pulse bg-zinc-200 dark:bg-zinc-700"
      [class]="rounded() ? 'rounded-full' : 'rounded-lg'"
      [style.width]="width()"
      [style.height]="height()">
    </div>
  `
})
export class SkeletonComponent {
  width = input<string>('100%');
  height = input<string>('1rem');
  rounded = input<boolean>(false);
}
