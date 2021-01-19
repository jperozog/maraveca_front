import { Component, Inject, OnInit, OnDestroy, ViewChildren, TemplateRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import { Router, ActivatedRoute } from '@angular/router';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import 'rxjs/add/operator/takeWhile';
import { AuthGuard } from '../_guards/index';
import { AuthenticationService } from '../_services/index';
import { DatePipe, Location } from '@angular/common';
import { environment } from '../../environments/environment';
import { SelectEquipoComponent, SelectTipoComponent } from '../inventarios/inventarios.component';
import { IpValidators } from '../servicios/validar_ip';
import { SerialValidators } from '../servicios/validar_serial';
import { eliminar_prod_pag } from '../config-admin/config-admin.component';




import { InstalacionesService } from '../services/soporte/instalaciones.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ArticuloService } from '../services/Inventario/articulo.service';
import { InstalacionesComponent } from '../instalaciones/instalaciones.component';
import { ListaTransferenciasService } from '../services/Inventario/lista-transferencias.service';
import { TicketsService } from '../services/soporte/tickets.service';
import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { forEach } from '@angular/router/src/utils/collection';
import { PromocionesService } from '../services/promociones/promociones.service';
import { CeldasService } from '../services/celdas/celdas.service';








const MAC_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
const PHONE_REGEX = /^(0414\d|0412\d|0416\d|0426\d|0424\d|0415\d)+\d{6}/;

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css']
})
export class SoporteComponent implements OnInit, OnDestroy {
  myService: MyService;
  datat: any = [];
  datai: any = [];
  dataa: any = [];
  datao: any = [];
  pi: any;
  pt: any;
  pa: any;
  po: any;
  datat_t: any = [];
  datai_t: any = [];
  dataa_t: any = [];
  datao_t: any = [];
  pi_t: any;
  pt_t: any;
  pa_t: any;
  po_t: any;
  update: boolean = true;
  autoupdate: boolean;
  //datai= [];
  search: string;
  modouno: any = 1;
  mododos: any = 2;
  position: string = '2';
  user: any;


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



  listacliente: any = [];
  listaips: any = [];
  celdas: any = [];
  equipos: any = [];
  disponibles: any = [];
  planes: any = [];
  celdaSeleccionada: number = 0;
  zoneSeleccionada: number;
  equipeSeleccionada: string;
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
  isCheckedP: boolean = false;
  isCheckedP2: boolean = false
  isChecked1: boolean = false;
  isChecked2: boolean = false;
  isChecked3: boolean = false;
  isChecked4: boolean = false;
  check: number;
  promociones: any = []
  promoSeleccionada: number = 0
  equipoSeleccionado: string = ""
  serial2Seleccionado: string = ""
  disponibles2: any = []
  instalacionSelected: number = 0

  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//
  //NUEVAS FUNCIONES////NUEVAS FUNCIONES//


  constructor(
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public router: Router,
    public usuario: AuthGuard,
    private modalService: BsModalService,
    private articuloService: ArticuloService,
    private instalacionesService: InstalacionesService,
    private promocionesService: PromocionesService,
    private ticketService: TicketsService) {
    this.snackBar.open('Cargando Tickets', null, {
      duration: 2000,
    });
    this.user = usuario.currentUser.id_user;
    this.autoupdate = true;
    this.myService = new MyService(http, router, usuario);
    console.log(usuario.currentUser);
    this.http.get(environment.apiEndpoint + 'soportesm/?user=' + usuario.currentUser.id_user)
      .subscribe((data) => {
        this.datat_t = data.json().soporte;
        this.datai_t = data.json().instalaciones;
        console.log(this.datai_t);
        this.dataa_t = data.json().averias;
        this.datao_t = data.json().otrost;
        this.pi_t = data.json().pendingi;
        this.pt_t = data.json().pendingt;
        this.pa_t = data.json().pendinga;
        this.po_t = data.json().pendingo;
        this.datat = this.datat_t;
        this.datai = this.datai_t;
        this.dataa = this.dataa_t;
        this.datao = this.datao_t;
        this.pi = this.pi_t;
        this.pa = this.pa_t;
        this.po = this.po_t;
        this.pt = this.pt_t;
        this.update = false;
      });

    this.snackBar.open('Tickets Cargados', null, {
      duration: 2000,
    });


  }

  ngOnInit() {
    //this.modo =2;
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
    this.traerCeldas();

  }

  ngOnDestroy() {
    this.autoupdate = false;
  }

  private openLINK(id) {
    //console.log(url)
    window.open('../#/editticket/' + id, '_blank');
  }

  refresh(nf) {
    this.update = true;
    this.http.get(environment.apiEndpoint + 'soportesm/?user=' + this.usuario.currentUser.id_user)
      .subscribe((data) => {
        this.datat_t = data.json().soporte;
        this.datai_t = data.json().instalaciones;
        this.dataa_t = data.json().averias;
        this.datao_t = data.json().otrost;
        this.pi_t = data.json().pendingi;
        this.pt_t = data.json().pendingt;
        this.pa_t = data.json().pendinga;
        this.po_t = data.json().pendingo;
        this.update = false;
        this.datat = this.datat_t;
        this.datai = this.datai_t;
        this.pi = this.pi_t;
        this.pt = this.pt_t;
        this.pa = this.pa_t
        this.po = this.po_t
        if (nf) {
          this.snackBar.open('Lista Actualizada', null, {
            duration: 2000,
          });
        }
      });

  }



  openDialog(): void {
    //this.router.navigate(['/addticket']);
    let dialogRef = this.dialog.open(AddticketComponent, {
      width: '40%',
      //data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.myService.refresh();
      this.http.get(environment.apiEndpoint + 'soportesm/?user=' + this.usuario.currentUser.id_user)
        .subscribe((data) => {
          this.datat = data.json().soporte;
          this.datai = data.json().instalaciones;
          this.dataa_t = data.json().averias;
          this.datao_t = data.json().otrost;

          console.log(this.datat);
        });

    });
  }
  edit(datos): void {
    //this.router.navigate(['/addticket']);
    let dialogRef = this.dialog.open(Edit_InstallComponent, {
      width: '40%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.myService.refresh();
      this.http.get(environment.apiEndpoint + 'soportesm/?user=' + this.usuario.currentUser.id_user)
        .subscribe((data) => {
          this.datat = data.json().soporte;
          this.datai = data.json().instalaciones;
          this.dataa_t = data.json().averias;
          this.datao_t = data.json().otrost;

          console.log(this.datat);
        });

    });
  }

  show(row) {

    this.router.navigate(['/addticket']);
    //console.log(row);
    //this.selectedRowIndex = row.id;
    /*let dialogRef = this.dialog.open(AddticketComponent, {
    width: '25%',
    data: row
  });

  dialogRef.afterClosed().subscribe(result => {
  console.log('The dialog was closed');
  this.myService.refresh();

  });
  */
  }










  //PARA EL MODULO DE SOPORTE//
  //PARA EL MODULO DE SOPORTE//
  //PARA EL MODULO DE SOPORTE//
  //PARA EL MODULO DE SOPORTE//


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.instalacionesService.traerips().subscribe(res => console.log(res), err => console.log(err))
    this.traerPromociones()
  }

  traerPromociones() {
    this.promocionesService.promociones().subscribe(res => this.promociones = res, err => console.log(err))
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

  closeModal() {
    this.soporteSelected = 0;
    this.deseleccionarCliente();
    this.celdaSeleccionada = 0;
    this.tipoPlanSeleccionado = 0;
    this.visualizarPlan = false;
    this.visualizarDisponible = false;
    this.equipeSeleccionada = "";
    this.serialSeleccionado = " ";
    this.ipSeleccionada = "1";
    this.planSeleccionado = 0;
    this.visualizarDivGuardar = false;
    this.isChecked = false;
    this.instalacionSelected = 0
    this.modalRef.hide()
  }

  onSearchCliente(searchValue: string): void {
    console.log(searchValue);
    this.instalacionesService.practica(searchValue)
      .subscribe(
        res => {
          this.listacliente = res,
            console.log(res)
        }
        ,
        err => console.log(err))

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



  traerCeldas() {
    this.instalacionesService.traerCeldaPractica()
      .subscribe(res => { console.log(res), this.celdas = res }, err => console.log(err))
  }


  hola() {
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
          this.disponibles = res,
            console.log(this.disponibles)
          this.visualizarDisponible = true
        },
        err => console.log(err))

    this.visualizarDivPlanes = true;

  }

  hola2() {
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


  SeleccionCliente(id: number, dni: string, nombre: string, apellido: string) {
    this.idSelecccionado = id;
    this.clienteSeleccionado = true;
    this.cedulaSeleccionado = dni;
    this.nombreSeleccionado = nombre;
    this.apellidoSeleccionado = apellido;
    this.visualizarDivEquipos = true;
  }

  deseleccionarCliente() {
    this.clienteSeleccionado = false;
    this.cedulaSeleccionado = "";
    this.nombreSeleccionado = "";
    this.apellidoSeleccionado = "";
    this.listacliente = [];
    this.celdaSeleccionada = 0;
    this.tipoPlanSeleccionado = 0;
    this.ipSeleccionada = " ";
    this.visualizarPlan = false;
    this.visualizarDisponible = false;
    this.equipeSeleccionada = "";
    this.visualizarDivEquipos = false;
    this.visualizarDivPlanes = false;
    this.instalacionSelected = 0

  }

  GuardarData() {
    if (this.soporteSelected == 1) {
      if (this.isChecked == false) {
        this.check = 0;
      } else {
        this.check = 1;
      }
    } else {


      this.ticketService.guardarTicket(this.isChecked1, this.isChecked2, this.isChecked3, this.isChecked4, 1, this.idSelecccionado, this.nombreSeleccionado, this.apellidoSeleccionado, this.usuario.currentUser.id_user).subscribe(res => console.log(res), err => console.log(err))
      this.isChecked1 = false;
      this.isChecked2 = false;
      this.isChecked3 = false;
      this.isChecked4 = false;
      this.deseleccionarCliente();
      this.isChecked = false;
      this.modalRef.hide()
      this.soporteSelected = 0;
    }



  }

}





export class MyService {

  constructor(private http: Http, private router: Router, public usuario: AuthGuard) {

  }

  Close() {
    window.close();
  }

  deleteData(id) {

    return this.http.delete(environment.apiEndpoint + 'soporte/' + id + '?responsable=' + this.usuario.currentUser.id_user, {})
      .map((resp: Response) => resp.json());


  }

  refresh() {
    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('soporte') > -1 ? '/clients' : '/soporte';
    setTimeout(() => {
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
    },
      1000);
  }

  addPb(ticket, pb) {
    pb.forEach(i => {
      this.http.post(environment.apiEndpoint + 'ticketp/?ticket_pb=' + ticket + '&problem_pb=' + i, i).subscribe((data) => {
      });


    });
  }
}

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./soporte.component.css'],
  providers: [SerialValidators, IpValidators]
})
export class AddticketComponent implements OnInit {
  edit: any;
  costo: any;
  nombre: string;
  servicios: any = null;
  clientes: any;
  cliente: any;
  equipo: any;
  celda: any;
  equipos: any;
  radio: any;
  antena: any;
  routers: any;
  antenas: any;
  switch: any;
  celdas: any;
  S_servicios: any;
  S_celda: any;
  S_equipos: any;
  addplan: FormGroup;
  //row: any;
  currentUser: any;
  problemas: any;
  requ = [];
  tes = false;
  antenna = false;
  EN: boolean = false;
  valorplaceholder = '';
  p_search: string;
  planes: any;
  planes1: any;
  planes2: any;
  planes3: any;
  planesd: any;

  constructor(private http: Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddticketComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    //private route: ActivatedRoute,
    public dialog: MdDialog,
    private validacion_serial: SerialValidators,
    public snackBar: MdSnackBar,
    private validacion_ip: IpValidators,
    public usuario: AuthGuard,
    private router: Router) {
    console.log(this.row);
    this.edit = false;
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.http.get(environment.apiEndpoint + 'servicios/')
      .subscribe((data) => {
        this.servicios = data.json().servicios;
        console.log('servicios');
        console.log(this.servicios);
      });
    this.http.get(environment.apiEndpoint + 'clientes/')
      .subscribe((data) => {
        this.clientes = data.json();
        setTimeout(() => {
          this.addplan.value.servicio_soporte = row.servicio;
          console.log(row.servicio);
        },
          3000);
      });
    this.http.get(environment.apiEndpoint + 'celdas/')
      .subscribe((data) => {
        this.celda = data.json();
        this.celdas = this.addplan.value.celda_soporte;

      });
    this.http.get(environment.apiEndpoint + 'equit/1')
      .subscribe((data) => {
        this.equipos = data.json();
        this.equipo = this.addplan.value.equipo_soporte;
      });
    this.http.get(environment.apiEndpoint + 'equit/2')
      .subscribe((data) => {
        this.radio = data.json();
      });
    this.http.get(environment.apiEndpoint + 'equit/3')
      .subscribe((data) => {
        this.antenas = data.json();
      });
    this.http.get(environment.apiEndpoint + 'add_preload/')
      .subscribe((data) => {
        this.planes = data.json().planes;
        this.planes1 = data.json().planes1;
        this.planes2 = data.json().planes2;
        this.planesd = data.json().planesd;
        this.planes3 = data.json().planes3;

      });
    this.addplan = this.fb.group({
      tipo_soporte: '1',
      problema_soporte: '',
      afectacion_soporte: '1',
      problems: '',
      comment_soporte: '',
      plan_srv: '',
      tipo_plan_srv: '',
      servicio_soporte: ['', Validators.required],
      celda_soporte: ['', Validators.required],
      tipo_equipo_soporte: ['', Validators.required],
      equipo_soporte: ['', Validators.required],
      antenna_soporte: '',
      seriale: ['', [Validators.required], [this.validacion_serial.serialValidator()]],
      // seriala: '',
      status_soporte: '1',
      user_soporte: this.currentUser.id_user,
      S_servicios: '',
      ptp_equipo: '',
      adicionales: [],
      nombrer: '',
      valorr: '',
      ip_srv: ['', [Validators.required], [this.validacion_ip.ipValidator()]],
      p_search: '',
      EN: false,
    });
    if (row != null) {
      console.log(row.ptp);
      this.addplan.patchValue({
        servicio_soporte: +row.servicio,
        celda_soporte: +row.celda,
        equipo_soporte: +row.equipo,
        ptp_equipo: +row.ptp,
        user_soporte: +this.currentUser.id_user
      });
      this.requ.push({ nombre: 'Tubo', valor: row.tubo });
      //this.celdas = row.celda;
      //this.equipo = row.equipo;
      //this.cliente = row.servicio;
      //console.log(row)
    }
    //this.addplan.value.servicio_soporte = this.cliente;
    //this.addplan.value.equipo_soporte = this.equipo;
    //this.addplan.value.celda_soporte = this.celda;

    console.log(this.addplan.value);
  }


  select(): void {
    //this.router.navigate(['/addticket']);
    let datos = { 'celda': this.addplan.value.celda_soporte, 'equipo': this.addplan.value.equipo_soporte };
    let dialogRef = this.dialog.open(SelectEquipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        seriale: result.selected
      });
    });
  }

  selectptp(): void {
    //this.router.navigate(['/addticket']);
    let datos = { 'celda': this.addplan.value.celda_soporte, 'equipo': this.addplan.value.ptp_equipo, 'usado': this.addplan.value.seriale };
    let dialogRef = this.dialog.open(SelectEquipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        valorr: result.selected
      });
    });
  }

  selectrouter(): void {
    //this.router.navigate(['/addticket']);
    let datos = { 'celda': this.addplan.value.celda_soporte, 'equipo': '4' };
    let dialogRef = this.dialog.open(SelectTipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        valorr: result.selected
      });
    });
  }

  selectswitch(): void {
    //this.router.navigate(['/addticket']);
    let datos = { 'celda': this.addplan.value.celda_soporte, 'equipo': '5' };
    let dialogRef = this.dialog.open(SelectTipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        valorr: result.selected
      });
    });
  }

  selectantena(): void {
    //this.router.navigate(['/addticket']);
    let datos = { 'celda': this.addplan.value.celda_soporte, 'equipo': '3' };
    let dialogRef = this.dialog.open(SelectTipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        seriala: result.selected
      });
    });
  }

  ngOnInit() {

    this.addplan.get('tipo_equipo_soporte').valueChanges.subscribe(
      () => {
        this.tes = true;
      }
    );
    /* this.addplan.get('seriale').valueChanges.subscribe(
       (seriale) => {
         if (this.tes && this.addplan.value.equipo_soporte != '' && seriale != '') {
           this.antenna = true;
         } else {
           this.antenna = false;
         }
       }
     );*/

    this.addplan.get('EN').valueChanges.subscribe(
      (EN) => {

        if (EN) {
          console.log(EN);
          this.addplan.get('seriale').setValidators([]);

        } else if (!EN && this.addplan.get('tipo_soporte').value == 1) {
          console.log(EN);
          this.addplan.get('seriale').setValidators([Validators.required]);

        }

        this.addplan.get('seriale').updateValueAndValidity();

      }
    );
    this.addplan.get('nombrer').valueChanges.subscribe(
      (nombrer) => {

        if (nombrer === 'Tubo') {
          console.log(nombrer);
          this.valorplaceholder = 'Metros';

        } else if (nombrer === 'SerialPTP') {
          console.log(nombrer);
          this.valorplaceholder = 'Serial';
        } else if (nombrer === 'Router') {
          console.log(nombrer);
          this.valorplaceholder = 'Serial';
        } else if (nombrer === 'Switch') {
          console.log(nombrer);
          this.valorplaceholder = 'Cantidad';
        }

        this.addplan.get('seriale').updateValueAndValidity();

      }
    );
    this.addplan.get('tipo_soporte').valueChanges.subscribe(
      (tipo_soporte) => {

        if (tipo_soporte === '1') {
          console.log('instalacion');
          this.addplan.get('plan_srv').setValidators([Validators.required]);
          this.addplan.get('tipo_plan_srv').setValidators([Validators.required]);
          this.addplan.get('servicio_soporte').setValidators([Validators.required]);
          this.addplan.get('celda_soporte').setValidators([Validators.required]);
          this.addplan.get('equipo_soporte').setValidators([Validators.required]);
          this.addplan.get('seriale').setValidators([Validators.required]);
          this.addplan.get('seriale').setAsyncValidators([this.validacion_serial.serialValidator()]);
          this.addplan.get('tipo_equipo_soporte').setValidators([Validators.required]);
          this.addplan.get('equipo_soporte').setValidators([Validators.required]);
          this.addplan.get('afectacion_soporte').setValidators([]);
          this.addplan.get('comment_soporte').setValidators([]);
          this.addplan.get('servicio_soporte').setValidators([]);
          this.addplan.get('problems').setValidators([]);
          this.addplan.get('ip_srv').setValidators([Validators.required]);
          // this.addplan.get('ip_srv').setAsyncValidators(this.validacion_ip.ipValidator());


        } else if (tipo_soporte === '2') {
          console.log('ticket');
          this.addplan.get('plan_srv').setValidators([]);
          this.addplan.get('tipo_plan_srv').setValidators([]);
          this.addplan.get('ip_srv').setValidators([]);
          this.addplan.get('ip_srv').setAsyncValidators([]);
          this.addplan.get('seriale').setAsyncValidators([]);
          this.addplan.get('servicio_soporte').setValidators([]);
          this.addplan.get('celda_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('seriale').setValidators([]);
          this.addplan.get('tipo_equipo_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('afectacion_soporte').setValidators([Validators.required]);
          this.addplan.get('comment_soporte').setValidators([]);
          this.addplan.get('servicio_soporte').setValidators([Validators.required]);
          this.addplan.get('problems').setValidators([Validators.required]);

        } else if (tipo_soporte === '3') {
          console.log('averia');
          this.addplan.get('servicio_soporte').setValidators([Validators.required]);
          this.addplan.get('celda_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('seriale').setValidators([]);
          this.addplan.get('tipo_equipo_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('afectacion_soporte').setValidators([]);
          this.addplan.get('comment_soporte').setValidators([Validators.required]);
          this.addplan.get('problems').setValidators([]);
          this.addplan.get('plan_srv').setValidators([]);
          this.addplan.get('tipo_plan_srv').setValidators([]);
          this.addplan.get('ip_srv').setValidators([]);
          this.addplan.get('ip_srv').setAsyncValidators([]);
          this.addplan.get('seriale').setAsyncValidators([]);

        } else if (tipo_soporte === '4') {
          console.log('Otros trabajos e instalaciones');
          this.addplan.get('servicio_soporte').setValidators([Validators.required]);
          this.addplan.get('celda_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('seriale').setValidators([]);
          this.addplan.get('tipo_equipo_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('afectacion_soporte').setValidators([]);
          this.addplan.get('comment_soporte').setValidators([Validators.required]);
          this.addplan.get('problems').setValidators([]);
          this.addplan.get('plan_srv').setValidators([]);
          this.addplan.get('tipo_plan_srv').setValidators([]);
          this.addplan.get('ip_srv').setValidators([]);
          this.addplan.get('ip_srv').setAsyncValidators([]);
          this.addplan.get('seriale').setAsyncValidators([]);

        }

        this.addplan.get('servicio_soporte').updateValueAndValidity();
        this.addplan.get('celda_soporte').updateValueAndValidity();
        this.addplan.get('equipo_soporte').updateValueAndValidity();
        this.addplan.get('seriale').updateValueAndValidity();
        this.addplan.get('afectacion_soporte').updateValueAndValidity();
        this.addplan.get('servicio_soporte').updateValueAndValidity();
        this.addplan.get('problems').updateValueAndValidity();
        this.addplan.get('tipo_equipo_soporte').updateValueAndValidity();
        this.addplan.get('equipo_soporte').updateValueAndValidity();
        this.addplan.get('plan_srv').updateValueAndValidity();
        this.addplan.get('tipo_plan_srv').updateValueAndValidity();
        this.addplan.get('ip_srv').updateValueAndValidity();

      }
    );

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addr() {
    console.log(this.addplan.value.valorr);
    this.requ.push({ nombre: this.addplan.value.nombrer, valor: this.addplan.value.valorr });
    this.addplan.patchValue({
      nombrer: '',
      valorr: ''
    });
  }

  deleter(req) {
    for (var i = 0; i < this.requ.length; i++) {
      if (this.requ[i]['nombre'] == req.nombre && this.requ[i]['valor'] == req.valor) {
        this.requ.splice(i, 1);
      }
    }
  }

  Enviar() {
    //this.addplan.value.adicionales.array_push()
    //console.log(JSON.stringify(this.addplan.value));
    //console.log(plan.problems)
    /*var body =
    "status_soporte="+plan.status_soporte+
    "&servicio_soporte="+plan.servicio_soporte+
    "&user_soporte="+plan.id_user+
    "&afectacion_soporte="+plan.afectacion+
    "&tipo_soporte="+plan.tipo
    */
    if (!this.EN) {
      this.requ.push({ nombre: 'SerialEquipo', valor: this.addplan.value.seriale });
      this.requ.push({ nombre: 'ModeloEquipo', valor: this.addplan.value.equipo_soporte });
    }
    /* if (this.antenna) {
       this.requ.push({nombre: 'SerialAntenna', valor: this.addplan.value.seriala});
       this.requ.push({nombre: 'ModeloAntena', valor: this.addplan.value.antenna_soporte});
     }*/

    this.addplan.patchValue({
      adicionales: this.requ
    });
    var plan = this.addplan.value;
    var url = environment.apiEndpoint + 'soporte2';
    this.http.post(url, plan).subscribe((data) => {
      this.row = data.json();
      console.log(plan);
      console.log(this.row);
    });
    setTimeout(() => {
      /*          var body1=
      "user_th="+plan.id_user+
      "&ticket_th="+this.row.id+
      "&comment=Se apertura el ticket"
      var url1 = environment.apiEndpoint+"ticketh?"+body1;
      this.http.post(url1,body1).subscribe((data) => {});
      if (plan.tipo == 2){
      this.CC.addPb(this.row.id, plan.problems);
    }
    */
    }, 2000);
    this.dialogRef.close();
    this.snackBar.open('Agregando Ticket: Por favor espere', null, {
      duration: 2000,
    });


  }

}

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./soporte.component.css']
})
export class EditticketComponent implements OnInit, OnDestroy {
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  edit: any;
  id: any;
  prueba;
  addplan: FormGroup;
  row: any;
  aps: any = []
  apSelected: number = 0
  celda: number
  plan: number
  zona: number
  listaConsumibles: any = []
  exteriores: any = []
  interiores: any = []
  conectores: any = []
  conector: number = 0
  exteriorSelected: number = 0
  interiorSelected: number = 0
  conectorSelected: number = 0
  isChecked: boolean = false
  isChecked2: boolean = false
  isChecked3: boolean = false
  isChecked4: boolean = false
  baseAntena: number = 0
  grapas: number = 0
  exterior: number = 0
  interior: number = 0
  instalador: any = []
  instaladorSelected: number = 0
  currentUser: any;
  problems = [];
  problemas = [];
  history: any;
  status = [];
  stat = [];
  autoupdate: boolean = true;
  update: boolean = true;

  constructor(private http: Http,
    private fb: FormBuilder,
    //public dialogRef: MdDialogRef<AddticketComponent>,
    //@Inject(MD_DIALOG_DATA) public row: any,
    private route: ActivatedRoute,
    public snackBar: MdSnackBar,
    private location: Location,
    public dialog: MdDialog,
    private modalService: BsModalService,
    private articulosServices: ArticuloService,
    private instalacionesService: InstalacionesService,
    private listaTransferenciaService: ListaTransferenciasService,
    private usuario: AuthGuard,
    private router: Router) {
    this.edit = true;
    this.prueba = this.route.params
      .subscribe(
        params => {
          this.id = params.ticket;
          console.log(this.id);
        }
      );
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    //console.log(this.currentUser)



    if (this.row) {
      //this.addplan.value.problems
    }

  }

  ngOnDestroy() {
    this.autoupdate = false;
  }

  ngOnInit() {
    this.http.get(environment.apiEndpoint + 'soporte/' + this.id)
      .subscribe((data) => {
        this.row = data.json()[0];
        this.celda = this.row.celda
        this.plan = this.row.plan
        console.log(this.row);
        this.addplan.value.status_soporte = this.row.status_soporte;
        this.addplan.value.tipo = this.row.tipo_soporte;
        console.log(this.addplan.value);
        this.history = this.row.history;
        this.row.problems.forEach(perm => {
          this.problems.push(perm.problem_pb);
          this.problemas = this.problems;

        });
        this.traerConsumibles()
        this.traerAps()
        this.traerInstalador()
      });
    this.addplan = this.fb.group({
      servicio: '',
      problema_soporte: '',
      status_soporte: '',
      id: this.currentUser.id_user,
      problems: '',
      historia: '',
      tipo: '',
    });
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
  }


  openModal(template2: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template2, this.config);
  }
  cerrarModal() {
    this.exteriorSelected = 0,
      this.exterior = 0
    this.interior = 0
    this.interiorSelected = 0
    this.conector = 0
    this.conectorSelected = 0
    this.apSelected = 0
    this.instaladorSelected = 0
    this.isChecked = false
    this.isChecked2 = false
    this.modalRef2.hide()
  }

  traerConsumibles() {
    console.log(this.celda)
    if (this.celda == 16 ||
      this.celda == 17 ||
      this.celda == 30 ||
      this.celda == 19 ||
      this.celda == 20 ||
      this.celda == 37 ||
      this.celda == 18 ||
      this.celda == 22 ||
      this.celda == 34 ||
      this.celda == 21 ||
      this.celda == 32) {

      this.zona = 1;
      console.log(this.zona)
    }

    if (this.celda == 9 ||
      this.celda == 12 ||
      this.celda == 3 ||
      this.celda == 6 ||
      this.celda == 7 ||
      this.celda == 8 ||
      this.celda == 28 ||
      this.celda == 10 ||
      this.celda == 11 ||
      this.celda == 15) {

      this.zona = 3;
      console.log(this.zona)
    }

    if (
      this.celda == 14 ||
      this.celda == 24 ||
      this.celda == 25 ||
      this.celda == 29) {

      this.zona = 2;
      console.log(this.zona)
    }

    if (this.celda == 2 ||
      this.celda == 4 ||
      this.celda == 5 ||
      this.celda == 13 ||
      this.celda == 31 ||
      this.celda == 40 ||
      this.celda == 41) {

      this.zona = 4;
      console.log(this.zona)
    }

    if (this.celda == 35 ||
      this.celda == 36 ||
      this.celda == 39) {
      this.zona = 5;
      console.log(this.zona)
    }

    if (this.celda == 38) {
      this.zona = 6;
      console.log(this.zona)
    }
    this.articulosServices.traerConsumibles(this.zona)
      .subscribe(
        res => {
          console.log(res)
          this.listaConsumibles = res
          this.listaConsumibles.forEach(element => {
            if (element.nombre_equipo.includes("EXTERIORES")) {
              this.exteriores.push(element)
            }
            if (element.nombre_equipo.includes("INTERIORES")) {
              this.interiores.push(element)
            }
            if (element.nombre_equipo.includes("CONECTORES")) {
              this.conectores.push(element)
            }

          });
        },
        err => console.log(err)
      )
  }

  traerAps() {
    this.instalacionesService.traerApsPractica()
      .subscribe(res => { this.aps = res }, err => console.log(err))
  }

  traerInstalador() {
    this.listaTransferenciaService.obtenerData7()
      .subscribe(
        res => {

          this.instalador = res,
            console.log(this.instalador)
        },
        err => console.log(err)
      );
  }
  /*
    cerrarInstalacion() {
      console.log(this.exteriorSelected)
      console.log(this.exterior)
      console.log(this.interior)
      console.log(this.interiorSelected)
      console.log(this.conector)
      console.log(this.conectorSelected)
      console.log(this.apSelected)
      console.log(this.instaladorSelected)
      console.log(this.isChecked)
      console.log(this.isChecked2)
      console.log(this.isChecked3)
      console.log(this.isChecked4)
      console.log(this.grapas)
      console.log(this.baseAntena)
  
  
      this.instalacionesService.cerrarInstalacion(this.id,
        this.instaladorSelected,
        this.apSelected,
        this.celda,
        this.plan,
        this.exteriorSelected,
        this.exterior,
        this.interiorSelected,
        this.interior,
        this.conectorSelected,
        this.conector,
        this.zona,
        this.baseAntena,
        this.grapas,
        0,
        this.usuario.currentUser.id_user)
        .subscribe(
          res => {
            console.log(res)
  
            this.exteriorSelected = 0,
              this.exterior = 0
            this.interior = 0
            this.interiorSelected = 0
            this.conector = 0
            this.conectorSelected = 0
            this.apSelected = 0
            this.instaladorSelected = 0
            this.isChecked = false
            this.isChecked2 = false
            this.isChecked3 = false
            this.isChecked4 = false
            this.grapas = 0,
              this.baseAntena = 0,
              this.modalRef2.hide()
            this.ngOnInit()
  
          },
          err => console.log(err)
        )
  
    }
    */


  refresh(nf) {
    this.update = true;
    this.http.get(environment.apiEndpoint + 'soporte/' + this.id)
      .subscribe((data) => {
        this.row = data.json()[0];
        this.addplan.value.status_soporte = this.row.status_soporte;
        this.addplan.value.tipo = this.row.tipo_soporte;
        console.log(this.addplan.value);
        this.history = this.row.history;
        this.row.problems.forEach(perm => {
          this.problems.push(perm.problem_pb);
          this.problemas = this.problems;
        });
        if (nf) {
          this.snackBar.open('Lista Actualizada', null, {
            duration: 2000,
          });
        }
      });
  }

  onNoClick(): void {
    //this.dialogRef.close();
  }

  private openLINK(id) {
    //console.log(url)
    window.open('http://186.167.32.27:81/maraveca/test.php?ip=' + id, '_blank');
  }

  Close() {
    this.location.back();
  }

  addh() {
    //console.log(this.addplan.value.historia)
    var body =
      'ticket_th=' + this.id +
      '&user_th=' + this.addplan.value.id +
      '&comment=' + this.addplan.value.historia;
    var url = environment.apiEndpoint + 'ticketh?' + body;
    this.http.post(url, body).subscribe((data) => {
      this.refresh(false);
    });
  }

  closeticket(): void {
    let dialogRef = this.dialog.open(DeleteticketDialog, {
      width: '250px',
      data: { nombre: this.row.nombre + ' ' + this.row.apellido, ap: this.row.nombre_ap, id: this.row.id_soporte }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  closeinstall(): void {
    let dialogRef = this.dialog.open(DeleteInstallDialog, {
      width: '40%',
      data: { row: this.row }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  closeotherinstall(): void {
    let dialogRef = this.dialog.open(Deleteotherinstall, {
      width: '350px',
      data: { row: this.row }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }


}


@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-delete.html',
  styleUrls: ['./soporte.component.css']
})

export class DeleteticketDialog {
  myService: MyService | null;
  currentUser: any;

  constructor(
    public dialogRef: MdDialogRef<DeleteticketDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard) {
    this.myService = new MyService(http, router, usuario);
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(data);
  }

  delete(): void {
    console.log('cerrando' + this.data.id);
    var post = this.fb.group({
      status_soporte: 2,
      responsable: this.usuario.currentUser.id_user
    });
    var body = 'status_soporte=2';
    var url = environment.apiEndpoint + 'soporte/' + this.data.id + '?' + body;
    this.http.put(url, body).subscribe((data) => {
      this.myService.refresh();
      this.myService.Close();
    });
    var body1 =
      'user_th=' + this.currentUser.id_user +
      '&ticket_th=' + this.data.id +
      '&comment=Se Cierra el ticket';
    var url1 = environment.apiEndpoint + 'ticketh?' + body1;
    this.http.post(url1, body1).subscribe((data) => {

    });


    this.dialogRef.close();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-newService.html',
  styleUrls: ['./soporte.component.css'],
  providers: [IpValidators]
})
export class DeleteInstallDialog implements OnInit {
  myService: MyService | null;
  addDetails: FormGroup;
  currentUser: any;
  consumibles: any;
  serial: any;
  aps: any;
  installers: any;
  a_search: any = '';
  u_search: any = '';
  sending = false;
  used = false;
  ip: any;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MdDialogRef<DeleteticketDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    private validar: IpValidators,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard) {
    console.log(data.row);
    this.ip = data.row.ipP;
    console.log(this.ip);
    if (data.row.ipP) {
      this.addDetails = this.fb.group({
        ap: ['', [Validators.required]],
        ip: this.ip,
        conectores: ['', [Validators.required]],
        cable: '',
        cable1: ['', [Validators.required]],
        cable2: ['', [Validators.required]],
        serial: '',
        ser1al: '',
        id: '',
        status_soporte: '2',
        user: '',
        installer: ['', [Validators.required]],
        u_search: '',
        a_search: '',
        tmp: '',
        servicio_soporte: '',
        plan: '',
        celda: ''
      });
      /* if (!this.ip) {
         this.addDetails.get('ip').setValidators([ Validators.required, this.validar.ipValidator()] );

       }*/
      if (data.row.ser1al == 0 || (data.row.ser1al == 1 && data.row.serial == 0)) {
        this.addDetails.get('serial').setValidators([Validators.required]);

      }
    } else if (!data.row.ipP) {

      this.addDetails = this.fb.group({
        ap: ['', [Validators.required]],
        ip: ['', [Validators.required], [this.validar.ipValidator()]],
        conectores: ['', [Validators.required]],
        cable: '',
        cable1: ['', [Validators.required]],
        cable2: ['', [Validators.required]],
        serial: '',
        ser1al: '',
        id: '',
        status_soporte: '2',
        user: '',
        installer: ['', [Validators.required]],
        u_search: '',
        a_search: '',
        tmp: '',
        servicio_soporte: '',
        plan: '',
        celda: ''
      });
      /* if (!this.ip) {
         this.addDetails.get('ip').setValidators([ Validators.required, this.validar.ipValidator()] );

       }*/
      if (data.row.ser1al == 0 || (data.row.ser1al == 1 && data.row.serial == 0)) {
        this.addDetails.get('serial').setValidators([Validators.required]);

      }
    }

  }

  ngOnInit() {
    //186.167.32.27:81/maraveca/public/index.php/api/installer
    this.myService = new MyService(this.http, this.router, this.usuario);
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.http.get(environment.apiEndpoint + 'installer')
      .subscribe((data) => {
        this.installers = data.json();
        console.log(this.aps);
      });

    this.http.get(environment.apiEndpoint + 'aps/')
      .subscribe((data) => {
        this.aps = data.json();
        console.log(this.aps);
      });

    if (this.currentUser.installer == 1) {
      this.addDetails.patchValue({
        installer: this.currentUser.id_user
      });
    }
    this.addDetails.get('serial').valueChanges.subscribe(
      (EN) => {
        setTimeout(() => {
          var pre = this.addDetails.value.serial.replace(/(.{2})/g, '$&:');
          this.addDetails.patchValue(
            {
              serial: this.addDetails.value.serial.replace(/[^a-zA-Z0-9 ]/g, ''),
              mac_srv: pre.replace(/(^:+|:+$)/g, '')
              //mac_srv: pre.replace(/(.{16})/g, '$&')
            }
          );
          if (this.addDetails.value.tmp != EN) {

            this.addDetails.patchValue({ tmp: EN });
            this.http.get(environment.apiEndpoint + 'verificar', { params: { serial: EN } })
              .subscribe((data) => {
                console.log(data.json());
                setTimeout(() => {
                  if (data.json() == 0) {
                    this.addDetails.get('tmp').setValidators([Validators.required, Validators.pattern(PHONE_REGEX)]);
                    this.addDetails.updateValueAndValidity();
                    this.used = false;
                  } else {
                    this.addDetails.get('tmp').setValidators([]);
                    this.addDetails.updateValueAndValidity();
                    this.used = true;
                  }
                }, 200);

              });
          }
          //this.addDetails.get('tmp').setValidators([Validators.required])
        }, 200);
        this.addDetails.updateValueAndValidity();
      });
  }

  nosymbol() {
    setTimeout(() => {
      this.addDetails.patchValue({
        serial: this.addDetails.value.serial.replace(/[^a-zA-Z0-9 ]/g, '')
      });
    }, 200);
  }

  service(row): void {
    this.sending = true;
    var cable = this.addDetails.value.cable1 - this.addDetails.value.cable2;
    if (cable < 0) {
      cable = cable * (-1);
    }
    var test = this.addDetails;
    test.patchValue({
      cable: cable,
      ser1al: this.data.row.ser1al,
      id: this.data.row.id_soporte,
      status_soporte: '2',
      user: this.currentUser.id_user,
      servicio_soporte: this.data.row.servicio_soporte,
      plan: this.data.row.plan,
      celda: this.data.row.celda
    });
    console.log(test);
    var url = environment.apiEndpoint + 'install/' + this.data.row.id_soporte;
    this.http.put(url, test.value).subscribe((data) => {
      this.myService.refresh();
      this.dialogRef.close();
      this.sending = false;


    }, error => {
      this.sending = false;
    });


  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'cerrar-oinstall.html',
  styleUrls: ['./soporte.component.css']
})
export class Deleteotherinstall implements OnInit {
  myService: MyService | null;
  currentUser: any;
  sending: any;
  addDetails: FormGroup;
  installers: any;
  a_search: any = '';
  u_search: any = '';
  tmp: '';
  comment: any;
  constructor(
    public dialogRef: MdDialogRef<DeleteticketDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard) {
    this.myService = new MyService(http, router, usuario);
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(data);
    this.addDetails = this.fb.group({

      id: '',
      status_soporte: '2',
      user: '',
      installer: ['', [Validators.required]],
      a_search: '',
      u_search: '',

    });
  }


  ngOnInit() {
    //186.167.32.27:81/maraveca/public/index.php/api/installer
    this.myService = new MyService(this.http, this.router, this.usuario);
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.http.get(environment.apiEndpoint + 'installer')
      .subscribe((data) => {
        this.installers = data.json();
        //console.log(this.myService);
      });
  }

  service(row): void {
    this.sending = true;

    var test = this.addDetails;
    test.patchValue({

      id: this.data.row.id_soporte,
      status_soporte: '2',
      user: this.currentUser.id_user,
      comment: this.data.row.comment_soporte,
    });
    var url = environment.apiEndpoint + 'oinstall/' + this.data.row.id_soporte;
    this.http.post(url, test.value).subscribe((data) => {
      this.myService.refresh();
      this.dialogRef.close();
      this.sending = false;
      console.log(test.value);

    }, error => {
      this.sending = false;
    });


    /* var url = environment.apiEndpoint + "oinstall/" + this.data.row.id_soporte;
     this.http.put(url, test.value).subscribe((data) => {
       this.myService.refresh()
       this.dialogRef.close();
       this.sending=false

     }, error =>{
       this.sending=false
     });*/
    /*var body1 =
      "user_th=" + this.currentUser.id_user +
      "&ticket_th=" + this.data.id +
      "&comment=Se Cierra el ticket"
    var url1 = environment.apiEndpoint + "ticketh?" + body1;
    this.http.post(url1, body1).subscribe((data) => {

    });
*/

    this.dialogRef.close();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'show-ip',
  templateUrl: './show-IP.component.html',
  styleUrls: ['./soporte.component.css']
})
export class Ipasignadascomponent {

  autoupdate: boolean
  ip_asig: any = [];
  ip_p: any = [];
  search: string = '';
  modouno: any = 1;
  mododos: any = 2;
  servidores: any = []
  mkSeleccionado: number = 0
  ips: any = []
  ips2: any = []
  ipsBack: any = []
  ips2Back: any = []
  e: number = 1
  p: number = 1

  @ViewChildren('servicios') spr;
  constructor(
    public usuario: AuthGuard,
    private location: Location,
    private instalacionesService: InstalacionesService,
    private celdasServices: CeldasService,
    private route : Router,
    private http: Http, public dialog: MdDialog, public snackBar: MdSnackBar, private router: Router) {
    this.autoupdate = true;
  }
  ngOnInit() {
    this.celdasServices.traerMk().subscribe(res => { console.log(res), this.servidores = res }, err => console.log(err))
  }

  actualizarLista(){
    this.buscarIps()
  }

  buscarIps() {
    this.instalacionesService.listaip2(this.mkSeleccionado)
      .subscribe(
        res => {
          console.log(res),
            this.ips = res["servicios"],
            this.ipsBack = res["servicios"],
            this.ips2 = res["instalaciones"],
            this.ips2Back = res["instalaciones"],
            this.snackBar.open("Ip Cargadas", null, {
              duration: 2000,
            });
        },
        err => console.log(err))
  }

  filtradoIp(ip: string) {
    let busquedaIps = []
    this.ips.forEach(element => {
      element.ip.includes(ip) ? busquedaIps.push(element) : console.log("no ha concidencia")
    });

    this.ips = busquedaIps

    let busquedaIps2 = []
    this.ips2.forEach(element => {
      element.ip.includes(ip) ? busquedaIps2.push(element) : console.log("no ha concidencia")
    });

    this.ips2 = busquedaIps2
  }

  filtradoIpBackSpace(ip: string) {
    console.log(ip)

    let backBusquedaIps = []
    this.ipsBack.filter(element => {
      element.ip.includes(ip) ? backBusquedaIps.push(element) : console.log("no ha concidencia")
    });

    this.ips = backBusquedaIps;

    let backBusquedaIps2 = []
    this.ips2Back.filter(element => {
      element.ip.includes(ip) ? backBusquedaIps2.push(element) : console.log("no ha concidencia")
    });

    this.ips2 = backBusquedaIps2;

  }

  irCliente(id){
    this.route.navigate(["/ClientOverview/"+id])
  }

}


@Component({
  selector: 'app-ticket',
  templateUrl: './Tickets_cerrados_usuarios.html',
  styleUrls: ['./soporte.component.css']
})

export class tickets_cerrados_user {
  //myService: MyService | null;
  myService: MyService;
  data: any = [];
  search: string = '';
  mes = '';
  year = '';
  fac = 'tod';
  meses = [];
  nombre_mes = '';
  anos = [];
  update: boolean = true;
  autoupdate: boolean = true;
  constructor(
    public usuario: AuthGuard,
    private http: Http,
    private datePipe: DatePipe,
    public dialog: MdDialog,
    private location: Location,
    private route: ActivatedRoute,
    public snackBar: MdSnackBar,
    private router: Router
  ) {

    this.snackBar.open("Cargando Usuarios", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router, usuario);
    this.http.get(environment.apiEndpoint + 'show_tickets')
      .subscribe((data) => {
        this.data = data.json();
        console.log(this.data);
        this.update = false;

      });

    this.snackBar.open("Usuarios Cargadas", null, {
      duration: 2000,
    });
  }
  show(row) {

  }

  stopPropagation(event) {
    event.stopPropagation();
    // console.log("Clicked!");
  }
  ngOnInit() {
    this.route.params.forEach((urlParams) => {
      console.log(urlParams)
      if (urlParams.fecha) {
        var params = urlParams.fecha.split('-')
        console.log(params)
        this.mes = params[0]
        this.year = params[1]

      } else {
        this.mes = this.datePipe.transform(Date.now(), 'M')
        this.year = this.datePipe.transform(Date.now(), 'y')

      }
      console.log('parametros')


    });
    this.refresh(true)

    this.meses = [
      { numero: "1", nombre: 'Enero' },
      { numero: "2", nombre: 'Febrero' },
      { numero: "3", nombre: 'Marzo' },
      { numero: "4", nombre: 'Abril' },
      { numero: "5", nombre: 'Mayo' },
      { numero: "6", nombre: 'Junio' },
      { numero: "7", nombre: 'Julio' },
      { numero: "8", nombre: 'Agosto' },
      { numero: "9", nombre: 'Septiembre' },
      { numero: "10", nombre: 'Octubre' },
      { numero: "11", nombre: 'Noviembre' },
      { numero: "12", nombre: 'Diciembre' },
    ]
    this.anos = [
      { year: "2018" },
      { year: "2019" },
      { year: "2020" }
    ]
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
  }
  ngOnDestroy() {
    this.autoupdate = false
  }

  refresh(nf) {
    this.update = true;
    this.http.get(environment.apiEndpoint + 'show_tickets/', { params: { month: this.mes, year: this.year } })
      .subscribe((data) => {
        this.data = data.json();
        // this.facturacion_t = data.json();
        this.update = false
        // this.facturacion=this.facturacion_t;
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
        if (nf) {
          this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          })
        }
      });
  }


  Close() { this.location.back(); }


}

@Component({
  selector: 'app-ticket',
  templateUrl: './tickets_cerrados_por_usuario.html',
  styleUrls: ['./soporte.component.css']
})

export class tickets_cerrados_por_usuarios {
  myService: MyService;

  datat: any = [];
  search: string = '';
  datat_t: any = [];
  id_u: any;
  id: any;

  data: any = [];

  mes = '';
  year = '';
  fac = 'tod';
  meses = [];
  nombre_mes = '';
  anos = [];
  update: boolean = true;
  autoupdate: boolean = true;
  nombre_u: any;
  apellido_u: any;
  constructor(
    private http: Http,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private location: Location,
    public usuario: AuthGuard) {

    this.id_u = this.route.params
      .subscribe(
        params => {
          this.id = params.ticket;
          console.log(this.id);
        }
      );


    this.snackBar.open('Cargando Tickets', null, {
      duration: 2000,
    });

    this.myService = new MyService(http, router, usuario);
    console.log(usuario.currentUser);
    this.http.get(environment.apiEndpoint + 'show_tickets_user/' + this.id)
      .subscribe((data) => {
        this.datat_t = data.json();
        this.datat = this.datat_t;
        this.update = false;
        this.nombre_u = this.datat[0].nombre_user;
        this.apellido_u = this.datat[0].apellido_user;
        console.log(this.datat);
        console.log(this.nombre_u);
        console.log(this.apellido_u);

      });

    this.snackBar.open('Tickets Cargados', null, {
      duration: 2000,
    });
  }
  show(row) {

  }
  stopPropagation(event) {
    event.stopPropagation();
    // console.log("Clicked!");
  }
  ngOnInit() {
    this.route.params.forEach((urlParams) => {
      console.log(urlParams)
      if (urlParams.fecha) {
        var params = urlParams.fecha.split('-')
        console.log(params)
        this.mes = params[0]
        this.year = params[1]

      } else {
        this.mes = this.datePipe.transform(Date.now(), 'M')
        this.year = this.datePipe.transform(Date.now(), 'y')

      }
      console.log('parametros')


    });
    this.refresh(true)

    this.meses = [
      { numero: "1", nombre: 'Enero' },
      { numero: "2", nombre: 'Febrero' },
      { numero: "3", nombre: 'Marzo' },
      { numero: "4", nombre: 'Abril' },
      { numero: "5", nombre: 'Mayo' },
      { numero: "6", nombre: 'Junio' },
      { numero: "7", nombre: 'Julio' },
      { numero: "8", nombre: 'Agosto' },
      { numero: "9", nombre: 'Septiembre' },
      { numero: "10", nombre: 'Octubre' },
      { numero: "11", nombre: 'Noviembre' },
      { numero: "12", nombre: 'Diciembre' },
    ]
    this.anos = [
      { year: "2018" },
      { year: "2019" }
    ]
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
  }
  ngOnDestroy() {
    this.autoupdate = false
  }

  refresh(nf) {
    this.update = true;
    this.http.get(environment.apiEndpoint + 'show_tickets_user/' + this.id, { params: { month: this.mes, year: this.year } })
      .subscribe((data) => {
        this.datat_t = data.json();
        this.datat = this.datat_t;
        // this.facturacion_t = data.json();
        this.update = false
        // this.facturacion=this.facturacion_t;

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
        if (nf) {
          this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          })
        }
      });
  }


  Close() { this.location.back(); }


}





@Component({
  selector: 'app-add-ticket',
  templateUrl: './update_install.component.html',
  styleUrls: ['./soporte.component.css'],
  providers: [SerialValidators, IpValidators]
})
export class Edit_InstallComponent implements OnInit {
  edit: any;
  costo: any;
  nombre: string;
  servicios: any = null;
  clientes: any;
  cliente: any;
  equipo: any;
  celda: any;
  equipos: any;
  radio: any;
  antena: any;
  routers: any;
  antenas: any;
  switch: any;
  celdas: any;
  S_servicios: any;
  S_celda: any;
  S_equipos: any;
  addplan: FormGroup;
  //row: any;
  currentUser: any;
  problemas: any;
  requ = [];
  tes = false;
  antenna = false;
  EN: boolean = false;
  valorplaceholder = '';
  p_search: string;
  planes: any;
  planes1: any;
  planes2: any;
  planes3: any;
  planesd: any;
  tipo_equip: any;
  nro_srial: any;


  constructor(private http: Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<Edit_InstallComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    //private route: ActivatedRoute,
    public dialog: MdDialog,
    private validacion_serial: SerialValidators,
    public snackBar: MdSnackBar,
    private validacion_ip: IpValidators,
    public usuario: AuthGuard,
    private router: Router) {


    console.log(row);

    console.log(row.equipos);
    if (this.row.tipo_equipo) {
      console.log(this.row.tipo_equipo.value1);
      this.tipo_equip = this.row.tipo_equipo.value1;
    }

    this.nro_srial = this.row.serial;

    console.log(this.row.serial);
    if (this.row.serial === 'Equipo Usado') {
      this.EN = true;
      this.nro_srial = null;
    }

    console.log(this.nro_srial);
    console.log(this.tipo_equip);
    this.edit = false;
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.http.get(environment.apiEndpoint + 'servicios/')
      .subscribe((data) => {
        this.servicios = data.json().servicios;
        console.log('servicios');
        console.log(this.servicios);
      });
    this.http.get(environment.apiEndpoint + 'clientes/')
      .subscribe((data) => {
        this.clientes = data.json();
        setTimeout(() => {
          this.addplan.value.servicio_soporte = row.servicio_soporte;
          console.log(row.servicio_soporte);
          console.log(this.clientes);
        },
          3000);
      });
    this.http.get(environment.apiEndpoint + 'celdas/')
      .subscribe((data) => {
        this.celda = data.json();
        this.celdas = this.addplan.value.celda_soporte;

      });
    this.http.get(environment.apiEndpoint + 'equit/1')
      .subscribe((data) => {
        this.equipos = data.json();
        this.equipo = this.addplan.value.equipo_soporte;
      });
    this.http.get(environment.apiEndpoint + 'equit/2')
      .subscribe((data) => {
        this.radio = data.json();
      });
    this.http.get(environment.apiEndpoint + 'equit/3')
      .subscribe((data) => {
        this.antenas = data.json();
      });
    this.http.get(environment.apiEndpoint + 'add_preload/')
      .subscribe((data) => {
        this.planes = data.json().planes;
        this.planes1 = data.json().planes1;
        this.planes2 = data.json().planes2;
        this.planesd = data.json().planesd;
        this.planes3 = data.json().planes3;


      });



    this.addplan = this.fb.group({

      plan_srv: ['', Validators.required],
      tipo_plan_srv: ['', Validators.required],
      servicio_soporte: ['', Validators.required],
      celda_soporte: ['', Validators.required],
      tipo_equipo_soporte: '',
      equipo_soporte: '',
      seriale: ['', Validators.required, this.validacion_serial.serialValidator()],
      // seriala: '',
      user_soporte: this.currentUser.id_user,
      S_servicios: '',
      ptp_equipo: '',
      adicionales: [],
      ip_srv: ['', [Validators.required]],
      p_search: '',
      nombrer: '',
      valorr: '',
      id_servidor: '',
      EN: false,
    });
    if (row != null) {
      console.log(row.ptp);
      this.addplan.patchValue({
        servicio_soporte: +row.servicio_soporte,
        tipo_plan_srv: +this.row.tipo_plan,
        plan_srv: +this.row.plan,

        seriale: this.nro_srial,
        celda_soporte: +row.celdas,
        tipo_equipo_soporte: [this.tipo_equip],
        equipo_soporte: +row.equipos,
        ptp_equipo: +this.row.ptp,
        ip_srv: this.row.ip,
        id_servidor: this.row.id_srvidor,
        user_soporte: +this.currentUser.id_user
      });
      console.log(row.Tubo);
      if (row.Tubo !== '' && row.Tubo !== undefined) {
        this.requ.push({ nombre: 'Tubo', valor: row.Tubo });
      }
      //this.celdas = row.celda;
      //this.equipo = row.equipo;
      //this.cliente = row.servicio;
      //console.log(row)
    }
    //this.addplan.value.servicio_soporte = this.cliente;
    //this.addplan.value.equipo_soporte = this.equipo;
    //this.addplan.value.celda_soporte = this.celda;

    console.log(this.addplan.value);




  }


  select(): void {
    //this.router.navigate(['/addticket']);
    let datos = { 'celda': this.addplan.value.celda_soporte, 'equipo': this.addplan.value.equipo_soporte };
    let dialogRef = this.dialog.open(SelectEquipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        seriale: result.selected
      });
    });
  }

  selectptp(): void {
    //this.router.navigate(['/addticket']);
    let datos = { 'celda': this.addplan.value.celda_soporte, 'equipo': this.addplan.value.ptp_equipo, 'usado': this.addplan.value.seriale };
    let dialogRef = this.dialog.open(SelectEquipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        valorr: result.selected
      });
    });
  }

  selectrouter(): void {
    //this.router.navigate(['/addticket']);
    let datos = { 'celda': this.addplan.value.celda_soporte, 'equipo': '4' };
    let dialogRef = this.dialog.open(SelectTipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        valorr: result.selected
      });
    });
  }

  selectswitch(): void {
    //this.router.navigate(['/addticket']);
    let datos = { 'celda': this.addplan.value.celda_soporte, 'equipo': '5' };
    let dialogRef = this.dialog.open(SelectTipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        valorr: result.selected
      });
    });
  }

  selectantena(): void {
    //this.router.navigate(['/addticket']);
    let datos = { 'celda': this.addplan.value.celda_soporte, 'equipo': '3' };
    let dialogRef = this.dialog.open(SelectTipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        seriala: result.selected
      });
    });
  }

  ngOnInit() {

    /*    this.addplan.get('tipo_equipo_soporte').valueChanges.subscribe(
          () => {
            this.tes = true;
          }
        );*/
    /* this.addplan.get('seriale').valueChanges.subscribe(
       (seriale) => {
         if (this.tes && this.addplan.value.equipo_soporte != '' && seriale != '') {
           this.antenna = true;
         } else {
           this.antenna = false;
         }
       }
     );*/

    this.addplan.get('EN').valueChanges.subscribe(
      (EN) => {

        if (EN === true) {
          console.log(EN);
          this.addplan.get('seriale').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('tipo_equipo_soporte').setValidators([]);

        } else {
          this.EN = false;
          console.log(EN);
          this.addplan.get('seriale').setValidators([Validators.required]);

          this.addplan.get('equipo_soporte').setValidators([Validators.required]);
          this.addplan.get('tipo_equipo_soporte').setValidators([Validators.required]);

        }

        this.addplan.get('seriale').updateValueAndValidity();
        this.addplan.get('equipo_soporte').updateValueAndValidity();
        this.addplan.get('tipo_equipo_soporte').updateValueAndValidity();

      }
    );
    this.addplan.get('nombrer').valueChanges.subscribe(
      (nombrer) => {

        if (nombrer === 'Tubo') {
          console.log(nombrer);
          this.valorplaceholder = 'Metros';

        } else if (nombrer === 'SerialPTP') {
          console.log(nombrer);
          this.valorplaceholder = 'Serial';
        } else if (nombrer === 'Router') {
          console.log(nombrer);
          this.valorplaceholder = 'Serial';
        } else if (nombrer === 'Switch') {
          console.log(nombrer);
          this.valorplaceholder = 'Cantidad';
        }

        this.addplan.get('seriale').updateValueAndValidity();

      }
    );

    this.addplan.get('ip_srv').valueChanges.subscribe(
      (ip_srv: string) => {
        console.log(ip_srv);
        if (ip_srv !== this.row.ip) {
          this.addplan.get('ip_srv').setAsyncValidators([this.validacion_ip.ipValidator()]);
          console.log(ip_srv);
        } else {
          console.log(ip_srv);
          this.addplan.get('ip_srv').setAsyncValidators([]);
        }
        this.addplan.get('ip_srv').updateValueAndValidity({ emitEvent: false });
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addr() {
    console.log(this.addplan.value.valorr);
    this.requ.push({ nombre: this.addplan.value.nombrer, valor: this.addplan.value.valorr });
    /*  this.addplan.patchValue({
        nombrer: '',
        valorr: ''
      });*/
  }

  deleter(req) {
    for (var i = 0; i < this.requ.length; i++) {
      if (this.requ[i]['nombre'] == req.nombre && this.requ[i]['valor'] == req.valor) {
        this.requ.splice(i, 1);
      }
    }
  }
  anular() {


    let dialogRef = this.dialog.open(confirm_anular_install, {
      width: '25%',
      data: { row: this.row, datos_instal: this.addplan.value }


    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
    this.dialogRef.close();
  }

  Editar() {
    //this.addplan.value.adicionales.array_push()
    //console.log(JSON.stringify(this.addplan.value));
    //console.log(plan.problems)
    /*var body =
    "status_soporte="+plan.status_soporte+
    "&servicio_soporte="+plan.servicio_soporte+
    "&user_soporte="+plan.id_user+
    "&afectacion_soporte="+plan.afectacion+
    "&tipo_soporte="+plan.tipo
    */
    /*if (!this.EN) {
         this.requ.push({nombre: 'SerialEquipo', valor: this.addplan.value.seriale});
         this.requ.push({nombre: 'ModeloEquipo', valor: this.addplan.value.equipo_soporte});
       }*/
    /* if (this.antenna) {
       this.requ.push({nombre: 'SerialAntenna', valor: this.addplan.value.seriala});
       this.requ.push({nombre: 'ModeloAntena', valor: this.addplan.value.antenna_soporte});
     }*/

    this.addplan.patchValue({
      adicionales: this.requ
    });
    var plan = this.addplan.value;
    console.log(plan);
    var url = environment.apiEndpoint + "editar_install/" + this.row.id_soporte;
    this.http.put(url, plan).subscribe((data) => {
      this.row = data.json();
      console.log(plan);
      console.log(this.row);
    });
    setTimeout(() => {
      /*          var body1=
      "user_th="+plan.id_user+
      "&ticket_th="+this.row.id+
      "&comment=Se apertura el ticket"
      var url1 = environment.apiEndpoint+"ticketh?"+body1;
      this.http.post(url1,body1).subscribe((data) => {});
      if (plan.tipo == 2){
      this.CC.addPb(this.row.id, plan.problems);
    }
    */
    }, 2000);
    this.dialogRef.close();
    this.snackBar.open('Editando  Instalacion: Por favor espere', null, {
      duration: 2000,
    });


  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm_anular_install.html',
  styleUrls: ['./soporte.component.css'],
})
export class confirm_anular_install {
  row: any;
  anular: any;
  modalRef: any;
  modalService: any;

  constructor(
    public dialogRef: MdDialogRef<confirm_anular_install>,
    @Inject(MD_DIALOG_DATA) public datos: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {

    console.log(this.datos);
    console.log(datos.row);
    console.log(datos.datos_instal);
    this.row = this.datos.row;


  }




  anular_install(): void {
    var plan = this.datos.datos_instal;
    console.log(plan);
    var url = environment.apiEndpoint + "anular_install/" + this.row.id_soporte;
    this.http.put(url, plan).subscribe((data) => {
      //this.row = data.json();
      // console.log(plan);
      //  console.log(this.row);
      this.dialogRef.close();
    });

    this.snackBar.open('Anulando  Instalacion: Por favor espere', null, {
      duration: 2000,
    });

  }






  onNoClick(): void {
    this.dialogRef.close();

  }

}

