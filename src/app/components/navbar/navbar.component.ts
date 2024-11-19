import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public usuario$: Observable<any>;
  
  constructor(public authService: AuthService, public router: Router) {
    this.usuario$ = this.authService.usuario;
  }

  ngOnInit(): void {
    this.usuario$ = this.authService.usuario;
  }

  onLogout() {
    this.authService.logout().then((res) => {
      this.router.navigate(['/login']);
    });
  }

  goInicio() {
    this.router.navigate(['/home']);
  }

  goIniciarSesion() {
    this.router.navigate(['/login']);
  }

  goRegistrarme() {
    this.router.navigate(['/register']);
  }
  
  onMiPerfil() {
    this.router.navigate(['/mi-perfil']);
  }

  goSolicitarTurnos() {
    this.router.navigate(['/solicitar-turno']);
  }

  goVerTurnos() {
    this.router.navigate(['/mis-turnos-paciente']);
  }

  onEstadisticas() {
    this.router.navigate(['/administracion/estadisticas']);
  }

  goMisTurnosPaciente() {
    this.router.navigate(['/mis-turnos-paciente']);
  }

  goMisTurnosEspecialista() {
    this.router.navigate(['/mis-turnos-especialista']);
  }

  goMisPacientes() {
    this.router.navigate(['/mis-pacientes']);
  }

  goAdmin() {
    this.router.navigate(['/admin']);
  }
}
