import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appGrowOnHover]',
  standalone: true
})
export class GrowOnHoverDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  // Cuando el mouse entra en el área del botón
  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.1)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.3s ease');
  }

  // Cuando el mouse sale del área del botón
  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
  }

}
