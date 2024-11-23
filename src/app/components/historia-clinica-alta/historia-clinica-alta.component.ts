import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TurnoService } from '../../services/turno.service';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { HistoriaClinica } from '../../models/historia-clinica';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historia-clinica-alta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './historia-clinica-alta.component.html',
  styleUrl: './historia-clinica-alta.component.css'
})
export class HistoriaClinicaAltaComponent {
  @Input() turno: any;
  formulario: FormGroup;
  @Input() TurnoAMostrar: any = '';

  constructor(
    public fb: FormBuilder,
    public routeActivate: ActivatedRoute,
    public historiaClinicaService: HistoriaClinicaService,
    public route: Router,
    private turnoSvc: TurnoService
  ) {
    this.formulario = fb.group({
      Altura: ['', Validators.required],
      Peso: ['', Validators.required],
      Temperatura: ['', [Validators.required, Validators.min(34), Validators.max(45)]],
      Presion: ['', [Validators.required]],
      Clave1: [''],
      Valor1: [''],
      Clave2: [''],
      Valor2: [''],
      Clave3: [''],
      Valor3: [''],
    });
  }

  ngOnInit(): void {
    // Si el turno tiene un ID de historia clínica asociado, asignamos ese ID
    if (this.turno && this.turno.historiaClinicaId) {
      // Asumimos que 'historiaClinicaId' es un campo en 'turno' que contiene el ID de la historia
      this.TurnoAMostrar.id = this.turno.historiaClinicaId;
    }
  }

  aceptar() {
    // Creamos una nueva instancia de HistoriaClinica
    var historia = new HistoriaClinica();
    
    // Asignamos los valores del formulario
    historia.altura = this.formulario.controls['Altura'].value;
    historia.peso = this.formulario.controls['Peso'].value;
    historia.temperatura = this.formulario.controls['Temperatura'].value;
    historia.presion = this.formulario.controls['Presion'].value;
    historia.clave1 = this.formulario.controls['Clave1'].value;
    historia.valor1 = this.formulario.controls['Valor1'].value;
    historia.clave2 = this.formulario.controls['Clave2'].value;
    historia.valor2 = this.formulario.controls['Valor2'].value;
    historia.clave3 = this.formulario.controls['Clave3'].value;
    historia.valor3 = this.formulario.controls['Valor3'].value;
  
    this.turnoSvc.updateTurnoHistoriaClinica(historia, this.turno.id).then(() => {
    }).catch((error) => {
      console.error('Error actualizando la historia clínica: ', error);
    });

    this.historiaClinicaService.addHistoriaClinica(historia).then(() => {
      this.formulario.reset();
      this.route.navigate(['/mis-pacientes']);
    }).catch((error) => {
      console.error('Error al agregar la historia clínica: ', error);
    });
  }
  
}
