import {Component, Inject, Pipe, PipeTransform, OnInit, OnDestroy} from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment'


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
  status='';
  meses=[];
  anos=[];
  myService: MyService | null;
  facturacion= [];
  facturacion_t = [];
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
    private route: ActivatedRoute
  ) {
    this.snackBar.open("Cargando Facturas", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router);
    this.http.get(environment.apiEndpoint+'facturas/')
    .subscribe((data) => {
      this.facturacion = data.json();
      this.facturacion_t = this.facturacion;
      this.update=false;
      //console.log(this.data);
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
    this.http.get(environment.apiEndpoint+'facturas/', {params:{month: this.mes, year: this.year, status: this.stat}})
    .subscribe((data) => {
      this.facturacion = data.json();
      this.facturacion_t = this.facturacion;
      this.update=false;
      //console.log(this.data);
    });
    this.snackBar.open("Facturas Cargadas", null, {
      duration: 2000,
    });
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
    this.http.get(environment.apiEndpoint+'facturas/', {params:{month: this.mes, year: this.year, status: this.stat}})
    .subscribe((data) => {
      this.facturacion_t = data.json();
      this.update=false
      this.facturacion=this.facturacion_t;
      if (nf){
        this.snackBar.open("Lista Actualizada", null, {
          duration: 2000,
        })
      }
    });
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
  constructor(
    private http:Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<FacturacionPagos>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    public usuario: AuthGuard,
    private router: Router,
    private _fb: FormBuilder,
    public dialog: MdDialog
  ){
    this.linea = row;
    //console.log("row")
    //console.log(row);
    this.cliente = row.cliente;
    this.email = row.email;
    this.phone = row.phone;
    this.address = row.address;
    this.dni = row.dni;
    this.monto = row.monto;
    this.addPago = this.fb.group({
      fac_id: this.row.id,
      pag_tip: ['',[Validators.required]],
      pag_monto: ['',[Validators.required]],
      pag_comment: ['',[Validators.required]],
      created_at: ['', [Validators.required]]
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
    this.deuda=this.monto-this.pagado;
    this.http.get(environment.apiEndpoint+'facprod/'+row.id)
    .subscribe((data) => {
      this.fac_products = data.json();
      this.iva= this.fac_products[0].IVA;
      this.neto = (100/(+this.iva+100))
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
      this.serie = data.json().serie;
      this.client = data.json()
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
    console.log(this.agregarProducto)
  }
  addProducto(){
    if(this.serie == 1){
    this.precio_articulo=(this.addProduct.value.precio_unitario*((+this.fac_products[0].IVA+100)/100))*this.addProduct.value.cantidad;
  }else{
    this.precio_articulo=this.addProduct.value.precio_unitario*this.addProduct.value.cantidad;
  }
    this.addProduct.patchValue({
      precio_articulo: this.precio_articulo,
      IVA: this.fac_products[0].IVA
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
