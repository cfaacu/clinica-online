import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TurnoService } from '../../services/turno.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent {
  @Input() turno!: any;
  formulario!: FormGroup;
  usuario: any;
  public usuario$: Observable<any>;

  constructor(
    public fv: FormBuilder,
    public auth: AuthService,
    public turnoService: TurnoService,
    public router: Router
  ) {
    this.usuario$ = this.auth.usuario;
    setTimeout(() => {
      this.usuario = this.auth.usuario;
    }, 3000);

    this.formulario = fv.group({
      pregUno: ['', Validators.required],
      pregDos: ['', Validators.required],
      pregTres: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.usuario$ = this.auth.usuario;
  }

  enviar() {
    const pregUno = this.formulario.controls['pregUno'].value;
    const pregDos = this.formulario.controls['pregDos'].value;
    const pregTres = this.formulario.controls['pregTres'].value;

    const encuesta = {
      pregUno: pregUno,
      pregDos: pregDos,
      pregTres: pregTres,
      fecha: new Date().toLocaleDateString(),
    };

    this.turnoService.addEncuesta(this.turno, encuesta).then((res) => {
      this.router.navigate(['/mis-turnos-paciente']);
    });
  }
}
