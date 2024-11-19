import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paciente } from '../../../../models/paciente';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paciente-lista.component.html',
  styleUrl: './paciente-lista.component.css'
})
export class PacienteListaComponent {
  @Output() pacienteSeleccionado: EventEmitter<any> = new EventEmitter<any>();
  @Input() lista: any[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log("listapacientessssssss",this.lista);
  }

  enviarPaciente(item: any) {
    this.pacienteSeleccionado.emit(item);
  }
}
