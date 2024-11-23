import { Component } from '@angular/core';
import { TurnoService } from '../../services/turno.service';
import { AuthService } from '../../services/auth.service';
import { HistoriaClinicaDetalleComponent } from "../historia-clinica-detalle/historia-clinica-detalle.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-pacientes.component.html',
  styleUrl: './mis-pacientes.component.css'
})
export class MisPacientesComponent {
  turnos!: any;
  turnosEspecialista: any[] = [];
  pacientesEspecialista: any[] = [];
  turnosPacienteSeleccionado: any[] = [];

  turnoSeleccionado!: any;
  pacienteSeleccionado!: any;
  turnosPacientesAtendidos: any[] = [];
  resenaSeleccionada: string | null = null;

  constructor(public turnoSvc: TurnoService, private authSvc: AuthService) {

    this.turnoSvc.getTurnos().subscribe((element: any) => {
      // OBTENGO TODOS LOS TURNOS
      this.turnos = element;

      // FILTRO TODOS LOS TURNOS DEL ESPECIALISTA
      if (this.turnos != null && this.authSvc.usuarioLogeado) {
        this.turnosEspecialista = this.turnos.filter(
          (item: any) =>
            item.especialista.email == this.authSvc.usuarioLogeado.email &&
            item.estado != 'RECHAZADO' &&
            item.estado != 'CANCELADO' &&
            item.estado != 'PENDIENTE'
        );
      }

      if (this.turnosEspecialista != null) {
        // OBTENGO TODOS LOS PACIENTES  DEL ESPECIALISTA SIN REPETIR
        console.log("turnos especialistass", this.turnosEspecialista);
        const emailUnicos = [''];
        for (var i = 0; i < this.turnosEspecialista.length; i++) {
          const email = this.turnosEspecialista[i].paciente.email;

          if (!emailUnicos.includes(email)) {
            emailUnicos.push(email);
            const pacienteFormateado = {
              email: this.turnosEspecialista[i].paciente.email,
              nombre: this.turnosEspecialista[i].paciente.nombre,
              apellido: this.turnosEspecialista[i].paciente.apellido,
              urlFotos: this.turnosEspecialista[i].paciente.urlsImagenes,
              ultimosTresTurnos: [''],
            };

            this.pacientesEspecialista.push(pacienteFormateado);
          }
        }

        console.log('this.turnosEspecialista -> ', this.turnosEspecialista);
        console.log('emailUnicos -> ', emailUnicos);
        console.log(
          'this.pacientesEspecialista -> ',
          this.pacientesEspecialista
        );

        // OBTENGO LOS TURNOS DEL PACIENTE
        this.pacientesEspecialista.forEach((paciente) => {
          for (var i = 0; i < this.turnosEspecialista.length; i++) {
            if (this.turnosEspecialista[i].paciente.email == paciente.email) {
              paciente.ultimosTresTurnos.push(this.turnosEspecialista[i]);
            }
          }
        });

        // OBTENGO LOS ULTIMOS 3 TURNOS DEL PACIENTE
        this.pacientesEspecialista.forEach((paciente) => {
          let arrFecha = paciente.ultimosTresTurnos;
          let len = paciente.ultimosTresTurnos.length;
          if (len > 3) {
            let turno1 = paciente.ultimosTresTurnos[len - 1];
            let turno2 = paciente.ultimosTresTurnos[len - 2];
            let turno3 = paciente.ultimosTresTurnos[len - 3];

            paciente.ultimosTresTurnos = [''];
            paciente.ultimosTresTurnos.push(turno3);
            paciente.ultimosTresTurnos.push(turno2);
            paciente.ultimosTresTurnos.push(turno1);
          }
        });
      }
      console.log(this.turnosPacientesAtendidos);
    });
  }

  ngOnInit(): void {
  }

  seleccionarPaciente(paciente: any) {
    this.resenaSeleccionada = null;
    this.pacienteSeleccionado = paciente;
    this.turnosPacienteSeleccionado = this.turnosEspecialista.filter(
      (turno) => turno.paciente.email === paciente.email
    );
  }
  
  verResena(turno: any) {
    this.resenaSeleccionada = turno.comentariosEspecialista || 'No hay comentarios disponibles.';
  }
  

  enviarTurno(turno: any) {
    this.turnoSeleccionado = turno;
    console.log(turno);
  }
}
