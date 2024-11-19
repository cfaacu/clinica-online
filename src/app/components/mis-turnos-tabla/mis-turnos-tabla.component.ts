import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Turno } from '../../models/turno';
import { TurnoService } from '../../services/turno.service';
import { AuthService } from '../../services/auth.service';
import { collection, getDocs, query, where } from '@angular/fire/firestore';
import { HistoriaClinicaDetalleComponent } from "../historia-clinica-detalle/historia-clinica-detalle.component";
import { TurnoDetalleComponent } from "../turno-detalle/turno-detalle.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPacientePipe } from "../../pipes/filter-paciente.pipe";
import { EncuestaComponent } from "../encuesta/encuesta.component";

@Component({
  selector: 'app-mis-turnos-tabla',
  standalone: true,
  imports: [CommonModule, FormsModule, HistoriaClinicaDetalleComponent, TurnoDetalleComponent, FilterPacientePipe, EncuestaComponent],
  templateUrl: './mis-turnos-tabla.component.html',
  styleUrl: './mis-turnos-tabla.component.css'
})
export class MisTurnosTablaComponent {
  public usuario$: Observable<any>;

  usuarios: any = [];
  usuario: any;
  public filter!: string;
  turnosOcupados: any;
  turnoSeleccionado!: Turno;
  turnosPaciente: any;
  turnosEspecialista: any;
  turnosHistoria: any;
  public listadoHistoriaClinica: any = [];
  public listaHistoriaClinica: any = [];

  constructor(
    private turnoSvc: TurnoService,
    public authSvc: AuthService
  ) {
    this.usuario$ = this.authSvc.usuario;
  }

  ngOnInit(): void {
    this.usuario$ = this.authSvc.usuario$;

    this.usuario$.subscribe(usuario => {
      this.usuario = usuario;

      if (this.usuario != null) {
        if (this.authSvc.ITEM_ACCESOS.isPaciente) {
          const turnosRef = collection(this.turnoSvc.firestore, 'turnos');
          const q = query(turnosRef, where('paciente.email', '==', this.usuario.email));
          this.turnosOcupados = getDocs(q);
        } else if (this.authSvc.ITEM_ACCESOS.isAdmin) {
          console.log('IS ADMIN MIS TURNOS ADMIN');
          const turnosRef = collection(this.turnoSvc.firestore, 'turnos');
          this.turnosOcupados = getDocs(turnosRef);
        }

        console.log(this.turnosOcupados);
        this.cargarTurnos();
      }
    });
  }

  cargarTurnos() {
    this.turnosPaciente = [];

    this.turnosOcupados.then((querySnapshot: any) => {
      querySnapshot.forEach((item: any) => {
        const turno: Turno = {
          id: item.id,
          estado: item.data().estado,
          paciente: item.data().paciente,
          especialista: item.data().especialista,
          especialidad: item.data().especialidad,
          fecha: item.data().fecha,
          hora: item.data().hora,
          comentariosPaciente: item.data().comentariosPaciente,
          comentariosEspecialista: item.data().comentariosEspecialista,
          comentariosAdmin: item.data().comentariosAdmin,
          historiaClinica: item.data().historiaClinica,
          encuesta: item.data().encuesta,
          calificacionAtencion: item.data().calificacionAtencion
        };
        this.turnosPaciente.push(turno);
      });
      console.log('turnos Paciente: ', this.turnosPaciente);
    }).catch((error: any) => {
      console.error('Error obteniendo los turnos: ', error);
    });
  }

  asignarTurno(turno: any) {
    console.log(turno);
    this.turnoSeleccionado = turno;
  }
}
