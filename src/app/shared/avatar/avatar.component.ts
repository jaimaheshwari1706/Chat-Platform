import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

function nameColor(name: string){
  let h = 0;
  for(let i=0;i<name.length;i++) h = name.charCodeAt(i) + ((h<<5)-h);
  const colors = ['bg-zinc-300','bg-zinc-400','bg-zinc-500','bg-zinc-600','bg-zinc-700'];
  return colors[Math.abs(h) % colors.length];
}

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div [ngClass]="sizeClass" class="rounded-full overflow-hidden relative flex items-center justify-center text-white">
    <img *ngIf="imageUrl" [src]="imageUrl" alt="avatar" class="object-cover w-full h-full" />
    <div *ngIf="!imageUrl" [ngClass]="bgClass + ' w-full h-full flex items-center justify-center text-sm font-semibold'">{{initials}}</div>
    <span *ngIf="showOnline" class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white bg-green-500"></span>
  </div>
  `
})
export class AvatarComponent{
  @Input() imageUrl?: string | null;
  @Input() name = '';
  @Input() size: number | 'sm' | 'md' | 'lg' = 'md';
  @Input() showOnline = false;

  get initials(){
    if(!this.name) return '';
    const parts = this.name.split(' ');
    return (parts[0]?.[0]||'') + (parts[1]?.[0]||'');
  }

  get bgClass(){ return nameColor(this.name || ''); }

  get sizeClass(){
    const s = this.size;
    if(s === 'sm' || s === 32) return 'w-8 h-8';
    if(s === 'lg' || s === 56) return 'w-14 h-14';
    return 'w-10 h-10';
  }
}
