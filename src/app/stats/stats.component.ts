import { Component, Inject, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { AuthGuard } from '../_guards/index';
import { environment } from '../../environments/environment'
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { MyService } from '../../src/app/servidores/servidores.component';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { FacturacionPagos, UpdatePlanPricesFacDialog } from '../facturacion/facturacion.component';
import { CustomValidators } from 'ngx-custom-validators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PagoComisionesService } from '../services/pago-comisiones/pago-comisiones.service';




@Component({
  selector: 'app-stat',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {
  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective;
  data: any = null;
  fechas: any = null;
  search: string = '';
  pagado = [];
  tittle = "Grafico Comparativo 4 meses"
  facturado = [];
  numero_pagos = [];
  monto_pagos = [];
  dias_pagos = [];
  _chartData: any;
  datos: boolean = false
  lineChartType: string = 'line';
  constructor(private http: Http, public usuario: AuthGuard, public dialog: MdDialog, public snackBar: MdSnackBar, public router: Router) {
    this.snackBar.open("Cargando AccessPoints", null, {
      duration: 2000,
    });
    this.http.get(environment.apiEndpoint + 'stat/')
      .subscribe((data) => {
        this.fechas = data.json().fechas;
        this.data = data.json().datos;
        console.log(this.data)
        data.json().datos.forEach(fecha => {
          this.pagado.push(fecha.pagado)
          this.facturado.push(fecha.facturado)

        })
        this.labels = [this.fechas[3].fecha, this.fechas[2].fecha, this.fechas[1].fecha, this.fechas[0].fecha]
        var _chartData = [
          {
            label: 'Facturado',
            data: [this.facturado[3], this.facturado[2], this.facturado[1], this.facturado[0]]
          },
          {
            label: 'Pagado',
            data: [this.pagado[3], this.pagado[2], this.pagado[1], this.pagado[0]]
          },
        ]
        this.chartData = _chartData;
        this.datos = true
      });
    this.snackBar.open("AccessPoints Cargados", null, {
      duration: 2000,
    });
  }

  // ADD CHART OPTIONS.
  chartOptions = {
    responsive: true,    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
    tooltips: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + tooltipItem.yLabel.toLocaleString('en-us') + ' Bs.S';
        }
      }
    },
    scales: {
      xAxes: [{
        title: 'meses/años'
      }],
      yAxes: [/*{
          title: 'Bs.S'
        },*/
        {
          ticks: {
            beginAtZero: true // se agrega la siguiente linea para que la grafica comience desde 0
          }
        }],

    }
  }

  labels = [];

  // STATIC DATA FOR THE CHART IN JSON FORMAT.
  chartData = [
    {
      label: 'Facturado',
      data: this.facturado
    },
    {
      label: 'Pagado',
      data: this.pagado
    },
  ]
  // CHART COLOR.
  colors = [
    { // Facturado.
      backgroundColor: 'rgba(77,83,96,0.2)'
    },
    { // Pagado.
      backgroundColor: 'rgba(30, 169, 224, 0.8)'
    }
  ]

  goTOfac(i) {
    this.router.navigate(['facturacion', { fecha: i.fecha, fac: 'bs', status: 'pendiente' }]);
  }

  goTOfacP(i) {
    this.router.navigate(['facturacion', { fecha: i.fecha, fac: 'bs', status: 'pagado' }]);
  }

  goTOfacF(i) {
    this.router.navigate(['facturacion', { fecha: i.fecha, fac: 'bs', status: '' }]);
  }

  // CHART CLICK EVENT.
  onChartClick(event) {
    console.log(event);
  }
  changeTYPE(dat) {
    this.tittle = "Grafico con detalles del mes " + dat.fecha
    this.http.get(environment.apiEndpoint + 'incidencia/?mes=' + dat.fecha)
      .subscribe((data) => {
        var data_mes = data.json()
        this.labels.length = 0;
        this.chartData[0].data.length = 0
        this.chartData[1].data.length = 0
        this.chartData[0].label = "Numero de Pagos"
        this.chartData[1].label = "Monto de Pagos"

        data_mes.forEach(dia => {
          this.chartData[1].data.push(dia.monto_pagos);
          this.chartData[0].data.push(dia.numero_pagos);
          this.labels.push(dia.fecha);
        })
        this.chartOptions = {
          responsive: true,    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function (tooltipItem, data) {
                const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                return datasetLabel + ': ' + tooltipItem.yLabel.toLocaleString('en-us') + ' ' + data_mes[0].denominacion;
              }
            }
          },
          scales: {
            xAxes: [{
              title: 'meses/años'
            }],
            yAxes: [/*{
                title: data_mes[0].denominacion se comenta la siguiente linea para que la grafica comience desde 0
              }*/
              {
                ticks: {
                  beginAtZero: true // se agrega la siguiente linea para que la grafica comience desde 0
                }
              }
            ],

          }
        }
        this.lineChartType = 'bar'
        this.chart.chart.update()
      })
    console.log(this.chartData)
  }
  refresh() {
    this.http.get(environment.apiEndpoint + 'stat/')
      .subscribe((data) => {
        this.data = data.json();
        console.log(this.data);
      });

  }

}

@Component({
  selector: 'app-stat',
  templateUrl: './statsdl.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsdlComponent {
  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective;
  data: any = null;
  fechas: any = null;
  search: string = '';
  pagado = [];
  tittle = "Grafico Comparativo 4 meses"
  facturado = [];
  numero_pagos = [];
  monto_pagos = [];
  dias_pagos = [];
  _chartData: any;
  datos: boolean = false
  lineChartType: string = 'line';
  constructor(private http: Http, public usuario: AuthGuard, public dialog: MdDialog, public snackBar: MdSnackBar, public router: Router) {
    this.snackBar.open("Cargando AccessPoints", null, {
      duration: 2000,
    });
    this.http.get(environment.apiEndpoint + 'statdl/')
      .subscribe((data) => {
        this.fechas = data.json().fechas;
        this.data = data.json().datos;
        data.json().datos.forEach(fecha => {
          this.pagado.push(fecha.pagado)
          this.facturado.push(fecha.facturado)
          console.log(this.data);
        })
        this.labels = [this.fechas[3].fecha, this.fechas[2].fecha, this.fechas[1].fecha, this.fechas[0].fecha]
        var _chartData = [
          {
            label: 'Facturado',
            data: [this.facturado[3], this.facturado[2], this.facturado[1], this.facturado[0]]
          },
          {
            label: 'Pagado',
            data: [this.pagado[3], this.pagado[2], this.pagado[1], this.pagado[0]]
          },
        ]
        this.chartData = _chartData;
        this.datos = true
      });
    this.snackBar.open("AccessPoints Cargados", null, {
      duration: 2000,
    });
  }

  // ADD CHART OPTIONS.
  chartOptions = {
    responsive: true,    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
    tooltips: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + tooltipItem.yLabel.toLocaleString('en-us') + ' US$.';
        }
      }
    },
    scales: {
      xAxes: [{
        title: 'meses/años'
      }],
      yAxes: [/*{
          title: 'Bs.S'
        },*/
        {
          ticks: {
            beginAtZero: true // se agrega la siguiente linea para que la grafica comience desde 0
          }
        }],

    }
  }

  labels = [];

  // STATIC DATA FOR THE CHART IN JSON FORMAT.
  chartData = [
    {
      label: 'Facturado',
      data: this.facturado
    },
    {
      label: 'Pagado',
      data: this.pagado
    },
  ]
  // CHART COLOR.
  colors = [
    { // Facturado.
      backgroundColor: 'rgba(77,83,96,0.2)'
    },
    { // Pagado.
      backgroundColor: 'rgba(30, 169, 224, 0.8)'
    }
  ]

  goTOfac(i) {
    this.router.navigate(['facturacion', { fecha: i.fecha, fac: 'dol', status: 'pendiente' }]);
  }

  goTOfacP(i) {
    this.router.navigate(['facturacion', { fecha: i.fecha, fac: 'dol', status: 'pagado' }]);
  }

  goTOfacF(i) {
    this.router.navigate(['facturacion', { fecha: i.fecha, fac: 'dol', status: '' }]);
  }


  // CHART CLICK EVENT.
  onChartClick(event) {
    console.log(event);
  }
  changeTYPE(dat) {
    this.tittle = "Grafico con detalles del mes " + dat.fecha
    this.http.get(environment.apiEndpoint + 'incidencia/?mes=' + dat.fecha)
      .subscribe((data) => {
        var data_mes = data.json()
        this.labels.length = 0;
        this.chartData[0].data.length = 0
        this.chartData[1].data.length = 0
        this.chartData[0].label = "Numero de Pagos"
        this.chartData[1].label = "Monto de Pagos"

        data_mes.forEach(dia => {
          this.chartData[1].data.push(dia.monto_pagos);
          this.chartData[0].data.push(dia.numero_pagos);
          this.labels.push(dia.fecha);
        })
        this.chartOptions = {
          responsive: true,    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function (tooltipItem, data) {
                const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                return datasetLabel + ': ' + tooltipItem.yLabel.toLocaleString('en-us') + ' ' + data_mes[0].denominacion;
              }
            }
          },
          scales: {
            xAxes: [{
              title: 'meses/años'
            }],
            yAxes: [/*{
                title: data_mes[0].denominacion se comenta la siguiente linea para que la grafica comience desde 0
              }*/
              {
                ticks: {
                  beginAtZero: true // se agrega la siguiente linea para que la grafica comience desde 0
                }
              }
            ],

          }
        }
        this.lineChartType = 'bar'
        this.chart.chart.update()
      })
    console.log(this.chartData)
  }
  refresh() {
    this.http.get(environment.apiEndpoint + 'statdl/')
      .subscribe((data) => {
        this.data = data.json();
        console.log(this.data);
      });

  }

}
@Component({
  selector: 'app-installer',
  templateUrl: './pagar.component.html',
  styleUrls: ['./stats.component.css']
})

export class PagarComponent {
 

}


@Component({
  selector: 'app-installer',
  templateUrl: './detallePagar.component.html',
  styleUrls: ['./stats.component.css']
})

export class DetallesInstallerComponent {

}


@Component({
  selector: 'app-installer',
  templateUrl: './cargarpago.component.html',
  styleUrls: ['./stats.component.css']
})

export class cargarPagocomponent {
  
}
@Component({
  selector: 'app-installer',
  templateUrl: './otrospago.component.html',
  styleUrls: ['./stats.component.css']
})
export class OtrosPagosComponent {
 

}

@Component({
  selector: 'app-installer',
  templateUrl: './odetallePagar.component.html',
  styleUrls: ['./stats.component.css']
})
export class DetallesotherInstallerComponent {
 
}
@Component({
  selector: 'app-installer',
  templateUrl: './cargarotropago.component.html',
  styleUrls: ['./stats.component.css']
})

export class cargarOpagocomponent {


}









































@Component({
  selector: 'app-installer',
  templateUrl: './pagos_comisiones.html',
  styleUrls: ['./stats.component.css']
})

export class Pagar_comisones_Component {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  myService: MyService | null;
  data: any = null;
  search: string = '';
  p: number = 1
  e: number = 1
  userSeleccionado: number = 0
  mesSeleccionado: number = 0
  anioSeleccionado: number = 0
  instalaciones: any = []
  instalaciones2: any = []
  instalacionesPagos: any = []
  ninstalaciones:any = []
  pendientes: any = []
  comisionesdl: number = 0;
  comisionesConversion: number = 0
  comisionesbs: number = 0;
  comisionesPagadasBs: number = 0;
  comisionDisponibleDl: number = 0;
  comisionPagadaDl: number = 0;
  comisionDisponibleConversion: number = 0;
  comisionDisponibleBs: number = 0;
  comisionRestanteDl: number = 0;
  comisionRestanteConversion: number = 0;
  comisionRestanteBs: number = 0;
  visualizar: boolean = false
  conversion: boolean = true
  pago$: boolean = false
  pagoBs: boolean = false
  emisorSeleccionado: string = ''
  receptorSeleccionado: string = ''
  tipoSeleccionado: string = ''
  referencia: string = ""
  monto: number = 0
  comisionFinal: number = 0
  tipoComision: string = ''
  listaPagos: any = []
  fechaPago: any = ""
  constructor(
    public usuario: AuthGuard,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public router: Router,
    private modalService: BsModalService,
    private pagoComisiones: PagoComisionesService) {

    this.myService = new MyService(http, router);
    this.snackBar.open("Cargando Usuarios", null, {
      duration: 2000,
    });
    this.http.get(environment.apiEndpoint + 'user_comision/')
      .subscribe((data) => {
        this.data = data.json();
        console.log(this.data);

      });

    this.snackBar.open("Usuarios Cargadas", null, {
      duration: 2000,
    });
  }
  show(row) {

  }


  openModal(lgModal) {
    lgModal.show();

  }

  openModal3(lgModal2) {
    lgModal2.show();

  }

  openModal4(lgModal3) {
    lgModal3.show();

  }

  verDetalles() {
    this.visualizar = true
    if (this.usuario.perm && this.usuario.perm.includes('comision_w')) {
      this.pagoComisiones.traerInstalacionUser(this.userSeleccionado, this.mesSeleccionado, this.anioSeleccionado).subscribe(
        res => {
          console.log(res),
            this.instalaciones = res['facturas'],
            this.instalaciones2 = res['facturas'],
            this.comisionesdl = res['comisionesdl'],
            this.comisionesConversion = res['comisionesConversion'],
            this.comisionesbs = res['comisionesbs'],
            this.comisionDisponibleDl = res['disponibleComisionDl'],
            this.comisionDisponibleBs = res['disponibleComisionConversion'] + res['disponibleComisionBs'],
            //this.comisionDisponibleBs = res['disponibleComisionBs'],
            this.comisionRestanteDl = res['restanteComisionDl'],
            this.comisionRestanteConversion = res['restanteComisionConversion'],
            this.comisionRestanteBs = res['restanteComisionBs'],
            this.snackBar.open("Comisiones Cargadas", null, {
              duration: 2000,
            });
        },
        err => console.log(err))
    } else {

      this.visualizar = true

      this.pagoComisiones.traerInstalacionUser(this.usuario.currentUser.id_user, this.mesSeleccionado, this.anioSeleccionado).subscribe(
        res => {
          console.log(res),
            this.instalaciones = res['facturas'],
            this.instalaciones2 = res['facturas'],
            this.comisionesdl = res['comisionesdl'],
            this.comisionesConversion = res['comisionesConversion'],
            this.comisionesbs = res['comisionesbs'],
            this.comisionDisponibleDl = res['disponibleComisionDl'],
            this.comisionDisponibleBs = res['disponibleComisionConversion'] + res['disponibleComisionBs'],
            //this.comisionDisponibleBs = res['disponibleComisionBs'],
            this.comisionRestanteDl = res['restanteComisionDl'],
            this.comisionRestanteConversion = res['restanteComisionConversion'],
            this.comisionRestanteBs = res['restanteComisionBs'],
            this.snackBar.open("Comisiones Cargadas", null, {
              duration: 2000,
            });
        },
        err => console.log(err))
    }
    this.pagosRealizadosDl()
    this.pagosRealizadosBs()
    this.comisionesPendientes();
    this.listaPagoComisiones()

  }

  pagosRealizadosDl() {
    this.pagoComisiones.traerPagosRealizadosDl(this.userSeleccionado, this.mesSeleccionado, this.anioSeleccionado)
      .subscribe(
        res => {
          this.comisionPagadaDl = res[0].monto
          this.comisionDisponibleDl = this.comisionDisponibleDl - this.comisionPagadaDl
        },
        err => console.log(err)
      )
  }

  pagosRecientesDl() {
    this.pagoComisiones.traerPagosRecientesRealizadosDl(this.userSeleccionado, this.mesSeleccionado, this.anioSeleccionado)
      .subscribe(
        res => {
          this.comisionDisponibleDl = this.comisionDisponibleDl - res[0].monto
          this.comisionPagadaDl = this.comisionPagadaDl + res[0].monto
        },
        err => console.log(err)
      )
  }

  pagosRealizadosBs() {
    this.pagoComisiones.traerPagosRealizadosBs(this.userSeleccionado, this.mesSeleccionado, this.anioSeleccionado)
      .subscribe(
        res => {
          this.comisionesPagadasBs = res[0].monto
          this.comisionDisponibleBs = this.comisionDisponibleBs - this.comisionesPagadasBs
        },
        err => console.log(err)
      )
  }



  pagosRecientesBs() {
    this.pagoComisiones.traerPagosRecientesRealizadosBs(this.userSeleccionado, this.mesSeleccionado, this.anioSeleccionado)
      .subscribe(
        res => {
          this.comisionDisponibleBs = this.comisionDisponibleBs - res[0].monto
          this.comisionesPagadasBs = this.comisionesPagadasBs + res[0].monto
        },
        err => console.log(err)
      )
  }

  comisionesPendientes() {

    this.pagoComisiones.traerInstalacionUserPendiente(this.userSeleccionado, this.mesSeleccionado, this.anioSeleccionado).subscribe(
      res => {
        this.pendientes = res,
          console.log(res)
      },
      err => console.log(err)
    )
  }



  listaPagoComisiones() {

    this.pagoComisiones.traerListaPagos(this.userSeleccionado, this.mesSeleccionado, this.anioSeleccionado).subscribe(
      res => {
        this.listaPagos = res
      },
      err => console.log(err)
    )
  }

  onSearchComision(e: string): void {
    console.log(e)
    if (e == "") {
      this.instalaciones = this.instalaciones2
    } else {

      const result = this.instalaciones.filter((el) =>
        el.nombre.toUpperCase().includes(e.toUpperCase())
      );
      const result2 = this.instalaciones.filter((el) =>
        el.dni.toUpperCase().includes(e.toUpperCase())
      );
      /*
      const result3 = this.instalaciones.filter((el) =>
        el.social.toUpperCase().includes(e.toUpperCase())
      );
      */

      const result4 = result.concat(result2)
      //const result5 = result4.concat(result3)

      this.instalaciones = result4;
    }
  }

  comisionBackSpace(e) {
    const algo = this.instalaciones2
    const result = algo.filter((el) =>
      el.nombre.toUpperCase().includes(e.toUpperCase())
    );
    const result2 = algo.filter((el) =>
      el.dni.toUpperCase().includes(e.toUpperCase())
    );
    const result4 = result.concat(result2)
    //const result5 = result4.concat(result3)

    this.instalaciones = result4;
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.instalaciones2.forEach(element => {
        element["estatus"] = 1
        this.instalacionesPagos.push(element)
    });
  }

  closeModal() {
    this.modalRef.hide()
    this.emisorSeleccionado = ""
    this.receptorSeleccionado = ""
    this.tipoSeleccionado = ""
    this.pago$ = false
    this.pagoBs = false

  }

  agregarNinstalacion(id: number, o: number){
    this.instalaciones.forEach(element => {
      if (element.id_srv == id) {
        element["estatus"] = 2
      }
    });

    if (this.ninstalaciones.includes(id)) {
      this.instalacionesPagos.forEach(element => {
        if (element.id_srv == id) {
          element["estatus"] = 1
        }
      });
      this.ninstalaciones.splice(o, 1);
    } else {
      this.ninstalaciones.push(id);
      console.log(this.ninstalaciones)
    }

  }

  pagar$() {
    this.pago$ = true
    if (this.pagoBs == true) {
      this.pagoBs = false
    }
    this.emisorSeleccionado = ""
    this.receptorSeleccionado = ""
    this.tipoSeleccionado = ""
  }

  pagarBs() {
    this.pagoBs = true
    if (this.pago$ == true) {
      this.pago$ = false
    }
    this.emisorSeleccionado = ""
    this.receptorSeleccionado = ""
    this.tipoSeleccionado = ""
  }

  guardarData() {
    console.log(this.fechaPago)
   
    if (this.pago$) {
      this.comisionFinal = this.comisionDisponibleDl
      this.tipoComision = "$"
      this.pagoComisiones.guardarData(this.monto, this.tipoComision, this.emisorSeleccionado, this.receptorSeleccionado, this.tipoSeleccionado, this.userSeleccionado, this.usuario.currentUser.id_user, this.referencia, this.mesSeleccionado, this.anioSeleccionado,this.fechaPago)
        .subscribe(
          res => {
            this.modalRef.hide()
            this.pagosRecientesDl()
            this.listaPagoComisiones()
            this.emisorSeleccionado = ""
            this.receptorSeleccionado = ""
            this.tipoSeleccionado = ""
            this.referencia = ""
            this.fechaPago = ""
            this.monto = 0
            this.pago$ = false
            this.pagoBs = false
            console.log(res)
          },
          err => console.log(err)
        )
    } else {
      this.comisionFinal = this.comisionDisponibleConversion + this.comisionDisponibleBs
      this.tipoComision = "Bs.S"
      this.pagoComisiones.guardarData(this.monto, this.tipoComision, this.emisorSeleccionado, this.receptorSeleccionado, this.tipoSeleccionado, this.userSeleccionado, this.usuario.currentUser.id_user, this.referencia, this.mesSeleccionado, this.anioSeleccionado,this.fechaPago)
        .subscribe(
          res => {
            this.modalRef.hide()
            this.pagosRecientesBs()
            this.listaPagoComisiones()
            this.emisorSeleccionado = ""
            this.receptorSeleccionado = ""
            this.tipoSeleccionado = ""
            this.referencia = ""
            this.fechaPago = ""
            this.monto = 0
            this.pago$ = false
            this.pagoBs = false
            console.log(res)
          },
          err => console.log(err)
        )
    }

    
  }

  alerta() {
    alert("holaaaaaaaaa")
  }

  irAPdf() {
    this.router.navigate(['/pdfComisiones', this.userSeleccionado, this.mesSeleccionado, this.anioSeleccionado])
  }




}

















































@Component({
  selector: 'app-installer',
  templateUrl: './factura_comision.html',
  styleUrls: ['../facturacion/facturacion.component.css']
})
export class factura_comision implements OnInit, OnDestroy {
  today: number = Date.now();
  id: any;
  mes = ''
  year = ''
  stat = false;
  fac = 'tod';
  status = '';
  meses = [];
  anos = [];
  myService: MyService | null;
  facturacion = [];
  facturacion_t = [];
  search: string = '';
  update: boolean = true;
  autoupdate: boolean = true;
  montos: any;
  pagado: any;
  total_bs: any;
  total_dl: any;
  pagado_bs: any;
  pagado_dl: any;
  deuda_bs: any;
  deuda_dl: any;
  total_cm_dl: any;
  total_cm_bs: any;
  recaudo_cm_bs: any;
  recaudo_cm_dl: any;
  nombre_mes = '';
  comisiones_pg_bs: any;
  comisiones_pg_dl: any;
  total_comisiones: any;
  t_comisiones: any;
  historicos: any;

  constructor(
    private http: Http,
    private datePipe: DatePipe,
    public usuario: AuthGuard,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params
      .subscribe(
        params => {
          this.id = params.id_user;
          console.log(this.id),
            this.pagado = params.inst;
          console.log(this.pagado)
        }
      );
  }


  openDialog(): void {
    let dialogRef = this.dialog.open(null, {
      width: '25%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  stopPropagation(event) {
    event.stopPropagation();
    // console.log("Clicked!");
  }
  ngOnInit() {
    this.route.params.forEach((urlParams) => {
      console.log(urlParams)
      if (urlParams.fecha) {
        var params = urlParams.fecha.split('-')
        console.log(params)
        this.mes = params[0]
        this.year = params[1]
        this.stat = false;
        this.status = 'pendiente';
        this.fac = urlParams.fac;
      } else {
        this.mes = this.datePipe.transform(Date.now(), 'M')
        this.year = this.datePipe.transform(Date.now(), 'y')
        this.stat = false;
        this.status = '';



      }
      console.log('parametros')
    });
    this.refresh(true)
    this.meses = [
      { numero: "1", nombre: 'Enero' },
      { numero: "2", nombre: 'Febrero' },
      { numero: "3", nombre: 'Marzo' },
      { numero: "4", nombre: 'Abril' },
      { numero: "5", nombre: 'Mayo' },
      { numero: "6", nombre: 'Junio' },
      { numero: "7", nombre: 'Julio' },
      { numero: "8", nombre: 'Agosto' },
      { numero: "9", nombre: 'Septiembre' },
      { numero: "10", nombre: 'Octubre' },
      { numero: "11", nombre: 'Noviembre' },
      { numero: "12", nombre: 'Diciembre' },
    ]
    this.anos = [
      { year: "2018" },
      { year: "2019" },
      { year: "2020" }
    ]
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
  }
  ngOnDestroy() {
    this.autoupdate = false
  }

  refresh(nf) {
    this.update = true;
    this.http.get(environment.apiEndpoint + 'fac_comision/' + this.id, { params: { month: this.mes, year: this.year, status: this.stat, fac: this.fac } })
      .subscribe((data) => {
        this.facturacion_t = data.json();
        this.update = false
        this.facturacion = this.facturacion_t;
        if (nf) {
          this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          })
        }

        switch (this.mes) {

          case '1':
            this.nombre_mes = 'Enero';
            break;
          case '2':
            this.nombre_mes = 'Febrero';
            break;
          case '3':
            this.nombre_mes = 'Marzo';
            break;
          case '4':
            this.nombre_mes = 'Abril';
            break;
          case '5':
            this.nombre_mes = 'Mayo';
            break;
          case '6':
            this.nombre_mes = 'Junio';
            break;
          case '7':
            this.nombre_mes = 'Julio';
            break;
          case '8':
            this.nombre_mes = 'Agosto';
            break;
          case '9':
            this.nombre_mes = 'Septiembre';
            break;
          case '10':
            this.nombre_mes = 'Octubre';
            break;
          case '11':
            this.nombre_mes = 'Noviembre';
            break;
          case '12':
            this.nombre_mes = 'Diciembre';
            break;


        }
      });

    this.http.get(environment.apiEndpoint + 'fac_comision_montos/' + this.id, { params: { month: this.mes, year: this.year } })
      .subscribe((data) => {
        this.montos = data.json();
        this.pagado = this.montos.datos;
        this.historicos = this.montos.historico;
        this.update = false;
        console.log(this.pagado);

        let sum_pagados_dol = 0;
        let sum_facturado_dol = 0;
        let sum_pagados_bs = 0;
        let sum_facturado_bs = 0;
        let total_cm_dl = 0;
        let total_cm_bs = 0;
        let recaudo_cm_bs = 0;
        let recaudo_cm_dl = 0;
        let a = 0;
        console.log(this.facturacion)

        for (let i = 0; i < this.facturacion.length; i++) {

          a++;
          console.log('a repitio varias veces' + ' ' + a);
          if (this.facturacion[i].denominacion == '$') {
            if (this.facturacion[i].fac_status == '1') {
              total_cm_dl += ((this.facturacion[i].porcentaje_comision_serv * this.facturacion[i].monto) / 100);
              recaudo_cm_dl += ((this.facturacion[i].porcentaje_comision_serv * this.facturacion[i].pagado) / 100);
              sum_pagados_dol += this.facturacion[i].pagado;
              sum_facturado_dol += this.facturacion[i].monto;


            }
          }
          if (this.facturacion[i].denominacion == 'Bs.S') {
            if (this.facturacion[i].fac_status == '1') {

              if (this.facturacion[i].serie_fac == 1) {

                console.log("VERGAAAAAAAAA " + (this.facturacion[i].monto / 1.16))
                const nuevo_monto = this.facturacion[i].monto / 1.16

                total_cm_bs += ((this.facturacion[i].porcentaje_comision_serv * nuevo_monto) / 100);
                recaudo_cm_bs += ((this.facturacion[i].porcentaje_comision_serv * nuevo_monto) / 100);
              } else {
                total_cm_bs += ((this.facturacion[i].porcentaje_comision_serv * this.facturacion[i].monto) / 100);
                recaudo_cm_bs += ((this.facturacion[i].porcentaje_comision_serv * this.facturacion[i].pagado) / 100);

                sum_pagados_bs += this.facturacion[i].pagado;
                sum_facturado_bs += this.facturacion[i].monto;
              }
            }
          }
        }
        this.recaudo_cm_bs = recaudo_cm_bs;
        this.recaudo_cm_dl = recaudo_cm_dl;
        this.total_bs = sum_facturado_bs;
        this.total_dl = sum_facturado_dol;
        this.pagado_bs = sum_pagados_bs;
        this.pagado_dl = sum_pagados_dol;

        this.deuda_bs = (this.total_bs - this.pagado_bs);
        this.deuda_dl = (this.total_dl - this.pagado_dl);
        this.total_cm_bs = total_cm_bs;
        this.total_cm_dl = total_cm_dl;
        console.log(total_cm_bs);
        console.log(total_cm_dl);
        console.log(sum_facturado_dol);
        console.log(sum_pagados_dol);
        console.log(sum_facturado_bs);
        console.log(sum_pagados_bs);

        console.log(this.montos);


      });
    this.http.get(environment.apiEndpoint + 'pago_comisiones_user/' + this.id, { params: { month: this.mes, year: this.year } })
      .subscribe((data) => {
        this.t_comisiones = data.json();
        this.total_comisiones = this.t_comisiones.datos

        this.update = false;
        console.log(this.total_comisiones);
        let comisiones_pg_bs = 0;
        let comisiones_pg_dl = 0;
        let a = 0;
        for (let i = 0; i < this.total_comisiones.length; i++) {
          a++;
          console.log('a repitio varias veces' + ' ' + a);
          if (this.total_comisiones[i].tipo_pago_comision === '1') {
            comisiones_pg_bs += +this.total_comisiones[i].monto_comision;

          } if (this.total_comisiones[i].tipo_pago_comision === '2') {
            comisiones_pg_dl += +this.total_comisiones[i].monto_comision;
          }

        }

        this.comisiones_pg_bs = comisiones_pg_bs;
        this.comisiones_pg_dl = comisiones_pg_dl;

        console.log(comisiones_pg_bs);
        console.log(comisiones_pg_dl);
      });


  }
  pagar(): void {
    let dialogRef = this.dialog.open(pagar_comisionescomponent, {
      panelClass: 'my-full-screen-dialog',
      data: { pagado: this.pagado, fac: this.facturacion }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }

  notify() {
    this.update = true;
    this.http.post(environment.apiEndpoint + 'notificar/', { responsable: this.usuario.currentUser.id_user })
      .subscribe((data) => { });
  }
  show(row) {
    //console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(FacturacionPagos, {
      width: '75%',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.refresh(false);
      this.snackBar.open("Facturas Actualizadas", null, {
        duration: 2000,
      });
    });
    //this.myService.refresh();

  }

  private delete(id): void {
    //console.log(id); //show`s id
    this.myService.deleteData(id)
      .subscribe((data) => { console.log(data) });
    this.snackBar.open("Borrando Equipo: Por favor espere", null, {
      duration: 1000,
    });
    this.myService.refresh();

  }

}

@Component({
  selector: 'app-installer',
  templateUrl: './pagar_comision.component.html',
  styleUrls: ['./stats.component.css'],

})

export class pagar_comisionescomponent {
  addPago: FormGroup;
  pagado: any;
  facturacion: any;
  search: string = '';
  comment: any = null;
  instalador: any = '';
  nombre_instalador: any;
  apellido_instalador: any;
  id_user: any;
  recaudo_cm_bs: any;
  recaudo_cm_dl: any;
  comisiones_pg_bs: any;
  comisiones_pg_dl: any;
  t_comisiones: any;
  total_comisiones: any;
  constructor(
    public usuario: AuthGuard,
    @Inject(MD_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<pagar_comisionescomponent>,
    private http: Http,
    private location: Location,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public router: Router) {
    console.log(data);
    console.log(data.pagado);
    console.log(data.fac);

    this.pagado = data.pagado;
    this.facturacion = data.fac;


    this.id_user = this.pagado[0].usuario;
    console.log(this.id_user)
    this.http.get(environment.apiEndpoint + 'users/' + this.id_user)
      .subscribe((data) => {
        this.instalador = data.json();
        console.log(this.instalador);
        this.nombre_instalador = this.instalador[0].nombre_user;
        this.apellido_instalador = this.instalador[0].apellido_user;

      });


    let recaudo_cm_bs = 0;
    let recaudo_cm_dl = 0;
    let b = 0;

    for (let i = 0; i < this.facturacion.length; i++) {

      b++;
      console.log('a repitio varias veces' + ' ' + b);
      if (this.facturacion[i].denominacion == '$') {


        recaudo_cm_dl += ((this.facturacion[i].porcentaje_comision_serv * this.facturacion[i].pagado) / 100);



      }
      if (this.facturacion[i].denominacion == 'Bs.S') {

        recaudo_cm_bs += ((this.facturacion[i].porcentaje_comision_serv * this.facturacion[i].pagado) / 100);


      }
    }

    this.recaudo_cm_bs = recaudo_cm_bs.toFixed(2);
    this.recaudo_cm_dl = recaudo_cm_dl.toFixed(2);

    this.http.get(environment.apiEndpoint + 'pago_comisiones_user/' + this.pagado[0].usuario, { params: { month: this.pagado[0].month, year: this.pagado[0].year } })
      .subscribe((data) => {
        this.t_comisiones = data.json();
        this.total_comisiones = this.t_comisiones.datos


        console.log(this.total_comisiones);
        let comisiones_pg_bs = 0;
        let comisiones_pg_dl = 0;

        for (let i = 0; i < this.total_comisiones.length; i++) {
          if (this.total_comisiones[i].tipo_pago_comision === '1') {
            comisiones_pg_bs += +this.total_comisiones[i].monto_comision;

          } if (this.total_comisiones[i].tipo_pago_comision === '2') {
            comisiones_pg_dl += +this.total_comisiones[i].monto_comision;
          }
        }

        this.comisiones_pg_bs = comisiones_pg_bs.toFixed(2);
        this.comisiones_pg_dl = comisiones_pg_dl.toFixed(2);

        console.log(comisiones_pg_bs);
        console.log(comisiones_pg_dl);
      });


    this.addPago = this.fb.group({

      monto_comision: ['', Validators.required],
      referencia_comision: ['', Validators.required],
      banco_comision: ['', Validators.required],
      fecha_comision: ['', Validators.required],
      tipo_pago_comision: ['', Validators.required],
      user_responsable: this.usuario.currentUser.id_user,
      user_comision: this.pagado[0].usuario,
      comment_comision: ['', Validators.required],
      month: this.pagado[0].month,
      year: this.pagado[0].year
    });


  }

  pagar() {

    var url = environment.apiEndpoint + "report_pago/";
    this.http.post(url, this.addPago.value).subscribe((data) => {
      this.dialogRef.close();

    });
  }

  Close() {
    this.location.back();
  }
  onNoClick(): void {
    this.dialogRef.close();

  }
}
