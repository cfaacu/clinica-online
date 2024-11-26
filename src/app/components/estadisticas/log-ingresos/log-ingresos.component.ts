import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { ExcelExportService } from '../../../services/excel-export.service';
import { CommonModule } from '@angular/common';
import { SelectedRowDirective } from '../../../directives/selected-row.directive';

@Component({
  selector: 'app-log-ingresos',
  standalone: true,
  imports: [CommonModule, SelectedRowDirective],
  templateUrl: './log-ingresos.component.html',
  styleUrl: './log-ingresos.component.css'
})
export class LogIngresosComponent {
  logs: Array<any> = [];

  constructor(
    private adminService: AdminService,
    public excelExport: ExcelExportService
  ) {
    this.adminService.getCollection('logIngresosClinica').subscribe((lista) => {
      this.logs = lista;
    });
  }

  ngOnInit(): void {}

  exportExcelAll() {
    this.excelExport.exportar_ArrayObjetos_toExcel(
      this.logs,
      'logsIngresosClinica',
      'hoja 1'
    );
  }
}
