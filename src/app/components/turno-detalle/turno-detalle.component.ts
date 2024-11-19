import { Component, Input } from '@angular/core';
import { TurnoService } from '../../services/turno.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turno-detalle',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './turno-detalle.component.html',
  styleUrl: './turno-detalle.component.css'
})
export class TurnoDetalleComponent {
  @Input() turnoDetalle!: any;
  aceptado = 'ACEPTADO';
  rechazado = 'RECHAZADO';
  cancelado = 'CANCELADO';
  finalizado = 'FINALIZADO';
  pendiente = 'PENDIENTE';
  realizado = 'REALIZADO';
  email!: string;
  usuario: any;
  nuevoComentarioPaciente!: string;
  nuevoComentarioEspecialista!: string;
  nuevoComentarioAdmin!: string;
  cancela: boolean = false;
  rechaza: boolean = false;
  finaliza: boolean = false;
  noMostrarEnviarComentarioEsp: boolean = false;
  noMostrarEnviarComentarioPac: boolean = false;
  noMostrarEnviarComentarioAdmin: boolean = false;

  estadoAccion: string = '';

  constructor(
    private turnoSvc: TurnoService,
    public authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.estadoAccion = '';
    this.usuario = this.authSvc.usuarioLogeado;
  }

  cancelar() {
    this.estadoAccion = this.cancelado;

    this.cancela = true;
    this.rechaza = false;
    this.finaliza = false;
  }

  rechazar() {
    this.estadoAccion = this.rechazado;

    this.cancela = false;
    this.rechaza = true;
    this.finaliza = false;
  }

  aceptar() {
    this.turnoDetalle.estado = this.aceptado;
    this.estadoAccion = this.aceptado;
  }

  finalizar() {
    this.cancela = false;
    this.rechaza = false;
    this.finaliza = true;
    this.estadoAccion = this.finalizado;
  }

  enviarComentario() {
    this.turnoDetalle.estado = this.estadoAccion;
    if (this.authSvc.ITEM_ACCESOS.isEspecialista) {
      this.turnoDetalle.comentariosEspecialista =
        this.nuevoComentarioEspecialista;
      this.turnoSvc.updateTurnoEstadoComentariosEspecialista(this.turnoDetalle);
      this.noMostrarEnviarComentarioEsp = true;
      this.nuevoComentarioEspecialista = '';
    } else if (this.authSvc.ITEM_ACCESOS.isPaciente) {
      this.turnoDetalle.comentariosPaciente = this.nuevoComentarioPaciente;
      this.turnoSvc.updateTurnoEstadoComentariosPaciente(this.turnoDetalle);
      this.noMostrarEnviarComentarioPac = true;
      this.nuevoComentarioPaciente = '';
    } else if (this.authSvc.ITEM_ACCESOS.isAdmin) {
      this.turnoDetalle.comentariosAdmin = this.nuevoComentarioAdmin;
      this.turnoSvc.updateTurnoEstadoComentariosAdmin(this.turnoDetalle);
      this.noMostrarEnviarComentarioAdmin = true;
      this.nuevoComentarioAdmin = '';
    }
    this.estadoAccion = '';

    if (this.authSvc.ITEM_ACCESOS.isEspecialista) {
      this.router.navigate(['/mis-turnos-especialista']);
    } else if (this.authSvc.ITEM_ACCESOS.isPaciente) {
      this.router.navigate(['/mis-turnos-paciente']);
    } 
    // else if (this.authSvc.ITEM_ACCESOS.isAdmin) {
    //   this.router.navigate(['/administracion/turnos']);
    // }
  }
}
