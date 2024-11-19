import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, setDoc } from '@angular/fire/firestore';
import { StorageService } from './storage.service';
import { Administrador } from '../models/administrador';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private firestore: Firestore, private storage : StorageService) { }

  public async altaAdmin(uid : string, admin : Administrador)
  {
    // Subir imagen de perfil del especialista a Firebase Storage (si existe)
    let imagenPerfil: string | undefined;

    if (admin.imagenPerfil) {
      imagenPerfil = await this.storage.subirImagen(admin.imagenPerfil, `administradores/${uid}/imagenPerfil`);
      console.log('imagen perfil',imagenPerfil);
    }

    // Crear referencia al documento en Firestore para el especialista
    const docRef = doc(this.firestore, `administradores/${uid}`);
    
    const adminData = {
      uid,
      ...admin,
      imagenPerfil
    };


    await setDoc(docRef, adminData);
  }

  public async obtenerAdmins() {
    const adminCol = collection(this.firestore, 'administradores');
    const adminSnapshot = await getDocs(adminCol);

    const administradores = adminSnapshot.docs.map(doc => ({
      ...doc.data()
    }));

    return administradores;
  }
}
