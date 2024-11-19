import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, query, setDoc } from '@angular/fire/firestore';
import { StorageService } from './storage.service';
import { Paciente } from '../models/paciente';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  constructor(private firestore: Firestore, private storage : StorageService) { }

  public async altaPaciente(uid : string, paciente : Paciente)
  {
    const urlsImagenes: { imagen1Url?: string; imagen2Url?: string } = {};

    if (paciente.imagen1) {
      urlsImagenes.imagen1Url = await this.storage.subirImagen(paciente.imagen1, `pacientes/${uid}/imagen1`);
    }
    if (paciente.imagen2) {
      urlsImagenes.imagen2Url = await this.storage.subirImagen(paciente.imagen2, `pacientes/${uid}/imagen2`);
    }

    const docRef = doc(this.firestore, `pacientes/${uid}`);
    
    const pacienteData = {
      uid,
      ...paciente,
      urlsImagenes
    };
    delete pacienteData.imagen1;
    delete pacienteData.imagen2;

    await setDoc(docRef, pacienteData);
    alert('Registro de paciente exitoso');
  }

  public async obtenerPacientes() {
    const pacientesCol = collection(this.firestore, 'pacientes');
    const pacientesSnapshot = await getDocs(pacientesCol);

    const pacientes = pacientesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return pacientes;
  }
  
  public getAllTwo(): Observable<any[]> {
    const pacienteRef = collection(this.firestore,'pacientes');
    const pacienteQuery = query(pacienteRef);

    return from(
      getDocs(pacienteQuery)
        .then((snapshot) => {
          const especialistas: any[] = [];
          snapshot.forEach(doc => {
            especialistas.push(doc.data());
          });
          return especialistas;
        })
        .catch((error) => {
          console.error('Error al obtener los especialistas:', error);
          throw error;
        })
    );
  }
}
