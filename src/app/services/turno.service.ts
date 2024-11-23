import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { addDoc, collection, doc, DocumentReference, Firestore, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Turno } from '../models/turno';
import { from, map, Observable } from 'rxjs';
import { HistoriaClinica } from '../models/historia-clinica';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  dbPath: string = 'turnos';
  turnos: Turno[] = [];

  turnosCollection!: AngularFirestoreCollection;
  turnosObs!: Observable<Turno[]>;
  turnosPorEspecialidad: Array<any> = [];
  cantTurnosPorEspecialidad: any;
  constructor(public firestore: Firestore) {
    this.cargarCollection();
  }

  // Cargar colección de turnos
  async cargarCollection() {
    const turnosRef = collection(this.firestore, this.dbPath);
    const q = query(turnosRef, orderBy('fecha'));

    const querySnapshot = await getDocs(q);

    this.turnos = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Turno;
      data.id = doc.id;
      return data;
    });
  }

  getTurnos(): Observable<Turno[]> {
    // Esta implementación usa Firestore directamente, por lo que necesitas acceder a las colecciones y observar cambios
    const turnosRef = collection(this.firestore, this.dbPath);
    const q = query(turnosRef, orderBy('fecha'));
    
    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as Turno;
          data.id = doc.id;
          return data;
        })
      )
    );
  }

  // Método para actualizar el ID en Firestore
  public updateID(id: string) {
    const turnoRef = doc(this.firestore, `${this.dbPath}/${id}`);
    return updateDoc(turnoRef, { id });
  }

  // Método para agregar un turno
  async addTurno(turno: any): Promise<DocumentReference> {
    const turnoRef = collection(this.firestore, this.dbPath);
    const object = {
      id: '',
      estado: turno.estado,
      paciente: turno.paciente,
      especialista: turno.especialista,
      especialidad: turno.especialidad,
      fecha: turno.fecha,
      hora: turno.hora,
      comentariosPaciente: turno.comentariosPaciente,
      comentariosEspecialista: turno.comentariosEspecialista,
      comentariosAdmin: turno.comentariosAdmin,
      historiaClinica: '',
      encuesta: '',
      calificacionAtencion: '',
    };

    const docRef = await addDoc(turnoRef, object);
    await this.updateID(docRef.id);  // Actualizamos el ID del turno
    return docRef;
  }

  // Método para actualizar un turno
  updateTurno(turno: Turno) {
    const turnoRef = doc(this.firestore, `${this.dbPath}/${turno.id}`);
    return updateDoc(turnoRef, { ...turno });
  }

  // Métodos para actualizar el estado de los turnos
  updateTurnoEstado(turno: Turno) {
    const turnoRef = doc(this.firestore, `${this.dbPath}/${turno.id}`);
    return updateDoc(turnoRef, { estado: turno.estado });
  }

  updateTurnoEstadoComentariosPaciente(turno: Turno) {
    const turnoRef = doc(this.firestore, `${this.dbPath}/${turno.id}`);
    return updateDoc(turnoRef, {
      estado: turno.estado,
      comentariosPaciente: turno.comentariosPaciente,
    });
  }

  updateTurnoEstadoComentariosEspecialista(turno: Turno) {
    const turnoRef = doc(this.firestore, `${this.dbPath}/${turno.id}`);
    return updateDoc(turnoRef, {
      estado: turno.estado,
      comentariosEspecialista: turno.comentariosEspecialista,
    });
  }

  updateTurnoEstadoComentariosAdmin(turno: Turno) {
    const turnoRef = doc(this.firestore, `${this.dbPath}/${turno.id}`);
    return updateDoc(turnoRef, {
      estado: turno.estado,
      comentariosAdmin: turno.comentariosAdmin,
    });
  }

  updateTurnoHistoriaClinica(historia: HistoriaClinica, turnoId: string) {
    const turnoRef = doc(this.firestore, `${this.dbPath}/${turnoId}`);
    
    const historiaData = { ...historia };
 
    delete historiaData.id; 
    
    return updateDoc(turnoRef, { historiaClinica: historiaData });
  }
  

  // Obtener turnos por especialidad
  getTurnosByEspecialidad(especialidad: string) {
    const turnosRef = collection(this.firestore, this.dbPath);
    const q = query(turnosRef, where('especialidad.nombre', '==', especialidad));
    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as Turno;
          data.id = doc.id;
          return data;
        })
      )
    );
  }

  async getTurnosByPaciente(id: string) {
    // Referencia a la colección de turnos
    const turnosRef = collection(this.firestore, this.dbPath);

    // Crear una consulta para filtrar los turnos por el id del paciente
    const q = query(turnosRef, where('paciente.id', '==', id)); // Filtramos por paciente.id

    try {
      // Ejecutamos la consulta
      const querySnapshot = await getDocs(q);

      // Mapear los resultados de los turnos
      const turnos = querySnapshot.docs.map(doc => doc.data());
      return turnos;

    } catch (error) {
      console.error("Error al obtener los turnos:", error);
      throw new Error('Error al obtener los turnos del paciente.');
    }
  }

  // Obtener turnos para el día
  getTurnosPorDia() {
    const turnosRef = collection(this.firestore, this.dbPath);
    return from(getDocs(turnosRef)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as Turno;
          data.id = doc.id;
          return data;
        })
      )
    );
  }

  // Método para agregar una encuesta a un turno
  public async addEncuesta(turno: any, encuesta: any) {
    const turnoRef = doc(this.firestore, `${this.dbPath}/${turno.id}`);
    await updateDoc(turnoRef, { encuesta: encuesta });
    return turnoRef;
  }

  // Método para agregar calificación de atención
  public async addCalificacionAtencion(turno: any, calificacionAtencion: any) {
    const turnoRef = doc(this.firestore, `${this.dbPath}/${turno.id}`);
    await updateDoc(turnoRef, { calificacionAtencion: calificacionAtencion });
    return turnoRef;
  }

  getTurnosByEspecialista(email: string): Observable<Turno[]> {
    const turnosRef = collection(this.firestore, this.dbPath);
    const q = query(turnosRef, where('especialista.email', '==', email));
    
    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as Turno;
          data.id = doc.id;
          return data;
        })
      )
    );
  }
}
