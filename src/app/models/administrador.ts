export interface Administrador {
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    email: string;
    password: string;
    imagenPerfil?: File | null ;
  }