import { Component, Inject, Pipe, PipeTransform, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { MdDatepickerModule } from '@angular/material/datepicker'
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { environment } from '../../environments/environment'
import { FacturacionPagos, ConfirmPagoDialog, DeclinePagoDialog, ConfirmPagoDialog2, DeclinePagoDialog2 } from '../facturacion/facturacion.component'
import { PreComponent } from '../presupuestos/pre.component'
import { AddservicesComponent, UpdateserviceComponent } from '../servicios/servicios.component'
import { forEach } from '@angular/router/src/utils/collection';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PHONE_REGEX = /^(0414\d|0412\d|0416\d|0426\d|0424\d|0415\d)+\d{6}/;
const KIND_REGEX = /^(V|J|E|G)/


import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CargarPagosService } from '../services/administrativo/cargar-pagos.service';
import { FacPromoService } from '../services/facturacion/fac-promo.service';
import { ClienteService } from '../services/cliente/cliente.service';
import { ServiciosService } from '../services/servicios/servicios.service';
import { FacturacionService } from '../services/facturacion/facturacion.service';
import { NotaCreditoService } from '../services/facturacion/nota-credito.service';
import { InstalacionesService } from '../services/soporte/instalaciones.service';
import { ArticuloService } from '../services/Inventario/articulo.service';
import { CajaDistribucionService } from '../services/caja-distribucion/caja-distribucion.service';
import { ViewFlags } from '@angular/core/src/view';
import { DescuentosService } from '../services/descuentos/descuentos.service';



@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {

  transform(value: any) {
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
      } else {
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

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  myService: MyService | null;
  clientes = [];
  pendientes = [];
  clientes_t = [];
  pendientes_t = [];
  search: string = '';
  modouno: any = 1;
  mododos: any = 2;
  update: boolean = true
  autoupdate: boolean = true

  nombres: string = ""
  apellidos: string = ""
  kni: string = ""
  dni: string = ""
  social: string = null
  fecha: any
  numero: string = ""
  numero2: string = ""
  email: string = ""
  estados: any = []
  estado: number = 0
  municipios: any = []
  municipio: number = 0
  parroquias: any = []
  parroquia: number = 0
  direccion: string = ""
  isChecked: boolean = false
  constructor(
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard,
    public test: AuthenticationService,
    private modalService: BsModalService,
    private cargarPagos: CargarPagosService,
    private clienteService: ClienteService) {
    this.snackBar.open("Cargando Clientes", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router, usuario);
    const id = this.usuario.currentUser.id_user;
    this.http.get(environment.apiEndpoint + 'clientes1/' + id)
      .subscribe((data) => {
        this.clientes = data.json().clientes;
        this.pendientes = data.json().pendientes;
        this.clientes_t = this.clientes
        this.pendientes_t = this.pendientes
        this.update = false
        // console.log(this.clientes);
        console.log(this.pendientes);
      });
    this.snackBar.open("Clientes Cargados", null, {
      duration: 2000,
    });
  }

  ngOnInit() {
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
    this.traerEstados()

  }

  irZonas() {
    this.router.navigate(['/zonasClientes'])
  }

  aggCliente(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  traerEstados() {
    this.clienteService.traerEstados().subscribe(res => this.estados = res, err => console.log(err))
  }

  Municipios() {
    this.clienteService.traerMunicipios(this.estado).subscribe(res => this.municipios = res, err => console.log(err))
  }
  Parroquias() {
    this.clienteService.traerParroquias(this.municipio).subscribe(res => this.parroquias = res, err => console.log(err))
  }


  verdatos() {

    this.clienteService.guardarCliente(this.nombres, this.apellidos, this.kni, this.dni, this.fecha.epoc, this.numero, this.email, this.estado, this.municipio, this.parroquia, this.social, this.direccion, this.isChecked, this.usuario.currentUser.id_user)
      .subscribe(
        res => this.ocultarModal(),
        err => console.log(err)
      )
  }

  ocultarModal() {
    this.modalRef.hide()
    this.nombres = ""
    this.apellidos = ""
    this.kni = ""
    this.dni = ""
    this.fecha = " "
    this.numero = ""
    this.email = ""
    this.estado = 0
    this.municipio = 0
    this.parroquia = 0
    this.social = null
    this.direccion = ""
    this.isChecked = false
  }

  ngOnDestroy() {
    this.autoupdate = false
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
  refresh(nf) {
    this.update = true
    const id = this.usuario.currentUser.id_user;
    this.http.get(environment.apiEndpoint + 'clientes1/' + id)
      .subscribe((data) => {
        console.log(data.json())
        this.clientes_t = data.json().clientes;
        this.pendientes_t = data.json().pendientes;
        this.update = false
        if (nf) {
          this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          });
        }
      });
    this.clientes = this.clientes_t
    this.pendientes = this.pendientes_t
  }
  show(row) {
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

  status(row) {
    console.log(row);
    //this.selectedRowIndex = row.id;
    if (this.usuario.perm && this.usuario.perm.includes('facturacion')) {
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
  private delete(id): void {
    console.log(id); //show`s id
    this.myService.deleteData(id)
      .subscribe((data) => { console.log(data) });
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

  constructor(private http: Http, private router: Router, private usuario: AuthGuard) { }

  deleteData(id) {
    return this.http.delete(environment.apiEndpoint + 'clientes/' + id + '?responsable=' + this.usuario.currentUser.id_user, {})
      .map((resp: Response) => resp.json());
    //return null;

  }
  refresh() {

    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('clients') > -1 ? '/celdas' : '/clients';

    setTimeout(() => {
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
export class AddclientsComponent implements OnInit {

  error: boolean = false;
  tipo: string;
  dni: string;
  email: string;
  name: string;
  last: string;
  dayofbirth: string;
  social: string;
  phone: string;
  phone2: string;
  //  serie : string;
  address: string;
  comment: string;
  form: string;
  addClient: FormGroup;
  myService: MyService | null;
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true,
  };

  myDatePickerOptions2: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true,
  };


  constructor(
    private http: Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddclientsComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard,
    private _fb: FormBuilder) {

    this.myService = new MyService(http, router, usuario);

    if (row != null) {
      this.addClient = this.fb.group({
        kind: [row.kind, [Validators.required, Validators.pattern(KIND_REGEX)]],
        dni: [row.dni, [Validators.required]],
        //email: [row.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
        email: [row.email, [Validators.pattern(EMAIL_REGEX)]],
        nombre: [row.nombre, [Validators.required]],
        apellido: [row.apellido, [Validators.required]],
        direccion: [row.direccion, [Validators.required]],
        day_of_birth: [row.day_of_birth, [Validators.required]],
        // serie: [row.serie, [Validators.required]],
        phone1: [row.phone1, [Validators.required, Validators.pattern(PHONE_REGEX)]],
        phone2: [row.phone2, [Validators.required]],
        comment: row.comment,
        id: [row.id, [Validators.required]],
        social: [row.social],
        responsable: this.usuario.currentUser.id_user,
      });
      //console.log(row)
    } else {

      this.addClient = this.fb.group({
        kind: ['', [Validators.required, Validators.pattern(KIND_REGEX)]],
        dni: ['', [Validators.required]],
        //email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
        email: ['', [Validators.pattern(EMAIL_REGEX)]],
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        day_of_birth: ['', [Validators.required]],
        //  serie: ['', [Validators.required]],
        phone1: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
        phone2: ['', [Validators.required]],
        comment: '',
        social: [''],
        responsable: this.usuario.currentUser.id_user,

      });
      //console.log("llego vacio"+ row)
    }

  }

  ngOnInit() {
    this.addClient.get('kind').valueChanges.subscribe(
      (kind) => {
        if (kind.toLowerCase() === 'v' || kind.toLowerCase() === 'e') {
          this.addClient.get('social').setValidators([]);
          this.addClient.get('social').updateValueAndValidity();
        } else if (kind.toLowerCase() === 'g' || kind.toLowerCase() === 'j' || kind.toLowerCase() === 'v-') {
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


  Enviar() {
    var client = this.addClient.value;
    console.log(client)
    /*
    var url = environment.apiEndpoint + "clientes";

    this.http.post(url, client).subscribe(data => {
      this.dialogRef.close();
      this.snackBar.open("Agregando Cliente: Por favor espere", null, {
        duration: 2000,
      });
    }, error => {
      this.error = true
    });
    //this.myService.refresh();
    //this.router.navigate(['/clientes']);
    */
  }
  Editar() {
    var client = this.addClient.value;
    var url = environment.apiEndpoint + "clientes/" + client.id;
    this.http.put(url, client).subscribe((data) => {
      this.dialogRef.close();
    });
    //this.myService.refresh();
    this.snackBar.open("Agregando Cliente: Por favor espere", null, {
      duration: 2000,
    });
    //this.router.navigate(['/clientes']);
  }


  sendSMS() {
    var client = this.addClient.value;
    //console.log(this.phone);
    if (
      client.phone1 != "" &&
      client.phone1 != null &&
      client.nombre != null &&
      client.nombre != "" &&
      client.apellido != null &&
      client.apellido != "") {


      const req = this.http.post(environment.apiEndpoint + 'sms', {
        numero: client.phone1,
        mensaje: 'Este es un mensaje de prueba de MARAVECA, saludos ' + client.nombre + " " + client.apellido,
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
    } else {
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

  fac_control: string;
  fac_products: any = null;
  fac_pagos: any = null;
  cliente: any;
  email: any;
  phone: any;
  address: any;
  dni: any;
  monto: number = 0;
  montosi: number = 0;
  iva: number = 0;
  pagado: number = 0;
  deuda: number = 0;
  opcion: string;
  nada: string;
  tipo: any;
  pagos: number = 0;
  id: any;
  //cliente: null;
  constructor(
    private http: Http,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<ClientsComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard,
    private _fb: FormBuilder

  ) {
    console.log(row);
    if (row.pagado == null) {
      this.pagado = 0;
    } else {
      this.pagado = parseInt(row.pagado);
    }
    this.cliente = row.nombre + " " + row.apellido
    this.http.get(environment.apiEndpoint + 'facturas/' + row.id)
      .subscribe((data) => {
        this.fac_products = data.json();
        console.log(this.fac_products.slice(0, 3));
        this.fac_products.forEach(linea => {
          //this.montosi = this.montosi + linea.monto;
          if (row.serie == 1) {
            linea.monto = linea.monto
          }
          //this.iva = this.montosi * 0.12;
          this.monto = this.monto + linea.monto;
          this.pagado = this.pagado + linea.pagado;
          console.log(this.monto + " | " + this.pagado);
        });
        this.deuda = this.monto - this.pagado;
        this.id = row.id;
      });

  }

  generate(fecha) {
    const req = this.http.post(environment.apiEndpoint + 'factura', {
      cliente: this.row.id,
      fecha: "18-08-01"
      //fecha : fecha
    }).subscribe(result => {
      this.monto = 0;
      this.pagado = 0;
      this.http.get(environment.apiEndpoint + 'facturas/' + this.id)
        .subscribe((data) => {
          this.fac_products = data.json();
          console.log(this.fac_products.slice(0, 3));
          this.fac_products.forEach(linea => {
            this.monto += linea.monto;
            this.pagado += linea.pagado;
            console.log(this.monto + " | " + this.pagado);
          });
          this.deuda = this.monto - this.pagado;
        });
    })
  }

  //aqui comenzara el dialog de detalles de una facturas
  status(row) {
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
      this.http.get(environment.apiEndpoint + 'facturas/' + this.id)
        .subscribe((data) => {
          this.fac_products = data.json();
          console.log(this.fac_products.slice(0, 3));
          this.fac_products.forEach(linea => {
            this.monto += linea.monto;
            this.pagado += linea.pagado;
            console.log(this.monto + " | " + this.pagado);
          });
          this.deuda = this.monto - this.pagado;
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
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
    this.myService = new MyService(http, router, usuario);
    console.log(this.data);
  }




  delete(): void {
    console.log(this.data);
    this.myService.deleteData(this.data.id)
      .subscribe((data) => { console.log(data) });
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
  responsable: any;
  datat: any;


  constructor(
    public dialogRef: MdDialogRef<AnularFactura>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
    this.myService = new MyService(http, router, usuario);
    console.log(this.data);
    this.responsable = this.usuario.currentUser.id_user;
    console.log(this.responsable);

    let data1 = this.data;
    let resp = this.responsable;
    let data_t = [];
    data_t.push(data1);
    data_t.push(resp);
    //this.datat= this.data1[this.data];
    console.log(data_t);
    this.datat = data_t;
    console.log(this.datat);

  }




  anular(): void {
    console.log(this.datat);
    this.snackBar.open("Anulando Factura: Por favor espere", null, {
      duration: 1000,
    });
    this.http.put(environment.apiEndpoint + "facturas/anular/" + this.data.id, this.datat).subscribe((data) => {
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
export class ClientOverview implements OnInit {
  myService: MyService | null;
  genFAC: FormGroup;
  id: any
  soporte: any
  cliente: any
  servicios: any
  historial: any
  balance_in: any;
  exoneraciones_in: any;
  exoneraciones: any;
  adicionales: any;
  srv_cli: any;
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true,
  };

  addClient: FormGroup;
  facturacion: any
  editclient: boolean = false
  editservice: boolean = false
  facturadoin: any = 0;
  pagadoin: any = 0;
  facturado: any = 0;

  pagado: any = 0;

  balance: any;
  autoupdate: boolean = true
  balac: any = 0;
  balac_$: any = 0;
  balac_in: any = 0;
  tipo_plan: any;
  modo_pago: any;
  fac_prog: any;
  estatus_prog: any;
  corte_prog: any;
  estatus_cort: any;
  estatus_serv: any;
  cort: any;
  serie_client: any;
  activo: boolean = false;


  /*Registro de Pago*/
  r: number = 1;
  bodyRegistroPagos: boolean = true
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  config2 = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'gray modal-lg'
  };
  metodos: any = [];
  Referencia: string = " ";
  fechaDesde: any = 0;
  fecha: any = 0;
  MetodoSelected: number = 0;
  Monto: number = 0
  taza: number = 0
  conversion: number = 0
  pagoCargado: boolean = false
  pagosExoneraciones: boolean = true
  /*Registro de Pago*/

  /*Promociones*/
  promociones: any = []
  planesPromo: any = []
  serviciosPromo: any = []
  tipoServicioPromo: number = 0
  planPromo: number = 0
  servicioPromo: number = 0
  clientePromocion: string = ""
  comentario: number = 0
  promoActiva: boolean = false
  datosPromo: any = []
  /*Promociones*/

  /*Generacion de Factura*/
  FacturaSeleccionada: number = 0
  ServiciosClientes: any = []
  ServiciosClientes2: any = []
  fechaFDesde: any = 0
  fechaFHasta: any = 0
  radio: number = 0
  ServicioSeleccionado: number = 0
  nservicio: any = []
  facBlanco: number = 0
  facBlancoTipo: number = 0
  modalRef7: BsModalRef;
  RazonAnulacion: string = ""
  facturaAnulacion: number = 0
  comprobacionAnulacion: boolean = false
  comprobacionAnulacionMotivo: string = ""
  /*Generacion de Factura*/

  /*Ajustes de Factura*/
  notaSeleccionada: number = 0
  tipoNotaSeleccionada: number = 0
  tipoAjusteSeleccionado: number = 0
  tipoNotaParcial: number = 0
  modoNotaParcial: number = 0
  porcentaje: number = 0
  dias: number = 0
  notasCreditos: any = []
  notaDeCredito: any
  notaActiva: boolean = false
  productos: any = []
  productoSeleccionado: number = 0
  montoNota: number = 0
  facturadoNotaDebito: number = 0
  facturadoNotaCredito: number = 0
  pagadoNotaDebito: number = 0
  pagadodoNotaCredito: number = 0

  MontoNotadeCredito: number = 0
  MontoNotadeDebito: number = 0

  deudaNota: number = 0

  pagoAjustesFactura = new FormGroup({
    metodo_pago: new FormControl(0),
    Referencia: new FormControl(""),
    fecha: new FormControl(""),
    monto: new FormControl(0)
  })

  mostrarNota: any

  /*Ajustes de Factura*/

  /*Historial*/
  h: number = 1
  bodyHistorial: boolean = true
  /*Historial*/

  /*Tickets*/
  so: number = 1
  bodyTickets: boolean = true
  /*Tickets*/

  /*Facturas*/
  f: number = 1
  bodyFacturas: boolean = true
  notasFacturas: boolean = true
  /*Facturas*/

  /*servicios*/
  s: number = 1
  ds: number = 1
  bodyServices: boolean = true
  bodyDatosServices: boolean = true
  servicioEditable: any
  isCheckedS: boolean = false
  usuarioNuevo: number = 0
  porcentajeNuevo = 0
  tipoPlanSeleccionado: number = 0
  planSeleccionado: number = 0
  apSeleccionado: number = 0
  equipeSeleccionada: string = ""
  celdaSeleccionada: number = 0
  zoneSeleccionada: number = 0

  planes: any = []
  aps: any = []
  cajas: any = []
  celdas: any = []
  equipos: any = []
  disponibles: any = []

  userComisiones: any = []

  modalRef9: BsModalRef;
  servicioProSeleccionado: number = 0
  tipoPlanProSeleccionado: number = 0
  planesPro: any = []
  planProSeleccionado: number = 0
  facturaProSeleccionada: number = 0
  /*servicios*/

  /*Cliente*/
  clienteSeleccionado: any = []
  editarCliente: boolean = false
  /*Cliente*/

  /*compromiso de servicio*/
  modalRef6: BsModalRef;
  compromisSerSeleccionado: number = 0
  fechaLimiteCompromisoServicio: string = ""
  visualizarCompromisosServicio: boolean = false
  compromisosServicios: any = []
  edicionComprosimo: boolean = false
  /*compromiso de servicio*/

  /*cortes programados*/
  modalRef8: BsModalRef;
  servicioCorteProgSeleccionado: number = 0
  fechaCorteProgSeleccionado: string = " "
  /*cortes programados*/

  /*Descuentos*/
  modalRef10: BsModalRef;
  facturaDescuentoSeleccionada: number = 0
  tipoDescuentoSeleccionado: number = 0
  diasSinServicio: number = 0
  comentarioDescuento: string = ""
  montoDescuento: number = 0
  /*Descuentos*/


  cargado: boolean = false
  constructor(

    private route: ActivatedRoute,
    private http: Http,
    public snackBar: MdSnackBar,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    public dialog: MdDialog,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    public usuario: AuthGuard,
    private cargarPagos: CargarPagosService,
    private FacPromoService: FacPromoService,
    private clienteService: ClienteService,
    private servicioService: ServiciosService,
    private facturacionService: FacturacionService,
    private notaService: NotaCreditoService,
    private instalacionesService: InstalacionesService,
    private articuloService: ArticuloService,
    private cajaService: CajaDistribucionService,
    private descuentoService: DescuentosService
  ) {
    this.addClient = this.fb.group({
      kind: ['', [Validators.required, Validators.pattern(KIND_REGEX)]],
      dni: ['', [Validators.required]],
      //email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      email: ['', [Validators.pattern(EMAIL_REGEX)]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      day_of_birth: ['', [Validators.required]],
      // serie: ['', [Validators.required]],
      phone1: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
      phone2: ['', [Validators.required]],
      comment: '',
      social: [''],
      responsable: this.usuario.currentUser.id_user

    });
  }
  ngOnInit() {
    this.route.params
      .subscribe(
        params => {
          this.id = params.id_user;
          console.log(params.id_user)
          this.refresh()
          this.traerDatosCliente()

        }



      )
    //console.log(this.usuario)
    this.pagado = 0;
    this.facturado = 0;
    this.balac = 0;
    this.pagadoin = 0;
    this.facturadoin = 0;


    this.cargarPagos.traerMetodos().subscribe(res => this.metodos = res, err => console.log(err))
    this.cargarPagos.traerTaza().subscribe(res => { this.taza = res[0].valor, console.log(res) }, err => console.log(err))
  }

  traerDatosCliente() {
    this.clienteService.traerDatosCliente(this.id).subscribe(res => { this.clienteSeleccionado = res[0], console.log(res) }, err => console.log(err))
  }

  ngOnDestroy() {
    this.autoupdate = false
  }
  notify() {
    this.http.post(environment.apiEndpoint + 'clientesn/', { responsable: this.usuario.currentUser.id_user, id: this.id })
      .subscribe((data) => { });
  }

  aprov(i): void {
    let dialogRef = this.dialog.open(ConfirmPagoDialog, {
      data: i,
      width: '25%'

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
    setTimeout("location.reload(true);", 4500);
  }
  aprov2(i): void {
    let dialogRef = this.dialog.open(ConfirmPagoDialog2, {
      data: i,
      width: '25%'

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
    /* setTimeout("location.reload(true);", 4500);*/
  }
  rem(i): void {
    let dialogRef = this.dialog.open(DeclinePagoDialog, {
      data: i,
      width: '25%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  rem2(i): void {
    let dialogRef = this.dialog.open(DeclinePagoDialog2, {
      data: i,
      width: '25%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }

  refresh() {
    var pagadoin_1 = 0
    var pagado_1 = 0
    var facturadoin_1 = 0
    var facturado_1 = 0
    var balac_1 = 0
    var balac_$_1 = 0
    var balac_in_1 = 0
    let facturadoNotaDebito_1 = 0
    let facturadoNotaCredito_1 = 0
    let PagadoNotaDebito_1 = 0
    let PagadoNotaCredito_1 = 0
    this.servicioCliente()
    this.notasCredito();

    this.http.get(environment.apiEndpoint + 'clientover/' + this.id)
      .subscribe((data) => {
        var response = data.json()
        console.log(response);
        this.soporte = response.soporte
        this.facturacion = response.facturacion
        this.servicios = response.servicios
        this.cliente = response.cliente
        this.tipo_plan = response.cliente.tipo_planes
        this.serie_client = +response.cliente.serie
        this.historial = response.history
        this.balance_in = response.balance_in
        this.exoneraciones_in = response.exoneraciones_in
        this.exoneraciones = response.exoneraciones
        this.adicionales = response.adicionales
        this.balance = response.balance
        this.srv_cli = response.srv_cli
        this.fac_prog = response.fac_prog
        this.corte_prog = response.corte_prog
        console.log(this.cliente)


        this.estatus_prog = this.fac_prog.length;


        this.estatus_cort = this.corte_prog.length;



        for (let i = 0; i < this.servicios.length; i++) {
          this.estatus_serv = this.servicios[i];

          this.cort = this.estatus_serv.stat_srv

          if (this.cort == 1) {
            this.activo = true;
          }
          console.log(this.activo);
        }

        this.notasCreditos.forEach(e => {
          if (e.tipo_nota == 1) {
            facturadoNotaDebito_1 = facturadoNotaDebito_1 + Number(e.monto_nota)
            PagadoNotaDebito_1 = PagadoNotaDebito_1 + Number(e.pagado)
          } else {
            facturadoNotaCredito_1 = facturadoNotaCredito_1 + Number(e.monto_nota)
            PagadoNotaCredito_1 = PagadoNotaCredito_1 + Number(e.pagado)
          }
        });

        this.balance.forEach(linea => {
          if (linea.bal_rest > 0 && linea.bal_stat == 1 && (linea.bal_tip != 8 && linea.bal_tip != 9 && linea.bal_tip != 10 && linea.bal_tip != 11)) {
            balac_1 = balac_1 + Number(linea.bal_rest);
          } else if (linea.bal_rest > 0 && linea.bal_stat == 1 && (linea.bal_tip == 8 || linea.bal_tip == 9 || linea.bal_tip == 10 || linea.bal_tip == 11)) {
            balac_$_1 = balac_$_1 + Number(linea.bal_rest);
          }
        })

        this.exoneraciones.forEach(linea => {
          if (linea.bal_rest > 0 && linea.bal_stat == 1 && (linea.bal_tip != 8 && linea.bal_tip != 9 && linea.bal_tip != 10 && linea.bal_tip != 11)) {
            balac_1 = balac_1 + Number(linea.bal_rest);
          } else if (linea.bal_rest > 0 && linea.bal_stat == 1 && (linea.bal_tip == 8 || linea.bal_tip == 9 || linea.bal_tip == 10 || linea.bal_tip == 11)) {
            balac_$_1 = balac_$_1 + Number(linea.bal_rest);
          }
        })

        this.balance_in.forEach(linea => {
          if (linea.bal_rest_in > 0 && linea.bal_stat_in == 1) {
            balac_in_1 = balac_in_1 + Number(linea.bal_rest_in);
          }

        })

        this.exoneraciones_in.forEach(linea => {
          if (linea.bal_rest_in > 0 && linea.bal_stat_in == 1) {
            balac_in_1 = balac_in_1 + Number(linea.bal_rest_in);
          }

        })





        this.facturacion.forEach(linea => {
          if (linea.denominacion == '$') {
            if (linea.fac_status == 1) {
              pagadoin_1 = pagadoin_1 + linea.pagado;
              facturadoin_1 = facturadoin_1 + linea.monto;
            }
          }
        });
        this.facturacion.forEach(linea => {
          if (linea.denominacion == 'Bs') {
            if (linea.fac_status == 1) {
              pagado_1 = pagado_1 + linea.pagado;
              facturado_1 = facturado_1 + linea.monto;
            }
          }

        });

        setTimeout(() => {

          this.facturadoNotaDebito = facturadoNotaDebito_1
          this.facturadoNotaCredito = facturadoNotaCredito_1
          this.pagadoNotaDebito = PagadoNotaDebito_1
          this.pagadodoNotaCredito = PagadoNotaCredito_1

          this.MontoNotadeCredito = this.facturadoNotaCredito - this.pagadodoNotaCredito
          this.MontoNotadeDebito = this.facturadoNotaDebito - this.pagadoNotaDebito

          this.balac = balac_1
          this.balac_$ = balac_$_1
          this.balac_in = balac_in_1
          this.pagado = pagado_1
          this.pagadoin = pagadoin_1
          this.facturadoin = facturadoin_1
          this.facturado = facturado_1

          if (!this.editclient) {
            this.addClient.patchValue({
              kind: this.cliente.kind,
              dni: this.cliente.dni,
              //email: [row.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
              email: this.cliente.email,
              nombre: this.cliente.nombre,
              apellido: this.cliente.apellido,
              direccion: this.cliente.direccion,
              day_of_birth: this.cliente.day_of_birth,
              // serie: this.cliente.serie,
              phone1: this.cliente.phone1,
              phone2: this.cliente.phone2,
              comment: this.cliente.comment,
              id: this.cliente.id,
              social: this.cliente.social,


            });
            console.log(this.facturado);
            console.log(this.pagado);
            console.log(this.facturadoin);
            console.log(this.pagadoin);
            console.log(this.balac_in);
          }
        }, 50)
        this.cargado = true
      });

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
      width: '23%',
      data: { id: this.cliente, serv: this.servicios }
    });



    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog GenFAC was closed');
      this.ngOnInit();
    });
  }
  program_corte(): void {
    /*let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%'
    });*/
    let dialogRef = this.dialog.open(program_corte, {
      width: '23%',
      data: { client: this.cliente, serv: this.servicios }
    });



    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog GenFAC was closed');
      this.ngOnInit();
    });
  }

  fac_progr() {

    //console.log(row);
    let dialogRef = this.dialog.open(fac_programadas, {
      width: '50%',
      data: this.fac_prog
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
      console.log('The dialog was AddClient closed');
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
  Close() { this.location.back(); }
  private openLINK(url) {
    console.log(url)
    window.open("/maraveca/test.php?ip=" + url, '_blank');
  }
  generate(fecha) {
    const req = this.http.post(environment.apiEndpoint + 'factura', {
      cliente: this.cliente.id,
      fecha: "18-09-01",
      responsable: this.usuario.currentUser.id_user,
      //fecha : fecha
    }).subscribe(result => {
      console.log(result)
      this.http.get(environment.apiEndpoint + 'clientover/' + this.id)
        .subscribe((data) => {
          var response = data.json()
          this.soporte = response.soporte
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
            //  serie: this.cliente.serie,
            phone1: this.cliente.phone1,
            phone2: this.cliente.phone2,
            comment: this.cliente.comment,
            id: this.cliente.id,
            social: this.cliente.social,

          });
        });
    })
    this.refresh();
  }
  edit() {
    this.editclient = true

  }
  edit_service(row) {

    console.log(row);
    let dialogRef = this.dialog.open(UpdateserviceComponent, {
      panelClass: 'my-full-screen-dialog',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
      console.log('The dialog was AddClient closed');
    });
    this.refresh();
  }

  show(row) {
    console.log(row);
    let dialogRef = this.dialog.open(AddservicesComponent, {
      panelClass: 'my-full-screen-dialog',
      // height: '98%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
      console.log('The dialog was AddClient closed');
    });
    //this.myService.refresh();
    this.refresh();
  }

  cort_prog() {

    //console.log(row);
    let dialogRef = this.dialog.open(cortes_programados, {
      width: '50%',
      data: this.corte_prog
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
      console.log('The dialog was AddClient closed');
    });
    this.refresh();
  }

  abono() {
    let dialogRef = this.dialog.open(AddPagoBalance, {
      data: this.id

    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
      if (result) {
        console.log(result);
        var url = environment.apiEndpoint + "pagoclient/"
        this.http.post(url, result).subscribe(data => {
          this.ngOnInit()
        })
      }
    });
    this.refresh();
  }

  abonod() {

    let dialogRef = this.dialog.open(AddPagoBalanceDl, {
      data: this.id

    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
      if (result) {
        console.log(result);
        var url = environment.apiEndpoint + "pagoclient_in/"
        this.http.post(url, result).subscribe(data => {
          console.log(data);
          this.ngOnInit()
        })
      }
    });
    this.refresh();
  }

  /*Cliente*/

  editarEstatusDatosClientes() {
    document.getElementById("elemento").style.display = "block";
    document.getElementById("elemento2").style.display = "block";
    this.editarCliente = !this.editarCliente
    this.refresh();
  }

  editarDatosClientes() {
    this.clienteService.editarDatosCliente(this.clienteSeleccionado).subscribe(res => { this.editarCliente = false, this.ngOnInit() }, err => console.log(err))
    document.getElementById("elemento").style.display = "none";
    document.getElementById("elemento2").style.display = "none";
    this.refresh();
  }


  /*Cliente*/

  /*Registro De Pago*/

  mostrarCuerpoRegistroPago() {
    this.bodyRegistroPagos = !this.bodyRegistroPagos

  }



  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);

  }

  hacerConversion(e) {
    this.conversion = this.Monto / this.taza
  }
  registrarPago() {

    if (this.Referencia.charAt(0) == " ") {
      this.Referencia = this.Referencia.substring(1)
    }

    this.balance_in.forEach(e => {
      if (e.bal_comment_in == this.Referencia || e.bal_comment_mod_in_ == this.Referencia) {
        this.pagoCargado = true
      }
    });

    if (this.pagoCargado) {

    } else {
        
      this.cargarPagos.registrarPago(
        this.MetodoSelected,
        this.Referencia,
        this.fecha.epoc,
        this.conversion,
        this.Monto,
        this.usuario.currentUser.id_user,
        this.cliente.id)
        .subscribe(
          res => { console.log(res), this.ocultarModal() },
          err => { console.log(err), this.ocultarModal() }
        )
        this.ocultarModal()
    }
  }

  ocultarModal() {
    this.Referencia = " ";
    this.fecha = 0;
    this.MetodoSelected = 0;
    this.Monto = 0
    this.pagoCargado = false
    this.modalRef.hide();
    this.ngOnInit()
  }

  cambiarPagosExoneraciones() {
    this.pagosExoneraciones = !this.pagosExoneraciones
  }
  /*Registro De Pago*/


  /* Promociones */
  openModal2(template2: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template2, this.config);
    this.servicioPromo = id
    this.traerPromociones()
    this.verificarPromo(id)
    this.traerDatosClienteFacPromo();

  }

  traerPromociones() {
    this.FacPromoService.traerPromociones().subscribe(res => this.promociones = res, err => console.log(err))
  }

  TipoPlan() {
    this.FacPromoService.traerPlanes(this.tipoServicioPromo).subscribe(res => this.planesPromo = res, err => console.log(err))
  }

  traerDatosClienteFacPromo() {
    this.FacPromoService.traerDatosClientes(this.id)
      .subscribe(
        res => {
          console.log(res),
            res[0].social == null ? this.clientePromocion = res[0].nombre + " " + res[0].apellido : this.clientePromocion = res[0].social,
            this.serviciosPromo = res
        }
        , err => console.log(err))
  }


  RealizarPromocion() {

    this.FacPromoService.guardarDataPromo(this.id, this.servicioPromo, this.planPromo, this.fecha.epoc, this.usuario.currentUser.id_user, this.comentario)
      .subscribe(
        res => { console.log(res), this.closeModalPromocion() },
        err => { console.log(err), this.closeModalPromocion() }
      )



  }

  closeModalPromocion() {
    this.comentario = 0
    this.fecha = 0
    this.servicioPromo = 0
    this.planPromo = 0
    this.tipoServicioPromo = 0
    this.modalRef.hide();
    this.ngOnInit();
  }

  verificarPromo(id) {
    this.FacPromoService.verificarPromocion(id)
      .subscribe(
        res => {
          console.log(res)
          if (res["existe"] == 1) {
            this.promoActiva = true
            this.datosPromo = res
          } else {
            this.promoActiva = false
          }
        },
        err => console.log(err))
  }

  ocultarModal2() {
    this.comentario = 0
    this.fecha = 0
    this.servicioPromo = 0
    this.planPromo = 0
    this.tipoServicioPromo = 0
    this.modalRef.hide();

  }
  /* Promociones */


  /*Generacion de Factura */
  openModal3(template3: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template3, this.config);
    this.servicioCliente()

  }

  ocultarModal3() {
    this.FacturaSeleccionada = 0
    this.fechaFDesde = 0
    this.fechaFHasta = 0
    this.fecha = 0
    this.radio = 0
    this.ServicioSeleccionado = 0
    this.nservicio = []
    this.ServiciosClientes = []
    this.ServiciosClientes2 = []
    this.modalRef.hide();
    this.facBlanco = 0
    this.facBlancoTipo = 0
    this.ngOnInit()
  }

  servicioCliente() {
    this.servicioService.servicioCliente(this.id)
      .subscribe(
        res => {

          this.ServiciosClientes = res
          this.ServiciosClientes.forEach(element => {
            element["estatus"] = 1
            this.ServiciosClientes2.push(element)
          });
          console.log(this.ServiciosClientes)
        },
        err => console.log(err));
  }

  agregarNservicio(id: number, o: number) {

    this.ServiciosClientes2.forEach(element => {
      if (element.id_srv == id) {
        element["estatus"] = 2
      }
    });

    if (this.nservicio.includes(id)) {
      this.ServiciosClientes2.forEach(element => {
        if (element.id_srv == id) {
          element["estatus"] = 1
        }
      });
      this.nservicio.splice(o, 1);
    } else {
      this.nservicio.push(id);
      console.log(this.nservicio)
    }
  }

  seleccionarTServicios() {
    this.ServiciosClientes2.forEach(element => {
      element["estatus"] = 2
      this.nservicio.push(element.id_srv);
    });
    console.log(this.nservicio)
  }

  LimpiarLista() {
    this.ServiciosClientes2.forEach(element => {
      element["estatus"] = 1
      this.nservicio = []
    });
  }

  generarFactura() {

    const cantidadServicios = this.ServiciosClientes.length
    if (cantidadServicios <= 1) {
      if (this.FacturaSeleccionada == 2) {
        this.facturacionService.generarFactura(this.id, "", "", "", this.ServiciosClientes[0].id_srv, this.FacturaSeleccionada, this.usuario.currentUser.id_user)
          .subscribe(
            res => { console.log(res), this.ocultarModal3() },
            err => { console.log(err), this.ocultarModal3() }
          )
      }
      if (this.FacturaSeleccionada == 1 || this.FacturaSeleccionada == 4) {
        this.facturacionService.generarFactura(this.id, "", this.fechaFDesde.formatted, this.fechaFHasta.formatted, this.ServiciosClientes[0].id_srv, this.FacturaSeleccionada, this.usuario.currentUser.id_user)
          .subscribe(
            res => { console.log(res), this.ocultarModal3() },
            err => { console.log(err), this.ocultarModal3() }
          )

      }

      if (this.FacturaSeleccionada == 3) {
        this.facturacionService.generarFactura(this.id, "", this.fechaFDesde.formatted, this.fechaFDesde.formatted, this.ServiciosClientes[0].id_srv, this.FacturaSeleccionada, this.usuario.currentUser.id_user)
          .subscribe(
            res => { console.log(res), this.ocultarModal3() },
            err => { console.log(err), this.ocultarModal3() }
          )

      }

      if (this.FacturaSeleccionada == 5) {

        if (this.facBlanco == 2) {
          this.facturacionService.generarFacturaBlanco(this.id, "", this.FacturaSeleccionada, this.facBlanco, 2, this.usuario.currentUser.id_user)
            .subscribe(
              res => { console.log(res), this.ocultarModal3() },
              err => { console.log(err), this.ocultarModal3() }
            )

        } else {
          this.facturacionService.generarFacturaBlanco(this.id, "", this.FacturaSeleccionada, this.facBlanco, this.facBlancoTipo, this.usuario.currentUser.id_user)
            .subscribe(
              res => { console.log(res), this.ocultarModal3() },
              err => { console.log(err), this.ocultarModal3() }
            )

        }
      }


    } else {
      if (this.radio == 1) {
        if (this.FacturaSeleccionada == 2) {
          this.facturacionService.generarFactura(this.id, "", "", "", this.ServicioSeleccionado, this.FacturaSeleccionada, this.usuario.currentUser.id_user)
            .subscribe(
              res => { console.log(res), this.ocultarModal3() },
              err => { console.log(err), this.ocultarModal3() }
            )

        }
        if (this.FacturaSeleccionada == 1 || this.FacturaSeleccionada == 4) {
          this.facturacionService.generarFactura(this.id, "", this.fechaFDesde.formatted, this.fechaFHasta.formatted, this.nservicio, this.FacturaSeleccionada, this.usuario.currentUser.id_user)
            .subscribe(
              res => { console.log(res), this.ocultarModal3() },
              err => { console.log(err), this.ocultarModal3() }
            )

        }

        if (this.FacturaSeleccionada == 3) {
          this.facturacionService.generarFactura(this.id, "", this.fechaFDesde.formatted, this.fechaFDesde.formatted, this.ServicioSeleccionado, this.FacturaSeleccionada, this.usuario.currentUser.id_user)
            .subscribe(
              res => { console.log(res), this.ocultarModal3() },
              err => { console.log(err), this.ocultarModal3() }
            )

        }

        if (this.FacturaSeleccionada == 5) {

          if (this.facBlanco == 2) {
            this.facturacionService.generarFacturaBlanco(this.id, "", this.FacturaSeleccionada, this.facBlanco, 2, this.usuario.currentUser.id_user)
              .subscribe(
                res => { console.log(res), this.ocultarModal3() },
                err => { console.log(err), this.ocultarModal3() }
              )

          } else {
            this.facturacionService.generarFacturaBlanco(this.id, "", this.FacturaSeleccionada, this.facBlanco, this.facBlancoTipo, this.usuario.currentUser.id_user)
              .subscribe(
                res => { console.log(res), this.ocultarModal3() },
                err => { console.log(err), this.ocultarModal3() }
              )

          }
        }

      } else {
        if (this.FacturaSeleccionada == 2) {
          this.facturacionService.generarFactura(this.id, "", "", "", this.nservicio, this.FacturaSeleccionada, this.usuario.currentUser.id_user)
            .subscribe(
              res => { console.log(res), this.ocultarModal3() },
              err => { console.log(err), this.ocultarModal3() }
            )

        }
        if (this.FacturaSeleccionada == 1 || this.FacturaSeleccionada == 4) {
          this.facturacionService.generarFactura(this.id, "", this.fechaFDesde.formatted, this.fechaFHasta.formatted, this.nservicio, this.FacturaSeleccionada, this.usuario.currentUser.id_user)
            .subscribe(
              res => { console.log(res), this.ocultarModal3() },
              err => { console.log(err), this.ocultarModal3() }
            )

        }

        if (this.FacturaSeleccionada == 3) {
          this.facturacionService.generarFactura(this.id, "", this.fechaFDesde.formatted, this.fechaFDesde.formatted, this.nservicio, this.FacturaSeleccionada, this.usuario.currentUser.id_user)
            .subscribe(
              res => { console.log(res), this.ocultarModal3() },
              err => { console.log(err), this.ocultarModal3() }
            )

        }

        if (this.FacturaSeleccionada == 5) {

          if (this.facBlanco == 2) {
            this.facturacionService.generarFacturaBlanco(this.id, "", this.FacturaSeleccionada, this.facBlanco, 2, this.usuario.currentUser.id_user)
              .subscribe(
                res => { console.log(res), this.ocultarModal3() },
                err => { console.log(err), this.ocultarModal3() }
              )

          } else {
            this.facturacionService.generarFacturaBlanco(this.id, "", this.FacturaSeleccionada, this.facBlanco, this.facBlancoTipo, this.usuario.currentUser.id_user)
              .subscribe(
                res => { console.log(res), this.ocultarModal3() },
                err => { console.log(err), this.ocultarModal3() }
              )

          }
        }
      }
    }

  }

  anularfactura(i, template7: TemplateRef<any>) {
    this.modalRef7 = this.modalService.show(template7, this.config);
    this.facturaAnulacion = i.id

    this.facturacionService.comprobarAnulacion(this.facturaAnulacion)
      .subscribe(
        res => {
          console.log(res)
          if (res["existe"] == 1) {
            this.comprobacionAnulacion = true,
              this.comprobacionAnulacionMotivo = res["0"].razon_anulacion
          } else {
            this.comprobacionAnulacion = false
          }
        },
        err => console.log(err))
    this.refresh();
  }

  closeModal7() {
    this.modalRef7.hide()
    this.RazonAnulacion = ""
    this.ngOnInit()

  }

  generarAnulacionFactura() {
    this.facturacionService.anularFactura(this.facturaAnulacion, this.usuario.currentUser.id_user, this.RazonAnulacion).subscribe(res => {console.log(res),this.closeModal7()}, err => {console.log(err),this.closeModal7()})
  }

  /*Generacion de Factura*/

  /*Ajustes de Factura*/
  openModal4(template4: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template4, this.config);
    this.servicioCliente()

  }

  traerProductos() {
    this.tipoNotaSeleccionada = 0
    this.productoSeleccionado = 0
    this.tipoNotaParcial = 0
    this.dias = 0
    this.porcentaje = 0
    this.notaService.traerProductos(this.notaSeleccionada).subscribe(res => this.productos = res, err => console.log(err))
  }

  notasCredito() {
    this.notaService.traerNotasDeCredito(this.id)
      .subscribe(
        res => {
          this.notasCreditos = res,
            console.log(res);
        },
        err => console.log(err))
  }

  tipodeNota() {
    this.dias = 0
    this.porcentaje = 0
    this.tipoNotaParcial = 0
  }

  tipodeNotaParcial() {
    this.dias = 0
    this.porcentaje = 0
  }

  generarNota() {


    if (this.tipoNotaSeleccionada == 1) {
      this.productos.forEach(element => {
        if (this.productoSeleccionado == element.id) {
          let precioNota = element.precio_bs
          this.notaService.guardarNota(this.tipoAjusteSeleccionado, this.id, this.notaSeleccionada, this.productoSeleccionado, precioNota).subscribe(res => this.closeCerrarNota(), err => console.log(err))
        }
      });
    } else {
      if (this.tipoNotaParcial == 1) {
        let calculo = this.porcentaje / 100
        this.productos.forEach(element => {
          if (this.productoSeleccionado == element.id) {
            let precioArticulo = element.precio_bs
            let precioNota = precioArticulo * calculo
            this.notaService.guardarNota(this.tipoAjusteSeleccionado, this.id, this.notaSeleccionada, this.productoSeleccionado, precioNota).subscribe(res => this.closeCerrarNota(), err => console.log(err))
          }
        });

      }
      if (this.tipoNotaParcial == 2) {
        this.productos.forEach(element => {
          if (this.productoSeleccionado == element.id) {
            let precioArticulo = element.precio_bs
            let precioDia = precioArticulo / 30
            let precioNota = precioDia * this.dias

            this.notaService.guardarNota(this.tipoAjusteSeleccionado, this.id, this.notaSeleccionada, this.productoSeleccionado, precioNota).subscribe(res => this.closeCerrarNota(), err => console.log(err))
          }
        });

      }
      if (this.tipoNotaParcial == 3) {
        let precioNota = this.montoNota
        this.notaService.guardarNota(this.tipoAjusteSeleccionado, this.id, this.notaSeleccionada, this.productoSeleccionado, precioNota).subscribe(res => this.closeCerrarNota(), err => console.log(err))
      }
    }
  }

  closeCerrarNota() {
    this.notaSeleccionada = 0
    this.tipoNotaSeleccionada = 0
    this.productoSeleccionado = 0
    this.tipoNotaParcial = 0
    this.porcentaje = 0
    this.dias = 0
    this.montoNota = 0
    this.modalRef.hide()
    this.ngOnInit()

  }

  verNota(id: number, lgModal) {
    this.mostrarNota = lgModal
    this.mostrarNota.show()
    this.notaActiva = true
    this.notasCreditos.forEach(element => {
      if (id == element.id_nota) {
        this.notaDeCredito = element
        this.deudaNota = element.total - element.pagado;
      }
    });
  }

  GenerarPagoAjusteFactura() {
    this.notaService.guardarPagoNota(this.pagoAjustesFactura.value, this.notaDeCredito.id_nota, this.usuario.currentUser.id_user)
      .subscribe(
        res => console.log(res),
        err => console.log(err))

    this.mostrarNota.hide()
    this.refresh()

  }

  /*Ajustes de Factura*/

  /*Historial*/
  mostrarCuerpoHistorial() {
    this.bodyHistorial = !this.bodyHistorial

  }
  /*Historial*/

  /*Ticket*/
  mostrarCuerpoTickets() {
    this.bodyTickets = !this.bodyTickets
  }
  /*Ticket*/

  /*Facturas*/
  mostrarCuerpoFacturas() {
    this.bodyFacturas = !this.bodyFacturas
  }

  cambiarNotasFacturas() {
    this.notasFacturas = !this.notasFacturas
  }
  /*Facturas*/

  /*servicios */

  mostrarCuerpoServicio() {
    this.bodyServices = !this.bodyServices

  }

  mostrarCuerpoDatosServicios() {
    this.bodyDatosServices = !this.bodyDatosServices

  }


  openModal5(template5: TemplateRef<any>, id: number, tipo: number) {

    this.servicioService.servicioIndividual(id, tipo).subscribe(
      res => {
        if (res["gen_comision_serv"] == 1) {
          this.isCheckedS = true
          this.comision()
        } else {
        }
        console.log(res),
          this.servicioEditable = res
        this.modalRef = this.modalService.show(template5, this.config2);
        this.traerAps();
        this.traerCajas();
        this.traerCeldas();
        this.traerEquipos(this.servicioEditable["tipo_srv"]);
        this.cambioEquipo();
      }, err => console.log(err))
  }

  comision() {
    if (this.isCheckedS) {
      this.usuariosComisiones()
    } else {
      this.usuarioNuevo = 0
      this.porcentajeNuevo = 0
    }
  }

  usuariosComisiones() {
    this.servicioService.usuariosComision().subscribe(res => { console.log(res), this.userComisiones = res }, err => console.log(err))
  }

  onChange() {

    this.instalacionesService.traerPlanesPractica(this.tipoPlanSeleccionado)
      .subscribe(
        res => {
          this.planes = res;
          console.log(this.planes)
        },

        err => console.log(err))

  }

  cambioPlan() {
    this.servicioEditable["tipo_plan"] = this.tipoPlanSeleccionado
    this.servicioEditable["plan_srv"] = this.planSeleccionado
  }

  traerAps() {
    this.instalacionesService.traerApsPractica()
      .subscribe(res => { console.log(res), this.aps = res }, err => console.log(err))
  }

  traerCajas() {
    this.cajaService.traerCajaDistribucion().subscribe(res => this.cajas = res, err => console.log(err))
  }

  traerCeldas() {
    this.instalacionesService.traerCeldaPractica()
      .subscribe(res => { console.log(res), this.celdas = res }, err => console.log(err))
  }

  traerEquipos(id) {
    this.instalacionesService.traerEquiposPractica(id)
      .subscribe(res => { this.equipos = res, console.log(res) }, err => console.log(err))
  }


  cambioEquipo() {
    if (this.servicioEditable["tipo_srv"] == 1) {
      this.apSeleccionado = this.servicioEditable["ap_srv"]
      this.equipeSeleccionada = this.servicioEditable["nombre_equipo"]
      this.celdas.forEach(element => {
        if (element.id_celda == this.servicioEditable["celda_ap"]) {
          this.celdaSeleccionada = element.id_celda
        }
      });
      this.hola()
    } else {
      this.zoneSeleccionada = this.servicioEditable["zona_caja"]
      this.equipeSeleccionada = this.servicioEditable["nombre_equipo"]
      this.hola()
    }

  }

  hola() {
    if (this.servicioEditable["tipo_srv"] == 1) {
      if (this.celdaSeleccionada == 16 ||
        this.celdaSeleccionada == 17 ||
        this.celdaSeleccionada == 30 ||
        this.celdaSeleccionada == 19 ||
        this.celdaSeleccionada == 20 ||
        this.celdaSeleccionada == 37 ||
        this.celdaSeleccionada == 18 ||
        this.celdaSeleccionada == 22 ||
        this.celdaSeleccionada == 34 ||
        this.celdaSeleccionada == 21 ||
        this.celdaSeleccionada == 32) {

        this.zoneSeleccionada = 1;
        console.log(this.zoneSeleccionada)
      }

      if (this.celdaSeleccionada == 9 ||
        this.celdaSeleccionada == 12 ||
        this.celdaSeleccionada == 3 ||
        this.celdaSeleccionada == 6 ||
        this.celdaSeleccionada == 7 ||
        this.celdaSeleccionada == 8 ||
        this.celdaSeleccionada == 28 ||
        this.celdaSeleccionada == 10 ||
        this.celdaSeleccionada == 11 ||
        this.celdaSeleccionada == 15) {

        this.zoneSeleccionada = 3;
        console.log(this.zoneSeleccionada)
      }

      if (
        this.celdaSeleccionada == 14 ||
        this.celdaSeleccionada == 24 ||
        this.celdaSeleccionada == 25 ||
        this.celdaSeleccionada == 29) {

        this.zoneSeleccionada = 2;
        console.log(this.zoneSeleccionada)
      }

      if (this.celdaSeleccionada == 2 ||
        this.celdaSeleccionada == 4 ||
        this.celdaSeleccionada == 5 ||
        this.celdaSeleccionada == 13 ||
        this.celdaSeleccionada == 31 ||
        this.celdaSeleccionada == 40 ||
        this.celdaSeleccionada == 41) {

        this.zoneSeleccionada = 4;
        console.log(this.zoneSeleccionada)
      }

      if (this.celdaSeleccionada == 35 ||
        this.celdaSeleccionada == 36 ||
        this.celdaSeleccionada == 39) {
        this.zoneSeleccionada = 5;
        console.log(this.zoneSeleccionada)
      }

      if (this.celdaSeleccionada == 38) {
        this.zoneSeleccionada = 6;
        console.log(this.zoneSeleccionada)
      }



      this.articuloService.obtenerDataEquiposPorModelo2(this.zoneSeleccionada, this.equipeSeleccionada)
        .subscribe(
          res => {
            this.disponibles = res
          },
          err => console.log(err))
    } else {
      this.articuloService.obtenerDataEquiposPorModelo2(this.zoneSeleccionada, this.equipeSeleccionada)
        .subscribe(
          res => {
            this.disponibles = res
          },
          err => console.log(err))
    }
    this.refresh();
  }

  EditarData() {
    this.servicioEditable["id_usuario"] = this.usuario.currentUser.id_user
    this.servicioService.editarData(this.servicioEditable).subscribe(res => { console.log(res), this.closeModal2() }, err => { console.log(err), this.closeModal2() })
  }

  closeModal2() {
    this.tipoPlanSeleccionado = 0
    this.planSeleccionado = 0
    this.isCheckedS = false
    this.modalRef.hide()
    this.ngOnInit()
  }

  openModal9(template9: TemplateRef<any>, id: number) {
    this.modalRef9 = this.modalService.show(template9, this.config);

    this.servicioProSeleccionado = id
  }

  TipoPlanPro() {
    this.FacPromoService.traerPlanes(this.tipoPlanProSeleccionado).subscribe(res => this.planesPro = res, err => console.log(err))
  }

  guardarFacturaPro() {
    this.servicioService.generarFacturaProrateada(this.usuario.currentUser.id_user, this.id, this.servicioProSeleccionado, this.facturaProSeleccionada, this.tipoPlanProSeleccionado, this.planProSeleccionado)
      .subscribe(res => { console.log(res), this.closeModal9() }, err => { console.log(err), this.closeModal9() })

  }

  closeModal9() {
    this.servicioProSeleccionado = 0
    this.facturaProSeleccionada = 0
    this.tipoPlanProSeleccionado = 0
    this.planProSeleccionado = 0
    this.modalRef9.hide()
    this.ngOnInit()

  }

  /*servicios */




  /*Compromiso de Servicios */

  openModal6(template6: TemplateRef<any>, servicio: number) {
    this.verificarCompromisoServicio(servicio)
    this.modalRef6 = this.modalService.show(template6, this.config);
  }

  generarCompromisoServicio() {
    this.servicioService.generarCompromisoServicio(this.id, this.compromisSerSeleccionado, this.tipoPlanSeleccionado, this.planSeleccionado, this.fechaLimiteCompromisoServicio, this.usuario.currentUser.id_user)
      .subscribe(
        res => {
          console.log(res)
          this.closeModal6()
        },
        err => {
          console.log(err),
            this.closeModal6()
        })
  }

  verificarCompromisoServicio(servicio: number) {
    this.servicioService.verificarCompromisoServicio(servicio)
      .subscribe(
        res => {
          console.log(res),
            this.compromisosServicios = res
          this.closeModal6()
        },
        err => console.log(err))
  }

  EliminarCompromisoServicio(compromiso: number, servicio: number) {

    this.servicioService.EliminarCompromisoServicio(compromiso, servicio, this.usuario.currentUser.id_user)
      .subscribe(
        res => {
          console.log(res),
            this.closeModal6()
        },
        err => console.log(err))
    this.refresh();
  }

  EditarCompromisoServicio(compromiso: number, servicio: number) {

    this.servicioService.EditarCompromisoServicio(compromiso, servicio, this.id, this.tipoPlanSeleccionado, this.planSeleccionado, this.fechaLimiteCompromisoServicio)
      .subscribe(
        res => {
          console.log(res)
          this.closeModal6()
        },
        err => console.log(err))
    this.refresh();
  }

  activarEdicion() {
    this.edicionComprosimo = true
  }

  closeModal6() {
    this.compromisSerSeleccionado = 0,
      this.tipoPlanSeleccionado = 0,
      this.planSeleccionado = 0
    this.fechaLimiteCompromisoServicio = "",
      this.compromisosServicios = []
    this.modalRef6.hide()
    this.ngOnInit()

  }

  /*Compromiso de Servicio */

  /*Cortes Programados*/
  openModal8(template: TemplateRef<any>) {

    this.modalRef8 = this.modalService.show(template, this.config);
  }


  generarCorteProgramado() {

    this.servicioService.generarCompromisoCorte(this.id, this.servicioCorteProgSeleccionado, this.usuario.currentUser.id_user, this.fechaCorteProgSeleccionado)
      .subscribe(res => this.closeModal8(), err => { console.log(err), this.closeModal8() })
  }

  closeModal8() {
    this.servicioCorteProgSeleccionado = 0
    this.fechaCorteProgSeleccionado = ""
    this.modalRef8.hide()
    this.ngOnInit()

  }
  /*Cortes Programados*/


  /*Descuentos*/
  openModal10(template10: TemplateRef<any>, id: number) {
    this.modalRef10 = this.modalService.show(template10, this.config);

    this.servicioProSeleccionado = id
  }

  guardarDescuento() {


    this.descuentoService.guardarDescuento(this.facturaDescuentoSeleccionada, this.tipoDescuentoSeleccionado, this.diasSinServicio, this.comentarioDescuento, this.montoDescuento, this.usuario.currentUser.id_user)
      .subscribe(
        res => { console.log(res), this.closeModal10() },
        err => { console.log(err), this.closeModal10() })

  }

  closeModal10() {
    this.facturaDescuentoSeleccionada = 0
    this.tipoDescuentoSeleccionado = 0
    this.diasSinServicio = 0
    this.comentarioDescuento = ""
    this.montoDescuento = 0
    this.modalRef10.hide()
    this.ngOnInit()
  }

  /*Descuentos*/

  updateClient() {
    var url = environment.apiEndpoint + "clientes/" + this.cliente.id
    this.http.put(url, this.addClient.value).subscribe((data) => {
      this.editclient = false
      this.http.get(environment.apiEndpoint + 'clientover/' + this.id)
        .subscribe((data) => {
          var response = data.json()
          this.soporte = response.soporte
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
            // serie: this.cliente.serie,
            phone1: this.cliente.phone1,
            phone2: this.cliente.phone2,
            comment: this.cliente.comment,
            id: this.cliente.id,
            social: this.cliente.social,

          });
        });
    });
    this.refresh();
  }

  status(row) {
    console.log(row);
    let dialogRef = this.dialog.open(FacturacionPagos, {
      width: '80%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was AddClient closed');
      this.http.get(environment.apiEndpoint + 'clientover/' + this.id)
        .subscribe((data) => {
          var response = data.json()
          this.soporte = response.soporte
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
            // serie: this.cliente.serie,
            phone1: this.cliente.phone1,
            phone2: this.cliente.phone2,
            comment: this.cliente.comment,
            id: this.cliente.id,
            social: this.cliente.social,

          });
        });
    });
    //this.myService.refresh();
    this.refresh();
  }

  print(): void {
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
    `+ printContents + `
    </body>
    </html>`
    );
  }



}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'pago-balance.html',
  styleUrls: ['./clients.component.css']
})
export class AddPagoBalance implements OnInit {

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
      bal_tip: ['', Validators.required],
      bal_monto: ['', Validators.required],
      created_at: ['', Validators.required],
      bal_comment: ['', Validators.required],
      bal_cli: id
    })
  }

  ngOnInit() {
    this.addAbono.get('created_at').valueChanges.subscribe(
      (fn) => {
        if (fn.epoc) {
          setTimeout(() => {
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
  templateUrl: 'pago-balance-d.html',
  styleUrls: ['./clients.component.css']
})
export class AddPagoBalanceDl implements OnInit {

  addAbono: FormGroup;
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    inline: true,
  };

  constructor(
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddPagoBalanceDl>,
    @Inject(MD_DIALOG_DATA) public id) {
    console.log(id);
    this.addAbono = this.fb.group({
      bal_tip_in: ['', Validators.required],
      bal_monto_in: ['', Validators.required],
      created_at: ['', Validators.required],
      bal_comment_in: ['', Validators.required],
      bal_cli_in: id
    })
  }

  ngOnInit() {
    this.addAbono.get('created_at').valueChanges.subscribe(
      (fn) => {
        if (fn.epoc) {
          setTimeout(() => {
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
  styleUrls: ['./clients.component.css']
})
export class GenFactura implements OnInit {

  genFAC: FormGroup;
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    inline: true,
  };
  data: any;
  nservicio: any;
  cliente: any;
  servicios: any;
  fac_serv: [any];
  n_serv: any;
  id_cliente: any;
  id_srv_client: any;
  id_serv: any;
  nr_serv: any;
  servi: any;
  name_plan: any;
  factura_b: any;
  fechaHasta: any

  constructor(
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private http: Http,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<GenFactura>,

    @Inject(MD_DIALOG_DATA) public cli) {
    this.http.get(environment.apiEndpoint + 'servicioscli/' + cli.id.id)
      .subscribe((data) => {
        this.servicios = data.json().servicios;

        console.log(this.servicios);
        console.log(cli);

      });
    this.servi = cli.serv;
    this.nr_serv = this.servi.length;
    this.id_cliente = cli.id.id;
    this.cliente = cli.id;

    console.log(this.cliente);
    console.log(this.id_cliente);
    console.log(this.id_serv);
    console.log(this.servi);
    console.log(this.nr_serv);
    console.log(this.name_plan);
    if (this.nr_serv >= 1) {
      if (this.nr_serv > 1) {
        this.id_serv = cli.serv[0].id_srv;
        this.name_plan = cli.serv[0].name_plan;
        this.genFAC = this.fb.group({
          cliente: [this.id_cliente, Validators.required],
          fecha: [''],
          nservicio: ['', Validators.required],
          pro: ['2', Validators.required],
          fac_serv: [this.fac_serv, Validators.required],
          responsable: usuario.currentUser.id_user

        });
        console.log(this.genFAC.value);

      } else {

        this.id_serv = cli.serv[0].id_srv;
        this.name_plan = cli.serv[0].name_plan;
        this.genFAC = this.fb.group({
          cliente: [this.id_cliente, Validators.required],
          fecha: [''],
          nservicio: [this.id_serv, Validators.required],
          pro: ['2', Validators.required],
          fac_serv: '',
          responsable: usuario.currentUser.id_user
        });
        console.log(this.genFAC.value);
      }
    } else {
      this.genFAC = this.fb.group({
        cliente: [this.id_cliente, Validators.required],
        fecha: [''],
        nservicio: ['', Validators.required],
        pro: ['2', Validators.required],
        responsable: usuario.currentUser.id_user
      })

    }
  }
  public onSelectAll() {
    const selected = this.servi.map(item => item.id_srv);
    this.genFAC.get('nservicio').patchValue(selected);
    console.log(selected);
  }

  public onClearAll() {
    this.genFAC.get('nservicio').patchValue([]);
  }




  ngOnInit() {

    this.genFAC.get('fecha').valueChanges.subscribe(
      (fn) => {
        if (fn.epoc) {
          setTimeout(() => {
            this.genFAC.patchValue({
              fecha: fn.formatted
            })
          }, 100)
        }
      })
    this.genFAC.get('pro').valueChanges.subscribe(
      (fn) => {
        if (fn == 1 || fn == 3) {
          this.genFAC.get('fecha').setValidators([Validators.required]);
        } else {
          this.genFAC.get('fecha').setValidators([]);
        }
      })
  }


  generate() {
    console.log(this.genFAC.value);

    const req = this.http.post(environment.apiEndpoint + 'factura', this.genFAC.value).subscribe(result => {
      console.log(result)
      this.dialogRef.close();
      this.snackBar.open("Factura Generada", null, {
        duration: 2000,
      });
    })


  }

  factura_blanco() {
    let dialogRef = this.dialog.open(GenFactura_blanco, {
      width: '23%',
      data: { dato_fac: this.genFAC.value, cli: this.cliente }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog GenFactura_blanco was closed');

    });
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'add-adic.html',
})
export class AddAdic implements OnInit {

  AddAdic: FormGroup;
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    inline: true,
  };
  cliente: any;
  planes: any;
  selected: any;
  planest: any;
  constructor(
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private http: Http,
    public dialogRef: MdDialogRef<AddAdic>,
    @Inject(MD_DIALOG_DATA) public id) {
    this.cliente = id
    console.log(this.cliente)
    this.AddAdic = this.fb.group({
      id_cli: [id.id, Validators.required],
      codigo_articulo: ['', Validators.required],
      precio_articulo: [''],
      cantidad: ['1', Validators.required],
      comment_articulo: ['', Validators.required]
    })
  }
  remind(i) {
    this.selected = i
    console.log(this.selected)
  }
  ngOnInit() {
    this.http.get(environment.apiEndpoint + 'planes/')
      .subscribe((data) => {
        this.planes = data.json();
        this.planest = this.planes.planes;

        console.log(this.planes);
        console.log(this.planest);
      });
  }
  generate() {
    const req = this.http.post(environment.apiEndpoint + 'addadic', this.AddAdic.value).subscribe(result => {
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

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'Genfactura_blanco.html',
  styleUrls: ['./clients.component.css']
})
export class GenFactura_blanco implements OnInit {

  genFAC: FormGroup;
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    inline: true,
  };
  data: any;
  nservicio: any;
  id_cliente: any;
  servicios: any;
  datos: any;
  cliente: any;
  serie: any;

  constructor(
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private http: Http,
    public dialogRef: MdDialogRef<GenFactura_blanco>,
    @Inject(MD_DIALOG_DATA) public id) {
    console.log(this.id);

    this.cliente = this.id.cli;
    this.datos = this.id.dato_fac;

    console.log(this.cliente);
    console.log(this.datos);


    this.id_cliente = this.cliente.id;
    console.log(this.id_cliente);
    this.serie = this.cliente.serie;
    console.log(this.serie);
    this.genFAC = this.fb.group({
      cliente: [this.id_cliente, Validators.required],
      fecha: [''],
      denominacion: ['', Validators.required],
      serie: [''],
      pro: ['2', Validators.required],
      responsable: usuario.currentUser.id_user
    })

    this.genFAC.get('denominacion').valueChanges.subscribe(
      (denominacion) => {

        if (denominacion == 1) {
          this.genFAC.get('serie').setValidators([Validators.required]);

        }
        this.genFAC.get('serie').updateValueAndValidity();


      }
    );

  }

  ngOnInit() {

    this.genFAC.get('fecha').valueChanges.subscribe(
      (fn) => {
        if (fn.epoc) {
          setTimeout(() => {
            this.genFAC.patchValue({
              fecha: fn.formatted
            })
          }, 100)
        }
      })
    this.genFAC.get('pro').valueChanges.subscribe(
      (fn) => {
        if (fn == 1) {
          this.genFAC.get('fecha').setValidators([Validators.required]);
        } else {
          this.genFAC.get('fecha').setValidators([]);
        }
      })
  }

  generate() {
    console.log(this.genFAC.value);

    const req = this.http.post(environment.apiEndpoint + 'factura_blanco', this.genFAC.value).subscribe(result => {
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
  templateUrl: './fac_prog.html',
  styleUrls: ['./clients.component.css']
})

export class fac_programadas {
  myService: MyService | null;
  //data:any = null;
  fac_prog: any;
  constructor(
    public usuario: AuthGuard,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public dialogRef: MdDialogRef<fac_programadas>,
    public router: Router,
    @Inject(MD_DIALOG_DATA) public data) {
    console.log(data);
    this.fac_prog = this.data;
    console.log(this.fac_prog);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  anularprog(i): void {
    let dialogRef = this.dialog.open(Anularprog_fac, {
      width: '25%',
      data: i
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
    this.dialogRef.close();
  }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'anular_prog_fac.component.html',
  styleUrls: ['./clients.component.css']
})
export class Anularprog_fac {
  myService: MyService | null;
  responsable: any;
  datat: any;


  constructor(
    public dialogRef: MdDialogRef<Anularprog_fac>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
    this.myService = new MyService(http, router, usuario);
    console.log(this.data);
    this.responsable = this.usuario.currentUser.id_user;
    console.log(this.responsable);

    let data1 = this.data;
    let resp = this.responsable;
    let data_t = [];
    data_t.push(data1);
    data_t.push(resp);
    //this.datat= this.data1[this.data];
    console.log(data_t);
    this.datat = data_t;
    console.log(this.datat);

  }




  anular(): void {
    this.snackBar.open("Anulando Factura: Por favor espere", null, {
      duration: 1000,
    });
    this.http.put(environment.apiEndpoint + "facturas_prog/anular/" + this.data.id_fac_prog, this.datat).subscribe((data) => {
      this.dialogRef.close();
    })
    //this.myService.refresh();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'Prog_corte.component.html',
  styleUrls: ['./clients.component.css']
})
export class program_corte implements OnInit {


  progCorte: FormGroup;
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    inline: true,
  };
  data: any;
  nservicio: any;
  cliente: any;
  servicios: any;
  fac_serv: [any];
  n_serv: any;
  id_cliente: any;
  id_srv_client: any;
  id_serv: any;
  nr_serv: any;
  servi: any;
  name_plan: any;
  factura_b: any;

  constructor(
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private http: Http,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<program_corte>,

    @Inject(MD_DIALOG_DATA) public row) {
    console.log(row);
    this.cliente = row.client;
    this.servi = row.serv;
    this.http.get(environment.apiEndpoint + 'servicioscli/' + this.cliente.id)
      .subscribe((data) => {
        this.servicios = data.json().servicios;

        console.log(this.servicios);
        console.log(row);

      });

    this.nr_serv = this.servi.length;
    this.id_cliente = this.cliente.id;


    console.log(this.cliente);
    console.log(this.id_cliente);
    console.log(this.id_serv);
    console.log(this.servi);
    console.log(this.nr_serv);
    console.log(this.name_plan);
    if (this.nr_serv >= 1) {
      if (this.nr_serv > 1) {
        this.id_serv = row.serv[0].id_srv;
        this.name_plan = row.serv[0].name_plan;
        this.progCorte = this.fb.group({
          cliente: [this.id_cliente, Validators.required],
          fecha: ['', Validators.required],
          nservicio: ['', Validators.required],
          fac_serv: [this.fac_serv, Validators.required],
          responsable: usuario.currentUser.id_user

        });
        console.log(this.progCorte.value);

      } else {

        this.id_serv = row.serv[0].id_srv;
        this.name_plan = row.serv[0].name_plan;
        this.progCorte = this.fb.group({
          cliente: [this.id_cliente, Validators.required],
          fecha: ['', Validators.required],
          nservicio: [this.id_serv, Validators.required],
          fac_serv: '',
          responsable: usuario.currentUser.id_user
        });
        console.log(this.progCorte.value);
      }
    } else {
      this.progCorte = this.fb.group({
        cliente: [this.id_cliente, Validators.required],
        fecha: ['', Validators.required],
        nservicio: ['', Validators.required],
        responsable: usuario.currentUser.id_user
      })

    }
  }
  public onSelectAll() {
    const selected = this.servi.map(item => item.id_srv);
    this.progCorte.get('nservicio').patchValue(selected);
    console.log(selected);
  }

  public onClearAll() {
    this.progCorte.get('nservicio').patchValue([]);
  }




  ngOnInit() {

    this.progCorte.get('fecha').valueChanges.subscribe(
      (fn) => {
        if (fn.epoc) {
          setTimeout(() => {
            this.progCorte.patchValue({
              fecha: fn.formatted
            })
          }, 100)
        }
      })

  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  generate() {
    console.log(this.progCorte.value);
    const req = this.http.post(environment.apiEndpoint + 'Prog_corte', this.progCorte.value).subscribe(result => {
      this.dialogRef.close();
      this.snackBar.open("Factura Generada", null, {
        duration: 2000,
      });
    })


  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './corte_prog.html',
  styleUrls: ['./clients.component.css']
})

export class cortes_programados {
  myService: MyService | null;
  //data:any = null;
  corte_prog: any;
  constructor(
    public usuario: AuthGuard,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public dialogRef: MdDialogRef<cortes_programados>,
    public router: Router,
    @Inject(MD_DIALOG_DATA) public data) {
    console.log(data);
    this.corte_prog = this.data;
    console.log(this.corte_prog);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  anularprog(i): void {
    let dialogRef = this.dialog.open(Anularprog_cort, {
      width: '25%',
      data: i
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
    this.dialogRef.close();
  }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'anular_prog_cort.component.html',
  styleUrls: ['./clients.component.css']
})
export class Anularprog_cort {
  myService: MyService | null;
  responsable: any;
  datat: any;


  constructor(
    public dialogRef: MdDialogRef<Anularprog_cort>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
    this.myService = new MyService(http, router, usuario);
    console.log(this.data);
    this.responsable = this.usuario.currentUser.id_user;
    console.log(this.responsable);

    let data1 = this.data;
    let resp = this.responsable;
    let data_t = [];
    data_t.push(data1);
    data_t.push(resp);
    //this.datat= this.data1[this.data];
    console.log(data_t);
    this.datat = data_t;
    console.log(this.datat);

  }




  anular(): void {
    this.snackBar.open("Anulando Corte programado: Por favor espere", null, {
      duration: 1000,
    });
    this.http.put(environment.apiEndpoint + "cortes_prog/anular/" + this.data.id_prog, this.datat).subscribe((data) => {
      this.dialogRef.close();
    })

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
