import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Especialista } from '../../../../models/especialista';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-especialista-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './especialista-lista.component.html',
  styleUrl: './especialista-lista.component.css'
})
export class EspecialistaListaComponent {
  @Output() especialistaSeleccionado: EventEmitter<any> = new EventEmitter<any>();
  @Input() lista: Especialista[] = [];

  constructor() {}

  ngOnInit(): void {
  }

  enviarEspecialista(item: any) {
    console.log("especialistaxsd",this.lista);
    this.especialistaSeleccionado.emit(item);
  }
}
