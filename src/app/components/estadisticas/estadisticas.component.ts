import { Component } from '@angular/core';
import { GraficoCantTurnosPorEspecialidadComponent } from "./grafico-cant-turnos-por-especialidad/grafico-cant-turnos-por-especialidad.component";
import { GraficoCantTurnosPorDiaComponent } from "./grafico-cant-turnos-por-dia/grafico-cant-turnos-por-dia.component";
import { GraficoCantTurnosEspecialistaComponent } from "./grafico-cant-turnos-especialista/grafico-cant-turnos-especialista.component";
import { GraficoCantTurnosEspecialistaFinalizadosComponent } from "./grafico-cant-turnos-especialista-finalizados/grafico-cant-turnos-especialista-finalizados.component";
import { LogIngresosComponent } from "./log-ingresos/log-ingresos.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule,GraficoCantTurnosPorEspecialidadComponent, GraficoCantTurnosPorDiaComponent, GraficoCantTurnosEspecialistaComponent, GraficoCantTurnosEspecialistaFinalizadosComponent, LogIngresosComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
  mostrarLogs: boolean = false;
  mostrarTurnosEspecialidad: boolean = false;
  mostrarTurnosXDia: boolean = false;
  mostrarTurnosXEspecialista: boolean = false;
  mostrarTurnosXEspecialistaFinalizados: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  mostrarIngresos() {
    this.mostrarLogs = true;
    this.mostrarTurnosXDia = false;
    this.mostrarTurnosEspecialidad = false;
    this.mostrarTurnosXEspecialista = false;
    this.mostrarTurnosXEspecialistaFinalizados = false;
  }

  mostrarTurnosByEspecialidad() {
    this.mostrarTurnosEspecialidad = true;
    this.mostrarLogs = false;
    this.mostrarTurnosXDia = false;
    this.mostrarTurnosXEspecialista = false;
    this.mostrarTurnosXEspecialistaFinalizados = false;
  }

  mostrarTurnosPorDia() {
    this.mostrarTurnosXDia = true;
    this.mostrarLogs = false;
    this.mostrarTurnosEspecialidad = false;
    this.mostrarTurnosXEspecialista = false;
    this.mostrarTurnosXEspecialistaFinalizados = false;
  }

  mostrarTurnosXMedico() {
    this.mostrarTurnosXDia = false;
    this.mostrarLogs = false;
    this.mostrarTurnosEspecialidad = false;
    this.mostrarTurnosXEspecialista = true;
    this.mostrarTurnosXEspecialistaFinalizados = false;
  }

  mostrarTurnosXMedicoFinalizados() {
    this.mostrarTurnosXDia = false;
    this.mostrarLogs = false;
    this.mostrarTurnosEspecialidad = false;
    this.mostrarTurnosXEspecialista = false;
    this.mostrarTurnosXEspecialistaFinalizados = true;
  }
}
