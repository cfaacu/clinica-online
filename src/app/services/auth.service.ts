import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async registrarUsuario(datos: any) {
    const { correo, contraseña, tipoUsuario, ...otrosDatos } = datos;
    try {
      // Crear usuario con correo y contraseña
      const credencialUsuario = await createUserWithEmailAndPassword(this.auth, correo, contraseña);
      const uid = credencialUsuario.user?.uid;

      if (uid) {
        // Crear referencia al documento en Firestore según el tipo de usuario
        const docRef = doc(this.firestore, `${tipoUsuario}/${uid}`);
        await setDoc(docRef, { uid, ...otrosDatos });
      }
      
      alert('Registro exitoso');
    } catch (error) {
      console.error("Error en el registro:", error);
      alert('Error en el registro');
    }
  }
}
