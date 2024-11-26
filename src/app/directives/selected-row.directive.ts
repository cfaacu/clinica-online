import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSelectedRow]',
  standalone: true
})
export class SelectedRowDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') onClick() {
    const rows = this.el.nativeElement.parentElement.children;
    for (let row of rows) {
      this.renderer.removeClass(row, 'selected');
    }
    this.renderer.addClass(this.el.nativeElement, 'selected');
  }

}
