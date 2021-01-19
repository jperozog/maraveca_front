import { Component, OnInit, TemplateRef } from '@angular/core';
import { Zonas2Service } from '../../../services/Inventario/zonas2.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthGuard } from '../../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ArticuloService } from '../../../services/Inventario/articulo.service';
import { BuscadorService } from '../../../services/Inventario/buscador.service';


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-zonas2',
  templateUrl: './zonas2.component.html',
  styleUrls: ['./zonas2.component.css']
})
export class Zonas2Component implements OnInit {
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

  historial: any = [];
  e: number = 1



  listacliente: any = [];
  celdas: any = [];
  equipos: any = [];
  disponibles: any = [];
  planes: any = [];
  celdaSeleccionada: number
  zoneSeleccionada: number;
  equipeSeleccionada: string;
  tipoPlanSeleccionado: number;
  planSeleccionado: number;
  visualizarDisponible: boolean = false;
  visualizarPlan: boolean = false;
  ipSeleccionada: string
  serialSeleccionado: string

  serialEquipo: string = ""
  detalles: boolean = false
  detalles2: boolean = false
  masDetallesDatos: any
  detallesEquipo: any
  detallesEquipo2: any


  constructor(private Zonas2Service: Zonas2Service,
    private articuloService: ArticuloService,
    private router: Router,
    public usuario: AuthGuard,
    private modalService: BsModalService,
    private buscadorService: BuscadorService) { }

  ngOnInit() {
    if (this.usuario.perm.includes('inventarios_esp')) {
      this.Zonas2Service.obtenerDataPermisos().subscribe(
        res => {
          this.zonas = res;
          //console.log(res);
        },
        err => console.log(err)

      );
    } else {
      this.Zonas2Service.obtenerData().subscribe(
        res => {
          this.zonas = res;
          //console.log(res);
        },
        err => console.log(err)

      );
    }
    this.traerHistorial()
  }

  traerHistorial() {
    this.Zonas2Service.historial().subscribe(res => this.historial = res, err => console.log(err))
  }

  Guardar(sede: HTMLInputElement): boolean {
    if (this.ubiSelected == "1") {
      this.ubicacion = "zulia.png"
    } else {
      this.ubicacion = "falcon.png"
    }

    this.Zonas2Service.guardarData(sede.value, this.ubicacion).subscribe(
      res => {
        this.zonas = res;
        //console.log(res);
      },
      err => console.log(err)

    );
    this.Zonas2Service.obtenerData().subscribe(
      res => {
        this.zonas = res;
        // console.log(res);
      },
      err => console.log(err)

    );


    return false;
  }

  zonaSeleccionada(id: Number) {
    this.router.navigate(['/zonas2', id])
  }

  zonaSeleccionada2(id: Number) {
    this.router.navigate(['/Consumibles', id])
  }

  Eliminar(): boolean {
    console.log(this.zonaSelected)
    this.Zonas2Service.eliminarZona(this.zonaSelected).subscribe(res => console.log(res), err => console.log(err));

    this.Zonas2Service.obtenerData().subscribe(
      res => {
        this.zonas = res,
          console.log(res);
      },
      err => console.log(err)

    );
    return false;
  }

  buscador(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  buscarEquipo() {
    this.buscadorService.buscarSerial(this.serialEquipo)
      .subscribe(
        res => {
          console.log(res),
            this.detallesEquipo2 = res
          if (this.detallesEquipo2.length > 0) {
            this.detallesEquipo = this.detallesEquipo2[0]
            this.detalles = true
          } else {
          }
        }, err => console.log(err))



  }

  masDetalles() {
    this.buscadorService.MasDetalles(this.detallesEquipo)
      .subscribe(
        res => {
          console.log(res)
          this.masDetallesDatos = res,
            this.detalles2 = true
        },
        err => console.log(err))
  }

  limpiarTodo() {
    this.detalles = false
    this.detalles2 = false
    this.masDetallesDatos = []
    this.serialEquipo = ""

  }

  closeModal() {
    this.detalles = false
    this.detalles2 = false
    this.masDetallesDatos = []
    this.serialEquipo = ""
    this.modalRef.hide()
  }

  transferencias() {
    this.router.navigate(['/transferenciaEquipos']);
  }
  listaTransferencias() {
    this.router.navigate(['/listaTransferencias']);
  }
  ventaEquipos() {
    this.router.navigate(['/ventaEquipos']);
  }

  estructura() {
    this.router.navigate(['/infraestructura']);
  }

  soporteTraslado() {
    this.router.navigate(['/soporteTraslado']);
  }

  vehiculos() {
    this.router.navigate(['/Vehiculos']);
  }

  equiposGrupales(){
    this.router.navigate(['/EquiposGrupales']);
  }
}
