import { Injectable, signal } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OfflineService {
  isOnline = signal<boolean>(navigator.onLine);

  constructor(){
    fromEvent(window, 'online').subscribe(() => this.isOnline.set(true));
    fromEvent(window, 'offline').subscribe(() => this.isOnline.set(false));
  }
}
