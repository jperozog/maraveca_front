import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../../../_guards/index';
import { Zonas2Service } from '../../../services/Inventario/zonas2.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ListaTransferenciasService } from '../../../services/Inventario/lista-transferencias.service';
import { OrdenTrasladoService } from '../../../services/Inventario/orden-traslado.service'

@Component({
  selector: 'app-soporte-traslado',
  templateUrl: './soporte-traslado.component.html',
  styleUrls: ['./soporte-traslado.component.css']
})
export class SoporteTrasladoComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  zonas: any = [];
  zonaSelected: number = 0;
  categorias: any = [];
  categoriaSelected: string = '';
  tipoSelected: number = 0
  equipos: any = []
  idLista: any = []
  equiposLista: any = []
  mostrarEquipos: boolean = false
  chofer: any = [];
  choferSelected: string = '';
  vehiculos: any = []
  vehiculoSeleccionado: number = 0;
  desde:string = ""
  hasta:string = ""
  traslados: any = []
  e: number = 1
  isChecked:boolean =false

  constructor(private router: Router,
    private usuario: AuthGuard,
    private zonas2Service: Zonas2Service,
    private modalService: BsModalService,
    private listaTransferenciaService: ListaTransferenciasService,
    private ordenTrasladoService: OrdenTrasladoService
  ) { }

  ngOnInit() {
    this.traerSede()
    this.traerTraslados()
    this.traerCategorias()
  }

  traerSede() {
    if (this.usuario.perm.includes('inventarios_esp')) {
      this.zonas2Service.obtenerDataPermisos().subscribe(
        res => {
          this.zonas = res;
          //console.log(res);
        },
        err => console.log(err)

      );
    } else {
      this.zonas2Service.obtenerData().subscribe(
        res => {
          this.zonas = res;
          //console.log(res);
        },
        err => console.log(err)

      );
    }
  }

  traerTraslados() {
    this.ordenTrasladoService.traerTraslados().subscribe(res => { console.log(res), this.traslados = res }, err => console.log(err))
  }

  traerCategorias() {
    this.zonas2Service.obtenerCategorias()
      .subscribe(
        res => {
          this.categorias = res,
            console.log(res)
        },
        err => console.log(err))
  }

  traerEquipos() {
    if (this.tipoSelected == 1) {
      this.zonas2Service.obtenerDatosZonaAsignados(this.zonaSelected, this.categoriaSelected).subscribe(
        res => {
          this.equipos = res,
            console.log(this.equipos),
            this.mostrarEquipos = true
        },
        err => console.log(err)
      )
    }

    if (this.tipoSelected == 2){
      this.zonas2Service.obtenerDatosZona(this.zonaSelected, this.categoriaSelected).subscribe(
        res => {
          this.equipos = res,
            console.log(this.equipos),
            this.mostrarEquipos = true
        },
        err => console.log(err)
      )
    }

    if (this.tipoSelected == 3){
      this.zonas2Service.obtenerDatosZonaVendidos(this.zonaSelected, this.categoriaSelected).subscribe(
        res => {
          this.equipos = res,
            console.log(this.equipos),
            this.mostrarEquipos = true
        },
        err => console.log(err)
      )
    }

  }

  agregarEquipoLista(id: number) {
    if (this.idLista.includes(id) == false) {
      this.equipos.forEach(e => {
        if (e.id_articulo == id) {
          this.equiposLista.push(e)
        }
      });
      this.idLista.push(id),
        console.log(this.equiposLista)
      console.log(this.idLista)
      this.traerEquipos()
      //this.filtrado = []

    } else {
      console.log("equipo ya en la lista");
    }
  }

  eliminarEquipoLista(i: number) {
    this.equiposLista.splice(i, 1);
    this.idLista.splice(i, 1);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.traerInstalador()
    this.traerVehiculos()
  }

  traerInstalador() {
    this.ordenTrasladoService.traerConductores()
      .subscribe(
        res => {

          this.chofer = res,
            console.log(this.chofer)
        },
        err => console.log(err)
      );
  }

  traerVehiculos() {
    this.ordenTrasladoService.traerVehiculos()
      .subscribe(
        res => {

          this.vehiculos = res,
            console.log(this.vehiculos)
        },
        err => console.log(err)
      );
  }

  realizarTraslado() {
    
    this.ordenTrasladoService.realizarTraslado(this.equiposLista, this.choferSelected, this.vehiculoSeleccionado, this.usuario.currentUser.id_user,this.desde,this.hasta)
      .subscribe(
        res => {
          this.traerTraslados()
          this.closeModal()
        },
        err => console.log(err))
        
  }

  closeModal() {
    this.modalRef.hide()
    this.choferSelected = ""
    this.vehiculoSeleccionado = 0
    this.mostrarEquipos = false
    this.desde = ""
    this.hasta = ""
  }

  irAOrden(id: number) {
    console.log(id)

    this.router.navigate(['/pdfTraslado', id])

  }

  onChange() {
    this.equipos = []
    this.idLista = []
    this.equiposLista = []
  }

  atras() {
    this.router.navigate(['/zonas2'])
  }



}
