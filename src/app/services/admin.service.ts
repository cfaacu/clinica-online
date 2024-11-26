import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, setDoc } from '@angular/fire/firestore';
import { StorageService } from './storage.service';
import { Administrador } from '../models/administrador';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private firestore: Firestore, private storage : StorageService) { }

  public async altaAdmin(uid : string, admin : Administrador)
  {
    let imagenPerfil: string | undefined;

    if (admin.imagenPerfil) {
      imagenPerfil = await this.storage.subirImagen(admin.imagenPerfil, `administradores/${uid}/imagenPerfil`);
      console.log('imagen perfil',imagenPerfil);
    }

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

  public getCollection(collectionName: string): Observable<any[]> {
    const dbCollection = collection(this.firestore, collectionName); 
    return collectionData(dbCollection, { idField: 'id' }); 
  }

  public async addLogIngreso(email: string): Promise<void> {
    const fecha = new Date();
    const item = {
      email: email,
      fecha: fecha.toLocaleDateString(),
      hora: fecha.toLocaleTimeString(),
    };
  
    const dbCollection = collection(this.firestore, 'logIngresosClinica'); 
    await addDoc(dbCollection, item);
  }
}
