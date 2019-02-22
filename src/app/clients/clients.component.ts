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
import { User } from '../_models/index';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';
import { AuthGuard } from '../_guards/index';
import { AuthenticationService } from '../_services/index';
import { APP_CONFIG } from '../app.config';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/takeWhile';
import { Location } from '@angular/common';
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';
import { environment } from '../../environments/environment'
import { FacturacionPagos, ConfirmPagoDialog, DeclinePagoDialog } from '../facturacion/facturacion.component'
import { PreComponent } from '../presupuestos/pre.component'
import { AddservicesComponent } from '../servicios/servicios.component'
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PHONE_REGEX = /^(0414\d|0412\d|0416\d|0426\d|0424\d|0415\d)+\d{6}/;
const KIND_REGEX= /^(V|J|E|G)/

@Pipe({name: 'capitalize'})
export class CapitalizePipe implements PipeTransform {

    transform(value:any) {
        if (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    }

}

@Pipe({ name: 'dataPipe' })
export class DataTablePipe implements PipeTransform {
  transform(items: any, filter: any, isAnd: false): any {
    //console.log(filter);
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
      //console.log(filter);
      if (isAnd) {
        return items.filter(item =>
            filterKeys.reduce((memo, keyName) =>
                (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === "", true));
      } else{
        return items.filter(item => {
          return filterKeys.some((keyName) => {
            //console.log(keyName);
            return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === "";
          });
        });
      }

    } else {
      return items;
    }
  }
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})

export class ClientsComponent implements OnInit, OnDestroy {


  myService: MyService | null;
  clientes= [];
  pendientes= [];
  clientes_t= [];
  pendientes_t= [];
  search: string = '';
  modo: any = 1;
  update:boolean=true
  autoupdate:boolean=true
  constructor(
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    public usuario: AuthGuard,
    public test: AuthenticationService) {
    this.snackBar.open("Cargando Clientes", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router, usuario);
    this.http.get(environment.apiEndpoint+'clientes1/')
      .subscribe((data) => {
        this.clientes = data.json().clientes;
        this.pendientes = data.json().pendientes;
        this.clientes_t = this.clientes
        this.pendientes_t = this.pendientes
        this.update=false
        //console.log(this.data);
      });
    this.snackBar.open("Clientes Cargados", null, {
      duration: 2000,
    });
  }

  ngOnInit(){
    IntervalObservable.create(10000)
    .takeWhile(() => this.autoupdate)
    .subscribe(() => {
      this.refresh(false);
    });
  }

  ngOnDestroy(){
    this.autoupdate=false
  }
  openDialog(): void {
    /*let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%'
    });*/
    let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%'
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  refresh(nf){
    this.update=true
    this.http.get(environment.apiEndpoint+'clientes1/')
      .subscribe((data) => {
        this.clientes_t = data.json().clientes;
        this.pendientes_t = data.json().pendientes;
        this.update=false
        if (nf){
          this.snackBar.open("Lista Actualizada", null, {
          duration: 2000,
        });}
      });
      this.clientes=this.clientes_t
      this.pendientes=this.pendientes_t
  }
  show(row){
    console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was AddClient closed');
      this.refresh(false);
    });
    //this.myService.refresh();
  }

  status(row){
    console.log(row);
    //this.selectedRowIndex = row.id;
    if(this.usuario.perm && this.usuario.perm.includes('facturacion')){
    let dialogRef = this.dialog.open(ClientesStatus, {
      width: '80%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was AddClient closed');
      this.refresh(false);
    });
    //this.myService.refresh();

  }
  }
  deleteDialog(row): void {
    console.log(row);
  let dialogRef = this.dialog.open(DeleteCliente, {
    data: row
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    //this.animal = result;
  });
  }
  private delete(id):void{
    console.log(id); //show`s id
    this.myService.deleteData(id)
    .subscribe((data) => {console.log(data)});
    this.snackBar.open("Borrando Cliente: Por favor espere", null, {
      duration: 2000,
    });
    //this.myService.refresh();

  }

}

function capitalizeName(name) {
  return name.replace(/\b(\w)/g, s => s.toUpperCase());
}

export class MyService {

  constructor(private http: Http, private router: Router, private usuario: AuthGuard) {}

  deleteData(id){
    return this.http.delete(environment.apiEndpoint+'clientes/'+id+'?responsable='+this.usuario.currentUser.id_user, {})
    .map((resp:Response)=>resp.json());
    //return null;

  }
  refresh(){

    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('clients') > -1 ? '/celdas' : '/clients';

    setTimeout(() =>
    {
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
    },
    2000);
  }
}

@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class AddclientsComponent implements OnInit{

  error : boolean = false;
  tipo : string;
  dni :string;
  email :string;
  name : string;
  last : string;
  dayofbirth : string;
  social : string;
  phone : string;
  phone2 : string;
  serie : string;
  address : string;
  comment: string;
  form: string;
  addClient: FormGroup;
  myService: MyService | null;
  myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        openSelectorOnInputClick: true,
    };


  constructor(
  private http:Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddclientsComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario:AuthGuard,
  private _fb: FormBuilder){

      this.myService = new MyService(http, router, usuario);

      if(row != null){
        this.addClient = this.fb.group({
          kind: [row.kind, [Validators.required, Validators.pattern(KIND_REGEX)]],
          dni: [row.dni, [Validators.required]],
          //email: [row.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
          email: [row.email, [Validators.pattern(EMAIL_REGEX)]],
          nombre: [row.nombre, [Validators.required]],
          apellido: [row.apellido, [Validators.required]],
          direccion: [row.direccion, [Validators.required]],
          day_of_birth: [row.day_of_birth, [Validators.required]],
          serie: [row.serie, [Validators.required]],
          phone1: [row.phone1, [Validators.required, Validators.pattern(PHONE_REGEX)]],
          phone2: [row.phone2, [Validators.required]],
          comment: row.comment,
          id: [row.id, [Validators.required]],
          social: [row.social],
          responsable: this.usuario.currentUser.id_user,
        });
        //console.log(row)
      }else{

        this.addClient = this.fb.group({
          kind: ['', [Validators.required, Validators.pattern(KIND_REGEX)]],
          dni:['', [Validators.required]],
          //email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
          email: ['', [Validators.pattern(EMAIL_REGEX)]],
          nombre: ['', [Validators.required]],
          apellido: ['', [Validators.required]],
          direccion: ['', [Validators.required]],
          day_of_birth: ['', [Validators.required]],
          serie: ['', [Validators.required]],
          phone1: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
          phone2: ['', [Validators.required]],
          comment: '',
          social: [''],
          responsable: this.usuario.currentUser.id_user,

        });
        //console.log("llego vacio"+ row)
      }

    }

    ngOnInit(){
      this.addClient.get('kind').valueChanges.subscribe(
        (kind) => {
          if ( kind.toLowerCase()==='v'||kind.toLowerCase()==='e'){
            this.addClient.get('social').setValidators([]);
            this.addClient.get('social').updateValueAndValidity();
          }else if(kind.toLowerCase()==='g'||kind.toLowerCase()==='j'){
            this.addClient.get('social').setValidators([Validators.required]);
            this.addClient.get('social').updateValueAndValidity();
          }
        })
        /*this.addClient.get('day_of_birth').valueChanges.subscribe(
          (fn) => {
            console.log(fn)
            if(fn.formatted){
              setTimeout(()=>{
              this.addClient.patchValue({
                day_of_birth: fn.epoc
              })
            }, 100)
          }
        })*/
    }

    onNoClick(): void {
      this.dialogRef.close();
    }


    Enviar(){
      var client = this.addClient.value;

      var url = environment.apiEndpoint+"clientes";

      this.http.post(url, client).subscribe(data => {
        this.dialogRef.close();
        this.snackBar.open("Agregando Cliente: Por favor espere", null, {
          duration: 2000,
        });
      }, error => {
        this.error=true
      });
      //this.myService.refresh();
      //this.router.navigate(['/clientes']);
    }
    Editar(){
      var client = this.addClient.value;
      var url = environment.apiEndpoint+"clientes/"+client.id;
      this.http.put(url, client).subscribe((data) => {
        this.dialogRef.close();
      });
      //this.myService.refresh();
      this.snackBar.open("Agregando Cliente: Por favor espere", null, {
        duration: 2000,
      });
      //this.router.navigate(['/clientes']);
    }


    sendSMS(){
      var client = this.addClient.value;
      //console.log(this.phone);
      if(
        client.phone1 != "" &&
        client.phone1 != null &&
        client.nombre != null &&
        client.nombre != "" &&
        client.apellido != null &&
        client.apellido != ""){


          const req = this.http.post(environment.apiEndpoint+'sms', {
            numero: client.phone1 ,
            mensaje: 'Este es un mensaje de prueba de MARAVECA, saludos '+ client.nombre + " " + client.apellido,
            userId: 1
          })

          .subscribe(
            res => {
              console.log(res);

            },
            err => {
              console.log("Error occured");
            }
          );
          this.snackBar.open("Mensaje Enviado", null, {
            duration: 2000,
          });
        }else{
          console.log("complete los campos");
          this.snackBar.open("Para enviar mensajes debe completar los campos nombre, apellido y telefono", null, {
            duration: 2000,
          });
        }
      }

    }

    @Component({
  selector: 'app-clients-astatus',
  templateUrl: './clients-astatus.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientesStatus {

  fac_control : string ;
  fac_products : any = null;
  fac_pagos : any = null;
  cliente : any;
  email : any;
  phone : any;
  address : any;
  dni : any;
  monto: number= 0;
  montosi: number= 0;
  iva: number= 0;
  pagado: number=0;
  deuda: number=0;
  opcion: string;
  nada: string;
  tipo: any;
  pagos: number = 0;
  id: any;
  //cliente: null;
  constructor(
    private http:Http,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<ClientsComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard,
    private _fb: FormBuilder

){
  //console.log(row);
  if(row.pagado == null){
    this.pagado = 0;
  }else{
    this.pagado = parseInt(row.pagado);
  }
  this.cliente=row.nombre+" "+row.apellido
  this.http.get(environment.apiEndpoint+'facturas/'+row.id)
  .subscribe((data) => {
    this.fac_products = data.json();
    console.log(this.fac_products.slice(0,3));
    this.fac_products.forEach(linea => {
      //this.montosi = this.montosi + linea.monto;
      if(row.serie == 1){
        linea.monto = linea.monto
      }
      //this.iva = this.montosi * 0.12;
      this.monto = this.monto + linea.monto;
      this.pagado = this.pagado + linea.pagado;
      console.log(this.monto+" | "+this.pagado);
    });
    this.deuda=this.monto-this.pagado;
    this.id = row.id;
  });

}

generate(fecha){
  const req = this.http.post(environment.apiEndpoint+'factura', {
    cliente: this.row.id ,
    fecha : "18-08-01"
    //fecha : fecha
  }).subscribe(result => {
    this.monto = 0;
    this.pagado = 0;
    this.http.get(environment.apiEndpoint+'facturas/'+this.id)
    .subscribe((data) => {
      this.fac_products = data.json();
      console.log(this.fac_products.slice(0,3));
      this.fac_products.forEach(linea => {
        this.monto += linea.monto;
        this.pagado += linea.pagado;
        console.log(this.monto+" | "+this.pagado);
      });
      this.deuda=this.monto-this.pagado;
    });
  })
}

//aqui comenzara el dialog de detalles de una facturas
status(row){
  console.log(row);
  //this.selectedRowIndex = row.id;
  //this.id = row.id;
  let dialogRef = this.dialog.open(FacturacionPagos, {
    width: '80%',
    data: row
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was AddClient closed');
    this.monto = 0;
    this.pagado = 0;
    this.http.get(environment.apiEndpoint+'facturas/'+this.id)
    .subscribe((data) => {
      this.fac_products = data.json();
      console.log(this.fac_products.slice(0,3));
      this.fac_products.forEach(linea => {
        this.monto += linea.monto;
        this.pagado += linea.pagado;
        console.log(this.monto+" | "+this.pagado);
      });
      this.deuda=this.monto-this.pagado;
    });
  });
  //this.myService.refresh();

}



}

@Component({
selector: 'delete-dialog',
templateUrl: 'confirm-delete.html',
styleUrls: ['./clients.component.css']
})
export class DeleteCliente {
  myService: MyService | null;

  constructor(
    public dialogRef: MdDialogRef<DeleteCliente>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
      this.myService = new MyService(http, router, usuario);
      console.log(this.data);
     }




    delete(): void {
      console.log(this.data);
      this.myService.deleteData(this.data.id)
      .subscribe((data) => {console.log(data)});
      this.dialogRef.close();
      this.snackBar.open("Borrando cliente: Por favor espere", null, {
        duration: 1000,
      });
      //this.myService.refresh();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
selector: 'delete-dialog',
templateUrl: 'anular.component.html',
styleUrls: ['./clients.component.css']
})
export class AnularFactura {
  myService: MyService | null;

  constructor(
    public dialogRef: MdDialogRef<AnularFactura>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
      this.myService = new MyService(http, router, usuario);
      console.log(this.data);
     }




    anular(): void {
      this.snackBar.open("Anulando Factura: Por favor espere", null, {
        duration: 1000,
      });
      this.http.put(environment.apiEndpoint+"facturas/anular/"+this.data.id, this.data).subscribe((data)=>{
      this.dialogRef.close();
    })
      //this.myService.refresh();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
selector: 'OverviewComponent',
templateUrl: 'client.overview.component.html',
styleUrls: ['./clients.component.css']
})
export class ClientOverview implements OnInit{
  myService: MyService | null;
  id:any
  soporte:any
  cliente:any
  servicios:any
  historial:any
  balance:any;
  adicionales:any;

  addClient: FormGroup;
  facturacion:any
  editclient:boolean=false
  facturado: any = 0;
  pagado:any = 0;
  autoupdate:boolean=true
  balac:any = 0;
  constructor(

    private route: ActivatedRoute,
    private http: Http,
    public snackBar:MdSnackBar,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    public dialog: MdDialog,
    private _fb: FormBuilder,
    public usuario: AuthGuard,
  ) {
    this.addClient = this.fb.group({
      kind: ['', [Validators.required, Validators.pattern(KIND_REGEX)]],
      dni:['', [Validators.required]],
      //email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      email: ['', [Validators.pattern(EMAIL_REGEX)]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      day_of_birth: ['', [Validators.required]],
      serie: ['', [Validators.required]],
      phone1: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
      phone2: ['', [Validators.required]],
      comment: '',
      social: [''],
      responsable: this.usuario.currentUser.id_user

    });
     }
     ngOnInit(){
       this.route.params
       .subscribe(
         params => {
           this.id = params.id_user;
           console.log(params.id_user)
           this.refresh()
         }
       )
       //console.log(this.usuario)
       this.pagado=0;
       this.facturado=0;
       this.balac=0;
       IntervalObservable.create(10000)
       .takeWhile(() => this.autoupdate)
       .subscribe(() => {
         this.refresh();
       });
     }
     ngOnDestroy(){
       this.autoupdate=false
     }
     notify(){
       this.http.post(environment.apiEndpoint+'clientesn/', {responsable: this.usuario.currentUser.id_user, id:this.id})
       .subscribe((data) => {});
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

     refresh(){
       var pagado_1=0
       var facturado_1=0
       var balac_1=0
      this.http.get(environment.apiEndpoint+'clientover/' + this.id)
       .subscribe((data) => {
         var response = data.json()
         this.soporte= response.soporte
         this.facturacion = response.facturacion
         this.servicios = response.servicios
         this.cliente = response.cliente
         this.historial = response.history
         this.balance = response.balance
         this.adicionales = response.adicionales
         this.balance.forEach(linea => {
           if (linea.bal_rest>0){
             balac_1=balac_1+Number(linea.bal_rest);
           }
         })
         this.facturacion.forEach(linea => {
           if(linea.denominacion == 'Bs.S'){
             if(linea.fac_status==1){
             pagado_1=pagado_1+linea.pagado;
             facturado_1 = facturado_1+linea.monto;
           }
           }else if(linea.denominacion == 'BSF'){
             if(linea.fac_status == 1){
             pagado_1=+pagado_1+(+linea.pagado/100000);
             facturado_1 = +facturado_1+(+linea.monto/100000);
           }
           }
         });

         setTimeout(()=>{
           this.balac=balac_1
           this.pagado=pagado_1
           this.facturado=facturado_1
           if(!this.editclient){
           this.addClient.patchValue({
             kind: this.cliente.kind,
             dni: this.cliente.dni,
             //email: [row.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
             email: this.cliente.email,
             nombre: this.cliente.nombre,
             apellido: this.cliente.apellido,
             direccion: this.cliente.direccion,
             day_of_birth: this.cliente.day_of_birth,
             serie: this.cliente.serie,
             phone1: this.cliente.phone1,
             phone2: this.cliente.phone2,
             comment: this.cliente.comment,
             id: this.cliente.id,
             social: this.cliente.social,

           });}
         }, 50)
       });
     }
     anularfactura(i):void {
       let dialogRef = this.dialog.open(AnularFactura, {
         width: '25%',
         data: i
       });


       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog was closed');

       })
     }

     SendPre(): void {
       /*let dialogRef = this.dialog.open(AddclientsComponent, {
         width: '25%'
       });*/
       var tipo = 'c'
       var datos = [this.cliente, tipo]
       let dialogRef = this.dialog.open(PreComponent, {
         width: '25%',
         data: datos
       });


       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog was closed');

       })
     }
     GenFac(): void {
       /*let dialogRef = this.dialog.open(AddclientsComponent, {
         width: '25%'
       });*/
       let dialogRef = this.dialog.open(GenFactura, {
         width: '25%',
         data: this.cliente
       });



       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog GenFAC was closed');
         this.ngOnInit();
       });
     }
     AddAdic(): void {
       /*let dialogRef = this.dialog.open(AddclientsComponent, {
         width: '25%'
       });*/
       let dialogRef = this.dialog.open(AddAdic, {
         width: '25%',
         data: this.cliente
       });



       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog GenFAC was closed');
         this.ngOnInit();
       });
     }
     Close(){this.location.back();}
     private openLINK(url){
       console.log(url)
       window.open("/maraveca/test.php?ip="+url, '_blank');
     }
     generate(fecha){
       const req = this.http.post(environment.apiEndpoint+'factura', {
         cliente: this.cliente.id ,
         fecha : "18-09-01",
         responsable: this.usuario.currentUser.id_user,
         //fecha : fecha
       }).subscribe(result => {
       this.http.get(environment.apiEndpoint+'clientover/' + this.id)
       .subscribe((data) => {
         var response = data.json()
         this.soporte= response.soporte
         this.facturacion = response.facturacion
         this.servicios = response.servicios
         this.cliente = response.cliente
         this.historial = response.history
         this.addClient.patchValue({
           kind: this.cliente.kind,
           dni: this.cliente.dni,
           //email: [row.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
           email: this.cliente.email,
           nombre: this.cliente.nombre,
           apellido: this.cliente.apellido,
           direccion: this.cliente.direccion,
           day_of_birth: this.cliente.day_of_birth,
           serie: this.cliente.serie,
           phone1: this.cliente.phone1,
           phone2: this.cliente.phone2,
           comment: this.cliente.comment,
           id: this.cliente.id,
           social: this.cliente.social,

         });
       });
       })
     }
     edit(){
       this.editclient=true

     }
     show(row){
       console.log(row);
       let dialogRef = this.dialog.open(AddservicesComponent, {
         panelClass: 'my-full-screen-dialog',
         data: row
       });
       dialogRef.afterClosed().subscribe(result => {
         this.ngOnInit();
         console.log('The dialog was AddClient closed');
       });
       //this.myService.refresh();
     }
     abono(){
       let dialogRef = this.dialog.open(AddPagoBalance, {
         data: this.id

       });
       dialogRef.afterClosed().subscribe(result => {
         this.ngOnInit();
         if(result){
         console.log(result);
         var url = environment.apiEndpoint+"pagoclient/"
         this.http.post(url, result).subscribe(data =>{
           this.ngOnInit()
         })
       }
       });
     }
     updateClient(){
       var url = environment.apiEndpoint+"clientes/"+this.cliente.id
       this.http.put(url, this.addClient.value).subscribe((data) => {
         this.editclient=false
         this.http.get(environment.apiEndpoint+'clientover/' + this.id)
         .subscribe((data) => {
           var response = data.json()
           this.soporte= response.soporte
           this.facturacion = response.facturacion
           this.servicios = response.servicios
           this.cliente = response.cliente
           this.historial = response.history
           this.addClient.patchValue({
             kind: this.cliente.kind,
             dni: this.cliente.dni,
             //email: [row.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
             email: this.cliente.email,
             nombre: this.cliente.nombre,
             apellido: this.cliente.apellido,
             direccion: this.cliente.direccion,
             day_of_birth: this.cliente.day_of_birth,
             serie: this.cliente.serie,
             phone1: this.cliente.phone1,
             phone2: this.cliente.phone2,
             comment: this.cliente.comment,
             id: this.cliente.id,
             social: this.cliente.social,

           });
         });
       });

     }

     status(row){
       console.log(row);
       //this.selectedRowIndex = row.id;
       //this.id = row.id;
       let dialogRef = this.dialog.open(FacturacionPagos, {
         width: '80%',
         data: row
       });
       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog was AddClient closed');
         this.http.get(environment.apiEndpoint+'clientover/' + this.id)
         .subscribe((data) => {
           var response = data.json()
           this.soporte= response.soporte
           this.facturacion = response.facturacion
           this.servicios = response.servicios
           this.cliente = response.cliente
           this.historial = response.history
           this.addClient.patchValue({
             kind: this.cliente.kind,
             dni: this.cliente.dni,
             //email: [row.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
             email: this.cliente.email,
             nombre: this.cliente.nombre,
             apellido: this.cliente.apellido,
             direccion: this.cliente.direccion,
             day_of_birth: this.cliente.day_of_birth,
             serie: this.cliente.serie,
             phone1: this.cliente.phone1,
             phone2: this.cliente.phone2,
             comment: this.cliente.comment,
             id: this.cliente.id,
             social: this.cliente.social,

           });
         });
       });
       //this.myService.refresh();

     }



}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'pago-balance.html',
})
export class AddPagoBalance implements OnInit{

  addAbono: FormGroup;
  myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        inline: true,
    };

  constructor(
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddPagoBalance>,
    @Inject(MD_DIALOG_DATA) public id) {
      console.log(id);
      this.addAbono = this.fb.group({
        bal_tip:['', Validators.required],
        bal_monto:['', Validators.required],
        created_at:['', Validators.required],
        bal_comment:['', Validators.required],
        bal_cli: id
      })
    }

    ngOnInit(){
      this.addAbono.get('created_at').valueChanges.subscribe(
        (fn) => {
        if(fn.epoc){
            setTimeout(()=>{
            this.addAbono.patchValue({
              created_at: fn.epoc
            })
          }, 100)
        }
        })
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'genFAC.component.html',
})
export class GenFactura implements OnInit{

  genFAC: FormGroup;
  myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        inline: true,
    };
  cliente: any;
  constructor(
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public snackBar:MdSnackBar,
    private http: Http,
    public dialogRef: MdDialogRef<GenFactura>,
    @Inject(MD_DIALOG_DATA) public id) {
      this.cliente = id
      this.genFAC = this.fb.group({
        cliente:[id.id, Validators.required],
        fecha:[''],
        pro:['2', Validators.required],
        responsable: usuario.currentUser.id_user
      })
    }

    ngOnInit(){
      this.genFAC.get('fecha').valueChanges.subscribe(
        (fn) => {
        if(fn.epoc){
            setTimeout(()=>{
            this.genFAC.patchValue({
              fecha: fn.formatted
            })
          }, 100)
        }
        })
        this.genFAC.get('pro').valueChanges.subscribe(
          (fn) => {
          if(fn==1){
              this.genFAC.get('fecha').setValidators([Validators.required]);
          }else{
            this.genFAC.get('fecha').setValidators([]);
          }
          })
    }
    generate(){
      const req = this.http.post(environment.apiEndpoint+'factura', this.genFAC.value).subscribe(result => {
        this.dialogRef.close();
        this.snackBar.open("Factura Generada", null, {
          duration: 2000,
        });
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'add-adic.html',
})
export class AddAdic implements OnInit{

  AddAdic: FormGroup;
  myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        inline: true,
    };
    cliente: any;
  planes: any;
  selected: any;
  constructor(
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public snackBar:MdSnackBar,
    private http: Http,
    public dialogRef: MdDialogRef<AddAdic>,
    @Inject(MD_DIALOG_DATA) public id) {
      this.cliente = id
      console.log(this.cliente)
      this.AddAdic = this.fb.group({
        id_cli:[id.id, Validators.required],
        codigo_articulo:['', Validators.required],
        precio_articulo:[''],
        cantidad:['1', Validators.required],
        comment_articulo: ['', Validators.required]
      })
    }
    remind(i){
      this.selected=i
      console.log(this.selected)
    }
    ngOnInit(){
      this.http.get(environment.apiEndpoint+'planes/')
        .subscribe((data) => {
          this.planes = data.json();
          //console.log(this.data);
        });
    }
    generate(){
      const req = this.http.post(environment.apiEndpoint+'addadic', this.AddAdic.value).subscribe(result => {
        this.dialogRef.close();
        this.snackBar.open("Factura Generada", null, {
          duration: 2000,
        });
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}

    //regex to validate phones (^0414\d+|^0412\d+|^0416\d+|^0426\d+|^0424\d+)(\d{6})
