import { Injectable } from '@angular/core';
import { addDoc, collection, CollectionReference, Firestore, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  private especialidadesRef: CollectionReference;

  constructor(private firestore: Firestore) {
    this.especialidadesRef = collection(this.firestore, 'especialidades');
  }

  async obtenerEspecialidades(): Promise<string[]> {
    try {
      const snapshot = await getDocs(this.especialidadesRef);
      return snapshot.docs.map(doc => doc.data()['nombre']);
    } catch (error) {
      console.error('Error obteniendo especialidades:', error);
      return [];
    }
  }

  async agregarEspecialidad(nuevaEspecialidad: string): Promise<void> {
    const especialidadQuery = query(this.especialidadesRef, where('nombre', '==', nuevaEspecialidad));
    const snapshot = await getDocs(especialidadQuery);

    if (snapshot.empty) {
      try {
        await addDoc(this.especialidadesRef, { nombre: nuevaEspecialidad });
        console.log('Especialidad agregada:', nuevaEspecialidad);
      } catch (error) {
        console.error('Error al agregar especialidad:', error);
      }
    }
  }
}
