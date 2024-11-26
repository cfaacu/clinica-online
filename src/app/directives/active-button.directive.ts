import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appActiveButton]',
  standalone: true
})
export class ActiveButtonDirective {
  @Input('appActiveButton') isActive: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    this.updateStyles();
  }

  private updateStyles() {
    if (this.isActive) {
      this.el.nativeElement.style.backgroundColor = '#007bff';
      this.el.nativeElement.style.color = 'white';
    } else {
      this.el.nativeElement.style.backgroundColor = '';
      this.el.nativeElement.style.color = '';
    }
  }

}
