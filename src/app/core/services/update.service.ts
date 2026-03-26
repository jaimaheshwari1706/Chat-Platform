import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UpdateService {
  showUpdate = signal(false);
}
