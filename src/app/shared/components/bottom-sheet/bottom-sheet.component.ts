import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/50" (click)="close.emit()"></div>
      <div class="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-t-2xl p-4 transform translate-y-0 transition-transform duration-300">
        <div class="w-12 h-1.5 bg-zinc-300 rounded mx-auto mb-3"></div>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class BottomSheetComponent{
  @Output() close = new EventEmitter<void>();
}
