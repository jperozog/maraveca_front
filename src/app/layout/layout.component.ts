import {
  Component,
  Pipe,
  PipeTransform,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthGuard } from '../_guards/index';
import { DashboardService } from '../services/dashboard/dashboard.service';
import { TicketsService } from '../services/soporte/tickets.service';
import { FactibilidadesService } from '../services/factibilidades/factibilidades.service';
import { InstalacionesService } from '../services/soporte/instalaciones.service';

//import { MultiDataSet, Label } from 'ng2-charts';

//import dataPipe from './layout.component.ts'


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  tickets: any = []
  factibilidades: any = []
  instalaciones: any = []
  ips: any = []
  reconexion: any
  p: number = 1
  e: number = 1
  i: number = 1
  s: number = 1

  //grafica de donas(gerencia)
  clientesActivos: number = 0 
  clientesSuspendidos:number = 0
  clientesExonerados:number = 0
  clientesRetirados:number = 0
  public doughnutChartLabelsC: any[] = ['Supendidos', 'Activos',"Exonerados","Retirados"];
  public doughnutChartDataC: any[] = [0, 0, 0, 0];
  public doughnutChartTypeC = 'doughnut';
  public doughnutColorsC: any[] = [{ backgroundColor: ["#E16F62", '#71BBEC','#E5E258', '#8F8F8F'] }];

  //grafica de pie(Gerencia)
  public pieChartLabelsG: any[] = ['Clientes', 'Potenciales'];
  public pieChartDataG: number[] = [0, 0];
  public pieChartTypeG: ChartType = 'pie';
  public pieChartLegendG = true;
  public pieChartColorsG = [
    {
      backgroundColor:['#71BBEC','#E16F62'],
    },
  ];


  //grafica de barras(Gerencia)
  public barChartOptionsG: any = {
    responsiveG: true,
    // We use these empty structures as placeholders for dynamic theming.
    scalesG: { xAxes: [{}], yAxes: [{}] },
    pluginsG: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabelsG: any[] = ['Tabla Comparativa'];
  public barChartTypeG: ChartType = 'bar';
  public barChartLegendG = true;
  public barChartDataG: any[] = [
    { data: [0], label: 'MK_DABAJURO' },
    { data: [0], label: 'MK-MENE' },
    { data: [0], label: 'MK-SEQUE' },
    { data: [0], label: 'MK-PUNTO_FIJO' },
    { data: [0], label: 'MK-CORO-GALICIA' },
    { data: [0], label: 'MK-SOCOPO' },
    { data: [0], label: 'MK-CABIMAS' },
    { data: [0], label: 'MK-VALLE_CLARO' },
    { data: [0], label: 'MK-SAN_FRANCISCO' },
    { data: [0], label: 'MK-Gladiolas' },
    { data: [0], label: 'MK_OFICINA_MARACAIBO' },
    { data: [0], label: 'MK_CHURUGUARA' },
    { data: [0], label: 'MK-BACHAQUERO' },
    { data: [0], label: 'MK Atlantis' },

  ];

  public barChartColorsG: any[] = [
    { backgroundColor: '#35D158' },
    { backgroundColor: '#D17035' },
    { backgroundColor: '#D13535' },
    { backgroundColor: '#D1BC35' },
    { backgroundColor: '#127A72' },
    { backgroundColor: '#7A1212' },
    { backgroundColor: '#56D8CC' },
    { backgroundColor: '#8556D8' },
    { backgroundColor: '#D85679' },
    { backgroundColor: '#D85656' },
    { backgroundColor: '#56D862' },
    { backgroundColor: '#5674D8' },
    { backgroundColor: '#12157A' },
    { backgroundColor: '#BAD856' }]


  // grafica de lineas(Gerencia)
  public lineChartDataG: any[] = [{ data: [0, 0], label: 'Pagado' }, { data: [0, 0], label: 'Facturado' }];
  public lineChartLabelsG: any[] = ['', ''];
  public lineChartOptionsG: (any & { annotation: any }) = {
    responsive: true,

  };
  public lineChartColorsG: any[] = [
    {
      backgroundColor: '#C3E2EF',
      borderColor: '#32A0CD',
      pointBackgroundColor: '#32A0CD',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: '#DCDEDB',
      borderColor: '#A7ABA5',
      pointBackgroundColor: '#A7ABA5',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegendG = true;
  public lineChartTypeG = 'line';


  public lineChartDataG2: any[] = [{ data: [0, 0, 0], label: 'Servicios' }];
  public lineChartLabelsG2: any[] = ['', '', ''];
  public lineChartOptionsG2: (any & { annotation: any }) = {
    responsive: true,

  };
  public lineChartColorsG2: any[] = [
    {
      backgroundColor: '#C3E2EF',
      borderColor: '#32A0CD',
      pointBackgroundColor: '#32A0CD',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegendG2 = false;
  public lineChartTypeG2 = 'line';






  //grafica de donas(soporte)
  public doughnutChartLabelsT: any[] = ['Abiertos', 'Cerrados'];
  public doughnutChartDataT: any[] = [0, 0];
  public doughnutChartTypeT = 'doughnut';
  public doughnutColorsT: any[] = [{ backgroundColor: ["#D13537", '#3596D1'] }];


  //grafica de pie(Soporte)
  public pieChartLabels: any[] = ['Abiertas', 'Cerradas'];
  public pieChartData: number[] = [0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#CD3232', '#35D158'],
    },
  ];


  //grafica de barras(Soporte)
  public barChartOptions: any = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: any[] = ['Tabla Comparativa'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any[] = [
    { data: [0], label: 'Factibles' },
    { data: [0], label: 'No Factibles ' },
    { data: [0], label: 'Pendientes' },
    { data: [0], label: 'Coordenadas' },
    { data: [0], label: 'Visita' },
  ];

  public barChartColors: any[] = [{ backgroundColor: '#35D158' }, { backgroundColor: '#D17035' }, { backgroundColor: '#D13535' }, { backgroundColor: '#D1BC35' }, { backgroundColor: '#5635D1' }]






  // grafica de lineas(Soporte)
  public lineChartData: any[] = [{ data: [0, 0, 0, 0], label: 'Clientes' }, { data: [0, 0, 0, 0], label: 'Clientes' }];
  public lineChartLabels: any[] = ['', '', '', ''];
  public lineChartOptions: (any & { annotation: any }) = {
    responsive: true,

  };
  public lineChartColors: any[] = [
    {
      backgroundColor: '#C3E2EF',
      borderColor: '#32A0CD',
      pointBackgroundColor: '#32A0CD',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: '#D4EFC3',
      borderColor: '#6EC239',
      pointBackgroundColor: '#6EC239',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  MontoTotalDl:any
  MontoTotalBs: any
  ticketsAbiertos:any
  instalacionesAbiertas:any




  constructor(private activateRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    public usuario: AuthGuard,
    private dashboardService: DashboardService,
    private ticketsService: TicketsService,
    private factibilidadesService: FactibilidadesService,
    private instalacionService: InstalacionesService
  ) { }

  ngOnInit() {
    if (this.usuario.currentUser.departamento == 'Gerencia') {
      this.traerDatosGraficaClientesInactivos()
      this.traerDatosGraficaClientesActivos()
      //this.traerDatosGraficaClientesZonas()
      this.traerDatosServiciosCreados()
      this.traerDatosGraficaTickets()
      this.traerDatosGraficaInstalaciones()
      this.traerDatosGraficaCuentasBs()
      //this.traerDatosGraficaCuentasDl()
    }
    if (this.usuario.currentUser.departamento == 'Soporte') {
      this.traerDatosGraficaTickets()
      this.traerDatosGraficaFactibilidades()
      this.traerDatosGraficaInstalaciones()
      this.traerDatosGraficaOperaciones()
      this.traerDatosTickets()
      this.traerDatosFactibilidades()
      //this.traerDatosInstalaciones()
      this.traerIps()

    }

  }


  traerDatosGraficaClientesActivos() {
    this.dashboardService.datosGraficaClientesActivos()
      .subscribe(
        res => {
          this.clientesActivos = res[0].activos
          this.clientesSuspendidos = res[0].suspendidos
          this.clientesExonerados = res[0].exonerados
          this.clientesRetirados = res[0].retirados
          this.doughnutChartDataC = [ this.clientesSuspendidos, this.clientesActivos, this.clientesExonerados, this.clientesRetirados]
        },
        err => console.log(err)
      )
  }


  traerDatosGraficaClientesInactivos() {
    this.dashboardService.datosGraficaClientesInactivos()
      .subscribe(
        res => {
          console.log(res)
          this.clientesExonerados = res[0].clientes
          this.clientesRetirados = res[0].potenciales
          this.pieChartDataG = [res[0].clientes, res[0].potenciales]
        },
        err => console.log(err)
      )
  }

  traerDatosGraficaClientesZonas() {
    this.dashboardService.datosGraficaClientesZonas()
      .subscribe(
        res => {
          this.barChartDataG = [
            { data: [res[0].cantidad], label: 'MK_DABAJURO' },
            { data: [res[1].cantidad], label: 'MK-MENE' },
            { data: [res[2].cantidad], label: 'MK-SEQUE' },
            { data: [res[3].cantidad], label: 'MK-PUNTO_FIJO' },
            { data: [res[4].cantidad], label: 'MK-CORO-GALICIA' },
            { data: [res[5].cantidad], label: 'MK-SOCOPO' },
            { data: [res[6].cantidad], label: 'MK-CABIMAS' },
            { data: [res[7].cantidad], label: 'MK-VALLE_CLARO' },
            { data: [res[8].cantidad], label: 'MK-SAN_FRANCISCO' },
            { data: [res[9].cantidad], label: 'MK-Gladiolas' },
            { data: [res[10].cantidad], label: 'MK_OFICINA_MARACAIBO' },
            { data: [res[11].cantidad], label: 'MK_CHURUGUARA' },
            { data: [res[12].cantidad], label: 'MK-BACHAQUERO' },
            { data: [res[13].cantidad], label: 'MK Atlantis' },
          ]
        },
        err => console.log(err)
      )
  }
  /*
  traerDatosGraficaCuentasDl() {
    this.dashboardService.datosGraficaCuentasDl()
      .subscribe(
        res => this.MontoTotalDl = res,
        err => console.log(err))
  }
  */
  traerDatosGraficaCuentasBs() {
    this.dashboardService.datosGraficaCuentasBs()
      .subscribe(
        res => this.MontoTotalBs = res,
        err => console.log(err))
  }

  traerDatosServiciosCreados() {
    this.dashboardService.traerDatosGraficaServicio()
      .subscribe(
        res => {
          console.log(res)
          console.log(res["datos"])
          console.log(res["fechas"])

         
          this.lineChartDataG2 = [
            { data: [res["datos"][2].facturado,res["datos"][1].facturado, res["datos"][0].facturado], label: 'Servicios' }
          ]


        },
        err => console.log(err))
  }



  traerDatosGraficaTickets() {
    this.dashboardService.datosGraficosTickets()
      .subscribe(
        res => {
          console.log(res),
          this.ticketsAbiertos = res[0].abiertos,
          this.doughnutChartDataT = [res[0].abiertos, res[0].cerrados]
        },
        err => console.log(err)
      )
  }

  traerDatosGraficaFactibilidades() {
    this.dashboardService.datosGraficosFactibilidades()
      .subscribe(
        res => {
          this.barChartData = [
            { data: [res[0].Factibles], label: 'Factibles' },
            { data: [res[0].noFactibles], label: 'No Factibles ' },
            { data: [res[0].pendientes], label: 'Pendientes' },
            { data: [res[0].Coordenadas], label: 'Coordenadas' },
            { data: [res[0].Visita], label: 'Visita' }
          ]
        },
        err => console.log(err)
      )
  }

  traerDatosGraficaInstalaciones() {
    this.dashboardService.datosGraficosInstalaciones()
      .subscribe(
        res => {
            console.log(res)
            this.instalacionesAbiertas = res[0].abiertos,
            this.pieChartData = [res[0].abiertos, res[0].cerrados]
        },
        err => console.log(err)
      )
  }

  traerDatosGraficaOperaciones() {
    this.dashboardService.datosGraficosOperaciones()
      .subscribe(
        res => {
          this.lineChartLabels = [res["fechas"][3].fecha, res["fechas"][2].fecha, res["fechas"][1].fecha, res["fechas"][0].fecha],
            this.lineChartData = [
              { data: [res["datos"][3], res["datos"][2], res["datos"][1], res["datos"][0]], label: 'Tickets' },
              { data: [res["datos2"][3], res["datos2"][2], res["datos2"][1], res["datos2"][0]], label: 'Factibilidades' }
            ]

        },
        err => console.log(err))
  }

  traerDatosTickets() {
    this.ticketsService.traerTickets().subscribe(res => this.tickets = res, err => console.log(err))
  }

  traerDatosFactibilidades() {
    this.factibilidadesService.traerFactibilidades().subscribe(res => this.factibilidades = res, err => console.log(err))
  }
  /*
  traerDatosInstalaciones() {
    this.instalacionService.traerInstalaciones().subscribe(res => this.instalaciones = res, err => console.log(err))
  }
  */
  traerIps() {
    this.instalacionService.traerips().subscribe(res => this.ips = res["ip_asignadas"], err => console.log(err))
  }



  public chartClicked(e: any): void {
    console.log(this.doughnutChartLabelsT[e.active[0]._index])
  }
  public chartHovered(e: any): void {
    console.log(e);
  }

}
