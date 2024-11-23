import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MisHorariosComponent } from "./mis-horarios/mis-horarios.component";
import { HistoriaClinicaComponent } from "./historia-clinica/historia-clinica.component";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, MisHorariosComponent, HistoriaClinicaComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    console.log("luggi",this.authService.usuarioLogeado)
  }
}
