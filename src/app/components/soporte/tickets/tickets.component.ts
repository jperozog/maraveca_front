import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthGuard } from '../../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TicketsService } from '../../../services/soporte/tickets.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';
import { tick } from '@angular/core/testing';
import { arrayLength } from 'ngx-custom-validators/src/app/array-length/validator';
import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { CeldasService } from '../../../services/celdas/celdas.service';
import { MangaEmpalmeService } from '../../../services/manga-empalme/manga-empalme.service';
import { ServiciosService } from '../../../services/servicios/servicios.service';
import { CajaDistribucionService } from '../../../services/caja-distribucion/caja-distribucion.service';
import { EquiposService } from '../../../services/equipos/equipos.service';
import { InstalacionesService } from '../../../services/soporte/instalaciones.service';
import {Tickets} from '../../../models/ticket';
import { ExcelService } from '../../../services/excel/excel.service';



@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  [x: string]: any;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  tickets: any = []
  tickets2: any = []
  averias: any = []
  averias2: any = []
  reposiciones: any = []
  reposiciones2: any = []
  ticketsActivos: number 
  averiasActivas: number
  repoActivas: number
  dato: Tickets;
  prueba: any = [];

  p: number = 1

  PrioridadSelected: number = 1;
  clienteSeleccionado: boolean = false;
  idSelecccionado: number
  cedulaSeleccionado: string = ""
  nombreSeleccionado: string = ""
  apellidoSeleccionado: string = ""



  listacliente: any = [];
  visualizarDivEquipos: boolean = false;
  ipSeleccionada: string;
  serialSeleccionado: string = " "
  isChecked: boolean = false;
  isChecked1: boolean = false;
  isChecked2: boolean = false;
  isChecked3: boolean = false;
  isChecked4: boolean = false;

  tipoActivo: number = 1
  tecnologiaSeleccionada: number = 0
  celdas: any = []
  mangas: any = []
  cajas: any = []
  celdaSeleccionada: number = 0
  mangaSeleccionada: number = 0
  cajaSeleccionada: number = 0
  comentario: string = ""

  serviciosClientes: any = []
  servicioSeleccionado: number = 0
  tecnoSeleccionada: number = 0
  equipos: any = []
  equipoSeleccionado: string = ""
  zonaSeleccionada: number = 0
  disponibles: any = []
  disponibleSeleccionado: number = 0
  comentarioEquipo: string = ""

  mudanza:number=0

  constructor(private ticketService: TicketsService,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard,
    private modalService: BsModalService,
    private celdaService: CeldasService,
    private mangaService: MangaEmpalmeService,
    private ServiciosService: ServiciosService,
    private cajaServices: CajaDistribucionService,
    private equiposService: EquiposService,
    private excelService:ExcelService,
    private instalacionService: InstalacionesService) { }

  ngOnInit() {
    this.traerTickets();
    this.ticketsAbiertos();
    this.traerCeldas();
    this.traerMangas();
    this.traerCajas()
  }

  exportAsXLSX():void {
    this.tickets.forEach(e => {
      this.dato = {
        numero: e.id_soporte,
        cliente: e.nombre+" "+e.apellido,
        celda_olt: e.nombre_celda,
        router: e.nombre_srvidor,
        estado: e.status_soporte,
        usuario: e.nombre_user+" "+e.apellido_user,
        fecha: e.created_at
      };
      this.prueba.push(this.dato)
    });
    this.excelService.exportAsExcelFile(this.prueba, 'Tickets');
  }

  cambiarActivo(activo: number) {
    this.tipoActivo = activo
  }

  traerCeldas() {
    this.celdaService.traerCeldas().subscribe(res => this.celdas = res, err => console.log(err))
  }

  traerMangas() {
    this.mangaService.traerMangaEmpalme().subscribe(res => this.mangas = res, err => console.log(err))
  }

  traerCajas() {
    this.cajaServices.traerCajaDistribucion().subscribe(res => { this.cajas = res, console.log(res) }, err => console.log(err))
  }


  traerTickets() {
    this.ticketService.traerTickets()
      .subscribe(
        res => {
          console.log(res)
          this.tickets = res["tickets"],
            this.tickets2 = res["tickets"],
            this.averias = res["averias"],
            this.averias2 = res["averias"],
            this.reposiciones = res["reposiciones"]
          this.reposiciones2 = res["reposiciones"]
          this.snackBar.open("Tickets Cargados", null, {
            duration: 2000,
          });
        },
        err => console.log(err))
  }

  ticketsAbiertos() {
    this.ticketService.traerTicketsActivos()
      .subscribe(
        res => {this.ticketsActivos = res["tickets"],this.averiasActivas = res["averias"],this.repoActivas = res["repo"],console.log(res)},
        err => console.log(err))
  }

  onSearchTicket(e: string): void {
    if (e == "") {
      this.traerTickets();
    } else {
      console.log(e)
      this.ticketService.busqueda(e).subscribe(res => { console.log(res), this.tickets = res }, err => console.log(err))
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSearchCliente(searchValue: string): void {
    console.log(searchValue);
    this.ticketService.practica(searchValue)
      .subscribe(
        res => {
          this.listacliente = res,
            console.log(res)
        }
        ,
        err => console.log(err))

  }

  SeleccionCliente(id: number, dni: string, nombre: string, apellido: string) {
    this.idSelecccionado = id;
    this.clienteSeleccionado = true;
    this.cedulaSeleccionado = dni;
    this.nombreSeleccionado = nombre;
    this.apellidoSeleccionado = apellido;
    this.visualizarDivEquipos = true;

    if (this.tipoActivo == 3) {
      this.ServiciosService.servicioCliente(id).subscribe(res => { this.serviciosClientes = res, console.log(res) }, err => console.log(err))
    }

  }

  deseleccionarCliente() {
    this.clienteSeleccionado = false;
    this.cedulaSeleccionado = "";
    this.nombreSeleccionado = "";
    this.apellidoSeleccionado = "";
    this.listacliente = [];
    this.visualizarDivEquipos = false;
    this.tecnoSeleccionada = 0
    this.servicioSeleccionado = 0
    this.celdaSeleccionada = 0
    this.cajaSeleccionada = 0
    this.equipoSeleccionado = ""
    this.zonaSeleccionada = 0
    this.disponibleSeleccionado = 0
    this.comentarioEquipo = ""

  }

  closeModal() {
    this.PrioridadSelected = 0;
    this.deseleccionarCliente();
    this.isChecked = false;
    this.modalRef.hide()
  }

  GuardarData() {
    if (this.tipoActivo == 1) {
      this.ticketService.guardarTicket(this.isChecked1, this.isChecked2, this.isChecked3, this.isChecked4, this.PrioridadSelected, this.idSelecccionado, this.nombreSeleccionado, this.apellidoSeleccionado, this.usuario.currentUser.id_user)
        .subscribe(
          res => {
            console.log(res),
              this.ngOnInit()

          },
          err => console.log(err)
        )


      this.PrioridadSelected = 0;
      this.isChecked1 = false;
      this.isChecked2 = false;
      this.isChecked3 = false;
      this.isChecked4 = false;
      this.deseleccionarCliente();
      this.isChecked = false;
      this.modalRef.hide()
    }

    if (this.tipoActivo == 2) {
      if (this.tecnologiaSeleccionada == 1) {
        this.ticketService.guardarAveria(this.tecnologiaSeleccionada, this.celdaSeleccionada, this.comentario, this.usuario.currentUser.id_user)
          .subscribe(
            res => {
              console.log(res)
              this.tipoActivo = 2
              this.ngOnInit()
            },
            err => console.log(err))
      } else {
        this.ticketService.guardarAveria(this.tecnologiaSeleccionada, this.mangaSeleccionada, this.comentario, this.usuario.currentUser.id_user)
          .subscribe(
            res => {
              console.log(res)
              this.tipoActivo = 2
              this.ngOnInit()
            },
            err => console.log(err))
      }

      this.tecnologiaSeleccionada = 0
      this.mangaSeleccionada = 0
      this.celdaSeleccionada = 0
      this.modalRef.hide()
    }

    if (this.tipoActivo == 3) {

      if (this.tecnoSeleccionada == 1) {
        this.ticketService.guardarReposicion(this.idSelecccionado, this.servicioSeleccionado, this.celdaSeleccionada, this.disponibleSeleccionado, this.comentarioEquipo, this.usuario.currentUser.id_user)
          .subscribe(
            res => {this.closeModal(),this.ngOnInit()},
            err => console.log(err)
          )
      } else {
        this.ticketService.guardarReposicion(this.idSelecccionado, this.servicioSeleccionado, this.cajaSeleccionada, this.disponibleSeleccionado, this.comentarioEquipo, this.usuario.currentUser.id_user)
          .subscribe(
            res =>  {this.closeModal(),this.ngOnInit()},
            err => console.log(err)
          )
      }

    }


  }


  buscarDatos(e: string) {

    if (this.tipoActivo == 1) {
      const busqueda = []
      this.tickets.filter(el => {
        if (el.social === null || el.social === "null") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        }
      })

      this.tickets = busqueda
    }

    if (this.tipoActivo == 2) {
      const busqueda = []
      this.averias.filter(el => {
        if (el.nombre_celda.toUpperCase().includes(e.toUpperCase()) || el.nombre_srvidor.toUpperCase().includes(e.toUpperCase())) {
          busqueda.push(el)
        }
      })

      this.averias = busqueda
    }

    if (this.tipoActivo == 3) {
      const busqueda = []
      this.reposiciones.filter(el => {
        if (el.social === null || el.social === "null") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        }
      })

      this.reposiciones = busqueda
    }


  }

  buscarDatosBackSpace(e: string) {

    if (this.tipoActivo == 1) {
      const busqueda = []
      this.tickets2.filter(el => {
        if (el.social === null || el.social === "null") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        }
      })

      this.tickets = busqueda;
    }

    if (this.tipoActivo == 2) {
      const busqueda = []
      this.averias2.filter(el => {
        if (el.nombre_celda.toUpperCase().includes(e.toUpperCase()) || el.nombre_srvidor.toUpperCase().includes(e.toUpperCase())) {
          busqueda.push(el)
        }
      })

      this.averias = busqueda;
    }


    if (this.tipoActivo == 3) {
      const busqueda = []
      this.reposiciones2.filter(el => {
        if (el.social === null || el.social === "null") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        }
      })

      this.reposiciones = busqueda;
    }


  }

  cambiarTecnologia() {
    this.celdaSeleccionada = 0
    this.mangaSeleccionada = 0
  }

  buscarTecnoglogia() {

    this.serviciosClientes.forEach(e => {
      if (e.id_srv == this.servicioSeleccionado) {
        this.tecnoSeleccionada = e.tipo_srv
      }
    });
    console.log(this.tecnoSeleccionada)
  }

  buscarEquipos() {
    this.equipoSeleccionado = ""
    this.disponibleSeleccionado = 0
    this.comentarioEquipo = ""
    this.instalacionService.traerEquiposPractica(this.tecnoSeleccionada).subscribe(res => this.equipos = res, err => console.log(err))
  }

  buscarEquiposModelos() {

    if (this.tecnoSeleccionada == 1) {
      this.celdas.forEach(e => {
        if (e.id_celda == this.celdaSeleccionada) {
          this.zonaSeleccionada = e.zona_celda
        }
      });
    } else {
      this.cajas.forEach(e => {
        if (e.id_caja == this.cajaSeleccionada) {
          this.zonaSeleccionada = e.zona_caja
        }
      });
    }

    this.instalacionService.obtenerDataEquiposPorModelo2(this.zonaSeleccionada, this.equipoSeleccionado).subscribe(res => this.disponibles = res, err => console.log(err))
  }



}
