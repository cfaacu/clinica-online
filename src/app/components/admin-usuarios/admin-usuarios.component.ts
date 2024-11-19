import { Component } from '@angular/core';
import { EspecialistaService } from '../../services/especialista.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    private especialistaService: EspecialistaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario es administrador
    // if (!this.authService.ITEM_ACCESOS.isAdmin) {
    //   this.router.navigate(['/login']); // Redirigir si no es admin
    //   return;
    // }

    // Obtener los especialistas registrados
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    try {
      this.isLoading = true;
      this.usuarios = await this.especialistaService.obtenerEspecialistas();
    } catch (error) {
      console.error('Error al cargar los usuarios', error);
    } finally {
      this.isLoading = false;
    }
  }

  async cambiarEstado(usuario: any, estado: boolean) {
    try {
      if (estado) {
        await this.especialistaService.habilitarCuentaEspecialista(usuario.uid);
        alert(`Estado del especialista ${usuario.nombre} ${usuario.apellido} cambiado a: habilitado`);
      } else {
        await this.especialistaService.inhabilitarCuentaEspecialista(usuario.uid);
        alert(`Estado del especialista ${usuario.nombre} ${usuario.apellido} cambiado a: inhabilitado`);
      }
    } catch (error) {
      console.error('Error al cambiar estado', error);
      alert('Hubo un error al intentar cambiar el estado del especialista. Por favor, intente nuevamente.');
    }
  }

  // Método para redirigir al formulario de registro para crear un nuevo administrador
  redirectToRegister() {
    this.router.navigate(['/register']);
  }
}
