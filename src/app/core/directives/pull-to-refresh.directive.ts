import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[pullToRefresh]' , standalone: true })
export class PullToRefreshDirective {
  @Output() refresh = new EventEmitter<void>();

  private startY = 0;
  private pulling = false;
  private threshold = 60;

  constructor(private el: ElementRef<HTMLElement>){ }

  @HostListener('touchstart', ['$event']) onStart(e: TouchEvent){
    if (this.el.nativeElement.scrollTop > 0) return;
    this.startY = e.touches[0].clientY;
    this.pulling = true;
  }

  @HostListener('touchmove', ['$event']) onMove(e: TouchEvent){
    if(!this.pulling) return;
    const delta = e.touches[0].clientY - this.startY;
    if(delta > this.threshold){
      this.pulling = false;
      this.refresh.emit();
    }
  }

  @HostListener('touchend') onEnd(){ this.pulling = false; }
}
