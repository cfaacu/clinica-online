import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from '@angular/fire/auth';
import { PacienteService } from './paciente.service';
import { EspecialistaService } from './especialista.service';
import { Paciente } from '../models/paciente';
import { Especialista } from '../models/especialista';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';
import { Administrador } from '../models/administrador';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public usuarioLogeado: any;
  public usuario: any;
  public msjError: string = '';

  public ITEM_ACCESOS: any;

  private usuarioSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null); 
  public usuario$: Observable<any> = this.usuarioSubject.asObservable();

  constructor(
    private auth: Auth,
    private pacienteService: PacienteService,
    private especialistaService: EspecialistaService,
    private router: Router,
    private adminService: AdminService) {

    this.setearUsuarioYAccesos();

    const user = this.auth.currentUser;
    if (user != null) {
      this.usuario = {
        id: user.uid,
        email: user.email,
        emailVerificado: user.emailVerified,
      };
      this.getIsAdmin(user.email ?? '');
      this.getIsEspecialista(user.email ?? '');
      this.getIsPaciente(user.email ?? '');
    }
  }

  // Método para asignar el usuario y emitirlo a través del BehaviorSubject
  private setearUsuario(usuario: any) {
    this.usuarioSubject.next(usuario); // Emitimos el nuevo valor del usuario
  }

  // Métodos de registro para Paciente, Especialista y Administrador
  async registrarPaciente(paciente: Paciente) {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, paciente.email, paciente.password);
      const uid = user?.uid;
      await this.sendVerifcationEmail(user);
      if (uid) {
        this.pacienteService.altaPaciente(uid, paciente);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro de paciente exitoso',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(["/login"]);
        });
      }
    } catch (error) {
      console.error("Error en el registro del paciente:", error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error en el registro del paciente',
        showConfirmButton: true
      });
    }
  }

  async registrarEspecialista(especialista: Especialista) {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, especialista.email, especialista.password);
      const uid = user?.uid;
      await this.sendVerifcationEmail(user);
      if (uid) {
        this.especialistaService.altaEspecialista(uid, especialista);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro de especialista exitoso',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(["/login"]);
        });
      }
    } catch (error) {
      console.error("Error en el registro del especialista:", error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error en el registro del especialista',
        showConfirmButton: true
      });
    }
  }

  async registrarAdministrador(admin: Administrador) {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, admin.email, admin.password);
      const uid = user?.uid;
      await this.sendVerifcationEmail(user);
      if (uid) {
        this.adminService.altaAdmin(uid, admin);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro de administrador exitoso',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(["/login"]);
        });
      }
    } catch (error) {
      console.error("Error en el registro del administrador:", error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error en el registro del administrador',
        showConfirmButton: true
      });
    }
  }

  // Restablece el usuario y accesos
  public setearUsuarioYAccesos() {
    this.usuario = null;
    this.setearItemAccesos();
    this.setearUsuarioLogeado(null);
    this.setearUsuario(null); // Emitimos un valor null para resetear el usuario
  }

  // Actualizamos el usuario logeado
  public setearUsuarioLogeado(item: any) {
    this.usuarioLogeado = item;
  }

  // Restablece los accesos
  public setearItemAccesos() {
    this.ITEM_ACCESOS = {
      cuentaHabilitada: false,
      isAdmin: false,
      isPaciente: false,
      isEspecialista: false,
    };
    console.log('setearItemAccesos');
  }

  // Consultar si el usuario es un especialista
  public async getIsEspecialista(email: string) {
    if (email != '') {
      this.especialistaService.obtenerEspecialistas().then((lista: any) => {
        lista.forEach((item: any) => {
          if (item.email == email) {
            this.ITEM_ACCESOS.isEspecialista = true;
            this.ITEM_ACCESOS.cuentaHabilitada = item.cuentaHabilitada;
            this.setearUsuarioLogeado(item);
            console.log('Es Especialista', this.ITEM_ACCESOS);
            console.log('item Especialista', item);
            this.setearUsuario(item); // Emitimos el valor del especialista
          }
        });
      });
    }
  }

  // Consultar si el usuario es un paciente
  public async getIsPaciente(email: string) {
    if (email != '') {
      this.pacienteService.obtenerPacientes().then((lista: any) => {
        lista.forEach((item: any) => {
          if (item.email == email) {
            this.ITEM_ACCESOS.isPaciente = true;
            this.ITEM_ACCESOS.cuentaHabilitada = item.cuentaHabilitada;
            this.setearUsuarioLogeado(item);
            console.log('Es Paciente', this.ITEM_ACCESOS);
            console.log('item Paciente', item);
            this.setearUsuario(item); // Emitimos el valor del paciente
          }
        });
      });
    }
  }

  // Consultar si el usuario es un administrador
  public async getIsAdmin(email: string) {
    if (email != '') {
      this.adminService.obtenerAdmins().then((lista: any) => {
        lista.forEach((item: any) => {
          if (item.email == email) {
            this.ITEM_ACCESOS.isAdmin = true;
            this.ITEM_ACCESOS.cuentaHabilitada = item.cuentaHabilitada;
            this.setearUsuarioLogeado(item);
            console.log('Es Admin', this.ITEM_ACCESOS);
            console.log('item Admin', item);
            this.setearUsuario(item); // Emitimos el valor del administrador
          }
        });
      });
    }
  }

  // Login
  async singIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.msjError = '';
      console.log(result);
  
      if (result.user) {
        // Verificamos si el correo está verificado
        if (!result.user.emailVerified) {
          // Si no está verificado, no permitimos el login
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Por favor, verifica tu correo antes de iniciar sesión.',
            showConfirmButton: true,
          });
          return; // Salimos del flujo si el correo no está verificado
        }
  
        // Si el correo está verificado, asignamos el usuario y sus accesos
        this.usuario = {
          id: result.user.uid,
          email: result.user.email,
          emailVerificado: result.user.emailVerified,
        };
  
        // Llamamos a los servicios para obtener el tipo de usuario (admin, especialista, paciente)
        await this.getIsAdmin(this.usuario.email);
        await this.getIsEspecialista(this.usuario.email);
        await this.getIsPaciente(this.usuario.email);
  
        // Si todo es correcto, se redirige a la página principal
        this.router.navigate(["/home"]).then(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Ingreso exitoso',
          });
        });
      }
    } catch (e : any) {
      this.setearUsuarioYAccesos();
      this.msjError = this.getError(e.code);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: "Datos inválidos",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  // Logout
  logout() {
    this.setearUsuarioYAccesos();
    return this.auth.signOut();
  }

  // Método para obtener errores
  private getError(msj: string): string {
    console.log('getError ->', msj);
    switch (msj) {
      case 'auth/user-not-found':
        return 'No existe ningún registro de usuario que corresponda al correo electrónico indicado.';
      case 'auth/email-already-in-use':
        return 'Otro usuario ya está utilizando el correo electrónico indicado.';
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es correcto.';
      case 'auth/invalid-password':
        return 'El valor que se proporcionó para la contraseña no es válido. Debe contener al menos seis caracteres.';
      case 'auth/invalid-phone-number':
        return 'El valor que se proporcionó para el número de celular no es válido. Debe no estar vacío y que cumpla con el estándar E.164.';
      case 'auth/wrong-password':
        return 'La contraseña no es válida.';
      case 'auth/email-already-in-use':
        return 'La dirección de correo electrónico ya está en uso por otra cuenta.';
    }
    return 'Ocurrió un error.';
  }

  // Restablecer el mensaje de error
  public setearMsjError() {
    this.msjError = '';
  }

  async sendVerifcationEmail(
    user: any = this.auth.currentUser
  ): Promise<void> {
    try {
      console.log('sendVerifcationEmail', user);
      const r = sendEmailVerification(await user);
      console.log(r);
      return r;
    } catch (error: any) {
      console.log('Error->', error);
      this.msjError = this.getError(error);
    }
  }
}
