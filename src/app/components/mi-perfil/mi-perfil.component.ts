import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MisHorariosComponent } from "./mis-horarios/mis-horarios.component";
import { HistoriaClinicaComponent } from "./historia-clinica/historia-clinica.component";


@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [MisHorariosComponent, HistoriaClinicaComponent, CommonModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    console.log("luggi",this.authService.usuarioLogeado)
  }
}
