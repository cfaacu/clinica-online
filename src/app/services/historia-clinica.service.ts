import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { HistoriaClinica } from '../models/historia-clinica';
import { Router } from '@angular/router';
import { addDoc, collection, doc, DocumentReference, Firestore, getDoc, getDocs, query, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {
  private historiasCollection;
  historias: Observable<HistoriaClinica[]>;

  constructor(public router: Router, private firestore: Firestore) {
    this.historiasCollection = collection(this.firestore, 'historiaClinica');
    this.historias = this.getHistorias();
  }

  // Método para obtener todas las historias clínicas
  getHistorias(): Observable<HistoriaClinica[]> {
    const q = query(this.historiasCollection);
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map(doc => {
          const data = doc.data() as HistoriaClinica;
          data.id = doc.id; 
          return data;
        });
      })
    );
  }

  async addHistoriaClinica(historia: HistoriaClinica): Promise<DocumentReference> {
    // Creamos una copia del objeto 'historia' eliminando las propiedades no necesarias
    const historiaData = { ...historia };
    
    // Si HistoriaClinica tiene propiedades que no son válidas en Firestore, eliminarlas
    delete historiaData.id;  // No necesitamos el id al agregar el documento
    // Aquí podrías añadir otras eliminaciones de propiedades si es necesario
  
    // Usamos addDoc para agregar un nuevo documento con el objeto limpio
    const docRef = await addDoc(this.historiasCollection, historiaData);
    return docRef;
  }
  

  // Método para actualizar una historia clínica, aplanando el objeto
  async updateHistoriaClinica(historia: HistoriaClinica): Promise<void> {
    const historiaRef = doc(this.firestore, `historiaClinica/${historia.id}`);
    
    // Aplanamos la historia antes de actualizarla
    const historiaData = {
      altura: historia.altura,
      peso: historia.peso,
      temperatura: historia.temperatura,
      presion: historia.presion,
      clave1: historia.clave1,
      valor1: historia.valor1,
      clave2: historia.clave2,
      valor2: historia.valor2,
      clave3: historia.clave3,
      valor3: historia.valor3,
      clave4: historia.clave4,
      valor4: historia.valor4,
      clave5: historia.clave5,
      valor5: historia.valor5,
      clave6: historia.clave6,
      valor6: historia.valor6
    };

    // Usamos updateDoc con el objeto plano
    await updateDoc(historiaRef, historiaData);
  }

  getHistoriaById(id: string): Observable<HistoriaClinica | undefined> {
    const historiaDocRef = doc(this.firestore, 'historiaClinica', id);
  
    return from(getDoc(historiaDocRef)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const historia = docSnapshot.data() as HistoriaClinica;
          historia.id = docSnapshot.id;
          return historia;
        } else {
          return undefined;
        }
      })
    );
  }
}
