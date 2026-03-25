import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="inline-block rounded-full" [class]="cls()"></span>`
})
export class StatusBadgeComponent {
  status = input<'online' | 'away' | 'offline'>('offline');
  cls = computed(() => {
    const base = 'w-2.5 h-2.5 ';
    return base + ({ online: 'bg-green-500', away: 'bg-amber-400', offline: 'bg-zinc-400' }[this.status()]);
  });
}
