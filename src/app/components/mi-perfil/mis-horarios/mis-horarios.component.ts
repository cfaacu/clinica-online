import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Especialista } from '../../../models/especialista';
import { Horarios } from '../../../models/horarios';
import { EspecialistaService } from '../../../services/especialista.service';
import { AuthService } from '../../../services/auth.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-horarios',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './mis-horarios.component.html',
  styleUrl: './mis-horarios.component.css'
})
export class MisHorariosComponent {
  formulario!: FormGroup;
  @Input() especialistaHorarios!: Especialista;
  especialidad!: string;
  horario!: Horarios;
  horarioAux!: Horarios;
  dia!: string;
  horarios!: any;
  usuario: any;
  horariosUsuario!: any;
  captchaPropio: boolean = false;
  successOperation: boolean = false;
  spinner: boolean;

  constructor(
    public fv: FormBuilder,
    private especialistaService: EspecialistaService,
    private authSvc: AuthService
  ) {
    this.spinner = false;
    this.successOperation = false;
    this.usuario = this.authSvc.usuarioLogeado;

    this.formulario = fv.group({
      lunesHoraDesde: ['', [this.validarMinutos, this.validarHora]],
      lunesHoraHasta: ['', [this.validarMinutos, this.validarHora]],
      martesHoraDesde: ['', [this.validarMinutos, this.validarHora]],
      martesHoraHasta: ['', [this.validarMinutos, this.validarHora]],
      miercolesHoraDesde: ['', [this.validarMinutos, this.validarHora]],
      miercolesHoraHasta: ['', [this.validarMinutos, this.validarHora]],
      juevesHoraDesde: ['', [this.validarMinutos, this.validarHora]],
      juevesHoraHasta: ['', [this.validarMinutos, this.validarHora]],
      viernesHoraDesde: ['', [this.validarMinutos, this.validarHora]],
      viernesHoraHasta: ['', [this.validarMinutos, this.validarHora]],
      sabadoHoraDesde: ['', [this.validarMinutos, this.validarSabadoHora]],
      sabadoHoraHasta: ['', [this.validarMinutos, this.validarSabadoHora]],
    });

    console.log(this.usuario.horarios);
    this.setearHorarios();
  }

  setearHorarios() {
    if (this.usuario.horarios != null) {
      const horarios = this.usuario.horarios;
      this.formulario.controls['lunesHoraDesde'].setValue(
        horarios.horarioLunes[0].desde
      );
      this.formulario.controls['lunesHoraHasta'].setValue(
        horarios.horarioLunes[0].hasta
      );
      this.formulario.controls['martesHoraDesde'].setValue(
        horarios.horarioMartes[0].desde
      );
      this.formulario.controls['martesHoraHasta'].setValue(
        horarios.horarioMartes[0].hasta
      );
      this.formulario.controls['miercolesHoraDesde'].setValue(
        horarios.horarioMiercoles[0].desde
      );
      this.formulario.controls['miercolesHoraHasta'].setValue(
        horarios.horarioMiercoles[0].hasta
      );
      this.formulario.controls['juevesHoraDesde'].setValue(
        horarios.horarioJueves[0].desde
      );
      this.formulario.controls['juevesHoraHasta'].setValue(
        horarios.horarioJueves[0].hasta
      );
      this.formulario.controls['viernesHoraDesde'].setValue(
        horarios.horarioViernes[0].desde
      );
      this.formulario.controls['viernesHoraHasta'].setValue(
        horarios.horarioViernes[0].hasta
      );
      this.formulario.controls['sabadoHoraDesde'].setValue(
        horarios.horarioSabado[0].desde
      );
      this.formulario.controls['sabadoHoraHasta'].setValue(
        horarios.horarioSabado[0].hasta
      );
    } else {
      this.formulario.reset();
    }
  }

  ngOnInit(): void {
  }

  private spinnerShow() {
    this.spinner = true;
  }

  private spinnerHide() {
    this.spinner = false;
  }

  cargarTurnos() {
    this.horarios
      .snapshotChanges()
      .pipe(
        map((data: any) => {
          this.horariosUsuario = new Array<Horarios>();
          data.map((item: any) => {
            if (item.payload.doc.data().idEspecialista == this.usuario.id) {
              const horario: Horarios = {
                idEspecialista: item.payload.doc.data().idEspecialista,
                emailEspecialista: item.payload.doc.data().emailEspecialista,
                especialidad: item.payload.doc.data().especialidad, 
                horarioLunes: item.payload.doc.data().horarioLunes,
                horarioMartes: item.payload.doc.data().horarioMartes,
                horarioMiercoles: item.payload.doc.data().horarioMiercoles,
                horarioJueves: item.payload.doc.data().horarioJueves,
                horarioViernes: item.payload.doc.data().horarioViernes,
                horarioSabado: item.payload.doc.data().horarioSabado,
              };
  
              this.horariosUsuario.push(horario);
            }
          });
        })
      )
      .subscribe();
  
    console.log(this.horariosUsuario);
  }
  

  validarMinutos(control: AbstractControl) {
    const nombre = control.value;
    if (nombre != '' && nombre != null) {
      var minutos = nombre.split(':')[1];
      var minCero = minutos.includes('00');
      var minTreinta = minutos.includes('30');

      if (minCero) {
        return null;
      }

      if (minTreinta) {
        return null;
      }

      if (!minCero && !minTreinta) return { minValido: true };
    }
    return null;
  }

  validarHora(control: AbstractControl) {
    const nombre = control.value;
    if (nombre != '' && nombre != null) {
      var hora = nombre.split(':')[0];
      if (hora < 8 || hora > 19) {
        return { horaValido: true };
      }
    }
    return null;
  }

  validarSabadoHora(control: AbstractControl) {
    const nombre = control.value;
    if (nombre != '' && nombre != null) {
      var hora = nombre.split(':')[0];
      if (hora < 8 || hora > 14) {
        return { horaValido: true };
      }
    }
    return null;
  }

  registrar() {
    this.spinnerShow();
    console.log("usuario horarios",this.usuario);
  
    this.horario = {
      idEspecialista: this.usuario.uid,
      emailEspecialista: this.usuario.email,
      especialidad: this.usuario.especialidades[0],
      horarioLunes: [
        {
          desde: this.formulario.controls['lunesHoraDesde'].value,
          hasta: this.formulario.controls['lunesHoraHasta'].value,
        },
      ],
      horarioMartes: [
        {
          desde: this.formulario.controls['martesHoraDesde'].value,
          hasta: this.formulario.controls['martesHoraHasta'].value,
        },
      ],
      horarioMiercoles: [
        {
          desde: this.formulario.controls['miercolesHoraDesde'].value,
          hasta: this.formulario.controls['miercolesHoraHasta'].value,
        },
      ],
      horarioJueves: [
        {
          desde: this.formulario.controls['juevesHoraDesde'].value,
          hasta: this.formulario.controls['juevesHoraHasta'].value,
        },
      ],
      horarioViernes: [
        {
          desde: this.formulario.controls['viernesHoraDesde'].value,
          hasta: this.formulario.controls['viernesHoraHasta'].value,
        },
      ],
      horarioSabado: [
        {
          desde: this.formulario.controls['sabadoHoraDesde'].value,
          hasta: this.formulario.controls['sabadoHoraHasta'].value,
        },
      ],
    };
  
    this.horariosUsuario = this.horario;
    this.usuario.horarios = this.horariosUsuario;
  
    this.especialistaService.updateHorarios(this.usuario).then((res: any) => {
      console.log(res);
      setTimeout(() => {
        this.spinnerHide();
        this.successOperation = true;
        setTimeout(() => {
          location.reload();
        }, 1000);
      }, 2000);
    });
  }
  
}
