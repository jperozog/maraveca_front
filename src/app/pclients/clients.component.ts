import { Component, Inject, Pipe, PipeTransform, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
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
import { PreComponent } from '../presupuestos/pre.component'
import { AddticketComponent } from '../soporte/soporte.component';
import { FacturacionPagos } from '../facturacion/facturacion.component'
import { DateModel, DatepickerOptions, TemporalType } from '@novalinc/datepicker';


import { IntalacionesService } from '../services/Inventario/intalaciones.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ArticuloService } from '../services/Inventario/articulo.service';
import { InstalacionesComponent } from '../instalaciones/instalaciones.component';
import { VentasEquiposService } from '../services/Inventario/ventas-equipos.service'
import { FactibilidadesService } from '../services/factibilidades/factibilidades.service'
import { ClienteService } from '../services/cliente/cliente.service';
import { PclienteService } from '../services/pcliente/pcliente.service';
import { PromocionesService } from '../services/promociones/promociones.service';
import {VentasService} from '../services/ventas/ventas.service'



const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PHONE_REGEX = /^(0414\d|0412\d|0416\d|0426\d|0424\d|0415\d)+\d{6}/;
const KIND_REGEX = /^(V|J|E|G)/

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})

export class PClientsComponent {

  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef4: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  modalRef3: BsModalRef;
  config3 = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  pClientes: any = []
  pClientes2: any = []
  detallesFactibilidad: any =[]
  pClienteSeleccionado: any = {}
  pClienteModificable: any = {}
  factbilidadSeleccionada: any = {}
  clienteSeleccionado: boolean = false
  listacliente: any = [];
  idSeleccionada: number
  cedulaSeleccionado: string
  nombreSeleccionado: string
  apellidoSeleccionado: string
  zoneSeleccionada: number
  cliente: string = ""
  latitud: string = ""
  longitud: string = ""
  ciudad: string = ""
  direccion: string = ""
  isCheckedCliente: boolean = false
  e:number = 1
  p:number = 1


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
  Direccion: string = ""
  celdas: any = [];
  equipos: any = [];

 



  myService: MyService | null;
  data: any = null;
  search: string = '';
  NewService: FormGroup;
  factibi: any = null;
  constructor(
    private http: Http,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard,
    public test: AuthenticationService,
    private modalService: BsModalService,
    private ventasEquiposService: VentasEquiposService,
    private factibilidadService: FactibilidadesService,
    private clienteService: ClienteService,
    private pclienteService: PclienteService,
    private ventaService:VentasService
  ) {
    this.snackBar.open("Cargando Clientes", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router, usuario);
    this.http.get(environment.apiEndpoint + 'pclientes/')
      .subscribe((data) => {
        this.data = data.json();
        console.log(this.data);
      });
    this.snackBar.open("Clientes Cargados", null, {
      duration: 2000,
    });


  }
  ngOnInit() {
    this.traerEstados()
    this.traerPClientes()
  }



 
  openModal(id: number, template2: TemplateRef<any>) {
    this.pClientes.forEach(e => { if (e["id"] == id) this.pClienteSeleccionado = e });
    this.modalRef = this.modalService.show(template2, this.config);
    this.pclienteService.traerFactibilidad(id).subscribe(res =>{console.log(res), this.detallesFactibilidad = res}, err => console.log(err))
  }

  openModal4(id:number,template4: TemplateRef<any>) {
    this.pClientes.forEach(e => { if (e["id"] == id) this.pClienteModificable = e });
    console.log(this.pClienteModificable)
    this.estado = this.pClienteModificable.estado
    this.municipio = this.pClienteModificable.municipio
    this.Municipios()
    this.Parroquias()
    this.modalRef4 = this.modalService.show(template4, this.config);
  }

  traerPClientes() {
    this.pclienteService.traerPCliente(this.usuario.currentUser.id_user).subscribe(res => {this.pClientes = res , this.pClientes2 = res}, err => console.log(err))
  }

  aggCliente(template1: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template1, this.config);
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
    this.pclienteService.guardarCliente(this.nombres, this.apellidos, this.kni, this.dni, this.fecha.epoc, this.numero, this.email, this.estado, this.municipio, this.parroquia, this.social,this.isCheckedCliente, this.Direccion)
      .subscribe(
        res => this.closeModal(),
        err => console.log(err)
      )

  }

  closeModal() {
    this.modalRef2.hide()
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
    this.Direccion = ""
    this.isCheckedCliente = false
  }


  nuevaFact(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);

  }

  ocultarModal() {
    this.clienteSeleccionado = false;
    this.cedulaSeleccionado = "";
    this.nombreSeleccionado = "";
    this.apellidoSeleccionado = "";
    this.listacliente = [];
    this.longitud = ""
    this.latitud = ""
    this.ciudad = ""
    this.direccion = ""
    this.modalRef.hide()
  }

  onSearchCliente(searchValue: string): void {
    if (searchValue == "") {
      this.listacliente = []
    } else {
      this.ventasEquiposService.traerClientesP(searchValue)
        .subscribe(
          res => {
            this.listacliente = res,
              console.log(res)
          }
          ,
          err => console.log(err))

    }
  }

  SeleccionCliente(id: number, dni: string, nombre: string, apellido: string) {
    this.idSeleccionada = id;
    this.clienteSeleccionado = true;
    this.cedulaSeleccionado = dni;
    this.nombreSeleccionado = nombre;
    this.apellidoSeleccionado = apellido;
    this.cliente = this.nombreSeleccionado + " " + this.apellidoSeleccionado;
    console.log(this.cliente)
  }

  deseleccionarCliente() {
    this.clienteSeleccionado = false;
    this.cedulaSeleccionado = "";
    this.nombreSeleccionado = "";
    this.apellidoSeleccionado = "";
    this.listacliente = [];
    this.longitud = ""
    this.latitud = ""
    this.ciudad = ""
    this.direccion = ""
  }

  guardarData() {
    this.factibilidadService.guardarNuevaFac(this.idSeleccionada,
      this.latitud,
      this.longitud,
      this.ciudad,
      this.direccion,
      this.usuario.currentUser.id_user).subscribe(
        res => {
          console.log(res)
          this.ocultarModal()
        },
        err => console.log(err))
  }




  actualizarP() {
    this.traerPClientes()
  }

  buscarCliente(e) {
    if (e == "") {
      this.traerPClientes()
    } else {
      const result = [] 
      const result3 = this.pClientes.forEach(el => {
        if (el.social === null || el.social === "null") {
            const cliente = el.nombre.toUpperCase()+" "+el.apellido.toUpperCase()
          if (cliente.toUpperCase().includes(e.toUpperCase()) || el.dni.includes(e)) {
            result.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase()) || el.dni.includes(e)) {
            result.push(el)
          }
        }
      });

      this.pClientes = result;
    }
  }

  BuscarClienteSpace(e) {
    const algo = this.pClientes2
    const result = []

     const result3 = this.pClientes2.forEach(el => {
       if (el.social === null || el.social === "null") {
           const cliente = el.nombre.toUpperCase()+" "+el.apellido.toUpperCase()
         if (cliente.toUpperCase().includes(e.toUpperCase()) || el.dni.includes(e)) {
           result.push(el)
         }
       } else {
         if (el.social.toUpperCase().includes(e.toUpperCase()) || el.dni.includes(e)) {
           result.push(el)
         }
       }
     });

     this.pClientes = result;
    
  }

  agendarCliente(id:number, template3:TemplateRef<any>){
      this.modalRef.hide();
      this.modalRef3 = this.modalService.show(template3,this.config)

      this.detallesFactibilidad.forEach(element => {if (element.id == id) this.factbilidadSeleccionada = element});

  }

  

  aceptarVenta(){
    this.ventaService.guardarVenta(this.factbilidadSeleccionada.id_pot,this.usuario.currentUser.id_user).subscribe(res=>console.log(res),err=>console.log(err))
  }

  NegarVenta(){
    this,this.closeModal3()
  }
 

  closeModal3() {
    this.modalRef3.hide()
    this.ngOnInit()
  }

  editarCliente(){
    this.pclienteService.editarCliente(this.pClienteModificable).subscribe(res=>this.closeModal4(), err=>console.log(err))
  }

  closeModal4(){
    this.modalRef4.hide()
    this.traerPClientes()
  }
















  SendPre(row): void {
    /*let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%'
    });*/
    var tipo = 'p'
    var datos = [row, tipo]
    let dialogRef = this.dialog.open(PreComponent, {
      width: '25%',
      data: datos
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  showPre(row): void {
    /*let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%'
    });*/
    let dialogRef = this.dialog.open(ShowPreComponent, {
      width: '25%',
      data: row
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  openDialog(): void {
    /*let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%'
    });*/
    let dialogRef = this.dialog.open(AddPclientsComponent, {
      width: '25%'
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }

  NFactibilidad(): void {
    /*let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%'
    });*/
    let dialogRef = this.dialog.open(AddFactComponent, {
      width: '25%'
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }

  dinstall(row) {

    let dialogRef = this.dialog.open(ConfirmCliente2, {
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.response) {
        row.responsable = this.usuario.currentUser.id_user
        row.id_pot = row.id
        var url = environment.apiEndpoint + "pclienttc/";
        this.http.post(url, row).subscribe((data) => {
          row.id_cli = data.json().id
          console.log("prueba")
          console.log(row)
          this.NewService = this.fb.group({
            servicio: row.id_cli,
            /* celda: "",
             equipo: "",
             tubo:"",
             ptp: "",*/
          });
          row = this.NewService.value;
          let dialogRef = this.dialog.open(AddticketComponent, {
            width: '30%',
            data: row
          });
          dialogRef.afterClosed().subscribe(result => {

          });
        });

      }
    })
  }
  show(row) {
    console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(AddPclientsComponent, {
      width: '20%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was AddClient closed');

    });
    //this.myService.refresh();
  }

  status(row) {
    //console.log(row);
    //this.selectedRowIndex = row.id;
    if (this.usuario.perm && this.usuario.perm.includes('pclientes_w')) {
      let dialogRef = this.dialog.open(PClientesStatus, {
        width: '80%',
        data: row
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was AddClient closed');
      });
      //this.myService.refresh();

    }
  }
  deleteDialog(row): void {
    console.log(row);
    let dialogRef = this.dialog.open(DeletePCliente, {
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
    this.myService.refresh();

  }

}

function capitalizeName(name) {
  return name.replace(/\b(\w)/g, s => s.toUpperCase());
}

export class MyService {

  constructor(private http: Http, private router: Router, private usuario: AuthGuard) { }

  deleteData(id) {
    return this.http.delete(environment.apiEndpoint + 'pclientes/' + id + "?responsable=" + this.usuario.currentUser.id_user, {})
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
export class AddPclientsComponent implements OnInit {


  tipo: string;
  dni: string;
  email: string;
  name: string;
  last: string;
  dayofbirth: string;
  social: string;
  phone: string;
  phone2: string;
  // serie : string;
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
  departure: DateModel;
  departureOptions: DatepickerOptions;


  constructor(private http: Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddPclientsComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    public usuario: AuthGuard,
    private router: Router,
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
        responsable: this.usuario.currentUser.id_user

      });
      //console.log(row)
    } else {

      this.addClient = this.fb.group({
        kind: ['', [Validators.required, Validators.pattern(KIND_REGEX)]],
        dni: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
        //email: ['', [Validators.pattern(EMAIL_REGEX)]],
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
      //console.log("llego vacio"+ row)
    }

  }
  ngOnInit() {
    this.addClient.get('kind').valueChanges.subscribe(
      (kind) => {
        if (kind.toLowerCase() === 'v' || kind.toLowerCase() === 'e') {
          this.addClient.get('social').setValidators([]);
          this.addClient.get('social').updateValueAndValidity();
        } else if (kind.toLowerCase() === 'g' || kind.toLowerCase() === 'j') {
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
            day_of_birth: fn.formatted
          })
        }, 100)
      }
    })*/
    this.departureOptions = new DatepickerOptions();
    //this.departureOptions.temporal = TemporalType.TIMESTAMP;
    this.departureOptions.placeholder = "Fecha De Nacimiento";
    this.departureOptions.locale = "es";
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  Enviar() {
    var client = this.addClient.value;

    var url = environment.apiEndpoint + "pclientes";

    this.http.post(url, client).subscribe((data) => {
      this.dialogRef.close();
      this.myService.refresh();
      this.snackBar.open("Agregando Cliente: Por favor espere", null, {
        duration: 2000,
      });

    });

    //this.router.navigate(['/clientes']);
  }
  Editar() {
    var client = this.addClient.value;
    console.log(JSON.stringify(client));
    var url = environment.apiEndpoint + "pclientes/" + client.id;
    this.http.put(url, this.addClient.value).subscribe((data) => {
      this.dialogRef.close();
      this.myService.refresh();
      this.snackBar.open("Agregando Cliente: Por favor espere", null, {
        duration: 2000,
      });

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
export class PClientesStatus {

  fac_products: any = null;
  cliente: any;
  email: any;
  phone: any;
  address: any;
  dni: any;
  opcion: string;
  nada: string;
  id: any;
  NewService: FormGroup;
  resp: any;
  confirnfac: any;



  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  zonas: any = [];
  agregarZona: FormGroup;
  ubiSelected: string;
  ubicacion: string;
  zonaSelected: Number;
  soporteSelected: Number = 0;
  clienteSeleccionado: boolean = false;
  idSelecccionado: number
  cedulaSeleccionado: string = ""
  nombreSeleccionado: string = ""
  apellidoSeleccionado: string = ""
  adicionalSeleccionado: number = 0
  adicional1Seleccionado: any



  listacliente: any = [];
  listaips: any = [];
  celdas: any = [];
  equipos: any = [];
  disponibles: any = [];
  planes: any = [];
  celdaSeleccionada: number = 0;
  nombreCeldaSeleccionada: string = ""
  zoneSeleccionada: number;
  equipeSeleccionada: string;
  nombreEquipeSeleccionada: string = ""
  tipoPlanSeleccionado: number;
  planSeleccionado: number = 0;
  visualizarDisponible: boolean = false;
  visualizarPlan: boolean = false;
  visualizarIp: boolean = false;
  visualizarDivEquipos: boolean = false;
  visualizarDivPlanes: boolean = false;
  visualizarDivGuardar: boolean = false;
  ipSeleccionada: string;
  serialSeleccionado: string = " "
  isChecked: boolean = false;
  isCheckedE: boolean = false;
  isCheckedP: boolean = false
  isCheckedP2: boolean = false
  check: number;
  promociones: any = []
  promoSeleccionada: number = 0
  equipoSeleccionado: string = ""
  serial2Seleccionado: string = ""
  disponibles2: any = []
  instalacionSelected: number = 0

  instalacionEditable: object = {}
  cambioSerial: boolean = false

  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//


  constructor(
    private http: Http,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<PClientsComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    private _fb: FormBuilder,
    private usuario: AuthGuard,
    private modalService: BsModalService,
    private articuloService: ArticuloService,
    private instalacionesService: IntalacionesService,
    private promocionesService: PromocionesService,
  ) {
    console.log(row);
    this.http.get(environment.apiEndpoint + 'factibi/' + row.id)
      .subscribe((data) => {
        this.fac_products = data.json();
        //console.log(this.fac_products)
        console.log(this.fac_products.slice(0, 3));
        this.fac_products.forEach(linea => {
        });
        this.id = row.id;
      });
    console.log(row);
    this.confirnfac = row;
    console.log(this.confirnfac);
  }

  ngOnInit() {
    this.traerCeldas();
    this.traerEquipos();
  }

  traerCeldas() {
    this.instalacionesService.traerCeldaPractica()
      .subscribe(res => { console.log(res), this.celdas = res }, err => console.log(err))
  }

  traerEquipos() {
    this.instalacionesService.traerEquiposPractica()
      .subscribe(res => { this.equipos = res, console.log(res) }, err => console.log(err))
  }
  /*
  hola() {
    if (this.factbilidadSeleccionada.idCelda == 16 ||
      this.factbilidadSeleccionada.idCelda == 17 ||
      this.factbilidadSeleccionada.idCelda == 30 ||
      this.factbilidadSeleccionada.idCelda == 19 ||
      this.factbilidadSeleccionada.idCelda == 20 ||
      this.factbilidadSeleccionada.idCelda == 37 ||
      this.factbilidadSeleccionada.idCelda == 18 ||
      this.factbilidadSeleccionada.idCelda == 22 ||
      this.factbilidadSeleccionada.idCelda == 34 ||
      this.factbilidadSeleccionada.idCelda == 21 ||
      this.factbilidadSeleccionada.idCelda == 32) {

      this.zoneSeleccionada = 1;
      console.log(this.zoneSeleccionada)
    }

    if (this.factbilidadSeleccionada.idCelda == 9 ||
      this.factbilidadSeleccionada.idCelda == 12 ||
      this.factbilidadSeleccionada.idCelda == 3 ||
      this.factbilidadSeleccionada.idCelda == 6 ||
      this.factbilidadSeleccionada.idCelda == 7 ||
      this.factbilidadSeleccionada.idCelda == 8 ||
      this.factbilidadSeleccionada.idCelda == 28 ||
      this.factbilidadSeleccionada.idCelda == 10 ||
      this.factbilidadSeleccionada.idCelda == 11 ||
      this.factbilidadSeleccionada.idCelda == 15) {

      this.zoneSeleccionada = 3;
      console.log(this.zoneSeleccionada)
    }

    if (
      this.factbilidadSeleccionada.idCelda == 14 ||
      this.factbilidadSeleccionada.idCelda == 24 ||
      this.factbilidadSeleccionada.idCelda == 25 ||
      this.factbilidadSeleccionada.idCelda == 29) {

      this.zoneSeleccionada = 2;
      console.log(this.zoneSeleccionada)
    }

    if (this.factbilidadSeleccionada.idCelda == 2 ||
      this.factbilidadSeleccionada.idCelda == 4 ||
      this.factbilidadSeleccionada.idCelda == 5 ||
      this.factbilidadSeleccionada.idCelda == 13 ||
      this.factbilidadSeleccionada.idCelda == 31 ||
      this.factbilidadSeleccionada.idCelda == 40 ||
      this.factbilidadSeleccionada.idCelda == 41) {

      this.zoneSeleccionada = 4;
      console.log(this.zoneSeleccionada)
    }

    if (this.factbilidadSeleccionada.idCelda == 35 ||
      this.factbilidadSeleccionada.idCelda == 36 ||
      this.factbilidadSeleccionada.idCelda == 39) {
      this.zoneSeleccionada = 5;
      console.log(this.zoneSeleccionada)
    }

    if (this.factbilidadSeleccionada.idCelda == 38) {
      this.zoneSeleccionada = 6;
      console.log(this.zoneSeleccionada)
    }


    if (this.isCheckedE) {
      this.articuloService.obtenerDataEquiposPorModelo3(this.zoneSeleccionada, this.equipeSeleccionada)
        .subscribe(
          res => {
            this.disponibles = res,
              console.log(this.disponibles)
            this.visualizarDisponible = true
          },
          err => console.log(err))

      this.visualizarDivPlanes = true;
    } else {
      this.articuloService.obtenerDataEquiposPorModelo2(this.zoneSeleccionada, this.equipeSeleccionada)
        .subscribe(
          res => {
            this.disponibles = res,
              console.log(this.disponibles)
            this.visualizarDisponible = true
          },
          err => console.log(err))

      this.visualizarDivPlanes = true;
    }


  }

  hola2() {
    if (this.factbilidadSeleccionada.idCelda == 16 ||
      this.factbilidadSeleccionada.idCelda == 17 ||
      this.factbilidadSeleccionada.idCelda == 30 ||
      this.factbilidadSeleccionada.idCelda == 19 ||
      this.factbilidadSeleccionada.idCelda == 20 ||
      this.factbilidadSeleccionada.idCelda == 37 ||
      this.factbilidadSeleccionada.idCelda == 18 ||
      this.factbilidadSeleccionada.idCelda == 22 ||
      this.factbilidadSeleccionada.idCelda == 34 ||
      this.factbilidadSeleccionada.idCelda == 21 ||
      this.factbilidadSeleccionada.idCelda == 32) {

      this.zoneSeleccionada = 1;
      console.log(this.zoneSeleccionada)
    }

    if (this.factbilidadSeleccionada.idCelda == 9 ||
      this.factbilidadSeleccionada.idCelda == 12 ||
      this.factbilidadSeleccionada.idCelda == 3 ||
      this.factbilidadSeleccionada.idCelda == 6 ||
      this.factbilidadSeleccionada.idCelda == 7 ||
      this.factbilidadSeleccionada.idCelda == 8 ||
      this.factbilidadSeleccionada.idCelda == 28 ||
      this.factbilidadSeleccionada.idCelda == 10 ||
      this.factbilidadSeleccionada.idCelda == 11 ||
      this.factbilidadSeleccionada.idCelda == 15) {

      this.zoneSeleccionada = 3;
      console.log(this.zoneSeleccionada)
    }

    if (
      this.factbilidadSeleccionada.idCelda == 14 ||
      this.factbilidadSeleccionada.idCelda == 24 ||
      this.factbilidadSeleccionada.idCelda == 25 ||
      this.factbilidadSeleccionada.idCelda == 29) {

      this.zoneSeleccionada = 2;
      console.log(this.zoneSeleccionada)
    }

    if (this.factbilidadSeleccionada.idCelda == 2 ||
      this.factbilidadSeleccionada.idCelda == 4 ||
      this.factbilidadSeleccionada.idCelda == 5 ||
      this.factbilidadSeleccionada.idCelda == 13 ||
      this.factbilidadSeleccionada.idCelda == 31 ||
      this.factbilidadSeleccionada.idCelda == 40 ||
      this.factbilidadSeleccionada.idCelda == 41) {

      this.zoneSeleccionada = 4;
      console.log(this.zoneSeleccionada)
    }

    if (this.factbilidadSeleccionada.idCelda == 35 ||
      this.factbilidadSeleccionada.idCelda == 36 ||
      this.factbilidadSeleccionada.idCelda == 39) {
      this.zoneSeleccionada = 5;
      console.log(this.zoneSeleccionada)
    }

    if (this.factbilidadSeleccionada.idCelda == 38) {
      this.zoneSeleccionada = 6;
      console.log(this.zoneSeleccionada)
    }



    this.articuloService.obtenerDataEquiposPorModelo2(this.zoneSeleccionada, this.equipoSeleccionado)
      .subscribe(
        res => {
          this.disponibles2 = res,
            console.log(this.disponibles2)
        },
        err => console.log(err))

    this.visualizarDivPlanes = true;

  }

  onChange() {
    this.instalacionesService.traerPlanesPractica(this.tipoPlanSeleccionado)
      .subscribe(
        res => {
          this.planes = res;
          this.visualizarPlan = true
        },

        err => console.log(err))
  }
  cambioCelda() {
    this.visualizarDisponible = false
  }

  cambiarEdificio() {
    if (this.isCheckedE) {

    } else {
      this.disponibles = []
      this.serialSeleccionado = ' '
    }
  }


  closeModal() {
    this.soporteSelected = 0;
    this.factbilidadSeleccionada.idCelda = 0;
    this.tipoPlanSeleccionado = 0;
    this.visualizarPlan = false;
    this.visualizarDisponible = false;
    this.equipeSeleccionada = "";
    this.serialSeleccionado = " ";
    this.ipSeleccionada = "1";
    this.planSeleccionado = 0;
    this.visualizarDivGuardar = false;
    this.isChecked = false;
    this.modalRef.hide()
  }


  onSearchIp(searchValue: string): void {
    console.log(searchValue);
    this.instalacionesService.listaip(searchValue)
      .subscribe(
        res => {
          this.listaips = res,
            console.log(res)
          if (this.listaips.length > 0) {
            this.visualizarIp = true;
          } else {
            this.visualizarIp = false;
            this.visualizarDivGuardar = true;
          }
          console.log(this.listaips.length)
          console.log(this.visualizarIp)
        }
        ,
        err => console.log(err))




  }

  GuardarData() {

    if (this.instalacionSelected == 2) {
      this.tipoPlanSeleccionado = 7
    }

    if (this.isChecked == false) {
      this.check = 0;
    } else {
      this.check = 1;
    }

    if (this.isCheckedP) {
      this.instalacionesService.ingresarDataInstalaciones(
        this.usuario.currentUser.id_user,
        this.idSelecccionado,
        this.factbilidadSeleccionada.idCelda,
        this.ipSeleccionada,
        this.planSeleccionado,
        this.tipoPlanSeleccionado,
        this.serialSeleccionado,
        this.serial2Seleccionado,
        this.equipeSeleccionada,
        this.equipoSeleccionado,
        this.check,
        this.instalacionSelected
      ).subscribe(
        res => {
          console.log(res)

        }
        , err => console.log(err))
    } else {
      this.instalacionesService.ingresarDataInstalaciones(
        this.usuario.currentUser.id_user,
        this.idSelecccionado,
        this.factbilidadSeleccionada.idCelda,
        this.ipSeleccionada,
        this.planSeleccionado,
        this.tipoPlanSeleccionado,
        this.serialSeleccionado,
        "0",
        this.equipeSeleccionada,
        "0",
        this.check,
        this.instalacionSelected
      ).subscribe(res => {
        console.log(res)
      }
        , err => console.log(err))
    }



    this.soporteSelected = 0;
    this.factbilidadSeleccionada.idCelda = 0;
    this.tipoPlanSeleccionado = 0;
    this.visualizarPlan = false;
    this.visualizarDisponible = false;
    this.equipeSeleccionada = "";
    this.serialSeleccionado = " ";
    this.planSeleccionado = 0;
    this.visualizarDivGuardar = false;
    this.isChecked = false;
    this.modalRef.hide()
  }

  traerPromociones() {
    this.promocionesService.promociones().subscribe(res => { this.promociones = res, console.log(res) }, err => console.log(err))
  }

  revisarAdicional() {
    this.promociones.forEach(element => {
      if (element["id_promocion"] == this.promoSeleccionada) {
        if (element["equipoAdi"] != 0) {
          this.isCheckedP2 = true
        } else {
          this.isCheckedP2 = false
        }
      }
    });
  }


  cambioInstalacion() {
    this.tipoPlanSeleccionado = 0;
    this.visualizarPlan = false;
    this.planSeleccionado = 0;
    this.visualizarDivGuardar = false;

    if (this.instalacionSelected == 2) {
      this.instalacionesService.traerPlanesPractica(7)
        .subscribe(
          res => {
            this.planes = res;
            this.visualizarPlan = true
          },

          err => console.log(err))
    } else {
      this.instalacionesService.traerPlanesPractica(this.tipoPlanSeleccionado)
        .subscribe(
          res => {
            this.planes = res;
            this.visualizarPlan = true
          },

          err => console.log(err))
    }
  }
*/


  //aqui comenzara el dialog de detalles de una facturas
  ConfirmNewClient(row): void {
    /*let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%'
    });*/
    let dialogRef = this.dialog.open(ConfirmCliente, {
      data: this.confirnfac
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  status(row, template: TemplateRef<any>) {
    if (row.status == 2 && row.factible == 1) {
      console.log(row)
      if (row.id_cli != null) {
        this.NewService = this.fb.group({
          servicio: row.id_cli,
          celda: row.adicionales[0].valor,
          equipo: row.adicionales[1].valor,
          tubo: row.adicionales[2].valor,
          ptp: row.adicionales[4].valor,
          /*adicionales: [{'nombre':'tubo', 'valor':row.adicionales[3].valor},
                        {'nombre':'PTP', 'valor': row.adicionales[4].det}]*/
        });
        this.modalRef = this.modalService.show(template, this.config);
        ///this.traerPromociones()
        this.equipeSeleccionada = row.adicionales[1].valor;
        this.nombreEquipeSeleccionada = row.adicionales[1].det;
        //this.factbilidadSeleccionada.idCelda = row.adicionales[0].valor;
        this.nombreCeldaSeleccionada = row.adicionales[0].det;
        console.log(this.equipeSeleccionada)
        //console.log(this.factbilidadSeleccionada.idCelda)
        console.log(this.nombreEquipeSeleccionada)
        console.log(this.nombreCeldaSeleccionada)


        /*
        let dialogRef = this.dialog.open(AddticketComponent, {
          width: '30%',
          data: row
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was AddClient closed');
          this.http.get(environment.apiEndpoint+'factibi/'+this.id)
          .subscribe((data) => {
            this.fac_products = data.json();
            this.fac_products.forEach(linea => {
            });
          });
        });
        */
      } else {
        let dialogRef = this.dialog.open(ConfirmCliente, {
          data: row
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.response) {
            row.responsable = this.usuario.currentUser.id_user
            var url = environment.apiEndpoint + "pclienttc/";
            this.http.post(url, row).subscribe((data) => {
              row.id_cli = data.json().id
              console.log("prueba")
              console.log(data)

              this.NewService = this.fb.group({
                servicio: row.id_cli,
                celda: row.adicionales[0].valor,
                equipo: row.adicionales[1].valor,
                tubo: row.adicionales[3].valor,
                ptp: row.adicionales[4].valor
              });
              this.modalRef = this.modalService.show(template, this.config);
              this.idSelecccionado = row.id_cli;
             // this.factbilidadSeleccionada.idCelda = row.adicionales[0].valor;
              this.nombreCeldaSeleccionada = row.adicionales[0].det;
              this.equipeSeleccionada = row.adicionales[1].valor;
              this.nombreEquipeSeleccionada = row.adicionales[1].det;
              this.adicionalSeleccionado = row.adicionales[3].valor;
              this.adicional1Seleccionado = row.adicionales[4].valor
              //this.traerPromociones()
              console.log(this.idSelecccionado);
              dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was AddClient closed');
                this.http.get(environment.apiEndpoint + 'factibi/' + this.id)
                  .subscribe((data) => {
                    this.fac_products = data.json();
                    this.fac_products.forEach(linea => {
                    });
                  });
              });

            });

          }
        })
      }

    }
    this.dialogRef.close();
  }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-delete.html',
  styleUrls: ['./clients.component.css']
})
export class DeletePCliente {
  myService: MyService | null;

  constructor(
    public dialogRef: MdDialogRef<DeletePCliente>,
    @Inject(MD_DIALOG_DATA) public data: any, private http: Http, public dialog: MdDialog, public snackBar: MdSnackBar, private router: Router, private usuario: AuthGuard) {
    this.myService = new MyService(http, router, usuario);
    console.log(this.data);
  }




  delete(): void {
    console.log(this.data);
    this.myService.deleteData(this.data.id_plan)
      .subscribe((data) => { console.log(data) });
    this.dialogRef.close();
    this.snackBar.open("Borrando cliente: Por favor espere", null, {
      duration: 1000,
    });
    this.myService.refresh();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-client2.html',
  styleUrls: ['./clients.component.css']
})


export class ConfirmCliente2 {
  return = false;
  id: any;
  factibi: any;
  fac_products: any;
  constructor(
    public dialogRef: MdDialogRef<ConfirmCliente2>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
    console.log(this.data);

    this.http.get(environment.apiEndpoint + 'factible/' + data.id)
      .subscribe((data) => {
        this.fac_products = data.json().factibilidades;
        this.factibi = data.json().fact
        console.log(this.fac_products.slice(0, 3));
        console.log(this.factibi);



      });
  }
  register() {
    this.return = true
    this.onNoClick()
  }


  onNoClick(): void {
    this.dialogRef.close({ response: this.return });
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-client.html',
  styleUrls: ['./clients.component.css']
})
export class ConfirmCliente {
  return = false
  constructor(
    public dialogRef: MdDialogRef<ConfirmCliente>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {
    console.log(this.data);
  }

  register() {
    this.return = true
    this.onNoClick()
  }

  onNoClick(): void {
    this.dialogRef.close({ response: this.return });
  }

}
@Component({
  selector: 'app-add-celdas',
  templateUrl: './add-fact.component.html',
  styleUrls: ['./clients.component.css']
})
export class AddFactComponent {

  pclientes: any;
  pclient: string;
  coordenadaslat: string;
  coordenadasllon: string;
  p_search: string;
  c_search: string;
  addFact: FormGroup;
  myService: MyService | null;


  constructor(private http: Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddFactComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {

    this.http.get(environment.apiEndpoint + 'pclientes/')
      .subscribe((data) => {
        this.pclientes = data.json();
        //console.log(this.celdas);
      });

    this.myService = new MyService(http, router, usuario);
    console.log(row)
    if (row != null) {
      this.addFact = this.fb.group({
        id_pot: [row.id, [Validators.required]],
        coordenadaslat: ['', [Validators.required]],
        coordenadaslon: ['', [Validators.required]],
        ciudad: ['', [Validators.required]],
        comentario: ['', [Validators.required]],
        status: '1',
        c_search: '',
        responsable: this.usuario.currentUser.id_user,
      });
      //console.log(row)
    } else {

      this.addFact = this.fb.group({
        id_pot: ['', [Validators.required]],
        coordenadaslat: ['', [Validators.required]],
        coordenadaslon: ['', [Validators.required]],
        ciudad: ['', [Validators.required]],
        comentario: ['', [Validators.required]],
        status: '1',
        c_search: '',
        responsable: this.usuario.currentUser.id_user,

      });
      //console.log("llego vacio"+ row)
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  Enviar() {
    /*var client = this.addFact.value;
    console.log(JSON.stringify(this.addClient.value));
    var body =
    "ip_ap=" + client.ip_ap +
    "&user_ap="+client.user_ap+
    "&password_ap="+client.password_ap+
    "&celda_ap="+client.celda_ap+
    "&nombre_ap="+client.nombre_ap;
    console.log(url);*/
    var url = environment.apiEndpoint + "factibi/";
    var resp = this.http.post(url, this.addFact.value).subscribe((data) => {
      console.log(data);
      this.dialogRef.close();
      this.snackBar.open("Agregando AccessPoint: Por favor espere", null, {
        duration: 2000,
      });
      this.myService.refresh();
    });
    //console.log(resp);

  }

}
@Component({
  selector: 'app-clients-astatus',
  templateUrl: './ShowPresupuestos.component.html',
  styleUrls: ['./clients.component.css']
})
export class ShowPreComponent {

  presupuestos: any;

  constructor(
    private http: Http,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<PClientsComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    private _fb: FormBuilder,
    private usuario: AuthGuard,
  ) {
    this.http.get(environment.apiEndpoint + 'presupuesto?tipo=p&cliente=' + row.id).subscribe((data) => {
      this.presupuestos = data.json()
    })
  }
}


    //regex to validate phones (^0414\d+|^0412\d+|^0416\d+|^0426\d+|^0424\d+)(\d{6})
