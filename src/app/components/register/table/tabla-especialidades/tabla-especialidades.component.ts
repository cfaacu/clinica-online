import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EspecialidadesService } from '../../../../services/especialidades.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-especialidades',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './tabla-especialidades.component.html',
  styleUrl: './tabla-especialidades.component.css'
})
export class TablaEspecialidadesComponent implements OnInit{
  @Input() especialidades: string[] = [];
  @Output() especialidadesSeleccionadas = new EventEmitter<string[]>();
  especialidadesSeleccionadasList: string[] = [];
  nuevaEspecialidad: string = '';  // Para capturar la nueva especialidad

  constructor(private especialidadesService: EspecialidadesService) {}

  ngOnInit(): void {
    // Emitir lista de especialidades seleccionadas en el inicio
    this.especialidadesSeleccionadas.emit(this.especialidadesSeleccionadasList);
  }

  toggleEspecialidad(especialidad: string): void {
    const index = this.especialidadesSeleccionadasList.indexOf(especialidad);
    if (index === -1) {
      this.especialidadesSeleccionadasList.push(especialidad);
    } else {
      this.especialidadesSeleccionadasList.splice(index, 1);
    }
    this.especialidadesSeleccionadas.emit(this.especialidadesSeleccionadasList);
  }

  // Función para agregar una nueva especialidad
  async agregarEspecialidad(): Promise<void> {
    if (this.nuevaEspecialidad.trim() !== '') {
      try {
        // Agregar la nueva especialidad a la base de datos
        await this.especialidadesService.agregarEspecialidad(this.nuevaEspecialidad.trim());

        // Agregar la especialidad a la lista local de especialidades y actualizar la vista
        this.especialidades.push(this.nuevaEspecialidad.trim());
        this.nuevaEspecialidad = '';  // Limpiar el campo de entrada

        // Emitir la lista actualizada de especialidades seleccionadas
        this.especialidadesSeleccionadas.emit(this.especialidadesSeleccionadasList);

        console.log('Especialidad agregada:', this.nuevaEspecialidad);
      } catch (error) {
        console.error('Error al agregar especialidad:', error);
      }
    }
  }
}
