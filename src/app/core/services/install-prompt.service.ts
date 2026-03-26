import { Injectable, signal } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InstallPromptService {
  private deferredPrompt = signal<any | null>(null);
  canInstall = signal<boolean>(false);

  constructor(){
    fromEvent(window, 'beforeinstallprompt').subscribe((e: any) => {
      e.preventDefault();
      this.deferredPrompt.set(e);
      this.canInstall.set(true);
    });
  }

  async install(){
    const prompt = this.deferredPrompt();
    if(!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if(outcome === 'accepted'){
      this.deferredPrompt.set(null);
      this.canInstall.set(false);
    }
  }
}
