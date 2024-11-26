import { Component } from '@angular/core';
import Highcharts from 'highcharts';
import { TurnoService } from '../../../services/turno.service';
import { EspecialistaService } from '../../../services/especialista.service';
import { Especialista } from '../../../models/especialista';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-grafico-cant-turnos-especialista-finalizados',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './grafico-cant-turnos-especialista-finalizados.component.html',
  styleUrl: './grafico-cant-turnos-especialista-finalizados.component.css'
})
export class GraficoCantTurnosEspecialistaFinalizadosComponent {
  especialistas: any = [];
  listaTurnos: any = [];
  turnosPorMedico: number = 0;
  dataTurnosXDia: any = [];
  medicos: any = [];
  cantidades: any = [];
  dias!: string;

  title = 'myHighchart';

  data: any = [
    {
      name: 'Médico'.toUpperCase(),
      data: this.cantidades,
    },
  ];

  highcharts = Highcharts;
  chartOptions: any = {
    chart: {
      type: 'area',
    },
    title: {
      text: 'Cantidad de turnos finalizados por médico'.toUpperCase(),
    },
    xAxis: {
      categories: this.medicos,
    },
    yAxis: {
      title: {
        text: 'Cantidad de Turnos'.toUpperCase(),
      },
      allowDecimals: false,
    },
    series: this.data,
  };

  constructor(
    public turnoSvc: TurnoService,
    public especialistaService: EspecialistaService
  ) {
    this.especialistaService.getAll().subscribe((especialistas) => {
      this.especialistas = especialistas.filter((item: Especialista) => item.cuentaHabilitada);
      this.turnoSvc.getTurnos().subscribe((turnos) => {
        this.listaTurnos = turnos;
        this.contarTurnosPorMedico();
      });
    });
    
  }

  ngOnInit(): void {}

  contarTurnosPorMedico() {
    for (let i = 0; i < this.especialistas.length; i++) {
      var item = this.especialistas[i];
      var nombreYApellido = item.apellido + ', ' + item.nombre;
      this.medicos.push(nombreYApellido);

      var turnosPorMedico = this.listaTurnos.filter(
        (element: any, index: any, array: any) => {
          return (
            item.email == element.especialista.email &&
            element.estado === 'FINALIZADO'
          );
        }
      );
      console.log('Turnos ->' + turnosPorMedico);

      this.cantidades.push(turnosPorMedico.length);
    }
    console.log(this.medicos);
    console.log(this.cantidades);
    Highcharts.chart('chart-line', this.chartOptions);
  }

  crearPdf() {
    let DATA = <HTMLElement>document.getElementById('pdfTable');

    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      var nombreArchivo = 'turnosxMedicoFinalizados.pdf';
      PDF.save(nombreArchivo);
    });
  }
}
