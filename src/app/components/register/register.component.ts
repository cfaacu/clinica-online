import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { EspecialidadesService } from '../../services/especialidades.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formularioRegistro: FormGroup;
  especialidades: string[] = [];
  esPaciente = false;
  esEspecialista = false;
  otraEspecialidadSeleccionada = false;

  constructor(
    private fb: FormBuilder,
    private servicioAuth: AuthService,
    private servicioEspecialidades: EspecialidadesService
  ) {
    this.formularioRegistro = this.fb.group({
      tipoUsuario: ['paciente', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      dni: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      obraSocial: [''],
      imagenesPerfil: [''],
      especialidad: [''],
      nuevaEspecialidad: [''],
      imagenPerfil: ['']
    });
  }

  ngOnInit(): void {
    this.cargarEspecialidades();
    this.cambiarTipoUsuario();
  }

  async cargarEspecialidades() {
    this.especialidades = await this.servicioEspecialidades.obtenerEspecialidades();
  }

  cambiarTipoUsuario() {
    const tipoUsuario = this.formularioRegistro.get('tipoUsuario')?.value;
    this.esPaciente = tipoUsuario === 'paciente';
    this.esEspecialista = tipoUsuario === 'especialista';
    this.otraEspecialidadSeleccionada = false;
    this.formularioRegistro.get('especialidad')?.valueChanges.subscribe(valor => {
      this.otraEspecialidadSeleccionada = valor === 'Otra';
    });
  }

  async alEnviar() {
    if (this.formularioRegistro.valid) {
      const datosFormulario = this.formularioRegistro.value;

      if (this.otraEspecialidadSeleccionada && datosFormulario.nuevaEspecialidad) {
        await this.servicioEspecialidades.agregarEspecialidad(datosFormulario.nuevaEspecialidad);
        datosFormulario.especialidad = datosFormulario.nuevaEspecialidad;
      }

      await this.servicioAuth.registrarUsuario(datosFormulario);
    }
  }
}
