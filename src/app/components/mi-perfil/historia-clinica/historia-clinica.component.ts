import { Component } from '@angular/core';
import { Turno } from '../../../models/turno';
import { HistoriaClinica } from '../../../models/historia-clinica';
import { HistoriaClinicaService } from '../../../services/historia-clinica.service';
import { AuthService } from '../../../services/auth.service';
import { TurnoService } from '../../../services/turno.service';
import { CommonModule } from '@angular/common';
import { collection, getDocs, query, where } from '@angular/fire/firestore';
import { FilterPacientePipe } from "../../../pipes/filter-paciente.pipe";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule,FormsModule,FilterPacientePipe],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent {
  public mostrar: boolean = false;
  public historiaSeleccionada: HistoriaClinica = {} as HistoriaClinica;
  public usuarioSeleccionado: any;
  public listadoHistoriaClinica: any = [];
  public listaHistoriaClinica: any = [];
  usuario!: any;
  public filter!: string;

  constructor(
    public historiaClinicaService: HistoriaClinicaService,
    public authSvc: AuthService,
    private turnoSvc: TurnoService
  ) {
    this.usuario = this.authSvc.usuarioLogeado;
  }

  ngOnInit(): void {
    const turnosCollection = collection(this.turnoSvc.firestore, 'turnos');
    const q = query(turnosCollection, where('paciente.id', '==', this.usuario.id));

    getDocs(q).then((querySnapshot) => {
      this.listaHistoriaClinica = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Turno;
        var turno = new Turno ()
        turno.estado = data.estado,
        turno.paciente = data.paciente,
        turno.especialista = data.especialista,
        turno.especialidad = data.especialidad,
        turno.fecha = data.fecha,
        turno.hora = data.hora,
        turno.comentariosPaciente = data.comentariosPaciente,
        turno.comentariosEspecialista = data.comentariosEspecialista,
        turno.comentariosAdmin = data.comentariosAdmin,
        turno.historiaClinica = data.historiaClinica
        this.listaHistoriaClinica.push(turno);
      });

      console.log(this.listaHistoriaClinica); 
    }).catch((error) => {
      console.error("Error al obtener documentos: ", error);
    });
  }
}
