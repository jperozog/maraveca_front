import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthGuard } from '../../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { InstalacionesService } from '../../../services/soporte/instalaciones.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';
import { tick } from '@angular/core/testing';
import { arrayLength } from 'ngx-custom-validators/src/app/array-length/validator';
import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { PromocionesService } from '../../../services/promociones/promociones.service';
import { ArticuloService } from '../../../services/Inventario/articulo.service';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { CajaDistribucionService } from '../../../services/caja-distribucion/caja-distribucion.service';
import { ServiciosService } from '../../../services/servicios/servicios.service';
import { Instalacion } from '../../../models/instalacion';
import { ExcelService } from '../../../services/excel/excel.service';


@Component({
  selector: 'app-instalaciones2',
  templateUrl: './instalaciones2.component.html',
  styleUrls: ['./instalaciones2.component.css']
})
export class Instalaciones2Component implements OnInit {
  modalRef: BsModalRef;
  intervalo: any
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  /*Instalaciones*/
  instalaciones: any = []
  instalaciones2: any = []
  instalacionesActivos: any = []
  p: number = 1
  instalaciones_t:any = [];
  dato: Instalacion;
  prueba: any = [];

  zonas: any = [];
  agregarZona: FormGroup;
  ubiSelected: string;
  ubicacion: string;
  zonaSelected: Number;
  soporteSelected: Number = 1;
  clienteSeleccionado: boolean = false;
  idSelecccionado: number
  cedulaSeleccionado: string = ""
  nombreSeleccionado: string = ""
  apellidoSeleccionado: string = ""



  listacliente: any = [];
  listaips: any = [];
  celdas: any = [];
  mks: any = [];
  equipos: any = [];
  disponibles: any = [];
  planes: any = [];
  celdaSeleccionada: number = 0;
  zoneSeleccionada: number;
  equipeSeleccionada: string;
  tipoPlanSeleccionado: number = 0;
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
  isCheckedE: boolean = false
  check: number;
  promociones: any = []
  promoSeleccionada: number = 0
  equipoSeleccionado: string = ""
  serial2Seleccionado: string = ""
  disponibles2: any = []
  instalacionSelected: number = 0

  tipoPagoSelected: number = 0
  tasaCliente: number = 0

  instalacionEditable: object = {}
  cambioSerial: boolean = false
  mkSeleccionado: number = 0
  cajas: any = []
  CajaDisSeleccionada: number = 0

  tipoActivo: number = 1
  /*Instalaciones*/

  /*Migraciones*/
  e: number = 1
  migraciones: any = []
  migraciones2: any = []
  serviciosMigracion: any = []
  migracionSelected: number = 0

  /*Migraciones*/

  /*Mudanzas*/
  m:number = 1
  mudanzaSelected: number = 0
  mudanzas: any = []
  mudanzas2: any = []
  /*Mudanzas*/


  /*Cupos Instalaciones*/
  c:number = 1
  ct:number = 1
  a:number = 1
  cuposTotales:any = []
  cupos: any = []
  cupos2: any = []
  cuposAnteriores:any = []
  id_insta_cupo:number = 0
  nombre_cupo:string = ""
  apellido_cupo:string = ""
  fecha_nueva_cupo:string = ""
  /*Cupos Instalaciones*/


  tipoActivo2: number = 1



  constructor(private instalacionesService: InstalacionesService,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard,
    private articuloService: ArticuloService,
    private promocionesService: PromocionesService,
    private modalService: BsModalService,
    private cajaServices: CajaDistribucionService,
    private excelService:ExcelService,
    private serviciosServices: ServiciosService) { }

  ngOnInit() {
    this.traerDatos()
    this.instalacionesAbiertas();
    this.traerCeldas();
    this.traerMK();
    this.traerCajasDistribucion();

  }

  exportAsXLSX():void {
    this.instalaciones_t.forEach(e => {
      this.dato = {
        cliente: e.nombre+" "+e.apellido,
        direccion: e.direccion,
        telefono: e.phone1,
        tipo: e.tipo_insta,
        zona: e.nombre_celda,
        router: e.nombre_srvidor,
        estado:e.status_insta,
        ip: e.ipP_det,
        serial: e.serial_det,
        usuario: e.nombre_user+" "+e.apellido_user,
        f_venta:e.fechaVenta,
        f_agenda: e.created_at};
      this.prueba.push(this.dato)
    });

    
    this.excelService.exportAsExcelFile(this.prueba, 'instalacion');
  }

  actualizarLista() {
    if (this.usuario.perm && this.usuario.perm.includes('instalaciones_w')) {
      this.traerMigraciones();
      this.traerMudanzas();
      this.traerCuposActivos()
      this.traerTodosCuposActivos()
      this.traerInstalaciones();
    } else {
      this.traerMigraciones2();
      this.traerMudanzas2();
      this.traerInstalaciones2();
    }
    this.instalacionesAbiertas();

    this.p = 1
  }

  traerDatos(){
    if (this.usuario.perm && this.usuario.perm.includes('instalaciones_w')) {
      this.traerMigraciones();
      this.traerMudanzas();
      this.traerCuposActivos()
      this.traerTodosCuposActivos()
      this.traerInstalaciones();
    } else {
      this.traerMigraciones2();
      this.traerMudanzas2();
      this.traerInstalaciones2();
    }
  }

  cambiarActivo(activo: number) {
    this.tipoActivo2 = activo
  }

  onSearchTicket(e: string): void {
    if (e == "") {
      this.instalaciones = [];
      this.traerInstalaciones();
    } else {

      const result = this.instalaciones.filter((i) =>
        i.dni.includes(e)
      );
    
      this.instalaciones = result;
    }

  }

  traerInstalaciones() {
    this.instalacionesService.traerInstalaciones(this.usuario.currentUser.id_user, 1, this.tipoActivo, this.mkSeleccionado, this.CajaDisSeleccionada)
      .subscribe(
        res => {
          this.instalaciones = res,
            this.instalaciones2 = res,
            this.instalaciones_t = res,
         
            this.snackBar.open("Instalaciones Cargadas", null, {
              duration: 2000,
            });
        },
        err => console.log(err))
  }

  traerMigraciones() {
    this.instalacionesService.traerMigraciones(this.usuario.currentUser.id_user, 1, this.tipoActivo, this.mkSeleccionado, this.CajaDisSeleccionada)
      .subscribe(
        res => {
          this.migraciones = res,
            this.migraciones2 = res,
          
            this.snackBar.open("Migraciones Cargadas", null, {
              duration: 2000,
            });
        },
        err => console.log(err))
  }

  traerMudanzas() {
    this.instalacionesService.traerMudanzas(this.usuario.currentUser.id_user, 1, this.tipoActivo, this.mkSeleccionado, this.CajaDisSeleccionada)
      .subscribe(
        res => {
          this.mudanzas = res,
            this.mudanzas2 = res,
         
            this.snackBar.open("Mudanzas Cargadas", null, {
              duration: 2000,
            });
        },
        err => console.log(err))
  }

  traerCuposActivos() {
    this.instalacionesService.traerCuposActivos()
      .subscribe(
        res => {
            this.cupos = res,
            
            console.log(res),
            this.snackBar.open("Cupos Diponibles Cargados", null, {
              duration: 2000,
            });
        },
        err => console.log(err))
  }

  traerTodosCuposActivos() {
    this.instalacionesService.traerTodosCuposActivos()
      .subscribe(
        res => {
            this.cuposTotales = res,
            this.cuposTotales.forEach(e => {
              e.apellido = e.apellido.substring(0, 1)+"...";
          });
        },
        err => console.log(err))
  }


  traerInstalaciones2() {
    this.instalacionesService.traerInstalaciones(this.usuario.currentUser.id_user, 0, this.tipoActivo, this.mkSeleccionado, this.CajaDisSeleccionada)
      .subscribe(
        res => {
          this.instalaciones = res,
            this.instalaciones2 = res,
            this.instalaciones_t = res
          
            this.snackBar.open("Instalaciones Cargadas", null, {
              duration: 2000,
            });
        },
        err => console.log(err))
  }

  traerMigraciones2() {
    this.instalacionesService.traerMigraciones(this.usuario.currentUser.id_user, 0, this.tipoActivo, this.mkSeleccionado, this.CajaDisSeleccionada)
      .subscribe(
        res => {
          this.migraciones = res,
            this.migraciones2 = res,
           
            this.snackBar.open("Migraciones Cargadas", null, {
              duration: 2000,
            });
        },
        err => console.log(err))
  }

  traerMudanzas2() {
    this.instalacionesService.traerMudanzas(this.usuario.currentUser.id_user, 0, this.tipoActivo, this.mkSeleccionado, this.CajaDisSeleccionada)
      .subscribe(
        res => {
          this.mudanzas = res,
            this.mudanzas = res,
           
            this.snackBar.open("Mudanzas Cargadas", null, {
              duration: 2000,
            });
        },
        err => console.log(err))
  }

  instalacionesAbiertas() {
    this.instalacionesService.traerInstalacionesActivos()
      .subscribe(
        res => this.instalacionesActivos = res,
        err => console.log(err))
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.instalacionesService.traerips().subscribe(res => console.log(res), err => console.log(err))
    this.traerPromociones()
  }

  openModal2(template2: TemplateRef<any>, id) {
    this.instalaciones.forEach(element => {
      if (element.id_insta == id) {
        this.instalacionEditable = element
      }
    });
    this.cambioEquipo()
    this.modalRef = this.modalService.show(template2, this.config);
    console.log(this.instalacionEditable)
  }

  cambioEquipo() {
    this.celdaSeleccionada = this.instalacionEditable["celda_det"]
    this.equipeSeleccionada = this.instalacionEditable["nombre_equipo"]
    this.cambioSerial = true
    this.hola()
  }

  cambioPlan() {
    this.instalacionEditable["tipo_det"] = this.tipoPlanSeleccionado
    this.instalacionEditable["plan_det"] = this.planSeleccionado
  }

  traerPromociones() {
    this.promocionesService.promociones().subscribe(res => this.promociones = res, err => console.log(err))
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


  SeleccionCliente(id: number, dni: string, nombre: string, apellido: string) {
    if (this.tipoActivo2 == 1) {
      this.idSelecccionado = id;
      this.clienteSeleccionado = true;
      this.cedulaSeleccionado = dni;
      this.nombreSeleccionado = nombre;
      this.apellidoSeleccionado = apellido;
      this.visualizarDivEquipos = true;
    }

    if (this.tipoActivo2 != 1) {
      this.idSelecccionado = id;
      this.clienteSeleccionado = true;
      this.cedulaSeleccionado = dni;
      this.nombreSeleccionado = nombre;
      this.apellidoSeleccionado = apellido;
      this.visualizarDivEquipos = true;

      this.serviciosServices.servicioCliente(id).subscribe(res => { this.serviciosMigracion = res }, err => console.log(err))

    }

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
    this.isCheckedP2 = false
    this.isCheckedP = false
    this.isCheckedE = false
    this.equipoSeleccionado = ""
    this.serial2Seleccionado = ""
    this.migracionSelected = 0
    this.mudanzaSelected = 0
  }

  traerCeldas() {
    this.instalacionesService.traerCeldaPractica()
      .subscribe(res => { console.log(res), this.celdas = res }, err => console.log(err))
  }
  traerMK() {
    this.instalacionesService.traerServidores()
      .subscribe(res => { console.log(res), this.mks = res }, err => console.log(err))
  }



  traerCajasDistribucion() {
    this.cajaServices.traerCajaDistribucion().subscribe(res => { console.log(res), this.cajas = res }, err => console.log(err))
  }

  traerEquipos(id: number) {
    if (this.tipoActivo2 == 1) {
      this.instalacionesService.traerEquiposPractica(id)
        .subscribe(res => { this.equipos = res, console.log(res) }, err => console.log(err))
    }
    if (this.tipoActivo2 == 2) {
      this.instalacionesService.traerEquiposPractica(2)
        .subscribe(res => { this.equipos = res, console.log(res) }, err => console.log(err))
    }

    if (this.tipoActivo2 == 3) {
      this.instalacionesService.traerEquiposPractica(1)
        .subscribe(res => { this.equipos = res, console.log(res) }, err => console.log(err))
    }

  }

  hola() {
    if (this.instalacionSelected == 1) {
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
    } else {

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

  }


  buscarEquipoMigracion() {
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

  buscarEquipoMudanza() {
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


  cambiarEdificio() {
    if (this.isCheckedE) {

    } else {
      this.disponibles = []
      this.serialSeleccionado = ' '
    }
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
      this.celdaSeleccionada == 41 ||
      this.celdaSeleccionada == 42 ||
      this.celdaSeleccionada == 43 ||
      this.celdaSeleccionada == 44 ||
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

  buscarPlanes() {
    this.instalacionesService.traerPlanesPractica(this.tipoPlanSeleccionado)
      .subscribe(
        res => {
          this.planes = res;
          this.visualizarPlan = true
        },

        err => console.log(err))
  }

  onChange() {
    this.instalacionesService.traerPlanesPractica(this.tipoPlanSeleccionado)
      .subscribe(
        res => {
          this.planes = res;
          console.log(this.planes)
          this.visualizarPlan = true
        },

        err => console.log(err))
  }

  cambioCelda() {
    this.visualizarDisponible = false
    if (this.instalacionSelected == 2 || this.tipoActivo2 == 2) {
      this.cajas.forEach(element => {
        if (this.celdaSeleccionada == element.id_caja) {
          this.zoneSeleccionada = element.zona_caja
        }
      });
    }
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

  onSearchIpEditable(searchValue: string): void {
    this.instalacionEditable["ipP_det"] = this.ipSeleccionada
    this.onSearchIp(searchValue)
  }

  buscarInstalacion(e) {
    const instalacioneNuevas = []
    if (e == "") {
      this.traerInstalaciones()
    } else {
      const result = this.instalaciones.filter((el) => {
        if (el.social === null || el.social === "null") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.serial_det.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase())) {
            instalacioneNuevas.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase()) || el.serial_det.toUpperCase().includes(e.toUpperCase())) {
            instalacioneNuevas.push(el)
          }
        }
      });
      this.instalaciones = instalacioneNuevas;
    }
  }

  buscarInstalacionBackSpace(e) {
    const algo = this.instalaciones2
    const instalacionesNuevas = []
    const result = algo.filter((el) => {
      if (el.social === null || el.social === "null") {
        if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.serial_det.toUpperCase().includes(e) || el.apellido.toUpperCase().includes(e.toUpperCase())) {
          instalacionesNuevas.push(el)
        }
      } else {
        if (el.social.toUpperCase().includes(e.toUpperCase()) || el.serial_det.toUpperCase().includes(e)) {
          instalacionesNuevas.push(el)
        }
      }
    });
    this.instalaciones = instalacionesNuevas;

  }

  GuardarData() {
    
    if (this.tipoActivo2 == 1) {
      let desde = 1

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
          this.celdaSeleccionada,
          this.ipSeleccionada,
          this.planSeleccionado,
          this.tipoPlanSeleccionado,
          this.serialSeleccionado,
          this.serial2Seleccionado,
          this.equipeSeleccionada,
          this.equipoSeleccionado,
          this.check,
          this.instalacionSelected,
          this.promoSeleccionada,
          desde,
          this.tasaCliente
        ).subscribe(
          res => {
            console.log(res)
          }
          , err => console.log(err))
      } else {
        this.instalacionesService.ingresarDataInstalaciones(
          this.usuario.currentUser.id_user,
          this.idSelecccionado,
          this.celdaSeleccionada,
          this.ipSeleccionada,
          this.planSeleccionado,
          this.tipoPlanSeleccionado,
          this.serialSeleccionado,
          "0",
          this.equipeSeleccionada,
          "0",
          this.check,
          this.instalacionSelected,
          0,
          desde,
          this.tasaCliente
        ).subscribe(res => {
          console.log(res)
        }
          , err => console.log(err))
      }


      this.soporteSelected = 1;
      this.deseleccionarCliente();
      this.celdaSeleccionada = 0;
      this.tipoPlanSeleccionado = 0;
      this.visualizarPlan = false;
      this.visualizarDisponible = false;
      this.equipeSeleccionada = "";
      this.equipoSeleccionado = "",
        this.serialSeleccionado = " ";
      this.serial2Seleccionado = "";
      this.planSeleccionado = 0;
      this.visualizarDivGuardar = false;
      this.isChecked = false;
      this.isCheckedP = false
      this.isCheckedP2 = false
      this.instalacionSelected = 0
      this.equipoSeleccionado = ""
      this.promoSeleccionada = 0
      this.tasaCliente = 0
      this.tipoPagoSelected = 0
      this.modalRef.hide()
      this.ngOnInit()
    }
    
    if (this.tipoActivo2 == 2) {
      
      this.instalacionesService.ingresarDataMigracion(this.idSelecccionado,this.migracionSelected, this.celdaSeleccionada, this.serialSeleccionado, this.promoSeleccionada, this.tasaCliente, this.planSeleccionado, this.usuario.currentUser.id_user)
        .subscribe(
          res => console.log(res),
          err => console.log(err)
        )

      this.soporteSelected = 1;
      this.deseleccionarCliente();
      this.celdaSeleccionada = 0;
      this.tipoPlanSeleccionado = 0;
      this.visualizarPlan = false;
      this.visualizarDisponible = false;
      this.migracionSelected = 0
      this.equipeSeleccionada = "";
      this.equipoSeleccionado = "",
      this.serialSeleccionado = " ";
      this.serial2Seleccionado = "";
      this.planSeleccionado = 0;
      this.visualizarDivGuardar = false;
      this.isChecked = false;
      this.isCheckedP = false
      this.isCheckedP2 = false
      this.instalacionSelected = 0
      this.equipoSeleccionado = ""
      this.promoSeleccionada = 0
      this.tasaCliente = 0
      this.tipoPagoSelected = 0
      this.modalRef.hide()
      this.ngOnInit()

    }

    if (this.tipoActivo2 == 3) {
      
      this.instalacionesService.ingresarDataMudanza(this.idSelecccionado,this.mudanzaSelected, this.celdaSeleccionada, this.ipSeleccionada, this.tasaCliente, this.usuario.currentUser.id_user)
        .subscribe(
          res => console.log(res),
          err => console.log(err)
        )
          
      this.soporteSelected = 1;
      this.deseleccionarCliente();
      this.celdaSeleccionada = 0;
      this.tipoPlanSeleccionado = 0;
      this.visualizarPlan = false;
      this.visualizarDisponible = false;
      this.migracionSelected = 0
      this.equipeSeleccionada = "";
      this.equipoSeleccionado = "",
      this.serialSeleccionado = " ";
      this.serial2Seleccionado = "";
      this.planSeleccionado = 0;
      this.visualizarDivGuardar = false;
      this.isChecked = false;
      this.isCheckedP = false
      this.isCheckedP2 = false
      this.instalacionSelected = 0
      this.equipoSeleccionado = ""
      this.promoSeleccionada = 0
      this.tasaCliente = 0
      this.tipoPagoSelected = 0
      this.modalRef.hide()
      this.ngOnInit()
          
    }



  }

  EditarData() {
    console.log(this.instalacionEditable)
    this.instalacionEditable["usuario"] = this.usuario.currentUser.id_user
    this.instalacionesService.editarData(this.instalacionEditable)
      .subscribe(
        res => {
          console.log(res)
        },
        err => console.log(err))

    this.soporteSelected = 1;
    this.deseleccionarCliente();
    this.celdaSeleccionada = 0;
    this.tipoPlanSeleccionado = 0;
    this.visualizarPlan = false;
    this.visualizarDisponible = false;
    this.equipeSeleccionada = "";
    this.equipoSeleccionado = "",
      this.serialSeleccionado = " ";
    this.serial2Seleccionado = "";
    this.planSeleccionado = 0;
    this.visualizarDivGuardar = false;
    this.isChecked = false;
    this.isCheckedP = false
    this.isCheckedP2 = false
    this.instalacionSelected = 0
    this.promoSeleccionada = 0
    this.equipoSeleccionado = ""
    this.modalRef.hide()
    this.ngOnInit()

  }

  anularData() {
    this.instalacionesService.anularData(this.instalacionEditable["id_insta"], this.usuario.currentUser.id_user)
      .subscribe(
        res => {
          console.log(res)
        }
        , err => console.log(err))
    this.ngOnInit()
    this.soporteSelected = 1;
    this.deseleccionarCliente();
    this.celdaSeleccionada = 0;
    this.tipoPlanSeleccionado = 0;
    this.visualizarPlan = false;
    this.visualizarDisponible = false;
    this.equipeSeleccionada = "";
    this.equipoSeleccionado = "",
      this.serialSeleccionado = " ";
    this.serial2Seleccionado = "";
    this.planSeleccionado = 0;
    this.visualizarDivGuardar = false;
    this.isChecked = false;
    this.isCheckedP = false
    this.isCheckedP2 = false
    this.instalacionSelected = 0
    this.promoSeleccionada = 0
    this.equipoSeleccionado = ""
    this.modalRef.hide()


  }

  cambioInstalacion() {
    this.tipoPlanSeleccionado = 0;
    this.visualizarPlan = false;
    this.planSeleccionado = 0;
    this.visualizarDivGuardar = false;
    this.equipeSeleccionada = "";
    this.serialSeleccionado = " ";
    this.ipSeleccionada = "1";
    this.planSeleccionado = 0;
    this.visualizarDivGuardar = false;
    this.isChecked = false;
    this.isCheckedP = false
    this.isCheckedP2 = false
    this.equipoSeleccionado = ""
    this.serial2Seleccionado = ""
    this.promoSeleccionada = 0

    this.traerEquipos(this.instalacionSelected)

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


  cambioTipoPago() {
    this.tasaCliente = 0

    if (this.tipoActivo2 == 2) {
      this.instalacionesService.traerPlanesPractica(7)
        .subscribe(
          res => {
            this.planes = res;
            this.visualizarPlan = true
          },

          err => console.log(err))

    }
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
    this.soporteSelected = 1;
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
    this.isCheckedP = false
    this.isCheckedP2 = false
    this.equipoSeleccionado = ""
    this.serial2Seleccionado = ""
    this.promoSeleccionada = 0
  }

  closeModal2() {
    this.traerInstalaciones()
    this.soporteSelected = 1;
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
    this.isCheckedP = false
    this.isCheckedP2 = false
    this.equipoSeleccionado = ""
    this.serial2Seleccionado = ""
    this.instalacionEditable = {}
    this.promoSeleccionada = 0
    this.disponibles = []

  }

  cambiarFechaCupo(id_insta:number,template: TemplateRef<any>){
    console.log(id_insta)
      this.modalRef.hide()
      this.id_insta_cupo = id_insta
      this.modalRef = this.modalService.show(template, this.config);
  }

  editarFechaCupo(){

   this.instalacionesService.editarFechaCupo(this.id_insta_cupo,this.fecha_nueva_cupo).subscribe(
     res=>{
       this.closeModal3()
       this.traerDatos()
       this.tipoActivo2 = 4
     },
     err=>console.log(err)
     )
  }

  abrirCuposAnteriores(lgModal){
    lgModal.show()

    this.instalacionesService.traerCuposAnteriores().subscribe(
        res=>{
        console.log(res),
        this.cuposAnteriores = res
        },
        err=>console.log(err)
        )
  }

  closeModal3(){
    this.modalRef.hide()
    this.fecha_nueva_cupo = ""
  }

  irAInstalacion(id: number) {
    this.router.navigate(['/detallesInstalacion', id])
  }

  irAMigracion(id: number) {
    this.router.navigate(['/detallesMigracion', id])
  }

  irAMudanza(id: number) {
    this.router.navigate(['/detallesMudanza', id])
  }
}
