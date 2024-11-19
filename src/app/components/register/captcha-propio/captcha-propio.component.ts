import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-captcha-propio',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './captcha-propio.component.html',
  styleUrl: './captcha-propio.component.css'
})
export class CaptchaPropioComponent {
  captchaText!: string;
  userInput: string = '';
  captchaValido: boolean | undefined = undefined;
  captchaImage!: string;

  constructor() {
    this.generarCaptcha();
  }

  // Generar una cadena aleatoria de letras y números
  generarCaptcha() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaText = '';
    for (let i = 0; i < 6; i++) {
      this.captchaText += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    // Aquí creas una imagen dinámica, aunque este es solo un ejemplo básico. Puedes usar una librería o crear una canvas.
    this.captchaImage = `data:image/svg+xml;base64,${btoa(this.crearImagenCaptcha(this.captchaText))}`;
  }

  // Crear una imagen en formato SVG (puedes crearla de manera más compleja si lo prefieres)
  crearImagenCaptcha(texto: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50">
              <rect width="100%" height="100%" fill="lightgray"/>
              <text x="50%" y="50%" font-size="24" text-anchor="middle" fill="black" dy=".3em">${texto}</text>
            </svg>`;
  }

  // Validar la entrada del usuario
  validarCaptcha() {
    if (this.userInput === this.captchaText) {
      this.captchaValido = true;
      this.enviarResultado();  // Emitir el resultado al padre
    } else {
      this.captchaValido = false;
      this.generarCaptcha();  // Regeneramos un nuevo captcha si la respuesta es incorrecta
    }
  }
  

  @Output() captchaValidado = new EventEmitter<boolean>();

  // Emitir el resultado al componente padre
  enviarResultado() {
    this.captchaValidado.emit(this.captchaValido);
  }
}
