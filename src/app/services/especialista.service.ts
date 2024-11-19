import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { StorageService } from './storage.service';
import { Especialista } from '../models/especialista';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  constructor(private firestore: Firestore, private storage : StorageService) { }

  public async altaEspecialista(uid : string, especialista : Especialista)
  {
    // Subir imagen de perfil del especialista a Firebase Storage (si existe)
    let imagenPerfil: string | undefined;

    if (especialista.imagenPerfil) {
      imagenPerfil = await this.storage.subirImagen(especialista.imagenPerfil, `especialistas/${uid}/imagenPerfil`);
    }

    // Crear referencia al documento en Firestore para el especialista
    const docRef = doc(this.firestore, `especialistas/${uid}`);
    
    const especialistaData = {
      uid,
      ...especialista,
      imagenPerfil
    };
    delete especialistaData.imagenPerfil;


    await setDoc(docRef, especialistaData);
  }

  public async obtenerEspecialistas() {
    const especialistasCol = collection(this.firestore, 'especialistas');
    const especialistasSnapshot = await getDocs(especialistasCol);

    const especialistas = especialistasSnapshot.docs.map(doc => ({
      ...doc.data()
    }));

    return especialistas;
  }

  public async habilitarCuentaEspecialista(uid: string) {
    await this.actualizarEstadoCuenta(uid, true);
  }

  public async inhabilitarCuentaEspecialista(uid: string) {
    await this.actualizarEstadoCuenta(uid, false);
  }

  private async actualizarEstadoCuenta(uid: string, estado: boolean) {
    const docRef = doc(this.firestore, `especialistas/${uid}`);
    
    await updateDoc(docRef, {
      cuentaHabilitada: estado
    });
  }

  public getAllTwo(): Observable<Especialista[]> {
    const especialistasCollection = collection(this.firestore, 'especialistas');
    
    // Realizar la consulta para obtener todos los documentos en esa colección
    const especialistasQuery = query(especialistasCollection);
    
    return from(
      getDocs(especialistasQuery).then((querySnapshot) => {
        const especialistas: Especialista[] = [];
        querySnapshot.forEach((doc) => {
          especialistas.push(doc.data() as Especialista);
        });
        return especialistas;
      })
      .catch((error) => {
        console.error('Error al obtener los especialistas:', error);
        throw error;
      })
    );
  }

  public async updateHorarios(usuario: Especialista) {
    console.log('update Horarios Especialista');
    console.log(usuario);
    console.log(usuario.horarios);

    const usuarioDocRef = doc(this.firestore, `especialistas/${usuario.uid}`);

    try {
      await updateDoc(usuarioDocRef, { horarios: { ...usuario.horarios } });

      console.log('Horarios actualizados exitosamente');
    } catch (error) {
      console.error('Error al actualizar los horarios:', error);
    }
  }
}
