import { Component } from '@angular/core';
import { Turno } from '../../models/turno';
import { AuthService } from '../../services/auth.service';
import { TurnoService } from '../../services/turno.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterEspecialistaPipe } from "../../pipes/filter-especialista.pipe";
import { TurnoDetalleComponent } from "../turno-detalle/turno-detalle.component";
import { HistoriaClinicaAltaComponent } from "../historia-clinica-alta/historia-clinica-alta.component";
import { HistoriaClinicaDetalleComponent } from '../historia-clinica-detalle/historia-clinica-detalle.component';

@Component({
  selector: 'app-mis-turnos-especialista',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterEspecialistaPipe, TurnoDetalleComponent, HistoriaClinicaAltaComponent,HistoriaClinicaDetalleComponent],
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrl: './mis-turnos-especialista.component.css'
})
export class MisTurnosEspecialistaComponent {
  usuario: any;
  public filter!: string;
  turnosPaciente: Turno[] = [];
  turnoSeleccionado!: Turno;
  mostrarAltaHistoria: boolean = true;
  isLoading: boolean = true; // Indicador de carga

  constructor(private turnoSvc: TurnoService, private authSvc: AuthService) {}

  ngOnInit(): void {
    // Obtener el usuario actual
    this.usuario = this.authSvc.usuario;

    if (this.usuario != null) {
      this.cargarTurnos();
    }
  }

  // Cargar los turnos del especialista
  cargarTurnos() {
    this.turnoSvc.getTurnosByEspecialista(this.usuario.email).subscribe(
      (turnos) => {
        // Limpiamos la lista de turnos antes de agregar los nuevos
        this.turnosPaciente = [];

        if (turnos && turnos.length > 0) {
          turnos.forEach(turno => {
            const nuevoTurno: Turno = {
              id: turno.id,
              estado: turno.estado,
              paciente: turno.paciente,
              especialista: turno.especialista,
              especialidad: turno.especialidad,
              fecha: turno.fecha,
              hora: turno.hora,
              comentariosPaciente: turno.comentariosPaciente,
              comentariosEspecialista: turno.comentariosEspecialista,
              comentariosAdmin: turno.comentariosAdmin,
              historiaClinica: turno.historiaClinica,
              encuesta: turno.encuesta,
              calificacionAtencion: turno.calificacionAtencion
            };
            this.turnosPaciente.push(nuevoTurno);
          });
        }

        // Cambiamos el estado de carga a false
        this.isLoading = false;
        console.log('Turnos del especialista: ', this.turnosPaciente);
      },
      (error) => {
        // En caso de error, también cambiamos el estado de carga
        this.isLoading = false;
        console.error('Error al cargar los turnos:', error);
      }
    );
  }

  // Asignar turno seleccionado
  asignarTurno(turno: Turno) {
    this.turnoSeleccionado = turno;

    // Comprobar si el turno tiene historia clínica
    if (turno.historiaClinica) {
      this.mostrarAltaHistoria = false;
    } else {
      this.mostrarAltaHistoria = true;
    }
  }
}
