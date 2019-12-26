import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {Router, ActivatedRoute} from '@angular/router';
import {DatePipe, Location} from '@angular/common';
import { AuthGuard } from '../_guards/index';
import { environment } from '../../environments/environment'
import { BaseChartDirective }   from 'ng2-charts/ng2-charts';
import {MyService} from '../../src/app/servidores/servidores.component';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {FacturacionPagos, UpdatePlanPricesFacDialog} from '../facturacion/facturacion.component';
import { CustomValidators } from 'ngx-custom-validators';




@Component({
  selector: 'app-stat',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {
     @ViewChild(BaseChartDirective)
     chart: BaseChartDirective;
    data:any = null;
    fechas:any = null;
    search: string = '';
    pagado  = [];
    tittle="Grafico Comparativo 4 meses"
    facturado  = [];
    numero_pagos=[];
    monto_pagos=[];
    dias_pagos=[];
    _chartData:any;
    datos:boolean=false
    lineChartType:string = 'line';
    constructor(private http: Http, public usuario: AuthGuard, public dialog: MdDialog, public snackBar:MdSnackBar, public router: Router) {
      this.snackBar.open("Cargando AccessPoints", null, {
        duration: 2000,
      });
      this.http.get(environment.apiEndpoint+'stat/')
        .subscribe((data) => {
          this.fechas = data.json().fechas;
          this.data = data.json().datos;
          data.json().datos.forEach(fecha =>{
            this.pagado.push(fecha.pagado)
            this.facturado.push(fecha.facturado)

          })
          this.labels = [this.fechas[3].fecha,this.fechas[2].fecha,this.fechas[1].fecha,this.fechas[0].fecha]
          var _chartData=[
            {label:'Facturado',
            data: [this.facturado[3], this.facturado[2], this.facturado[1], this.facturado[0]]},
            {label: 'Pagado',
            data: [this.pagado[3], this.pagado[2], this.pagado[1], this.pagado[0]]},
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
      intersect: false ,
      callbacks: {
        label: function (tooltipItem, data) {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          return  datasetLabel + ': ' +tooltipItem.yLabel.toLocaleString('en-us') + ' Bs.S';
        }
      }},
    scales: {
        xAxes: [{
            title: 'meses/años'
        }],
        yAxes: [/*{
          title: 'Bs.S'
        },*/
          { ticks: {
  beginAtZero: true // se agrega la siguiente linea para que la grafica comience desde 0
}}],

      }
  }

  labels = [];

  // STATIC DATA FOR THE CHART IN JSON FORMAT.
  chartData=[
    {label:'Facturado',
    data: this.facturado},
    {label: 'Pagado',
    data: this.pagado},
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

goTOfac(i){
  this.router.navigate(['facturacion', {fecha:i.fecha, fac:'bs'}]);
}

// CHART CLICK EVENT.
    onChartClick(event) {
      console.log(event);
    }
    changeTYPE(dat){
      this.tittle="Grafico con detalles del mes "+dat.fecha
      this.http.get(environment.apiEndpoint+'incidencia/?mes='+dat.fecha)
        .subscribe((data) => {
          var data_mes = data.json()
          this.labels.length = 0;
          this.chartData[0].data.length=0
          this.chartData[1].data.length=0
          this.chartData[0].label="Numero de Pagos"
          this.chartData[1].label="Monto de Pagos"

          data_mes.forEach(dia =>{
            this.chartData[1].data.push(dia.monto_pagos);
            this.chartData[0].data.push(dia.numero_pagos);
            this.labels.push(dia.fecha);
          })
          this.chartOptions = {
          responsive: true,    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
          tooltips: {
            mode: 'index',
            intersect: false ,
            callbacks: {
              label: function (tooltipItem, data) {
                const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                return  datasetLabel + ': ' +tooltipItem.yLabel.toLocaleString('en-us') + ' ' +data_mes[0].denominacion;
              }
            }},
          scales: {
              xAxes: [{
                  title: 'meses/años'
              }],
              yAxes: [/*{
                title: data_mes[0].denominacion se comenta la siguiente linea para que la grafica comience desde 0
              }*/
                { ticks: {
                    beginAtZero: true // se agrega la siguiente linea para que la grafica comience desde 0
                  }}
              ],

            }
        }
          this.lineChartType='bar'
          this.chart.chart.update()
          })
      console.log(this.chartData)
    }
  refresh(){
    this.http.get(environment.apiEndpoint+'stat/')
      .subscribe((data) => {
        this.data= data.json();
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
  data:any = null;
  fechas:any = null;
  search: string = '';
  pagado  = [];
  tittle="Grafico Comparativo 4 meses"
  facturado  = [];
  numero_pagos=[];
  monto_pagos=[];
  dias_pagos=[];
  _chartData:any;
  datos:boolean=false
  lineChartType:string = 'line';
  constructor(private http: Http, public usuario: AuthGuard, public dialog: MdDialog, public snackBar:MdSnackBar, public router: Router) {
    this.snackBar.open("Cargando AccessPoints", null, {
      duration: 2000,
    });
    this.http.get(environment.apiEndpoint+'statdl/')
      .subscribe((data) => {
        this.fechas = data.json().fechas;
        this.data = data.json().datos;
        data.json().datos.forEach(fecha =>{
          this.pagado.push(fecha.pagado)
          this.facturado.push(fecha.facturado)
console.log(this.data);
        })
        this.labels = [this.fechas[3].fecha,this.fechas[2].fecha,this.fechas[1].fecha,this.fechas[0].fecha]
        var _chartData=[
          {label:'Facturado',
            data: [this.facturado[3], this.facturado[2], this.facturado[1], this.facturado[0]]},
          {label: 'Pagado',
            data: [this.pagado[3], this.pagado[2], this.pagado[1], this.pagado[0]]},
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
      intersect: false ,
      callbacks: {
        label: function (tooltipItem, data) {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          return  datasetLabel + ': ' +tooltipItem.yLabel.toLocaleString('en-us') + ' US$.';
        }
      }},
    scales: {
      xAxes: [{
        title: 'meses/años'
      }],
      yAxes: [/*{
          title: 'Bs.S'
        },*/
        { ticks: {
            beginAtZero: true // se agrega la siguiente linea para que la grafica comience desde 0
          }}],

    }
  }

  labels = [];

  // STATIC DATA FOR THE CHART IN JSON FORMAT.
  chartData=[
    {label:'Facturado',
      data: this.facturado},
    {label: 'Pagado',
      data: this.pagado},
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

  goTOfac(i){
    this.router.navigate(['facturacion', {fecha:i.fecha, fac:'dol'}]);
  }

// CHART CLICK EVENT.
  onChartClick(event) {
    console.log(event);
  }
  changeTYPE(dat){
    this.tittle="Grafico con detalles del mes "+dat.fecha
    this.http.get(environment.apiEndpoint+'incidencia/?mes='+dat.fecha)
      .subscribe((data) => {
        var data_mes = data.json()
        this.labels.length = 0;
        this.chartData[0].data.length=0
        this.chartData[1].data.length=0
        this.chartData[0].label="Numero de Pagos"
        this.chartData[1].label="Monto de Pagos"

        data_mes.forEach(dia =>{
          this.chartData[1].data.push(dia.monto_pagos);
          this.chartData[0].data.push(dia.numero_pagos);
          this.labels.push(dia.fecha);
        })
        this.chartOptions = {
          responsive: true,    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
          tooltips: {
            mode: 'index',
            intersect: false ,
            callbacks: {
              label: function (tooltipItem, data) {
                const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                return  datasetLabel + ': ' +tooltipItem.yLabel.toLocaleString('en-us') + ' ' +data_mes[0].denominacion;
              }
            }},
          scales: {
            xAxes: [{
              title: 'meses/años'
            }],
            yAxes: [/*{
                title: data_mes[0].denominacion se comenta la siguiente linea para que la grafica comience desde 0
              }*/
              { ticks: {
                  beginAtZero: true // se agrega la siguiente linea para que la grafica comience desde 0
                }}
            ],

          }
        }
        this.lineChartType='bar'
        this.chart.chart.update()
      })
    console.log(this.chartData)
  }
  refresh(){
    this.http.get(environment.apiEndpoint+'statdl/')
      .subscribe((data) => {
        this.data= data.json();
        console.log(this.data);
      });

  }

}
  @Component({
    selector: 'app-installer',
    templateUrl: './pagar.component.html',
    styleUrls: ['./stats.component.css']
  })

  export class PagarComponent{
    myService: MyService | null;
    data:any = null;
    search: string = '';
    constructor(
      public usuario: AuthGuard,
      private http: Http,
      public dialog: MdDialog,
      public snackBar:MdSnackBar,
      public router: Router) {

      this.myService = new MyService(http, router);
        this.snackBar.open("Cargando Usuarios", null, {
          duration: 2000,
        });
        this.http.get(environment.apiEndpoint+'installers/')
        .subscribe((data) => {
          this.data = data.json();
          console.log(this.data);
        
        });

        this.snackBar.open("Usuarios Cargadas", null, {
          duration: 2000,
        });
      }
      show(row){

    }

  }


  @Component({
    selector: 'app-installer',
    templateUrl: './detallePagar.component.html',
    styleUrls: ['./stats.component.css']
  })

  export class DetallesInstallerComponent{
    modo: any = 1;
    instalaciones:any = null;
    pagos:any = null;
    search: string = '';
    instalador: any = '';
    constructor(
      public usuario: AuthGuard,
      private route: ActivatedRoute,
      private http: Http,
      private location: Location,
      public dialog: MdDialog,
      public snackBar:MdSnackBar,
      public router: Router) {
        this.route.params
        .subscribe(
          params => {
            this.instalador = params.inst;
            console.log(this.instalador)
          }
        );

        this.http.get(environment.apiEndpoint+'installer/'+this.instalador)
        .subscribe((data) => {
          this.instalaciones = data.json().instalaciones;
          this.pagos = data.json().pagos;
          console.log(this.instalaciones);
        });
        this.http.get(environment.apiEndpoint+'users/'+this.instalador)
        .subscribe((data) => {
          this.instalador = data.json();
          console.log(this.instalador);
        });
        this.snackBar.open("Instaladores Cargados", null, {
          duration: 2000,
        });

      }



    pagar(): void {
        let dialogRef = this.dialog.open(cargarPagocomponent, {
          panelClass: 'my-full-screen-dialog',
          data: this.instalador
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');

        })
      }
      show(row){

    }
    Close(){this.location.back();}

  }


  @Component({
    selector: 'app-installer',
    templateUrl: './cargarpago.component.html',
    styleUrls: ['./stats.component.css']
  })

  export class cargarPagocomponent {
    addPago: FormGroup;
    data: any = null;
    search: string = '';
    n: any = null;
    monto: any = null;
    refer: any = null;
    banco: any = null;
    fecha: any = null;
    comment: any = null;

    //instalador: any = '';
    constructor(
      public usuario: AuthGuard,
      @Inject(MD_DIALOG_DATA) public instalador: any,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      public dialogRef: MdDialogRef<cargarPagocomponent>,
      private http: Http,
      private location: Location,
      public dialog: MdDialog,
      public snackBar: MdSnackBar,
      public router: Router) {
      console.log(instalador)
    }

    pagar() {
      this.addPago = this.fb.group({
        n: this.n,
        monto: this.monto,
        referencia: this.refer,
        banco: this.banco,
        fecha: this.fecha,
        responsable: this.usuario.currentUser.id_user,
        installer: this.instalador[0].id_user,
        comment: this.comment
      })
      var url = environment.apiEndpoint + "instpagos/";
      this.http.post(url, this.addPago.value).subscribe((data) => {
        this.dialogRef.close();

      });
    }

   /* Close() {
      this.location.back();
    }*/
    onNoClick(): void {
      this.dialogRef.close();

  }
  }
@Component({
  selector: 'app-installer',
  templateUrl: './otrospago.component.html',
  styleUrls: ['./stats.component.css']
})
export class OtrosPagosComponent{
  myService: MyService | null;
  data:any = null;
  search: string = '';
  constructor(
    public usuario: AuthGuard,
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    public router: Router) {
    this.myService = new MyService(http, router);
    this.snackBar.open("Cargando Usuarios", null, {
      duration: 2000,
    });
    this.http.get(environment.apiEndpoint+'oinstallers/')
      .subscribe((data) => {
        this.data = data.json();
        console.log(this.data);
      });

    this.snackBar.open("Usuarios Cargadas", null, {
      duration: 2000,
    });
  }
  show(row){

  }

}

@Component({
  selector: 'app-installer',
  templateUrl: './odetallePagar.component.html',
  styleUrls: ['./stats.component.css']
})
export class DetallesotherInstallerComponent{
  modo: any = 1;
  instalaciones:any = null;
  pagos:any = null;
  search: string = '';
  instalador: any = '';
  constructor(
    public usuario: AuthGuard,
    private route: ActivatedRoute,
    private http: Http,
    private location: Location,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    public router: Router) {
    this.route.params
      .subscribe(
        params => {
          this.instalador = params.inst;
          console.log(this.instalador)
        }
      );
    this.http.get(environment.apiEndpoint+'oinstaller/'+this.instalador)
      .subscribe((data) => {
        this.instalaciones = data.json().instalaciones;
        this.pagos = data.json().pagos;
        console.log(this.instalaciones);
      });
    this.http.get(environment.apiEndpoint+'users/'+this.instalador)
      .subscribe((data) => {
        this.instalador = data.json();
        console.log( this.instalador);
      });
    this.snackBar.open("Instaladores Cargados", null, {
      duration: 2000,
    });

  }

  pagar2(): void {
    let dialogRef = this.dialog.open(cargarOpagocomponent, {
      panelClass: 'my-full-screen-dialog',
      data: this.instalador
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  show(row){

  }
  Close(){this.location.back();}

}
@Component({
  selector: 'app-installer',
  templateUrl: './cargarotropago.component.html',
  styleUrls: ['./stats.component.css']
})

export class cargarOpagocomponent {

  addPago: FormGroup;
  data: any = null;
  search: string = '';
  n: any = null;
  monto: any = null;
  refer: any = null;
  banco: any = null;
  fecha: any = null;
  comment: any = null;
  c_otr: any;
  S_otr: any;
instalaciones: any=null;
oinstalador: any=null;
 prueba: [any];



 //pagos: any= null;
trabajo
  //instalador: any = '';

  constructor(
    public usuario: AuthGuard,
    @Inject(MD_DIALOG_DATA) public instalador: any,

    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<cargarPagocomponent>,
    private http: Http,
    private location: Location,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public router: Router) {

   console.log(instalador)
    //console.log(instalaciones);


   this.http.get(environment.apiEndpoint + 'oinstaller/' +instalador[0].id_user)
      .subscribe((data) => {
        this.instalaciones = data.json().instalaciones;
        //this.pagos = data.json().pagos;
        console.log(this.instalaciones);
      });
  }

  pagar() {
    for (let i in this.prueba) {
    this.addPago = this.fb.group({
      prueba: this.prueba[i],
      monto: this.monto,
      referencia: this.refer,
      banco: this.banco,
      fecha: this.fecha,
      responsable: this.usuario.currentUser.id_user,
      installer: this.instalador[0].id_user,
      comment: this.comment



    })

    var url = environment.apiEndpoint + "oinstallpgo/";
    this.http.post(url, this.addPago.value).subscribe((data) => {
      console.log(this.addPago.value);

      this.dialogRef.close();
      console.log(this.prueba);


    });
 }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
 /* Close() {
    this.location.back();
  }*/


}
@Component({
  selector: 'app-installer',
  templateUrl: './pagos_comisiones.html',
  styleUrls: ['./stats.component.css']
})

export class Pagar_comisones_Component{
  myService: MyService | null;
  data:any = null;
  search: string = '';
  constructor(
    public usuario: AuthGuard,
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    public router: Router) {

    this.myService = new MyService(http, router);
    this.snackBar.open("Cargando Usuarios", null, {
      duration: 2000,
    });
    this.http.get(environment.apiEndpoint+'user_comision/')
      .subscribe((data) => {
        this.data = data.json();
        console.log(this.data);

      });

    this.snackBar.open("Usuarios Cargadas", null, {
      duration: 2000,
    });
  }
  show(row){

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
  mes=''
  year=''
  stat=false;
  fac='tod';
  status='';
  meses=[];
  anos=[];
  myService: MyService | null;
  facturacion= [];
  facturacion_t = [];
  search: string = '';
  update:boolean=true;
  autoupdate:boolean=true;
  montos: any;
  pagado: any;
 total_bs: any;
  total_dl:any;
  pagado_bs:any;
  pagado_dl:any;
  deuda_bs: any;
  deuda_dl: any;
  total_cm_dl:any;
  total_cm_bs:any;
  recaudo_cm_bs:any;
  recaudo_cm_dl:any;
  nombre_mes= '';
  comisiones_pg_bs:any;
  comisiones_pg_dl:any;
  total_comisiones:any;
  t_comisiones:any;
  historicos: any;

  constructor(
    private http: Http,
    private datePipe: DatePipe,
    public usuario: AuthGuard,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
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
    this.snackBar.open("Cargando Facturas", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router);
    this.http.get(environment.apiEndpoint+'fac_comision/'+this.id)
      .subscribe((data) => {
        this.facturacion = data.json();
        this.facturacion_t = this.facturacion;
        this.update=false;

        console.log(this.facturacion);
      });
    this.snackBar.open("Facturas Cargadas", null, {
      duration: 2000,
    });

    this.http.get(environment.apiEndpoint+'fac_comision_montos/'+this.id)
      .subscribe((data) => {
        this.montos = data.json();
        this.pagado = this.montos.datos;

        this.update=false;

      });
    this.http.get(environment.apiEndpoint+'history_pago/'+this.id)
      .subscribe((data) => {
        this.historicos = data.json();
        this.autoupdate=false;
          console.log(this.historicos);
      });
    this.http.get(environment.apiEndpoint+'pago_comisiones_user/'+this.id)
      .subscribe((data) => {
        this.total_comisiones = data.json();
        this.update=false;
        console.log(this.total_comisiones);
      });
  }


  openDialog(): void {
    let dialogRef = this.dialog.open(null, {
      width: '25%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  stopPropagation(event){
    event.stopPropagation();
    // console.log("Clicked!");
  }
  ngOnInit(){
    this.route.params.forEach((urlParams) => {
      console.log(urlParams)
      if(urlParams.fecha){
        var params=urlParams.fecha.split('-')
        console.log(params)
        this.mes= params[0]
        this.year= params[1]
        this.stat=false;
        this.status='pendiente';
      }else{
        this.mes= this.datePipe.transform(Date.now(), 'M')
        this.year= this.datePipe.transform(Date.now(), 'y')
        this.stat=false;
        this.status='';



      }
      console.log('parametros')
    });
    this.refresh(true)
    this.meses=[
      {numero:"1", nombre:'Enero'},
      {numero:"2", nombre:'Febrero'},
      {numero:"3", nombre:'Marzo'},
      {numero:"4", nombre:'Abril'},
      {numero:"5", nombre:'Mayo'},
      {numero:"6", nombre:'Junio'},
      {numero:"7", nombre:'Julio'},
      {numero:"8", nombre:'Agosto'},
      {numero:"9", nombre:'Septiembre'},
      {numero:"10", nombre:'Octubre'},
      {numero:"11", nombre:'Noviembre'},
      {numero:"12", nombre:'Diciembre'},
    ]
    this.anos=[
      {year:"2018"},
      {year:"2019"}
    ]
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
  }
  ngOnDestroy(){
    this.autoupdate=false
  }

  refresh(nf){
    this.update=true;
    this.http.get(environment.apiEndpoint+'fac_comision/'+this.id, {params:{month: this.mes, year: this.year, status: this.stat, fac: this.fac}})
      .subscribe((data) => {
        this.facturacion_t = data.json();
        this.update=false
        this.facturacion=this.facturacion_t;
        if (nf){
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

    this.http.get(environment.apiEndpoint+'fac_comision_montos/'+this.id, {params:{month: this.mes, year: this.year}})
      .subscribe((data) => {
        this.montos = data.json();
        this.pagado = this.montos.datos;
        this.historicos = this.montos.historico;
        this.update=false;
        console.log(this.historicos);

        let sum_pagados_dol=0;
        let sum_facturado_dol= 0;
        let sum_pagados_bs=0;
        let sum_facturado_bs= 0;
        let total_cm_dl=0;
        let total_cm_bs=0;
        let recaudo_cm_bs=0;
        let recaudo_cm_dl=0;

        for (let i = 0; i < this.pagado.length; i++) {
          if(this.pagado[i].denominacion == '$')
          {

            total_cm_dl += ((this.pagado[i].comision * this.pagado[i].facturado) / 100);
            recaudo_cm_dl += ((this.pagado[i].comision * this.pagado[i].pagado) / 100);
            sum_pagados_dol += this.pagado[i].pagado;
            sum_facturado_dol += this.pagado[i].facturado;


          }
          if(this.pagado[i].denominacion == 'Bs.S')
          {
            total_cm_bs += ((this.pagado[i].comision * this.pagado[i].facturado) / 100);
            recaudo_cm_bs += ((this.pagado[i].comision * this.pagado[i].pagado) / 100);

            sum_pagados_bs += this.pagado[i].pagado;
            sum_facturado_bs += this.pagado[i].facturado;
          }
        }
        this.recaudo_cm_bs = recaudo_cm_bs;
        this.recaudo_cm_dl = recaudo_cm_dl;
        this.total_bs = sum_facturado_bs;
        this.total_dl = sum_facturado_dol;
        this.pagado_bs = sum_pagados_bs;
        this.pagado_dl = sum_pagados_dol;

        this.deuda_bs = (this.total_bs -  this.pagado_bs);
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
    this.http.get(environment.apiEndpoint+'pago_comisiones_user/'+this.id, {params:{month: this.mes, year: this.year}})
      .subscribe((data) => {
        this.t_comisiones = data.json();
        this.total_comisiones = this.t_comisiones.datos

        this.update=false;
        console.log(this.total_comisiones);
        let comisiones_pg_bs = 0;
        let comisiones_pg_dl = 0;
        for (let i = 0; i < this.total_comisiones.length; i++) {
          if(this.total_comisiones[i].tipo_pago_comision === '1')
        {
            comisiones_pg_bs += +this.total_comisiones[i].monto_comision;

         } if(this.total_comisiones[i].tipo_pago_comision === '2')

       {
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
      data: this.pagado
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }

  notify(){
    this.update=true;
    this.http.post(environment.apiEndpoint+'notificar/', {responsable: this.usuario.currentUser.id_user})
      .subscribe((data) => {});
  }
  show(row){
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

  private delete(id):void{
    //console.log(id); //show`s id
    this.myService.deleteData(id)
      .subscribe((data) => {console.log(data)});
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
  data: any = null;
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
    @Inject(MD_DIALOG_DATA) public pagado: any,
    private route: ActivatedRoute,
    private fb: FormBuilder,
   public dialogRef: MdDialogRef<pagar_comisionescomponent>,
    private http: Http,
    private location: Location,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public router: Router) {
    console.log(pagado)




 this.id_user= this.pagado[0].usuario;
    console.log(this.id_user)
   this.http.get(environment.apiEndpoint+'users/'+this.id_user)
      .subscribe((data) => {
        this.instalador = data.json();
        console.log( this.instalador);
        this.nombre_instalador = this.instalador[0].nombre_user;
        this.apellido_instalador = this.instalador[0].apellido_user;

      });


    let recaudo_cm_bs=0;
    let recaudo_cm_dl=0;

    for (let i = 0; i < this.pagado.length; i++) {
      if(this.pagado[i].denominacion == '$')
      {


        recaudo_cm_dl += ((this.pagado[i].comision * this.pagado[i].pagado) / 100);


      }
      if(this.pagado[i].denominacion == 'Bs.S')
      {

        recaudo_cm_bs += ((this.pagado[i].comision * this.pagado[i].pagado) / 100);


      }
    }
    this.recaudo_cm_bs = recaudo_cm_bs.toFixed(2);
    this.recaudo_cm_dl = recaudo_cm_dl.toFixed(2);

    this.http.get(environment.apiEndpoint+'pago_comisiones_user/'+this.pagado[0].usuario, {params:{month: this.pagado[0].month, year: this.pagado[0].year}})
      .subscribe((data) => {
        this.t_comisiones = data.json();
        this.total_comisiones = this.t_comisiones.datos


        console.log(this.total_comisiones);
        let comisiones_pg_bs = 0;
        let comisiones_pg_dl = 0;
        for (let i = 0; i < this.total_comisiones.length; i++) {
          if(this.total_comisiones[i].tipo_pago_comision === '1')
          {
            comisiones_pg_bs += +this.total_comisiones[i].monto_comision;

          } if(this.total_comisiones[i].tipo_pago_comision === '2')

          {
            comisiones_pg_dl += +this.total_comisiones[i].monto_comision;
          }
        }

        this.comisiones_pg_bs = comisiones_pg_bs.toFixed(2);
        this.comisiones_pg_dl = comisiones_pg_dl.toFixed(2);

        console.log(comisiones_pg_bs);
        console.log(comisiones_pg_dl);
      });


    this.addPago = this.fb.group({

      monto_comision: ['', Validators.required ],
      referencia_comision: ['', Validators.required ],
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

  /* Close() {
     this.location.back();
   }*/
  onNoClick(): void {
    this.dialogRef.close();

  }
}
