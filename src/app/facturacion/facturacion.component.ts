import {LOCALE_ID, Component, Inject, Pipe, PipeTransform, OnInit, OnDestroy} from '@angular/core';
import localeEs from '@angular/common/locales/es';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';
import {DatePipe, Location} from '@angular/common';
import { environment } from '../../environments/environment';
import {DeletePlanDialog, UpdatePlanPricesDialog} from '../planes/planes.component';
import {ExcelService} from '../services/excel/excel.service';
import { forEach } from '@angular/router/src/utils/collection';
import {Facturacion} from '../models/facturacion';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit, OnDestroy {
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
      duration: 2000,
    });
    this.myService = new MyService(http, router);
    this.http.get(environment.apiEndpoint+'facturas1/'+this.usuario.currentUser.id_user)
    .subscribe((data) => {
      this.facturacion = data.json();
      this.facturacion_t = this.facturacion;
      this.update=false;
    // console.log(this.facturacion );
    });
    this.snackBar.open("Facturas Cargadas", null, {
      duration: 2000,
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
      {year:"2019"},
      {year:"2020"}
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
  updatePricesfac(): void {
    let dialogRef = this.dialog.open(UpdatePlanPricesFacDialog, {
      width: '25%'
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


export class MyService {

  constructor(private http: Http, private router: Router) {

  }

  deleteData(id){

    return this.http.delete(environment.apiEndpoint+'equipos/'+id, {})
    .map((resp:Response)=>resp.json());



  }

  refresh(){
    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('facturacion') > -1 ? '/clients' : '/facturacion';
    setTimeout(() =>
    {
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
    },
    1000);
  }

}

@Component({
  selector: 'app-facturacion-pagos',
  templateUrl: './facturacion.pagos.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionPagos {
  Arr = Array;
  addPago: FormGroup;
  addProduct: FormGroup;
  fac_control : string ;
  fac_products : any = null;
  num_products : any = 0;
  numbers:any=null;
  fac_pagos : any = null;
  cliente : any;
  client : any = [];
  email : any;
  phone : any;
  address : any;
  dni : any;
  monto: any;
  fecha:any;
  montosi: any;
  pagado: any;
  deuda: any;
  opcion: string;
  nada: string;
  tipo: any;
  impuesto:any = 0;
  serie:any;
  codigo_factura:any;
  nombre_articulo:any;
  precio_unitario:any;
  cantidad:any;
  precio_articulo:any;
  comment_articulo:any;
  linea: any;
  iva: any = 0
  neto: any = 0
  sending_m = false
  sending_p = false
  agregarProducto:boolean=false;
  config = [];
  iva_c: any;
  fecha_f: any;
  mes: any;
  precio_producto: any;
  tasa_sis: any;
  data_cofig : any;
  tasa_generacion:number
 show:boolean = true;
 buttonName:any = 'calculo de monto en Bs.S segun la tasa actual';
  constructor(
    private http:Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<FacturacionPagos>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    public usuario: AuthGuard,
    private router: Router,
    private _fb: FormBuilder,
    public dialog: MdDialog,
    @Inject(LOCALE_ID) private locale: string
  ){
    this.fecha_f = row.updated_at;
    this.linea = row;
    //console.log("row")
    //console.log(row);
    this.cliente = row.cliente;
    this.email = row.email;
    this.phone = row.phone;
    this.address = row.address;
    this.dni = row.dni;
    this.monto = row.monto;
    this.tasa_generacion = row.tasa_generacion
    this.addPago = this.fb.group({
      fac_id: this.row.id,
      pag_tip: ['',[Validators.required]],
      pag_monto: ['',[Validators.required]],
      pag_comment: ['',[Validators.required]],
      created_at: ['', [Validators.required]],
      responsable: this.usuario.currentUser.id_user
    })
    this.addProduct = this.fb.group({
      codigo_factura: this.row.id,
      nombre_articulo: ['',[Validators.required]],
      precio_unitario: ['',[Validators.required]],
      IVA: '',
      cantidad: ['',[Validators.required]],
      precio_articulo: '',
      comment_articulo: '',


    })

    if(row.pagado == null){
      this.pagado = 0;
    }else{
      this.pagado = row.pagado;
    }
    console.log(row);
    this.deuda=this.monto-this.pagado;
    this.http.get(environment.apiEndpoint+'facprod/'+row.id)
      .subscribe((data) => {
        this.fac_products = data.json();
        this.iva= this.fac_products[0].IVA;
        this.neto = (100/(+this.iva+100))

        this.precio_producto = this.fac_products.precio_articulo;


        let product = 0;
        for (let i = 0; i < this.fac_products.length; i++) {


         product += (+this.fac_products[i].precio_articulo);

         this.precio_producto = product;
        }

        console.log( this.precio_producto);


        if(this.fac_products.length <=12){
          this.num_products = 12-this.fac_products.length;
          //this.numbers = Array(5).fill().map((x,i)=>i); // [0,1,2,3,4]
          console.log(this.num_products);
        }
        //console.log(this.fac_products.slice(0,3));
      });
    this.http.get(environment.apiEndpoint+'facpag/'+row.id)
      .subscribe((data) => {
        this.fac_pagos = data.json();
        //console.log(this.fac_pagos.slice(0,3));
      });
    this.http.get(environment.apiEndpoint+'clientes/'+row.id_cliente)
      .subscribe((data) => {

        this.client = data.json()
        this.serie = row.serie_fac
        console.log(this.serie);
        if(this.serie == 1)
        {

          console.log(this.monto)
          console.log(this.iva)
          this.impuesto = ((this.monto / (+this.iva+100)) * this.iva);
          console.log(this.impuesto)
          this.montosi = this.monto;
          this.monto = this.monto * (100/(+this.iva+100));
        }if(this.serie != 1){
          this.montosi = this.monto;
        }
        //console.log(this.fac_pagos.slice(0,3));
      });


    this.http.get(environment.apiEndpoint+'Configuraciones/')
      .subscribe((data) => {
        this.data_cofig = data.json();
        console.log(this.data_cofig);
        this.tasa_sis = this.data_cofig[0].valor;
        console.log(this.tasa_sis);
      });


  }
  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show) {
      this.buttonName = "calculo de monto en Bs.S segun la tasa actual";

    }  else{
      this.buttonName = "Volver a monto en dolares";
  }
  }

  sendmail(){
    var url = environment.apiEndpoint+"facturas/"+this.row.id;
    if(this.client.email!= null && this.client.email.toUpperCase()!="NULL"){
      var post = this.fb.group({
          responsable: this.usuario.currentUser.id_user
        }
      )
      this.http.post(url, post.value)
        .subscribe((data)=>{
          this.snackBar.open("Correo Enviado", null, {
            duration: 2000,
          });
        })

    }else{
      this.snackBar.open("Cliente no tiene correo registrado", null, {
        duration: 2000,
      });
    }
  }

  print(): void {
    let moment = this.deuda;
    this.deuda = 0;
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
    <head>
    <title></title>
    <style>
    @page {
      size: A4;
      margin: 0 10px 0 10px;
    }
span{
font-size: 12px
}
    table.fac, th.fac, td.fac {
      border:1px solid black;
      font-size: 12px
    }
    table.fact, th.fact, td.fact {
      border-bottom: 1px solid black;
      font-size: 12px
    }
    table.fontprod, th.fontprod, td.fontprod {
      font-size: 10px
    }
    table.fontna, th.fontna, td.fontna {
      min-width: 35%;
    }
    table.fontc, th.fontc, td.fontc {
      min-width: 20%;
    }
    table.fontz, th.fontz, td.fontz {
      font-size: 12px
    }

    .boto {
      border-top: 1px solid black;
    }
    .bobo {
      border-bottom: 1px solid black
    }
.mensajeBS{
  border: 1px solid black;
  width: 60%;
  font-size: 14px;
  padding: 5px;

}

.Der{
  float: Right;
  margin-top: -5%;


}

}
    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
      }

    }
    </style>
    </head>
    <body onload="window.print();window.close()">
    <table>
    <tr><td style="height:130px"></td></tr>
    </table>
    `+printContents+`
    </body>
    </html>`
    );
    popupWin.document.close();
    //onload="window.print();window.close()"
    this.deuda = moment;
  }
  deletepagoDialog(row): void {
    console.log(row);
    let dialogRef = this.dialog.open(deletepagoDialog, {
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
      this.http.get(environment.apiEndpoint+'facpag/'+this.row.id)
        .subscribe((data) => {
          this.fac_pagos = data.json();
          this.sending_p = false
          //console.log(this.fac_pagos.slice(0,3));
        });
      this.pagado=this.pagado-this.row.pag_monto;
      this.deuda=this.monto-this.pagado;
    });
  }
  deleteProductDialog(row): void {
    console.log(row);
    let dialogRef = this.dialog.open(deleteProductDialog, {
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
      this.http.get(environment.apiEndpoint+'facprod/'+this.row.id)
        .subscribe((data) => {
          this.fac_products = data.json();
          //console.log(this.fac_pagos.slice(0,3));

        });
      this.monto=this.monto-row.precio_articulo;
      this.deuda=this.monto-this.pagado;

    });
  }
  activar(){
    this.agregarProducto=true;
    console.log(this.agregarProducto);
    this.http.get(environment.apiEndpoint+'Configuraciones/')
      .subscribe((data) => {
        this.config = data.json();
        this.iva_c = this.config[2].valor;
        //console.log(this.fac_pagos.slice(0,3));
        console.log(this.config);
        console.log(this.iva_c);
      });
  }
  addProducto(){
    if(this.serie == 1){
      this.precio_articulo=(this.addProduct.value.precio_unitario*((+this.iva_c+100)/100))*this.addProduct.value.cantidad;
    }else{
      this.precio_articulo=this.addProduct.value.precio_unitario*this.addProduct.value.cantidad;
    }
    console.log(this.config);
    console.log(this.fac_products);
    this.addProduct.patchValue({
      precio_articulo: this.precio_articulo,
     IVA: this.iva_c

    })

    var url = environment.apiEndpoint+"facprod";
    this.http.post(url, this.addProduct.value)
      .subscribe((data)=>{
        this.agregarProducto=false;
        this.http.get(environment.apiEndpoint+'facprod/'+this.row.id)
          .subscribe((data) => {
            this.fac_products = data.json();
            //console.log(this.fac_pagos.slice(0,3));
          });
        this.monto=this.monto+this.precio_articulo;
        this.deuda=this.monto-this.pagado;
        if (this.deuda <= 0) {

        }
        //this.pagos.push({opcion: this.opcion, nada: this.nada});
        this.codigo_factura='';
        this.nombre_articulo='';
        this.precio_unitario='';
        this.cantidad='';
        this.precio_articulo='';
        this.comment_articulo='';
      })
  }
  agregar(){
    //let body = "fac_id="+this.row.id+"&pag_tip="+this.tipo+"&pag_monto="+this.nada+"&pag_comment="+this.opcion;
    //console.log(body);
    console.log(this.addPago.value);
    this.sending_p = true
    var url = environment.apiEndpoint+"facpag";
    this.http.post(url, this.addPago.value)
      .subscribe((data)=>{
        this.agregarProducto=false;
        this.http.get(environment.apiEndpoint+'facpag/'+this.row.id)
          .subscribe((data) => {
            this.fac_pagos = data.json();
            this.sending_p = false
            //console.log(this.fac_pagos.slice(0,3));
          });
        this.pagado=this.pagado+this.nada;
        this.deuda=this.monto-this.pagado;
        if (this.deuda <= 0) {

        }
        //this.pagos.push({opcion: this.opcion, nada: this.nada});
        this.opcion = "";
        this.nada = "";
      }, error =>{ this.sending_p = false })
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-delete-pago.html',
  styleUrls: ['./facturacion.component.css']
})
export class deletepagoDialog {
  myService: MyService | null;

  constructor(
    public dialogRef: MdDialogRef<deletepagoDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
      console.log(this.data);
    }




    delete(data): void {
      console.log(this.data);

      this.http.delete(environment.apiEndpoint+'fac_pago/'+data.id+'?responsable='+this.usuario.currentUser.id_user, {})
      .subscribe((data)=>{
        this.dialogRef.close();
        this.snackBar.open("Pago Borrado: Por favor espere", null, {
          duration: 1000,
        });

      });

      //this.myService.refresh();
      //this.myService.refresh();
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }
  @Component({
    selector: 'delete-dialog',
    templateUrl: 'confirm-delete-producto.html',
    styleUrls: ['./facturacion.component.css']
  })
  export class deleteProductDialog {
    myService: MyService | null;

    constructor(
      public dialogRef: MdDialogRef<deleteProductDialog>,
      @Inject(MD_DIALOG_DATA) public data: any,
      private http: Http,
      public dialog: MdDialog,
      public snackBar:MdSnackBar,
      private router: Router,
      private usuario: AuthGuard) {
        console.log(this.data);
      }




      delete(data): void {
        console.log(this.data);
        this.http.delete(environment.apiEndpoint+'fac_product/'+data.id+'?responsable='+this.usuario.currentUser.id_user, {})
        .subscribe((data)=>{
          this.dialogRef.close();
          this.snackBar.open("Borrando cliente: Por favor espere", null, {
            duration: 1000,
          });
        })
        //this.myService.refresh();
      }

      onNoClick(): void {
        this.dialogRef.close();
      }

    }

    @Component({
      templateUrl: 'confirm.pago.component.html',
      styleUrls: ['./facturacion.component.css']
    })
    export class ConfirmPagoDialog implements OnInit, OnDestroy {
      constructor(
        public dialogRef: MdDialogRef<ConfirmPagoDialog>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private http: Http,
        public dialog: MdDialog,
        public snackBar:MdSnackBar,
        private router: Router,
        private usuario: AuthGuard) {
          console.log(this.data);
        }

      ngOnInit(){
        console.log(this.data)
      }
      ngOnDestroy(){

      }
      onNoClick(): void {
        this.dialogRef.close();
      }
      aprov(): void{
        this.http.put(environment.apiEndpoint+'balance/', this.data)
        .subscribe((data) => {
          this.dialogRef.close();
        })

        this.snackBar.open("aprovando pago: Por favor espere", null, {
          duration: 4000,
        });
        this.dialogRef.close();
      }
    }
@Component({
  templateUrl: 'confirm.pago_int.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class ConfirmPagoDialog2 implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MdDialogRef<ConfirmPagoDialog2>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
    console.log(this.data);
  }

  ngOnInit(){
    console.log(this.data)
  }
  ngOnDestroy(){

  }
  onNoClick2(): void {
    this.dialogRef.close();
  }
  aprov2(): void{
    this.http.put(environment.apiEndpoint+'balance_in/', this.data)
      .subscribe((data) => {
        console.log(data)
        this.dialogRef.close();
      })

    this.snackBar.open("aprovando pago: Por favor espere", null, {
      duration: 4000,
    });
    this.dialogRef.close();
  }
}
    @Component({
      templateUrl: 'decline.pago.component.html',
      styleUrls: ['./facturacion.component.css']
    })
    export class DeclinePagoDialog implements OnInit, OnDestroy {
      DeclinePagos: FormGroup
      constructor(
        public dialogRef: MdDialogRef<DeclinePagoDialog>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private http: Http,
        private _fb: FormBuilder,
        private fb: FormBuilder,
        public dialog: MdDialog,
        public snackBar:MdSnackBar,
        private router: Router,
        private usuario: AuthGuard) {
        }

      ngOnInit(){
        console.log(this.data);
        this.DeclinePagos = this.fb.group({
          id_bal: this.data.id_bal,
          option: ['', [Validators.required]],
          reason: [''],
          obs: [''],

        })
        this.DeclinePagos.get('option').valueChanges.subscribe(
          (op) => {
            if ( op != 1){
              this.DeclinePagos.get('reason').setValidators([]);
              this.DeclinePagos.get('reason').updateValueAndValidity();
            }else if( op == 1 ){
              this.DeclinePagos.get('reason').setValidators([Validators.required]);
              this.DeclinePagos.get('reason').updateValueAndValidity();
            }
          })
      }
      ngOnDestroy(){

      }
      onNoClick(): void {
        this.dialogRef.close();
      }
      rem(): void{
        console.log(this.DeclinePagos.value);
        this.http.delete(environment.apiEndpoint+'balance/', {params: this.DeclinePagos.value})
        .subscribe((data) => {
          this.dialogRef.close();
        })
      }
    }
    @Component({
      templateUrl: 'aprov.pagos.component.html',
      styleUrls: ['./facturacion.component.css']
    })
    export class AprovPagos implements OnInit, OnDestroy {
      myService: MyService | null;
      balance=[];
      balance_t=[];
      autoupdate=true
      constructor(
        private http: Http,
        public dialog: MdDialog,
        public snackBar:MdSnackBar,
        private router: Router,
        private location: Location,
        private usuario: AuthGuard) {
        }

        ngOnInit(){
          IntervalObservable.create(10000)
          .takeWhile(() => (this.autoupdate))
          .subscribe(() => {
            this.refresh(false);
          });
          this.refresh(false);

        }
        ngOnDestroy(){
          this.autoupdate=false
        }
        refresh(test){
          this.http.get(environment.apiEndpoint+'balance/', {params:{uid: this.usuario.currentUser.id_user}})
          .subscribe((data) => {
            this.balance_t = data.json();
            this.balance = this.balance_t;
            //console.log(this.dash);

          });
        }
        aprov(i): void{
          let dialogRef = this.dialog.open(ConfirmPagoDialog, {
            data: i,
            width: '25%'
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');

          })

        }

        rem(i): void{
          let dialogRef = this.dialog.open(DeclinePagoDialog, {
            data: i,
            width: '25%'
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');

          })
        }
      Close(){this.location.back();}
        // aprov(i): void{
        //   this.http.put(environment.apiEndpoint+'balance/', i)
        //   .subscribe((data) => {
        //
        //   })
        //
        // }
        // rem(i): void{
        //   this.http.delete(environment.apiEndpoint+'balance/', {params: {id_bal: i.id_bal, bal_cli: i.bal_cli}})
        //   .subscribe((data) => {
        //
        //   })
        // }
      }

@Component({
  templateUrl: 'aprov.pagos.in.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class AprovPagosin implements OnInit, OnDestroy {
  myService: MyService | null;
  balance=[];
  balance_t=[];
  autoupdate=true
  constructor(
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private location: Location,
    private usuario: AuthGuard) {
  }

  ngOnInit(){
    IntervalObservable.create(10000)
      .takeWhile(() => (this.autoupdate))
      .subscribe(() => {
        this.refresh(false);
      });
    this.refresh(false);

  }
  ngOnDestroy(){
    this.autoupdate=false
  }
  refresh(test){
    this.http.get(environment.apiEndpoint+'balance_in/', {params:{uid: this.usuario.currentUser.id_user}})
      .subscribe((data) => {
        this.balance_t = data.json();
        this.balance = this.balance_t;
        //console.log(this.dash);

      });
  }
  aprov2(i): void{
    let dialogRef = this.dialog.open(ConfirmPagoDialog2, {
      data: i,
      width: '25%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })

  }

  rem2(i): void{
    let dialogRef = this.dialog.open(DeclinePagoDialog2, {
      data: i,
      width: '25%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  Close(){this.location.back();}
  // aprov(i): void{
  //   this.http.put(environment.apiEndpoint+'balance/', i)
  //   .subscribe((data) => {
  //
  //   })
  //
  // }
  // rem(i): void{
  //   this.http.delete(environment.apiEndpoint+'balance/', {params: {id_bal: i.id_bal, bal_cli: i.bal_cli}})
  //   .subscribe((data) => {
  //
  //   })
  // }
}
@Component({
  templateUrl: 'decline.pago.in.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class DeclinePagoDialog2 implements OnInit, OnDestroy {
  DeclinePagos: FormGroup
  constructor(
    public dialogRef: MdDialogRef<DeclinePagoDialog2>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    private _fb: FormBuilder,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
  }

  ngOnInit(){
    console.log(this.data);
    this.DeclinePagos = this.fb.group({
      id_bal_in: this.data.id_bal_in,
      option: ['', [Validators.required]],
      reason: [''],
      obs: [''],
      user_bal_mod:[0],

    })
    this.DeclinePagos.get('option').valueChanges.subscribe(
      (op) => {
        if ( op != 1){
          this.DeclinePagos.get('reason').setValidators([]);
          this.DeclinePagos.get('reason').updateValueAndValidity();
        }else if( op == 1 ){
          this.DeclinePagos.get('reason').setValidators([Validators.required]);
          this.DeclinePagos.get('reason').updateValueAndValidity();
        }
      })
  }
  ngOnDestroy(){

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  rem2(): void{
    console.log(this.DeclinePagos.value);
    this.http.delete(environment.apiEndpoint+'balance_in/', {params: this.DeclinePagos.value})
      .subscribe((data) => {
        this.dialogRef.close();
      })
  }
}

@Component({
  selector: 'Update-Prices',
  templateUrl: 'UpdatePrices_Fac.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class UpdatePlanPricesFacDialog{
  myService: MyService | null;
  addplan: FormGroup;
  constructor(
    public dialogRef: MdDialogRef<DeletePlanDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private fb: FormBuilder) {
    this.myService = new MyService(http, router);
    this.addplan = this.fb.group({
      taza: '',

    });
  }

  update(): void {
    var plan = this.addplan.value;
    console.log(JSON.stringify(this.addplan.value));
    var body = "taza=" + plan.taza;
    var url = environment.apiEndpoint+"price_fac/update";

    this.http.post(url, this.addplan.value).subscribe((data) => {
      this.dialogRef.close();
      this.snackBar.open("Editando Plan: Por favor espere", null, {
        duration: 2000,
      });

    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  templateUrl: 'balance_bs.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class balance_bs  {
  myService: MyService | null;
  balance=[];
  balance_t=[];
  search: string = '';
  autoupdate: boolean;
  update = true;
  constructor(
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private location: Location,
    private usuario: AuthGuard) {
    console.log(this.usuario.currentUser.id_user);

    this.http.get(environment.apiEndpoint+'balance/')
      .subscribe((data) => {
        this.balance_t = data.json();
        this.balance = this.balance_t;
        //console.log(this.dash);
        console.log(this.balance_t);

      });
  }
    Edit_ref(i): void{
      let dialogRef = this.dialog.open(Editar_ref_bs, {
        data: i,
        width: '40%'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })

  }

  refresh(nf) {
    this.update = true
    this.autoupdate = false
    this.http.get(environment.apiEndpoint+'balance/')
      .subscribe((data) => {
        this.balance_t = data.json();
        this.balance = this.balance_t;
        if (nf) {
          this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          });
        }
      });

  }

  Close(){this.location.back();}
  }





@Component({
  templateUrl: 'balance_dl.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class balance_dl  {
  myService: MyService | null;
  balance=[];
  balance_t=[];
  search: string = '';
  autoupdate: boolean;
  update = true;
  constructor(
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private location: Location,
    private usuario: AuthGuard) {
    console.log(this.usuario.currentUser.id_user);

    this.http.get(environment.apiEndpoint+'balance_in/')
      .subscribe((data) => {
        this.balance_t = data.json();
        this.balance = this.balance_t;
        //console.log(this.dash);
        console.log(this.balance_t);

      });
  }
  Edit_ref_in(i): void{
    let dialogRef = this.dialog.open(Editar_ref_dl, {
      data: i,
      width: '40%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })

  }

  refresh(nf) {
    this.update = true
    this.autoupdate = false
    this.http.get(environment.apiEndpoint+'balance_in/')
      .subscribe((data) => {
        this.balance_t = data.json();
        this.balance = this.balance_t;
        if (nf) {
          this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          });
        }
      });

  }

  Close(){this.location.back();}
}


@Component({
  templateUrl: 'editar_ref_bs.html',
  styleUrls: ['./facturacion.component.css']
})
export class Editar_ref_bs implements OnInit, OnDestroy {
 Edit_pago_bs: FormGroup;
  update:boolean=true;
  user: any;

  constructor(
    public dialogRef: MdDialogRef<DeclinePagoDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    private _fb: FormBuilder,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
    console.log(this.usuario.currentUser.id_user);
this.user = this.usuario.currentUser.id_user;
  }


  ngOnInit(){
    console.log(this.user);
    console.log(this.data);
    this.Edit_pago_bs = this.fb.group({
      id_bal: this.data.id_bal,
      bal_tip: this.data.bal_tip,
      bal_from: this.data.bal_from,
      bal_monto: this.data.bal_monto,
        bal_rest: this.data.bal_rest,
      bal_comment: this.data.bal_comment,
     bal_comment_mod: '',
      bal_fecha_mod: '',
      user_bal_mod: this.user

    })

  }
  ngOnDestroy(){

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  rem(){
    var client = this.Edit_pago_bs.value;
  console.log(JSON.stringify(this.Edit_pago_bs.value));
   let dp = new DatePipe(navigator.language);
    var url = environment.apiEndpoint + "edit_balance/" + this.data.id_bal;
    //console.log(body);

    this.snackBar.open("Editando Informacion del Pago", null, {
    duration: 2000,
  });

  this.http.put(url, this.Edit_pago_bs.value).subscribe((data) => {
  this.dialogRef.close();
});

}
}


@Component({
  templateUrl: 'editar_ref_dl.html',
  styleUrls: ['./facturacion.component.css']
})
export class Editar_ref_dl implements OnInit, OnDestroy {
  Edit_pago_dl: FormGroup;
  update:boolean=true;
  user: any;

  constructor(
    public dialogRef: MdDialogRef<DeclinePagoDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    private _fb: FormBuilder,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
    console.log(this.usuario.currentUser.id_user);
    this.user = this.usuario.currentUser.id_user;
  }


  ngOnInit(){
    console.log(this.user);
    console.log(this.data);
    this.Edit_pago_dl = this.fb.group({
      id_bal_in: this.data.id_bal_in,
      bal_tip_in: this.data.bal_tip_in,
      bal_from_in: this.data.bal_from_in,
      bal_monto_in: this.data.bal_monto_in,
      bal_rest_in: this.data.bal_rest_in,
      bal_comment_in: this.data.bal_comment_in,
      bal_comment_mod_in: '',
      bal_fecha_mod_in: '',
      user_bal_mod_in: this.user

    })

  }
  ngOnDestroy(){

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  rem(){
    var client = this.Edit_pago_dl.value;
    console.log(JSON.stringify(this.Edit_pago_dl.value));
    let dp = new DatePipe(navigator.language);
    var url = environment.apiEndpoint + "edit_balance_in/" + this.data.id_bal_in;
    //console.log(body);

    this.snackBar.open("Editando Informacion del Pago", null, {
      duration: 2000,
    });

    this.http.put(url, this.Edit_pago_dl.value).subscribe((data) => {
      this.dialogRef.close();
    });

  }
}
