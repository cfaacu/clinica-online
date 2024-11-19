import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public formulario: FormGroup;
  public spinner = false;

  constructor(
    public adminService: AdminService,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.formulario = formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  async submit() {
    let item = {
      email: this.formulario.controls['email'].value,
      password: this.formulario.controls['password'].value,
    };

    try {
      this.spinnerShow();
      this.authService.singIn(item.email, item.password).then((res) => {
        this.spinnerHide();
        if (this.authService.msjError == '') {
          this.router.navigate(['/home']);
        }
      });
    } catch (error) {
      this.spinnerHide();
    }
  }

  ngOnDestroy(): void {
    this.authService.setearMsjError();
  }

  onAdmin1() {
    this.formulario.controls['email'].setValue('tiltijulti@gufum.com');
    this.formulario.controls['password'].setValue('asd1234');
  }

  onEspecialista1() {
    this.formulario.controls['email'].setValue('diydokerzu@gufum.com');
    this.formulario.controls['password'].setValue('asd1234');
  }

  onEspecialista2() {
    this.formulario.controls['email'].setValue('mimidel759@edectus.com');
    this.formulario.controls['password'].setValue('asd1234');
  }

  onPaciente1() {
    // this.formulario.controls['email'].setValue('ladrunofyu@gufum.com');
    this.formulario.controls['email'].setValue('kilmizedro@gufum.com');

    this.formulario.controls['password'].setValue('asd1234');
  }

  onPaciente2() {
    this.formulario.controls['email'].setValue('fipsurugni@gufum.com');
    this.formulario.controls['password'].setValue('asd1234');
  }

  onPaciente3() {
    this.formulario.controls['email'].setValue('yestigorku@gufum.com');
    this.formulario.controls['password'].setValue('asd1234');
  }

  private spinnerShow() {
    this.spinner = true;
  }

  private spinnerHide() {
    this.spinner = false;
  }
}
