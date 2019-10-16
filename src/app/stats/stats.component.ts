import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {Router, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../_guards/index';
import { environment } from '../../environments/environment'
import { BaseChartDirective }   from 'ng2-charts/ng2-charts';
import {MyService} from '../../src/app/servidores/servidores.component';



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
  this.router.navigate(['facturacion', {fecha:i.fecha}]);
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
    this.router.navigate(['facturacion', {fecha:i.fecha}]);
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
