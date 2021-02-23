import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Facturacion} from '../models/facturacion';
import { AuthGuard } from '../_guards/index';
import {ExcelService} from '../services/excel/excel.service';
import { FacturacionPagos, MyService } from '../facturacion/facturacion.component';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { environment } from '../../environments/environment';
import {DatePipe, Location} from '@angular/common';
import {Http, Response} from '@angular/http';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';




@Component({
  selector: 'app-facturacion-n',
  templateUrl: './facturacion-n.component.html',
  styleUrls: ['./facturacion-n.component.css']
})
export class FacturacionNComponent implements OnInit {

  today: number = Date.now();

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
  prueba: any = [];
  dato: Facturacion;
  search: string = '';
  update:boolean=true;
  autoupdate:boolean=true;

  constructor(
    private http: Http,
    private datePipe: DatePipe,
    public usuario: AuthGuard,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private excelService:ExcelService
  ) {
    this.snackBar.open("Cargando Facturas", null, {
      duration: 10000,
    });
    this.myService = new MyService(http, router);
    this.http.get(environment.apiEndpoint+'facturas1/'+this.usuario.currentUser.id_user)
    .subscribe((data) => {
      this.facturacion = data.json();
      this.facturacion_t = this.facturacion;
      this.update=false;
    // console.log(this.facturacion );
    });
    /*this.snackBar.open("Facturas Cargadas", null, {
      duration: 2000,
    });*/
   }

  ngOnInit() {
    this.route.params.forEach((urlParams) => {
      console.log(urlParams)
      if(urlParams.fecha){
        var params=urlParams.fecha.split('-')
        console.log(params)
        this.mes= params[0]
        this.year= params[1]
        this.stat=false;
        this.status=urlParams.status;
        this.fac = urlParams.fac;
      }else{
        this.mes= this.datePipe.transform(Date.now(), 'M')
        this.year= this.datePipe.transform(Date.now(), 'y')
        this.stat=false;
        this.status='';
      }
      console.log('parametros')
    });
    /*this.refresh(true)
    IntervalObservable.create(10000)
    .takeWhile(() => this.autoupdate)
    .subscribe(() => {
      this.refresh(false);
    });*/
  }

  refresh(nf){
    this.update=true;
    this.http.get(environment.apiEndpoint+'facturas1/'+this.usuario.currentUser.id_user, {params:{month: this.mes, year: this.year, status: this.stat, fac: this.fac}})
    .subscribe((data) => {
      this.facturacion_t = data.json();
      console.log(data.json())
      this.update=false
      this.facturacion=this.facturacion_t;
      if (nf){
        this.snackBar.open("Lista Actualizada", null, {
          duration: 2000,
        })
      }
    });
  }

  exportAsXLSX():void {
    this.facturacion_t.forEach(e => {
      this.dato = {
        dni: e.dni,
        cliente: e.cliente,
        monto: e.monto,
        pagado: e.pagado,
        deuda:e.deuda,
        estado: e.estado};
      this.prueba.push(this.dato)
    });
    this.excelService.exportAsExcelFile(this.prueba, 'Facturacion');
  }

  notify(){
    this.update=true;
    this.http.post(environment.apiEndpoint+'notificar/', {responsable: this.usuario.currentUser.id_user})
    .subscribe((data) => {});
  }

  stopPropagation(event){
    event.stopPropagation();
    // console.log("Clicked!");
  }

  show(row){
    //console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(FacturacionPagos, {
      width: '80%',
      data: row  
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.snackBar.open("Facturas Actualizadas", null, {
        duration: 2000,
      });
    });
    //this.myService.refresh();

  }

}
