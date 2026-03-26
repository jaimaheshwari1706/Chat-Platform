import { Directive, Output, EventEmitter, HostListener, Input } from '@angular/core';

@Directive({ selector: '[longPress]', standalone: true })
export class LongPressDirective {
  @Output() longPress = new EventEmitter<PointerEvent>();
  @Input() threshold = 500;

  private timeout: any = null;

  @HostListener('pointerdown', ['$event']) onDown(e: PointerEvent){
    this.timeout = setTimeout(() => this.longPress.emit(e), this.threshold);
  }

  @HostListener('pointerup') onUp(){ this.clear(); }
  @HostListener('pointerleave') onLeave(){ this.clear(); }

  private clear(){ if(this.timeout){ clearTimeout(this.timeout); this.timeout = null; } }
}
