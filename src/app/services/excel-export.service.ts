import { Injectable } from '@angular/core';
import { PacienteService } from './paciente.service';
import { AdminService } from './admin.service';
import { EspecialidadesService } from './especialidades.service';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor(
    public pacienteServoce: PacienteService,
    public adminService: AdminService,
    public especialidadService: EspecialidadesService
  ) {}

  async exportar_ArrayObjetos_toExcel(
    arrayObjetos: any,
    nombreDeArchivoRecibido: string,
    nombreDeHojaRecibido: string
  ) {

    const worksheet = XLSX.utils.json_to_sheet(arrayObjetos);
    console.log(worksheet);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, worksheet, nombreDeHojaRecibido);

    XLSX.writeFile(wb, nombreDeArchivoRecibido + '.xlsx');
  }
}
