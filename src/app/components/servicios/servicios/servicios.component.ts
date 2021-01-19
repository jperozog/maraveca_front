import { Component, OnInit, TemplateRef } from '@angular/core';
import { ServiciosService } from '../../../services/servicios/servicios.service';
import { callNgModuleLifecycle } from '@angular/core/src/view/ng_module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthGuard } from '../../../_guards/index';
import { InstalacionesService } from '../../../services/soporte/instalaciones.service';
import { ArticuloService } from '../../../services/Inventario/articulo.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import {CajaDistribucionService} from '../../../services/caja-distribucion/caja-distribucion.service'
import {MangaEmpalmeService} from '../../../services/manga-empalme/manga-empalme.service'

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class Servicios2Component implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'gray modal-lg'
  };
  intervalo:any

  servicios: any = []
  servicios2: any = []
  instalacionesP: any = []
  instalacionesP2: any = []
  p: number = 1
  e: number = 1
  servicioEditable: any
  instalacionEditable: any
  aps: any = []
  celdas: any = []
  cajas: any = []
  mangas: any = []
  equipos: any = []
  planes: any = []
  listaips: any = [];
  disponibles: any = []
  isChecked: boolean = false
  visualizarIp: boolean = false;
  userComisiones: any = []
  listacliente: any = []

  tipoPlanSeleccionado: number = 0
  planSeleccionado: number = 0
  equipeSeleccionada: string = ""
  apSeleccionado: number = 0
  celdaSeleccionada: number = 0
  zoneSeleccionada: number = 0
  ipSeleccionada: string = ""

  FiltroActivo: number = 1

  tipoClienteSeleccionado: number = 2
  estadoSeleccionado: number = 0
  userComisionSelected: number = 0
  procentajeComisionSelected: number = 0
  comentarioSeleccioando: string = ""
  costoSeleccionado: number = 0
  creditoSeleccionado: number = 40
  fechaInsta: string = ""
  fechaIniSer: string = ""

  idSelecccionado: number = 0;
  clienteSeleccionado: boolean = false;
  cedulaSeleccionado: string = "";
  nombreSeleccionado: string = "";
  apellidoSeleccionado: string = "";
  visualizarDivEquipos: boolean = false;
  tipoClienteNuevo: number = 2
  estadoNuevo: number = 0
  tipoPlanNuevo: number = 0
  planNuevo: number = 0
  ipNueva: string = ""
  equipoNuevo: string = ""
  apNuevo: number = 0
  serialNuevo: string = ""
  usuarioNuevo: number = 0
  porcentajeNuevo: number = 0
  comentarioNuevo: string = ""
  costoNuevo: number = 0
  creditoNuevo: number = 40
  fechaInsNuevo: string = ""
  fechaStarNuevo: string = ""
  idEquipoNuevo: number = 0

  nuevoServicio: Object = {
    idCliente: 0,
    tipoServicio: 0,
    tipoCliente: 2,
    tipoPlan: 0,
    plan: 0,
    ip: "",
    equipo: 0,
    modeloEquipo: "",
    ap: 0,
    serial: "",
    usuarioComision: 0,
    porcentaje: 0,
    comentario: "",
    costo: 0,
    credito: 0,
    fechaInstalacion: "",
    fechaInicioServicio: "",
    id_usuario: 0
  }

  constructor(private servicioService: ServiciosService,
    private modalService: BsModalService,
    public snackBar: MdSnackBar,
    public usuario: AuthGuard,
    private instalacionesService: InstalacionesService,
    private articuloService: ArticuloService,
    private cajaService: CajaDistribucionService,
    private mangaService: MangaEmpalmeService) { }

  ngOnInit() {
    this.traerServicios()
    /*
    this.intervalo = IntervalObservable.create(10000)
    .subscribe(() => {
      this.traerServicios()
    })
      */
  }
  /*
  ngOnDestroy() {
    this.intervalo.unsubscribe()
  }
  */
  

  traerServicios() {
    this.servicioService.servicios(this.usuario.currentUser.id_user).subscribe(
      res => {
        console.log(res),
          this.servicios = res["servicios"],
          this.servicios2 = res["servicios"],
          this.instalacionesP = res["instalaciones"],
          this.instalacionesP2 = res["instalaciones"],
          this.snackBar.open("Servicios Cargados", null, {
            duration: 2000,
          });
      },
      err => console.log(err))
  }
  openModal(template: TemplateRef<any>, id) {
    this.instalacionesP.forEach(element => {
      if (element.id_insta == id) {
        this.instalacionEditable = element
      }
    });
    //this.cambioEquipo()
    console.log(this.instalacionEditable)
    this.modalRef = this.modalService.show(template, this.config);
    this.traerAps();
    this.traerCeldas();
    this.traerCajas();
    this.traerMangas();
    //this.traerEquipos();
  }

  

  openModal2(template: TemplateRef<any>, id) {
    this.servicios.forEach(element => {
      if (element.id_srv == id) {
        this.servicioEditable = element
        if (element["gen_comision_serv"] == 1) {
          this.isChecked = true
          this.comision()
        } else {
        }
      }
    });
    //this.cambioEquipo()
    console.log(this.servicioEditable)
    this.modalRef = this.modalService.show(template, this.config);
    this.traerAps();
    this.traerCeldas();
    this.traerCajas();
    this.traerMangas();
    if (this.servicioEditable.tipo_srv == 1) {
       this.traerEquipos(1); 
    } else {
      this.traerEquipos(2); 
    }
    this.cambioEquipo();
  }

  traerEquipos(id:number) {
    this.instalacionesService.traerEquiposPractica(id)
      .subscribe(res => { this.equipos = res, console.log(res) }, err => console.log(err))
  }

  openModal3(template3: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template3, this.config);
    this.traerAps();
    this.traerCeldas();
    this.traerCajas();
    this.traerMangas();
    //this.traerEquipos();
  }

  traerCeldas() {
    this.instalacionesService.traerCeldaPractica()
      .subscribe(res => { console.log(res), this.celdas = res }, err => console.log(err))
  }

  traerAps() {
    this.instalacionesService.traerApsPractica()
      .subscribe(res => { console.log(res), this.aps = res }, err => console.log(err))
  }

  traerCajas(){
    this.cajaService.traerCajaDistribucion().subscribe(res=>this.cajas = res, err=>console.log(err))
  }

  traerMangas(){
    this.mangaService.traerMangaEmpalme().subscribe(res=>this.mangas = res, err=>console.log(err))
  }
/*
  traerEquipos() {
    this.instalacionesService.traerEquiposPractica()
      .subscribe(res => { this.equipos = res, console.log(res) }, err => console.log(err))
  }
*/
  buscarPlanes() {
    this.instalacionesService.traerPlanesPractica(this.tipoPlanSeleccionado)
      .subscribe(
        res => {
          this.planes = res;
        },

        err => console.log(err))
  }

  cambioPlan() {
    if (this.clienteSeleccionado) {
      this.planSeleccionado = this.planNuevo
      this.tipoPlanSeleccionado = this.tipoPlanNuevo
    } else {
      if (this.FiltroActivo == 1) {
        this.servicioEditable["tipo_plan"] = this.tipoPlanSeleccionado
        this.servicioEditable["plan_srv"] = this.planSeleccionado
      } else {
        this.instalacionEditable["tipo_det"] = this.tipoPlanSeleccionado
        this.instalacionEditable["plan_det"] = this.planSeleccionado
      }
    }
  }

  onChange() {

    if (this.clienteSeleccionado) {
      this.instalacionesService.traerPlanesPractica(this.tipoPlanNuevo)
        .subscribe(
          res => {
            this.planes = res;
            console.log(this.planes)
          },

          err => console.log(err))
    } else {
      this.instalacionesService.traerPlanesPractica(this.tipoPlanSeleccionado)
        .subscribe(
          res => {
            this.planes = res;
            console.log(this.planes)
          },

          err => console.log(err))
    }
  }

  cambioEquipo() {
    if (this.clienteSeleccionado) {
      this.apSeleccionado = this.apNuevo
      this.equipeSeleccionada = this.equipoNuevo
      this.aps.forEach(element => {
        if (element.id == this.apSeleccionado) {
          this.celdaSeleccionada = element.celda_ap
        }
      });
      this.hola()

    } else {
      if (this.FiltroActivo == 1) {
        this.apSeleccionado = this.servicioEditable["ap_srv"]
        this.equipeSeleccionada = this.servicioEditable["nombre_equipo"]
        this.celdas.forEach(element => {
          if (element.id_celda == this.servicioEditable["celda_ap"]) {
            this.celdaSeleccionada = element.id_celda
          }
        });
        this.hola()
      } else {
        this.apSeleccionado = this.instalacionEditable["ap_det"]
        this.equipeSeleccionada = this.instalacionEditable["nombre_equipo"]
        this.celdas.forEach(element => {
          if (element.id_celda == this.instalacionEditable["celda_ap"]) {
            this.celdaSeleccionada = element.id_celda
          }
        });
        this.hola()
      }
    }
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
          this.disponibles = res
        },
        err => console.log(err))
  }

  EditarData() {
    this.servicioEditable["id_usuario"] = this.usuario.currentUser.id_user
    this.servicioService.editarData(this.servicioEditable).subscribe(res => console.log(res), err => console.log(err))
    this.closeModal2()
  }

  agregarData() {

    this.equipos.forEach(e => {
      if (e.nombre_equipo == this.equipoNuevo) {
        this.idEquipoNuevo = e.id_equipo
      }
    });

    this.nuevoServicio = {
      idCliente: this.idSelecccionado,
      tipoServicio: this.estadoNuevo,
      tipoCliente: this.tipoClienteNuevo,
      tipoPlan: this.tipoPlanNuevo,
      plan: this.planNuevo,
      ip: this.ipNueva,
      equipo: this.idEquipoNuevo,
      modeloEquipo: this.equipoNuevo,
      ap: this.apNuevo,
      serial: this.serialNuevo,
      usuarioComision: this.usuarioNuevo,
      porcentaje: this.porcentajeNuevo,
      comentario: this.comentarioNuevo,
      costo: this.costoNuevo,
      credito: this.creditoNuevo,
      fechaInstalacion: this.fechaInsNuevo,
      fechaInicioServicio: this.fechaStarNuevo,
      id_usuario: this.usuario.currentUser.id_user
    }

    this.servicioService.guardarData(this.nuevoServicio).subscribe(res => console.log(res), err => console.log(err))

    this.closeModal3()
  }

  activarServicio() {
    console.log(this.instalacionEditable)

    this.instalacionEditable["tipoCliente"] = this.tipoClienteSeleccionado
    this.instalacionEditable["estadoCliente"] = this.estadoSeleccionado
    this.instalacionEditable["userComision"] = this.userComisionSelected
    this.instalacionEditable["procentajeComision"] = this.procentajeComisionSelected
    this.instalacionEditable["comentario"] = this.comentarioSeleccioando
    this.instalacionEditable["costo"] = this.costoSeleccionado
    this.instalacionEditable["credito"] = this.creditoSeleccionado
    this.instalacionEditable["fechaInsta"] = this.fechaInsta
    this.instalacionEditable["fechaIniSer"] = this.fechaIniSer
    this.instalacionEditable["id_usuario"] = this.usuario.currentUser.id_user

    this.servicioService.activarServicio(this.instalacionEditable).subscribe(res => console.log(res), err => console.log(err))
    
    this.closeModal()
  }

  buscarServicio(e) {
    const serviciosNuevos = []
    if (e == "") {
      this.traerServicios()
    } else {
      const result = this.servicios.filter((el) => {
        if (el.kind == "V" || el.kind == "E") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase()) || el.ip_srv.toUpperCase().includes(e) || el.dni.toUpperCase().includes(e)) {
            serviciosNuevos.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase()) || el.ip_srv.toUpperCase().includes(e) || el.dni.toUpperCase().includes(e)) {
            serviciosNuevos.push(el)
          }
        }
      });
      this.servicios = serviciosNuevos;
    }

    const instalacionesNuevas = []
    if (e == "") {
      this.traerServicios()
    } else {
      const result = this.instalacionesP.filter((el) => {
        if (el.social === null || el.social === "null") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase()) || el.ipP_det.toUpperCase().includes(e.toUpperCase()) ) {
            instalacionesNuevas.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase()) || el.ipP_det.toUpperCase().includes(e.toUpperCase()) ) {
            instalacionesNuevas.push(el)
          }
        }
      });
      this.instalacionesP = instalacionesNuevas;
    }

  }

  buscarServicioBackSpace(e) {
    const algo = this.servicios2
    const serviciosNuevos = []
    const result = algo.filter((el) => {
      if (el.social === null || el.social === "null") {
        if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase()) || el.ip_srv.toUpperCase().includes(e.toUpperCase())) {
          serviciosNuevos.push(el)
        }
      } else {
        if (el.social.toUpperCase().includes(e.toUpperCase()) || el.ip_srv.toUpperCase().includes(e.toUpperCase())) {
          serviciosNuevos.push(el)
        }
      }
    });
    this.servicios = serviciosNuevos;


    const algo2 = this.instalacionesP2
    const instalacionesNuevas = []
    const result2 = algo2.filter((el) => {
      if (el.social === null || el.social === "null") {
        if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase()) || el.ipP_det.toUpperCase().includes(e.toUpperCase()) ) {
          instalacionesNuevas.push(el)
        }
      } else {
        if (el.social.toUpperCase().includes(e.toUpperCase()) || el.ipP_det.toUpperCase().includes(e.toUpperCase()) ) {
          instalacionesNuevas.push(el)
        }
      }
    });
    this.instalacionesP = instalacionesNuevas;


  }

  onSearchIpEditable(searchValue: string): void {

    if (this.clienteSeleccionado) {

    } else {
      if (this.FiltroActivo == 1) {
        this.servicioEditable["ip_srv"] = this.ipSeleccionada
      } else {
        this.instalacionEditable["ipP_det"] = this.ipSeleccionada
      }
    }
    this.onSearchIp(searchValue)
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
          }
        }
        ,
        err => console.log(err))
  }

  onSearchCliente(searchValue: string): void {
    if (searchValue == "") {
      this.listacliente = []
    } else {
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

    this.estadoNuevo = 0
    this.tipoClienteNuevo = 2
    this.tipoPlanNuevo = 0
    this.planNuevo = 0
    this.ipNueva = ""
    this.equipoNuevo = ""
    this.apNuevo = 0
    this.serialNuevo = ""
    this.isChecked = false
    this.usuarioNuevo = 0
    this.porcentajeNuevo = 0
    this.comentarioNuevo = ""
    this.costoNuevo = 0
    this.creditoNuevo = 40
    this.fechaInsNuevo = ""
    this.fechaStarNuevo = ""
  }

  closeModal() {
    this.tipoClienteSeleccionado = 2
    this.estadoSeleccionado = 0
    this.tipoPlanSeleccionado = 0
    this.userComisionSelected = 0
    this.procentajeComisionSelected = 0
    this.comentarioSeleccioando = ''
    this.costoSeleccionado = 0
    this.creditoSeleccionado = 40
    this.planSeleccionado = 0
    this.ipSeleccionada = ''
    this.fechaIniSer = " "
    this.fechaInsta = " "
    this.isChecked = false
    this.modalRef.hide()
    this.traerServicios()
    this.deseleccionarCliente()
  }

  closeModal2() {
    this.tipoPlanSeleccionado = 0
    this.planSeleccionado = 0
    this.ipSeleccionada = ''
    this.isChecked = false
    this.modalRef.hide()
    this.ngOnInit()
  }

  closeModal3() {
    this.estadoNuevo = 0
    this.tipoClienteNuevo = 2
    this.tipoPlanNuevo = 0
    this.planNuevo = 0
    this.ipNueva = ""
    this.idEquipoNuevo = 0
    this.equipoNuevo = ""
    this.apNuevo = 0
    this.serialNuevo = ""
    this.usuarioNuevo = 0
    this.porcentajeNuevo = 0
    this.comentarioNuevo = ""
    this.costoNuevo = 0
    this.creditoNuevo = 0
    this.fechaInsNuevo = ""
    this.fechaStarNuevo = ""
    this.isChecked = false
    this.modalRef.hide()
    this.traerServicios()
    this.deseleccionarCliente()
  }

  comision() {
    if (this.isChecked) {
      this.usuariosComisiones()
    } else {
      this.usuarioNuevo = 0
      this.porcentajeNuevo = 0
    }
  }

  usuariosComisiones() {
    this.servicioService.usuariosComision().subscribe(res => { console.log(res), this.userComisiones = res }, err => console.log(err))
  }

  actualizarLista() {
    this.traerServicios()
  }

}
