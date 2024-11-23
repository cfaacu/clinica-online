import { ChangeDetectorRef, Component } from '@angular/core';
import { EspecialistaService } from '../../services/especialista.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { PacienteService } from '../../services/paciente.service';
import { AdminService } from '../../services/admin.service';
import { TurnoService } from '../../services/turno.service';
import * as XLSX from 'xlsx'; 


@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css'
})
export class AdminUsuariosComponent {
  usuarios: any[] = [];
  isLoading = false;

  constructor(
    private turnoService: TurnoService,
    private especialistaService : EspecialistaService,
    private pacienteService: PacienteService,  // Inyectamos el servicio de Pacientes
    private adminService: AdminService,  // Inyectamos el servicio de Administradores
    public authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef  // Inyectamos ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Obtener todos los usuarios (administradores, pacientes, y especialistas)
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    try {
      this.isLoading = true;

      // Usamos Promise.all() para esperar a que se carguen todos los usuarios de los tres servicios
      const [especialistas, pacientes, administradores] = await Promise.all([
        this.especialistaService.obtenerEspecialistas(),
        this.pacienteService.obtenerPacientes(),
        this.adminService.obtenerAdmins()
      ]);

      // Combinamos los resultados en un solo arreglo
      this.usuarios = [
        ...especialistas.map(user => ({ ...user, tipo: 'especialista' })),
        ...pacientes.map(user => ({ ...user, tipo: 'paciente' })),
        ...administradores.map(user => ({ ...user, tipo: 'administrador' }))
      ];
      
    } catch (error) {
      console.error('Error al cargar los usuarios', error);
    } finally {
      this.isLoading = false;
    }
  }

  async cambiarEstado(usuario: any, habilitar: boolean) {
    try {
      if (habilitar) {
        await this.especialistaService.habilitarCuentaEspecialista(usuario.uid);
        Swal.fire({
          title: 'Éxito',
          text: `Estado del especialista ${usuario.nombre} ${usuario.apellido} cambiado a: habilitado`,
          icon: 'success'
        });
        // Actualizar el estado en el arreglo de usuarios en el componente
        usuario.cuentaHabilitada = true;
      } else {
        await this.especialistaService.inhabilitarCuentaEspecialista(usuario.uid);
        Swal.fire({
          title: 'Éxito',
          text: `Estado del especialista ${usuario.nombre} ${usuario.apellido} cambiado a: inhabilitado`,
          icon: 'success'
        });
        // Actualizar el estado en el arreglo de usuarios en el componente
        usuario.cuentaHabilitada = false;
      }

      // Forzar la actualización de la vista en caso de que Angular no detecte el cambio
      this.cdRef.detectChanges();

    } catch (error) {
      console.error('Error al cambiar estado', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al intentar cambiar el estado del especialista. Por favor, intente nuevamente.',
        icon: 'error'
      });
    }
  }

  // Método para redirigir al formulario de registro para crear un nuevo administrador
  redirectToRegister() {
    this.router.navigate(['/register']);
  }

  async descargarTurnos(usuario: any) {
    try {
      const turnos = await this.turnoService.getTurnosByPaciente(usuario.id);

      if (turnos && turnos.length > 0) {
        const datosTurnos = turnos.map(turno => ({
          Fecha: turno['fecha'],
          Hora: turno['hora'],
          Paciente: turno['paciente'].nombre,
          ComentariosEspecialista: turno['comentariosEspecialista'],
          Especialidad: turno['especialidad']?.nombre, 
          Especialista: `${turno['especialista']?.nombre} ${turno['especialista']?.apellido}`,  
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(datosTurnos);
        XLSX.utils.book_append_sheet(wb, ws, 'Turnos');

        XLSX.writeFile(wb, `${usuario.nombre}_${usuario.apellido}_turnos.xlsx`);
      } else {
        Swal.fire({
          title: 'Sin turnos',
          text: 'Este paciente no tiene turnos registrados.',
          icon: 'info'
        });
      }

    } catch (error) {
      console.error('Error al descargar los turnos', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al intentar descargar los turnos.',
        icon: 'error'
      });
    }
  }
}
