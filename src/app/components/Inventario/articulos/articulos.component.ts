import { Component, Pipe, PipeTransform, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Zonas2Service } from '../../../services/Inventario/zonas2.service';
import { ArticuloService } from '../../../services/Inventario/articulo.service';
import { MatPaginator } from '@angular/material/paginator';
import { Articulo } from '../../../models/Articulo';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthGuard } from '../../../_guards/index';


@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})

export class ArticulosComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  e: number = 1;
  p: number = 1;
  id: Number;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  datos: any = [];
  datos2:any = []
  disponibles: any = [];
  enProceso: any = [];
  noDisponibles: any = [];
  tipoSelected: string;
  equipos: any = [];
  paginaActual: number = 1;
  equiposPorPagina: number = 5;
  filtrado: any;
  modeloEquipos: any = [];
  equipoSelected: string = "";
  ingresoSelected: number = 0;
  equiposEnCola: any = [];
  cola: Articulo;
  serial1: string = "";
  serialCaja: string = ""
  modelo_articulo: string;
  visualizar: boolean = false;
  sedeSelected: number = 0;
  zonas: any = [];
  id_user: number;
  id_articulo: number;
  listaConsumibles: any = []
  equiposConsumibles: any = []
  nuevaLista: any = []
  detallesConsumible: any = []
  NuevoEquipoSelected: number
  NuevaCantidadSelected: number
  NuevaUnidadSelected: string
  NuevaCantidad: number = 0
  consumibleE: number

  ConsumibleBajo: boolean = false
  CBequipo: string = ""

  Proveedor: string= ''
  notaEntrega:string = " "


  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private Zona2Service: Zonas2Service,
    private ArticuloService: ArticuloService,
    private usuario: AuthGuard
  ) {
  }

  @ViewChild('serial') private elementRef: ElementRef;

  ngOnInit() {

    this.id = this.activateRoute.snapshot.params.id;

    this.traerDatos();
    this.contadordeDatos();
    this.traerZonas();
    this.id_user = this.usuario.currentUser.id_user
    console.log(this.id_user)
    this.ArticuloService.obtenerData().subscribe(res => { console.log(res), this.modeloEquipos = res }, err => console.log(err));
    
  }


  traerDatos() {
    this.Zona2Service.obtenerDatosZona1(this.id).subscribe(
      res => {
        this.datos = res,
        this.datos2 = res
      },
      err => console.log(err)
    )
  }

  openModal1(template1: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template1);
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template);
    this.id_articulo = id
  }


  colaEquipos(serial: HTMLInputElement) {
    this.ArticuloService.obtenerDataEquipo(this.equipoSelected)
      .subscribe(
        res => {
          if (this.ingresoSelected == 1) {
            this.cola = {
              id_caja_articulo: this.serialCaja,
              modelo_articulo: this.equipoSelected,
              serial_articulo: this.serial1,
              estatus: 1,
              id_tipo_articulo: res[0].tipo_equipo,
              id_tipo_zona: this.id,
              proveedor: this.Proveedor,
              notaEntrega: this.notaEntrega
            }
          } else {
            this.cola = {
              id_caja_articulo: "0",
              modelo_articulo: this.equipoSelected,
              serial_articulo: this.serial1,
              estatus: 1,
              id_tipo_articulo: res[0].tipo_equipo,
              id_tipo_zona: this.id,
              proveedor: this.Proveedor,
              notaEntrega: this.notaEntrega
            }
          }
          this.equiposEnCola.push(this.cola);
          console.log(this.equiposEnCola)
          document.getElementById("serial").focus();
          this.serial1 = "";
        },
        err => console.log(err)
      )

  }


  Guardar(serial: HTMLInputElement) {

    if (this.equiposEnCola.length == 0) {


      console.log(this.equipoSelected)
      this.cola = {
        id_caja_articulo: "0",
        modelo_articulo: this.equipoSelected,
        serial_articulo: this.serial1,
        estatus: 1,
        id_tipo_articulo: 0,
        id_tipo_zona: this.id,
        proveedor: this.Proveedor,
        notaEntrega: this.notaEntrega
      }
      this.ArticuloService.obtenerDataEquipo(this.equipoSelected)
        .subscribe(
          res => {
            this.cola.id_tipo_articulo = res[0].tipo_equipo,
              this.tipoSelected = res[0].tipo_equipo
            this.ArticuloService.guardarData(this.cola).subscribe(res => console.log(res), err => console.log(err))
            this.Zona2Service.obtenerDatosZona1(this.id).subscribe(res => {this.datos = res  ,this.datos2 = res}, err => console.log(err))
            this.contadordeDatos()
          },
          err => console.log(err)
        )

    } else {

      this.ArticuloService.guardarCola(this.equiposEnCola)
        .subscribe(
          res => {
            console.log(res)
            this.Zona2Service.obtenerDatosZona1(this.id).subscribe(res => {this.datos = res,  this.datos2 = res}, err => console.log(err))
            this.contadordeDatos()

          }
          , err => console.log(err)
        )
    }
    this.equiposEnCola = []
    this.equipoSelected = ""
    this.serialCaja = ""
    this.ingresoSelected = 0
    this.serial1 = ""
    this.Proveedor = ""
    this.notaEntrega = ""
    this.modalRef.hide()

  }

  closeModal1(){
    this.equiposEnCola = []
    this.equipoSelected = ""
    this.serialCaja = ""
    this.ingresoSelected = 0
    this.serial1 = ""
    this.Proveedor = ""
    this.notaEntrega = ""
    this.modalRef.hide()
  }

  categoriaSeleccionada(modelo_articulo: string) {
    console.log(modelo_articulo)
    this.modelo_articulo = modelo_articulo
    this.ArticuloService.obtenerDataEquiposPorModelo(this.id, this.modelo_articulo)
      .subscribe(
        res => {
          this.datos = res,
          this.datos2 = res
          if (this.visualizar == false) { this.visualizar = true }
          else { this.visualizar = false }

        },
        err => console.log(err))

  }

  volverCategorias() {
    this.Zona2Service.obtenerDatosZona1(this.id).subscribe(
      res => {
        this.datos = res,
        this.datos2 = res
        if (this.visualizar == false) { this.visualizar = true }
        else { this.visualizar = false }
      },
      err => console.log(err)
    )
  }

  atras() {
    this.router.navigate(['/zonas2'])
  }

  traspadoEquipo() {
    console.log(this.sedeSelected);
    console.log(this.id_articulo)
    this.ArticuloService.traspasoDeEquipos(this.sedeSelected, this.id_articulo)
      .subscribe(
        res => {
          this.traerDatos();
          this.contadordeDatos();
          this.visualizar = false;
          console.log(res)
        },
        err => console.log(err)
      )
    this.modalRef.hide();
  }

  contadordeDatos() {
    this.ArticuloService.obtenerNumeroDisponibles(this.id).subscribe(
      res => {
        this.disponibles = res
      },
      err => console.log(err))

    this.ArticuloService.obtenerNumeroEnProceso(this.id).subscribe(
      res => {
        this.enProceso = res
      },
      err => console.log(err))

    this.ArticuloService.obtenerNumeroNoDisponibles(this.id).subscribe(
      res => {
        this.noDisponibles = res
      },
      err => console.log(err))

  }

  traerZonas() {
    this.Zona2Service.obtenerData().subscribe(res => this.zonas = res, err => console.log(err))
  }


  idEquipo(idEquipo) {
    this.router.navigate(["/equipo", this.id, idEquipo])
  }

  clickTotal() {
    this.Zona2Service.obtenerDatosZona1(this.id).subscribe(
      res => {
        this.datos = res,
        this.datos2 = res
        this.visualizar = false
      },
      err => console.log(err)
    )
  }

  clickDisponibles() {
    this.ArticuloService.obtenerNumeroDisponibles(this.id).subscribe(
      res => {
        this.datos = res,
        this.datos2 = res,
          this.visualizar = true
      },
      err => console.log(err))
  }


  clickEnProceso() {
    this.ArticuloService.obtenerNumeroEnProceso(this.id).subscribe(
      res => {
        this.datos = res,
        this.datos2 = res,
        this.visualizar = true
      },
      err => console.log(err))
  }
  clickNoDisponibles() {
    this.ArticuloService.obtenerNumeroNoDisponibles(this.id).subscribe(
      res => {
        this.datos = res,
          this.visualizar = true,
          this.datos2 = res
      },
      err => console.log(err))
  }

 

 

  agregarConsumible(lgModal) {
    this.ArticuloService.agregarConsumible(this.NuevoEquipoSelected, this.NuevaCantidadSelected, this.NuevaUnidadSelected, this.id)
      .subscribe(
        res => {
          console.log(res,
            this.NuevoEquipoSelected = 0,
            this.NuevaCantidad = 0,
            this.NuevaUnidadSelected = ""
          )
        },
        err => console.log(err)
      )
  }

  openModal2(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.listaConsumibles.forEach(element => {
      if (element.id_consumible == id) {
        this.detallesConsumible = element
        this.NuevaCantidad = element.cantidad
      }
    });
    console.log(this.detallesConsumible)
  }

  modificarConsumible(id: number) {
    console.log(this.NuevaCantidad)
    console.log(id)

    this.ArticuloService.modificarConsumible(this.NuevaCantidad, id)
      .subscribe(
        res => {
          console.log(res),
            this.modalRef.hide()
        },
        err => console.log(err)
      )

  }

  eliminarConsumible(template2: TemplateRef<any>, id: number) {
    this.modalRef2 = this.modalService.show(template2, this.config);
    this.consumibleE = id
  }

  eliminar() {
    this.ArticuloService.eliminarConsumible(this.consumibleE)
      .subscribe(
        res => {
          console.log(res),
            this.modalRef2.hide(),
            this.modalRef.hide(),
            this.NuevoEquipoSelected = 0,
            this.NuevaCantidad = 0,
            this.NuevaUnidadSelected = ""
        },
        err => console.log(err)
      )
  }

  noEliminar() {
    this.modalRef2.hide()
  }

  buscarEquipo(e) {
    if (e == "") {
    
    } else {

      const result = this.datos.filter((el) =>
        el.serial_articulo.toUpperCase().includes(e.toUpperCase())
      );

      this.datos = result;
    }

  }

  filtradoEquipoBackSpace(e){
    let backBusquedaEquipos = []
    this.datos2.filter(element => {
      element.serial_articulo.includes(e) ? backBusquedaEquipos.push(element) : console.log("no ha concidencia")
    });

    this.datos = backBusquedaEquipos;
  }




}
