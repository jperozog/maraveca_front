import {Component, Inject, Pipe, PipeTransform} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent {


      myService: MyService | null;
      data: any = null;
      search: string = '';
      constructor(private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router) {
        this.snackBar.open("Cargando Facturas", null, {
          duration: 2000,
        });
        this.myService = new MyService(http, router);
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/facturas/')
          .subscribe((data) => {
            this.data = data.json();
            console.log(this.data);
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
      refresh(){
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/facturas/')
          .subscribe((data) => {
            this.data = data.json();
            console.log(this.data);
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
          this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/facturas/')
            .subscribe((data) => {
              this.data = data.json();
              //console.log(this.data);
            });
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

        return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/equipos/'+id, {})
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

  fac_control : string ;
  fac_products : any = null;
  fac_pagos : any = null;
  cliente : any;
  email : any;
  phone : any;
  address : any;
  dni : any;
  monto: any;
  montosi: any;
  pagado: any;
  deuda: any;
  opcion: string;
  nada: string;
  tipo: any;
  impuesto:any = 0;
  serie:any;

  constructor(
    private http:Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<FacturacionPagos>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    private _fb: FormBuilder
){
  //console.log(row);
  this.cliente = row.cliente;
  this.email = row.email;
  this.phone = row.phone;
  this.address = row.address;
  this.dni = row.dni;
  this.monto = row.monto

  if(row.pagado == null){
    this.pagado = 0;
  }else{
    this.pagado = parseInt(row.pagado);
  }
  this.deuda=parseInt(this.monto)-parseInt(this.pagado);
  this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/facprod/'+row.id)
  .subscribe((data) => {
    this.fac_products = data.json();
    //console.log(this.fac_products.slice(0,3));
  });
  this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/facpag/'+row.id)
  .subscribe((data) => {
    this.fac_pagos = data.json();
    //console.log(this.fac_pagos.slice(0,3));
  });
  this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/clientes/'+row.id_cliente)
  .subscribe((data) => {
    this.serie = data.json().serie;
    if(this.serie == 1){
      this.impuesto = (this.monto / 112) * 12;
      this.montosi = this.monto;
      this.monto = this.monto - this.impuesto;
    }
    //console.log(this.fac_pagos.slice(0,3));
  });

}

agregar(){
  let body = "fac_id="+this.row.id+"&pag_tip="+this.tipo+"&pag_monto="+this.nada+"&pag_comment="+this.opcion;
  //console.log(body);
  this.http.post('http://186.167.32.27:81/maraveca/public/index.php/api/facpag?'+body, body)
  .subscribe((data)=>{
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/facpag/'+this.row.id)
    .subscribe((data) => {
      this.fac_pagos = data.json();
      //console.log(this.fac_pagos.slice(0,3));
    });
    this.pagado=parseInt(this.pagado)+parseInt(this.nada);
    this.deuda=parseInt(this.monto)-parseInt(this.pagado);
    if (this.deuda <= 0) {

    }
    //this.pagos.push({opcion: this.opcion, nada: this.nada});
    this.opcion = "";
    this.nada = "";
  })
}

}
