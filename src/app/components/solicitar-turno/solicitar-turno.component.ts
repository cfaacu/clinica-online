import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Turno } from '../../models/turno';
import { AuthService } from '../../services/auth.service';
import { EspecialistaService } from '../../services/especialista.service';
import { PacienteService } from '../../services/paciente.service';
import { TurnoService } from '../../services/turno.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { EspecialidadesService } from '../../services/especialidades.service';
import { Paciente } from '../../models/paciente';
import { ENUM_ESTADO_TURNO } from '../../enum/estadoTurno.enum';
import { HistoriaClinica } from '../../models/historia-clinica';
import { PacienteListaComponent } from "./listas/paciente-lista/paciente-lista.component";
import { EspecialidadListaComponent } from "./listas/especialidad-lista/especialidad-lista.component";
import { EspecialistaListaComponent } from "./listas/especialista-lista/especialista-lista.component";

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [CommonModule, PacienteListaComponent, EspecialidadListaComponent, EspecialistaListaComponent],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css',
  providers: [DatePipe] 
})
export class SolicitarTurnoComponent {
  suscripciones: Subscription[] = [];

  especialistas: any[] = [];
  especialistaSeleccionado: any;

  especialidades: any[] = [];
  especialidadSeleccionado: any;

  pacientes: any[] = [];
  pacienteSeleccionado: any;
  spinner: boolean = true;

  successOperation: boolean = false;

  public usuario$: Observable<any>;
  usuarios: any[] = [];
  especialistasEspecialidad: any[] = [];
  turno!: Turno;
  turnosOcupados: any;
  fromDate: any;
  toDate: any;
  fechas: any;
  mostrarHora = false;
  fechaElegida: any;
  horaElegida!: string;
  turnosDisponibles: any[] = [];
  listaUsuarios: any[] = [];
  idAdmin = false;
  email!: string;
  paciente!: any;
  administrador!: any;
  captchaPropio: boolean = false;
  mensajeError!: string;

  constructor(
    public authSvc: AuthService,
    public especialistaService: EspecialistaService,
    public especialidadService: EspecialidadesService,
    public pacienteService: PacienteService,
    private turnoSvc: TurnoService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.successOperation = false;
    this.usuario$ = this.authSvc.usuario;
  }

  ngOnInit(): void {
    console.log("UsuarioLogueado", this.authSvc.usuarioLogeado)
    this.setearTurno();
    this.spinnerShow();
    this.cargarPacientes();
    this.cargarEspecialistas();
    setTimeout(() => {
      this.spinnerHide();
    }, 2000);
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.suscripciones = [];  // Limpiar el array después de cancelar todas las suscripciones
  }
  

  private spinnerShow() {
    this.spinner = true;
  }

  private spinnerHide() {
    this.spinner = false;
  }

  cargarEspecialistas() {
    this.especialistaService.getAllTwo().subscribe({
      next: (especialistas) => {
        this.especialistas = especialistas;
      },
      error: (error) => {
        console.error('Error al obtener los especialistas:', error);
      }
    });
  }

  cargarEspecialidades() {
    this.especialidades = [];
    this.especialidadService
      .getAllEsp()
      .subscribe((especialidades) => {
        this.especialidades = especialidades.filter((especialidad) =>{
          return this.especialistaSeleccionado.especialidades.includes(especialidad.nombre);
        })
      });
  }

  cargarPacientes() {
    this.suscripciones.push(
      this.pacienteService.getAllTwo().subscribe((snapshot) => {
        this.pacientes = [];
        snapshot.forEach((item: any) => {
          {
            console.log("wiwi", item.payload)
            const data = item as Paciente;
            data.uid = item.uid;
            this.pacientes.push(data);
          }
        });
      })
    );
  }

  asignarEspecialista(item: any) {
    console.log('Especialista seleccionada ->', item);
    this.mensajeError = '';
    //SETEO CAMPOS
    this.setearFechaYHora();

    //ASIGNO
    this.especialistaSeleccionado = item;
    this.cargarEspecialidades();
  }

  asignarEspecialidad(item: any) {
    console.log('Especialidad seleccionada ->', item);

    //SETEO CAMPOS
    this.setearFechaYHora();

    //ASIGNO
    this.especialidadSeleccionado = item;

    this.cargarTurnos();
  }

  asignarPaciente(item: any) {
    this.pacienteSeleccionado = item;
    console.log(this.pacienteSeleccionado);
  }

  // Fechas turnos
  mostrarHorarios(fecha: any) {
    console.log('turnosDispnibles: ', this.turnosDisponibles);
    this.horaElegida = '';
    this.fechaElegida = fecha;
    console.log('fechaElegida: ', this.fechaElegida);
    console.log('dia elegido: ', this.fechaElegida.fmt_date.weekDay);

    this.fechaElegida.row_date.hours = this.getHorasByDia(
      this.fechaElegida.fmt_date.weekDay
    );

    let fechaElegidaStr =
    this.fechaElegida.row_date.year +
    '-' +
    this.fechaElegida.row_date.month +
    '-' +
    this.fechaElegida.row_date.day;


    this.filtrarHorariosTurnos(fechaElegidaStr);
  }

  filtrarHorariosTurnos(fecha: string) {
    if (this.especialistaSeleccionado.horarios === null) {
      // Si 'horarios' es null, mostramos el mensaje de no disponibilidad
      this.mensajeError = "No hay turnos disponibles para este especialista.";
      return; // Salimos del método ya que no hay turnos disponibles
    }
    let fechaDis = fecha;
    this.turnosOcupados.forEach((turno: any) => {
      console.log(turno.especialista);
      
      // Solo procesar turnos del especialista seleccionado y no rechazados o cancelados
      if (
        turno.especialista.id == this.especialistaSeleccionado.id &&
        turno.estado != ENUM_ESTADO_TURNO.RECHAZADO &&
        turno.estado != ENUM_ESTADO_TURNO.CANCELADO
      ) {
        // Iterar sobre las fechas para comparar
        this.fechas.forEach((element : any) => {
          // Formateamos la fecha en el formato adecuado
          fechaDis =
            element.row_date.year +
            '-' +
            element.row_date.month +
            '-' +
            element.row_date.day;
  
          // Si las fechas coinciden, procedemos con la lógica de horarios
          if (turno.fecha == fechaDis) {
            // Desmarcar la hora ocupada
            const horaIndex = element.row_date.hours.indexOf(turno.hora);
            if (horaIndex !== -1) {
              element.row_date.hours[horaIndex] = null;
            }
            
            // Verificar si el turno ya ha sido agregado antes de agregarlo
            if (!this.turnosDisponibles.find((item) => item === element)) {
              this.turnosDisponibles.push(element);
            }
          }
        });
      }
    });
  }
  

  fechaTurnoElegido(hora: any) {
    this.horaElegida = hora;
    console.log('horaElegida: ', this.horaElegida);
  }

  cargarTurnos() {
    this.turnosDisponibles = [];
    console.log('cargar Turnos');
    this.getDates();
    this.turnoSvc.getTurnos().subscribe((turnos) => {
      this.turnosOcupados = turnos;
      this.cargarTurnosDisponibles();
    });
  }

  getDates() {
    var current_date = new Date();
    current_date.setDate(current_date.getDate() + 1);
    var dias = 15;
    var end_date = new Date();
    end_date.setDate(current_date.getDate() + dias);
    var getTimeDiff = Math.abs(current_date.getTime() - end_date.getTime());
    var date_range = Math.ceil(getTimeDiff / (1000 * 3600 * 24)) + 1;
  
    var weekday = ['Sun', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    var months = [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];
  
    var hoursWeek = [
      '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
    ];
    var hoursSat = [
      '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30'
    ];
  
    var dates = new Array();
  
    for (var i = 0; i <= date_range; i++) {
      var getDate = current_date.getDate() < 10 ? '0' + current_date.getDate() : current_date.getDate();
      var getMonth = current_date.getMonth() < 9 ? '0' + (current_date.getMonth() + 1) : (current_date.getMonth()+1).toString();
      
      var row_date;
      var hours;
  
      if (current_date.getDay() == 6) { 
        hours = hoursSat;
        row_date = {
          day: getDate,
          month: getMonth ,
          year: current_date.getFullYear(),
          hours
        };
      } else {  
        hours = hoursWeek;
        row_date = {
          day: getDate,
          month: getMonth ,
          year: current_date.getFullYear(),
          hours
        };
      }
  
      var fmt_date = {
        weekDay: weekday[current_date.getDay()],
        date: getDate,
        month: months[current_date.getMonth()],
        monthName: this.datePipe.transform(current_date, 'yyyy-MM-dd')
      };
  
      const hasValidHours = this.hasValidHorario(fmt_date.weekDay);
  
      if (hasValidHours) {
        dates.push({
          row_date: row_date,
          fmt_date: fmt_date,
          is_weekend: current_date.getDay() == 0 || current_date.getDay() == 6,
        });
      }
  
      current_date.setDate(current_date.getDate() + 1);
    }
  
    this.fechas = dates;
    console.log("depurar",this.fechas);  // Para depuración
  }
  
  hasValidHorario(dia: string): boolean {
    console.log('Especialista seleccionado:', this.especialistaSeleccionado); 
  
    if (!this.especialistaSeleccionado || !this.especialistaSeleccionado.horarios) {
      return false;
    }
  
    switch (dia) {
      case 'MON': // Lunes
        const lunesHorario = this.especialistaSeleccionado.horarios.horarioLunes?.[0];
        return lunesHorario?.desde !== null && lunesHorario?.hasta !== null;
      case 'TUE': // Martes
        const martesHorario = this.especialistaSeleccionado.horarios.horarioMartes?.[0];
        return martesHorario?.desde !== null && martesHorario?.hasta !== null;
      case 'WED': // Miércoles
        const miercolesHorario = this.especialistaSeleccionado.horarios.horarioMiercoles?.[0];
        return miercolesHorario?.desde !== null && miercolesHorario?.hasta !== null;
      case 'THU': // Jueves
        const juevesHorario = this.especialistaSeleccionado.horarios.horarioJueves?.[0];
        return juevesHorario?.desde !== null && juevesHorario?.hasta !== null;
      case 'FRI': // Viernes
        const viernesHorario = this.especialistaSeleccionado.horarios.horarioViernes?.[0];
        return viernesHorario?.desde !== null && viernesHorario?.hasta !== null;
      case 'SAT': // Sábado
        const sabadoHorario = this.especialistaSeleccionado.horarios.horarioSabado?.[0];
        return sabadoHorario?.desde !== null && sabadoHorario?.hasta !== null;
      default:
        return false;
    }
  }
  
  
  
  
  

  getHorasByDia(dia: string): string[] {
    let retorno = [];
  
    if (!this.especialistaSeleccionado || !this.especialistaSeleccionado.horarios) {
      return [];  
    }
  
    switch (dia) {
      case 'MON':
        if (this.especialistaSeleccionado.horarios.horarioLunes &&
            this.especialistaSeleccionado.horarios.horarioLunes[0]?.desde !== null) {
          retorno = this.getArrayHoras(false, this.especialistaSeleccionado.horarios.horarioLunes[0].desde, this.especialistaSeleccionado.horarios.horarioLunes[0].hasta);
        }
        break;
      case 'TUE':
        if (this.especialistaSeleccionado.horarios.horarioMartes &&
            this.especialistaSeleccionado.horarios.horarioMartes[0]?.desde !== null) {
          retorno = this.getArrayHoras(false, this.especialistaSeleccionado.horarios.horarioMartes[0].desde, this.especialistaSeleccionado.horarios.horarioMartes[0].hasta);
        }
        break;
      case 'WED':
        if (this.especialistaSeleccionado.horarios.horarioMiercoles &&
            this.especialistaSeleccionado.horarios.horarioMiercoles[0]?.desde !== null) {
          retorno = this.getArrayHoras(false, this.especialistaSeleccionado.horarios.horarioMiercoles[0].desde, this.especialistaSeleccionado.horarios.horarioMiercoles[0].hasta);
        }
        break;
      case 'THU':
        if (this.especialistaSeleccionado.horarios.horarioJueves &&
            this.especialistaSeleccionado.horarios.horarioJueves[0]?.desde !== null) {
          retorno = this.getArrayHoras(false, this.especialistaSeleccionado.horarios.horarioJueves[0].desde, this.especialistaSeleccionado.horarios.horarioJueves[0].hasta);
        }
        break;
      case 'FRI':
        if (this.especialistaSeleccionado.horarios.horarioViernes &&
            this.especialistaSeleccionado.horarios.horarioViernes[0]?.desde !== null) {
          retorno = this.getArrayHoras(false, this.especialistaSeleccionado.horarios.horarioViernes[0].desde, this.especialistaSeleccionado.horarios.horarioViernes[0].hasta);
        }
        break;
      case 'SAT':
        if (this.especialistaSeleccionado.horarios.horarioSabado &&
            this.especialistaSeleccionado.horarios.horarioSabado[0]?.desde !== null) {
          retorno = this.getArrayHoras(true, this.especialistaSeleccionado.horarios.horarioSabado[0].desde, this.especialistaSeleccionado.horarios.horarioSabado[0].hasta);
        }
        break;
    }
  
    if (retorno.length === 0) {
      return [];
    }
  
    return retorno;
  }
  
  

  getArrayHoras(
    esSabado: boolean,
    horaDesde: string,
    horaHasta: string
  ): any[] {
    console.log('esSabado: ', esSabado);
    console.log('horaDesde: ', horaDesde);
    console.log('horaHasta: ', horaHasta);
    var hoursWeek = [
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
      '18:30',
    ];
    var hoursSat = [
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
    ];
    let hoursWeekOK = new Array();
    let hoursSatOK = new Array();
    if (!esSabado) {
      hoursWeek.forEach((hora) => {
        if (hora >= horaDesde && hora < horaHasta) {
          hoursWeekOK.push(hora);
        }
      });
      console.log('hoursWeekOK ->', hoursWeekOK);
      return hoursWeekOK;
    }

    hoursSat.forEach((hora) => {
      if (hora >= horaDesde && hora < horaHasta) {
        hoursSatOK.push(hora);
      }
    });
    console.log('hoursSatOK ->', hoursSatOK);
    return hoursSatOK;
  }

  cargarTurnosDisponibles() {
    // Si turnosOcupados está vacío o es null, entonces simplemente generamos todos los turnos disponibles
    if (!this.turnosOcupados || this.turnosOcupados.length === 0) {
      console.log("No hay turnos ocupados. Generando turnos disponibles...");
      
      // Generamos los turnos disponibles con todas las horas en 'fechas'
      this.turnosDisponibles = this.fechas.map((element: any) => {
        // Creamos una copia de la fecha para asegurarnos de no modificar directamente las fechas originales
        const newElement = { ...element };
        
        // Aseguramos que las horas estén disponibles
        newElement.row_date.hours = newElement.row_date.hours.filter((hora: any) => hora !== null);
    
        return newElement;
      });
    
      console.log("Turnos generados:", this.turnosDisponibles);
    
    } else {
      // Si existen turnos ocupados, realizamos la lógica habitual para marcar las horas ocupadas
      console.log("Filtrando turnos ocupados...");
      this.turnosDisponibles = [];
  
      // Aquí recorremos los turnos ocupados para marcar las horas correspondientes
      this.turnosOcupados.forEach((turno: any) => {
        if (
          turno.estado !== ENUM_ESTADO_TURNO.RECHAZADO // Ignoramos los rechazados
        ) {
          for (let index = 0; index < this.fechas.length; index++) {
            const element = this.fechas[index];
            const fechaDis =
              element.row_date.year + '-' + element.row_date.month + '-' + element.row_date.day;
    
            if (turno.fecha === fechaDis) {
              // Marca las horas ocupadas como null solo si el turno no está cancelado
              if (turno.estado !== ENUM_ESTADO_TURNO.CANCELADO) {
                for (let hourIndex = 0; hourIndex < element.row_date.hours.length; hourIndex++) {
                  const item = element.row_date.hours[hourIndex];
                  if (item === turno.hora) {
                    element.row_date.hours[hourIndex] = null;
                  }
                }
              }
            }
            // Agrega la fecha con las horas ocupadas a turnosDisponibles
            this.turnosDisponibles.push(element);
          }
        }
      });
  
      // Elimina duplicados si es necesario
      this.turnosDisponibles = this.turnosDisponibles.filter(
        (item, index, self) =>
          index === self.findIndex((t) => (
            t.row_date.year === item.row_date.year &&
            t.row_date.month === item.row_date.month &&
            t.row_date.day === item.row_date.day
          ))
      );
  
      console.log("Turnos ocupados filtrados:", this.turnosDisponibles);
    }
  
    // Si después de todo no hay turnos disponibles, muestra un mensaje de error
    if (this.turnosDisponibles.length === 0) {
      this.mensajeError = "No hay turnos disponibles para este especialista!";
      console.log(this.mensajeError);
    } else {
      this.mensajeError = '';  // Limpia el mensaje de error si hay turnos disponibles
    }
    
    console.log("Turnos disponibles finales: ", this.turnosDisponibles);
  }

  convertirHoraAMPM(hora: string): string {
    const [hour, minute] = hora.split(':');
    let formattedHour = parseInt(hour);
    let ampm = formattedHour >= 12 ? 'PM' : 'AM';
    
    // Convertir hora de 24 a 12
    formattedHour = formattedHour % 12;
    formattedHour = formattedHour ? formattedHour : 12;  // El 0 debe ser 12
    const formattedMinute = minute;
    
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  }
  
  
  

  // ------------------------------------------------------- registra turno
  registrarTurno() {
    console.log("UsuarioLogueadoMtd", this.authSvc.usuarioLogeado);
  
    this.spinnerShow();
    if (
      this.authSvc.usuarioLogeado &&
      this.especialistaSeleccionado &&
      this.horaElegida
    ) {
      this.turno = new Turno();
      this.turno.id = '';
      this.turno.estado = ENUM_ESTADO_TURNO.PENDIENTE;
      this.turno.especialista = this.especialistaSeleccionado;
      this.turno.especialidad = this.especialidadSeleccionado;

      if (this.authSvc.ITEM_ACCESOS.isAdmin) {
        this.paciente = this.pacienteSeleccionado;
        this.turno.paciente = this.pacienteSeleccionado;
      } else if (this.authSvc.ITEM_ACCESOS.isPaciente) {
        this.paciente = this.authSvc.usuarioLogeado;
        this.turno.paciente = this.paciente;
      }
      this.turno.fecha =
        this.fechaElegida.row_date.year +
        '-' +
        this.fechaElegida.row_date.month +
        '-' +
        this.fechaElegida.row_date.day;

      this.turno.hora = this.horaElegida;

      this.turno.comentariosPaciente = '';
      this.turno.comentariosEspecialista = '';
      this.turno.comentariosAdmin = '';
      this.turno.historiaClinica = new HistoriaClinica();
      this.turno.encuesta = '';
      this.turno.calificacionAtencion = '';
      this.turnoSvc
        .addTurno(this.turno)
        .then((res: any) => {
          this.successOperation = true;
  
          this.setearTurno();
          this.router.navigate(['/mis-turnos-paciente']);
        })
        .catch((error: any) => {
          this.spinnerHide();
          console.error(error);
        });
    }
  }

  setearFechaYHora() {
    this.fechaElegida = null;
    this.horaElegida = '';
  }

  setearTurno() {
    this.spinnerHide();
    this.pacienteSeleccionado = null;
    this.especialistaSeleccionado = null;
    this.especialidadSeleccionado = null;
    this.setearFechaYHora();
  }
}

