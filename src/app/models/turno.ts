import { Especialista } from "./especialista";
import { HistoriaClinica } from "./historia-clinica";
import { Paciente } from "./paciente";

export class Turno{
    id!: string;
    estado!: string;
    paciente!: Paciente;
    especialista!: Especialista;
    especialidad!: Especialista;
    fecha!: string;
    hora!: string;
    comentariosPaciente!: string;
    comentariosEspecialista!: string;
    comentariosAdmin!: string;
    historiaClinica!: HistoriaClinica;
    encuesta!: string;
    calificacionAtencion!: string;
}