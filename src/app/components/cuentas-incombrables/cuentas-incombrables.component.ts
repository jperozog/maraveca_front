import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../_guards/index';
import {CuentasIncobrablesService} from '../../services/cuentas-incobrables/cuentas-incobrables.service'
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-cuentas-incombrables',
  templateUrl: './cuentas-incombrables.component.html',
  styleUrls: ['./cuentas-incombrables.component.css']
})
export class CuentasIncombrablesComponent implements OnInit {
  cuentas: any = []
  exonerados: any = []
  anioSeleccionado: number = 0
  mesSeleccionado:number = 0
  e:number = 1
  p:number = 1

  public lineChartDataG2: any[] = [{ data: [0, 0, 0], label: 'Monto'}];
  public lineChartLabelsG2: any[] = ['', '', ''];
  public lineChartOptionsG2: (any & { annotation: any }) = {
    responsive: true,

  };
  public lineChartColorsG2: any[] = [
    {
      backgroundColor: '#EFC4C3',
      borderColor: '#CD4032',
      pointBackgroundColor: '#CD4032',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartTypeG2 = 'line';

  public pieChartLabels: any[] = ['Total', 'Clientes Exonerados',"Exoneraciones"];
  public pieChartData: number[] = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#32ACCD', '#CDC832','#C46B21'],
    },
  ];


  constructor(
       public usuario: AuthGuard,
       public cuentasServices: CuentasIncobrablesService,

    ) { }

  ngOnInit() {
    var today = new Date();
    this.mesSeleccionado = today.getMonth() + 1
    this.anioSeleccionado = today.getFullYear()
   this.traerCuentas()
   this.traerDatosGraficaCuentasIncobrables()
   this.traerClientesExonerados()
   this.traerDatosGraficaCuentasExonerados()
  }

  traerCuentas(){
    this.cuentasServices.traeCuentas(this.anioSeleccionado,this.mesSeleccionado).subscribe(res=>{console.log(res),this.cuentas = res}, err=>console.log(err))
  }


  traerClientesExonerados(){
    this.cuentasServices.clientesExonerados().subscribe(res=>{console.log(res),this.exonerados = res}, err=>console.log(err))
  }



  traerDatosGraficaCuentasIncobrables() {
    this.cuentasServices.datosGraficaCuentasIncobrables()
      .subscribe(
        res => {
          console.log(res)

          this.lineChartDataG2 = [
            { data: [res["datos"][2].monto,res["datos"][1].monto, res["datos"][0].monto], label: 'Monto' }
          ]

          this.lineChartLabelsG2 = [res["fechas"][2].fecha,res["fechas"][1].fecha, res["fechas"][0].fecha]
         

        },
        err => console.log(err))
  }

  traerDatosGraficaCuentasExonerados() {
    this.cuentasServices.datosGraficaCuentasExonerados()
      .subscribe(
        res => {
          console.log(res),
          this.pieChartData = [res[0].facturado, res[0].monto,res[0].exoneraciones]
        },
        err => console.log(err))
  }

}
