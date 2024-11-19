import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-historia-clinica-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia-clinica-detalle.component.html',
  styleUrl: './historia-clinica-detalle.component.css'
})
export class HistoriaClinicaDetalleComponent {
  @Input() turnoDetalle!: any;

  constructor() {}

  ngOnInit(): void {}
}
