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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Especialista } from '../../../models/especialista';

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
  public profesionalesUnicos: any[] = [];
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
      const profesionales = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Turno;
        var turno = new Turno()
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

        // Guardar profesionales únicos
        if (!profesionales.has(data.especialista.uid)) {
          profesionales.add(data.especialista.uid);
          this.profesionalesUnicos.push(data.especialista);
        }
      });
    }).catch((error) => {
      console.error("Error al obtener documentos: ", error);
    });
  }

  generarPDF() {
    const pdf = new jsPDF();
    
    // Use the filtered list of turnos based on the current filter
    const turnosFiltrados = this.listaHistoriaClinica.filter((t: Turno) => 
      !this.filter || 
      t.especialidad.nombre.toLowerCase().includes(this.filter.toLowerCase()) || 
      `${t.especialista.nombre} ${t.especialista.apellido}`.toLowerCase().includes(this.filter.toLowerCase())
    );
  
    // Configurar encabezado del PDF
    pdf.setFontSize(18);
    pdf.text('Historia Clínica', 14, 22);
    pdf.setFontSize(11);
    pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    pdf.text(`Paciente: ${this.usuario.nombre} ${this.usuario.apellido}`, 14, 38);
  
    // Añadir filtro aplicado si existe
    if (this.filter) {
      pdf.text(`Filtro: ${this.filter}`, 14, 46);
    }
  
    // Logo de la clínica
    const logoUrl = 'https://i.postimg.cc/L8DqTVRV/2771402.png';
    pdf.addImage(logoUrl, 'PNG', 160, 10, 30, 30);
  
    // Generar tabla con datos
    const datos = turnosFiltrados.map((turno: Turno) => {
      const historiaClinica = turno.historiaClinica || {};
      return [
        turno.fecha,
        turno.especialidad.nombre,
        `${turno.especialista.nombre} ${turno.especialista.apellido}`,
        historiaClinica.altura || '-',
        historiaClinica.peso || '-',
        historiaClinica.temperatura || '-',
        historiaClinica.clave1 ? `${historiaClinica.clave1}: ${historiaClinica.valor1}` : '-',
        historiaClinica.clave2 ? `${historiaClinica.clave2}: ${historiaClinica.valor2}` : '-',
        historiaClinica.clave3 ? `${historiaClinica.clave3}: ${historiaClinica.valor3}` : '-'
      ];
    });
  
    (pdf as any).autoTable({
      head: [
        ['Fecha', 'Especialidad', 'Profesional', 'Altura', 'Peso', 'Temperatura', 
         'Clave 1', 'Clave 2', 'Clave 3']
      ],
      body: datos,
      startY: 55
    });
  
    pdf.save('historia-clinica-filtrada.pdf');
  }
}
