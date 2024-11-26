import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { EspecialistaService } from '../../services/especialista.service';
import { GrowOnHoverDirective } from '../../directives/grow-on-hover.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GrowOnHoverDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(public authService: AuthService, public router: Router, public especialistaService: EspecialistaService) {
  }

  ngOnInit(): void {

  }

  goIniciarSesion() {
    this.router.navigate(['/login']);
  }

  goRegistrarme() {
    this.router.navigate(['/register']);
  }
}
