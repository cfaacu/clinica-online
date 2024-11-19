import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { EspecialidadesService } from '../../services/especialidades.service';
import { TablaEspecialidadesComponent } from "./table/tabla-especialidades/tabla-especialidades.component";
import { Paciente } from '../../models/paciente';
import { Especialista } from '../../models/especialista';
import { Administrador } from '../../models/administrador';
import { CaptchaPropioComponent } from "./captcha-propio/captcha-propio.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaEspecialidadesComponent, CaptchaPropioComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formularioRegistro: FormGroup;
  tipoSeleccionado: string | null = null;
  esPaciente = false;
  esEspecialista = false;
  esAdmin = false;
  especialidades: string[] = [];
  especialidadesSeleccionadas: string[] = [];

  // Propiedades específicas para las imágenes
  imagenPaciente1: File | null = null;
  imagenPaciente2: File | null = null;
  imagenEspecialista: File | null = null;
  imagenAdmin: File | null = null;

  captchaValidado: boolean = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private especialidadesService: EspecialidadesService
  ) {
    this.formularioRegistro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(22)]],
      dni: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
      obraSocial: [''],
    });
  }

  ngOnInit(): void {
    this.obtenerEspecialidades();
    console.log(this.authService.ITEM_ACCESOS);
    console.log(this.authService.usuario);
  }

  handleCaptchaValidado(valido: boolean) {
    this.captchaValidado = valido;
  }
  
  // Método para seleccionar tipo de usuario
  seleccionarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.esPaciente = tipo === 'paciente';
    this.esEspecialista = tipo === 'especialista';
    this.esAdmin = tipo === 'administrador';

    // Deshabilitar campo 'obraSocial' para el especialista
    if (this.esEspecialista) {
      this.formularioRegistro.get('obraSocial')?.disable();
    } else {
      this.formularioRegistro.get('obraSocial')?.enable();
    }
  }

  async obtenerEspecialidades() {
    this.especialidades = await this.especialidadesService.obtenerEspecialidades();
  }

  actualizarEspecialidades(seleccionadas: string[]) {
    this.especialidadesSeleccionadas = seleccionadas;
  }

  // Método para manejar el cambio de archivo (captura de imágenes)
  onFileChange(event: any, campo: string) {
    const file = event.target.files[0];
    if (file) {
      // Asignamos el archivo a la propiedad correspondiente dependiendo del campo
      if (campo === 'imagenPaciente1') {
        this.imagenPaciente1 = file;
      } else if (campo === 'imagenPaciente2') {
        this.imagenPaciente2 = file;
      } else if (campo === 'imagenEspecialista') {
        this.imagenEspecialista = file;
      } else if (campo === 'imagenAdmin') {
        this.imagenAdmin = file;
      }
    }
  }



  async alEnviar() {
    if (this.formularioRegistro.invalid || !this.captchaValidado) {
      return; 
    }


    // Preparamos los datos del formulario y continuamos con el registro...
    try {
      if (this.esEspecialista) {
        const especialista: Especialista = {
          nombre: this.formularioRegistro.value.nombre,
          apellido: this.formularioRegistro.value.apellido,
          edad: this.formularioRegistro.value.edad,
          dni: this.formularioRegistro.value.dni,
          especialidades: this.especialidadesSeleccionadas.length > 0 ? this.especialidadesSeleccionadas : null,
          email: this.formularioRegistro.value.correo,
          cuentaHabilitada: false,
          password: this.formularioRegistro.value.contraseña,
          imagenPerfil: this.imagenEspecialista,
          horarios: null
        };
        await this.authService.registrarEspecialista(especialista);
      } else if (this.esPaciente) {
        const paciente: Paciente = {
          nombre: this.formularioRegistro.value.nombre,
          apellido: this.formularioRegistro.value.apellido,
          edad: this.formularioRegistro.value.edad,
          dni: this.formularioRegistro.value.dni,
          obraSocial: this.formularioRegistro.value.obraSocial,
          email: this.formularioRegistro.value.correo,
          password: this.formularioRegistro.value.contraseña,
          imagen1: this.imagenPaciente1,
          imagen2: this.imagenPaciente2
        };
        await this.authService.registrarPaciente(paciente);
      } else if (this.esAdmin) {
        const administrador: Administrador = {
          nombre: this.formularioRegistro.value.nombre,
          apellido: this.formularioRegistro.value.apellido,
          edad: this.formularioRegistro.value.edad,
          dni: this.formularioRegistro.value.dni,
          email: this.formularioRegistro.value.correo,
          password: this.formularioRegistro.value.contraseña,
          imagenPerfil: this.imagenAdmin
        };
        await this.authService.registrarAdministrador(administrador);
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  }
}
