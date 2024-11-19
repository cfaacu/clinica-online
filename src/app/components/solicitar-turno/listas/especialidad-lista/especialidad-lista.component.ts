import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-especialidad-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './especialidad-lista.component.html',
  styleUrl: './especialidad-lista.component.css'
})
export class EspecialidadListaComponent {
  @Output() especialidadSeleccionado: EventEmitter<any> = new EventEmitter<any>();
  @Input() lista: any[] = [];

  constructor() {

  }

  ngOnInit(): void {
    console.log("listescppp",this.lista)
  }

  enviarEspecialidad(item: any) {
    this.especialidadSeleccionado.emit(item);
  }
}
