import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span [ngClass]="cls" class="w-2.5 h-2.5 rounded-full inline-block ring-2 ring-white"></span>`
})
export class StatusBadgeComponent{
  @Input() status: 'online' | 'away' | 'offline' = 'offline';

  get cls(){
    if(this.status === 'online') return 'bg-green-500';
    if(this.status === 'away') return 'bg-amber-400';
    return 'bg-zinc-400';
  }
}
