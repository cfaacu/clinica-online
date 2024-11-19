import { Horarios } from "./horarios";

export interface Especialista {
    uid?: string,
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    especialidades: string[] | null;
    email: string;
    cuentaHabilitada: boolean;
    password: string;
    imagenPerfil?: File | null ;
    horarios: Horarios | null;
  }