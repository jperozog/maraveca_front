import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { InfraestructuraService } from '../../../services/Inventario/infraestructura.service'
@Component({
  selector: 'app-infraestructura',
  templateUrl: './infraestructura.component.html',
  styleUrls: ['./infraestructura.component.css']
})
export class InfraestructuraComponent implements OnInit {
  e: number = 1
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  zonas: any = []
  equipos: any = []
  disponibles: any = []
  infra: any = []
  infra2: any = []
  zonasSeleccionada: number = 0
  tipoSeleccionado: number = 0
  modeloSeleccionado: string = ""
  idSeleccionado: number = 0
  idConsumible: number = 0
  Comentario: string = ""
  cantidad: number = 0
  busqueda: boolean = false
  equipoSeleccionado: any
  tipoIncidencia: string = ""
  comentarioIncidencia: string = ""
  equipoInfraestructura: any
  constructor(
    private router: Router,
    private modalService: BsModalService,
    private autoGuard: AuthGuard,
    private infraestructuraService: InfraestructuraService
  ) { }

  ngOnInit() {
    this.traerData();
    this.traerZonas();
  }

  cambioEquipo(tipo: number) {
    this.traerEquipos(tipo)
    this.busqueda = false
  }


  traerData() {
    this.infraestructuraService.traerData().subscribe(res => { this.infra = res, this.infra2 = res }, err => console.log(err))
  }

  traerZonas() {
    if (this.autoGuard.perm.includes('inventarios_esp')) {
      this.infraestructuraService.traerZonasPermisos().subscribe(res => this.zonas = res, err => console.log(err))
    } else {
      this.infraestructuraService.traerZonas().subscribe(res => this.zonas = res, err => console.log(err))
    }
  }

  traerEquipos(tipo: number) {
    this.infraestructuraService.traerEquipos(tipo).subscribe(res => this.equipos = res, err => console.log(err))
  }

  buscarEquipo() {
    this.busqueda = true
    this.infraestructuraService.traerDisponibles(this.zonasSeleccionada, this.modeloSeleccionado, this.tipoSeleccionado).subscribe(res => this.disponibles = res, err => console.log(err))

  }


  GuardarData() {
    this.infraestructuraService.guardarDate(this.idSeleccionado, this.Comentario, this.tipoSeleccionado, this.cantidad, this.autoGuard.currentUser.id_user).subscribe(res => { console.log(res), this.traerData() }, err => console.log(err))

    this.idSeleccionado = 0
    this.zonasSeleccionada = 0
    this.busqueda = false
    this.Comentario = ""
    this.modeloSeleccionado = ""
    this.tipoSeleccionado = 0
    this.cantidad = 0
    this.ngOnInit()
  }

  atras() {
    this.router.navigate(['/zonas2']);
  }

  BuscarInfra(e) {


    if (e == "") {
      this.traerData()
    } else {

      const result2 = this.infra.filter((el) =>
        el.modelo_articulo.toUpperCase().includes(e.toUpperCase())
      );

      const result = this.infra.filter((el) =>
        el.serial_articulo.toUpperCase().includes(e.toUpperCase())
      );
      const result3 = result.concat(result2)
      this.infra = result3;
    }

  }

  BuscarInfraBackSpace(e) {

    const algo = this.infra2
    const result = algo.filter((el) =>
      el.serial_articulo.toUpperCase().includes(e.toUpperCase())
    );
    const result2 = this.infra2.filter((el) =>
      el.modelo_articulo.toUpperCase().includes(e.toUpperCase())
    );

    const result3 = result.concat(result2)
    this.infra = result3;

  }

  detallesInfra(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.idConsumible = id

    this.infra.forEach(element => {
      if (element.id_equipo_infra == id) {
       this.equipoInfraestructura = element
       console.log(element)
      }
    });

  }

  agregarIncidecia() {

    this.infraestructuraService.agregarIncidencia(this.idConsumible, this.tipoIncidencia, this.comentarioIncidencia, this.autoGuard.currentUser.id_user)
      .subscribe(
        res => {
          console.log(res),
            this.closeModal()
        }, err => console.log(err))
  }

  closeModal() {
    this.modalRef.hide()
    this.ngOnInit()
    this.comentarioIncidencia = ""
    this.tipoIncidencia = ""
  }


}
