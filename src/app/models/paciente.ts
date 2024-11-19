export interface Paciente{
    uid?: string,
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    obraSocial: string;
    email:string;
    password: string;
    imagen1?: File | null;
    imagen2?: File | null;
}