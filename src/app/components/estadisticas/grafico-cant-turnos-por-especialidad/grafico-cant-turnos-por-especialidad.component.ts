import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Turno } from '../../../models/turno';
import * as Highcharts from 'highcharts';
import { TurnoService } from '../../../services/turno.service';
import { EspecialidadesService } from '../../../services/especialidades.service';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-grafico-cant-turnos-por-especialidad',
  standalone: true,
  imports: [CommonModule,HighchartsChartModule],
  templateUrl: './grafico-cant-turnos-por-especialidad.component.html',
  styleUrl: './grafico-cant-turnos-por-especialidad.component.css'
})
export class GraficoCantTurnosPorEspecialidadComponent {
  highcharts = Highcharts;
  chartOptions: any;

  listaTurnos: any = [];
  especialidades: string[] = [];
  cantidades: number[] = [];
  datosProyectados: any = [];

  constructor(
    private turnoSvc: TurnoService,
    private especialidadService: EspecialidadesService
  ) {}

  ngOnInit(): void {
    this.turnoSvc.getTurnos().subscribe((turnos) => {
      this.listaTurnos = turnos;
      this.procesarDatos();
      this.configurarGrafico();
    });
  }

  procesarDatos(): void {
    // Filtrar y contar turnos por especialidad
    const especialidadesMap = this.listaTurnos.reduce((acc: any, turno: Turno) => {
      const especialidad = turno.especialidad?.nombre || 'Sin Especialidad';
      acc[especialidad] = (acc[especialidad] || 0) + 1;
      return acc;
    }, {});

    // Convertir a arrays para el gráfico
    this.especialidades = Object.keys(especialidadesMap);
    this.cantidades = Object.values(especialidadesMap);

    // Preparar datos proyectados
    this.datosProyectados = this.especialidades.map((especialidad, index) => ({
      label: especialidad,
      data: this.cantidades[index],
    }));
  }

  configurarGrafico(): void {
    this.chartOptions = {
      chart: {
        type: 'bar',
      },
      title: {
        text: 'Cantidad de turnos por Especialidad'.toUpperCase(),
      },
      xAxis: {
        categories: this.especialidades,
        title: {
          text: 'Especialidades',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad de Turnos',
        },
      },
      series: [
        {
          name: 'Turnos',
          data: this.cantidades,
        },
      ],
    };
  }

  crearPdf() {
    const DATA = document.getElementById('pdfTable');
    if (DATA) {
      html2canvas(DATA).then((canvas) => {
        const fileWidth = 208;
        const fileHeight = (canvas.height * fileWidth) / canvas.width;

        const FILEURI = canvas.toDataURL('image/png');
        const PDF = new jsPDF('p', 'mm', 'a4');
        const position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save('turnosxEspecialidad.pdf');
      });
    }
  }
}
