import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Zonas2Service } from '../../../services/Inventario/zonas2.service';
import { DetallesArticulosService } from '../../../services/Inventario/detalles-articulos.service';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ListaTransferenciasService } from '../../../services/Inventario/lista-transferencias.service';
import { filter } from 'rxjs/operator/filter';
import { filterQueryId } from '@angular/core/src/view/util';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { OrdenTrasladoService } from '../../../services/Inventario/orden-traslado.service'


@Component({
  selector: 'app-transferencia-equipos',
  templateUrl: './transferencia-equipos.component.html',
  styleUrls: ['./transferencia-equipos.component.css']
})
export class TransferenciaEquiposComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  zonas: any = [];
  equiposEmisor: any = [];
  equiposSeleccionado: any = [];
  zonaSelected: number = 0;
  zonaSelected2: number = 0;
  ingresoSelected: number = 0
  tipoTransSelected: number = 0
  cantidadConsumible: number = 0
  cajaSelected: string = ""
  categorias: any = [];
  categoriaSelected: string = '';
  chofer: any = [];
  p: number = 1;
  e: number = 1;
  isChecked: boolean = false;
  choferSelected: string;
  id_transferencia: number;
  objetoConsumible: Object = {
    id: 0,
    cantidad: 0
  }


  equipo: any;
  equiposLista: any = [];
  cajasLista: any = []
  id: any;
  idLista: any = [];
  filtrado: any

  cedula: string;
  modelo: string;
  placa: string;
  color: string;
  ano: string;
  vehiculos:any = []
  vehiculoSelected:any
  cedulaSelected:string = ""

  constructor(
    private router: Router,
    private detallesArticuloService: DetallesArticulosService,
    private zonas2Service: Zonas2Service,
    private modalService: BsModalService,
    private listaTransferenciaService: ListaTransferenciasService,
    private ordenTrasladoService: OrdenTrasladoService,
    private usuario: AuthGuard) { }

  ngOnInit() {

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

    this.traerInstalador();
  }
  modoDeTransferencia() {
    this.ingresoSelected = 0
    this.categoriaSelected = ""
    this.equiposEmisor = []
    this.equiposLista = []
    this.idLista = []

    if (this.tipoTransSelected == 1) {
      this.zonas2Service.obtenerCategorias()
        .subscribe(
          res => {
            this.categorias = res,
              console.log(res)
          },
          err => console.log(err))
    } else {
      this.zonas2Service.obtenerConsumibles()
        .subscribe(
          res => {
            this.categorias = res,
              console.log(res)
          },
          err => console.log(err))
    }
  }

  mostrarEquipoEmisor() {
    console.log(this.ingresoSelected)
    console.log(this.tipoTransSelected)
    if (this.tipoTransSelected == 1) {
      if (this.ingresoSelected == 1) {
        this.listaTransferenciaService.traerEquiposCajas(this.cajaSelected).subscribe(res => this.equiposEmisor = res, err => console.log(err))
      } else {
        this.zonas2Service.obtenerDatosZona(this.zonaSelected, this.categoriaSelected).subscribe(
          res => {
            this.equiposEmisor = res,
              console.log(this.equiposEmisor)
          },
          err => console.log(err)
        )
      }
    } else {
      this.zonas2Service.chequearConsumibles(this.zonaSelected, this.categoriaSelected).subscribe(res => this.equiposEmisor = res, err => console.log(err))
    }

  }

  modoDeIngreso() {
    this.equiposEmisor = []
    this.idLista = []
    this.equiposLista = []
    if (this.ingresoSelected == 1) {
      this.listaTransferenciaService.traerDatosCajas(this.zonaSelected).subscribe(res => this.cajasLista = res, err => console.log(err))
    } else {

    }
  }

  agregarEquipoLista(id: number, template3: TemplateRef<any>) {

    if (this.tipoTransSelected == 1) {
      this.detallesArticuloService.obtenerData(id).subscribe(
        res => {
          this.equipo = res[0],
            this.id = res[0].id_articulo
          if (this.idLista.includes(this.id) == false) {
            this.equiposLista.push(this.equipo),
              this.idLista.push(this.id),
              this.mostrarEquipoEmisor()
            this.filtrado = []

          } else {
            console.log("equipo ya en la lista");
          }
        },
        err => console.log(err))
    } else {
      this.modalRef = this.modalService.show(template3, this.config);
    }
  }

  agregarListaConsumible() {

    if (this.idLista.includes(this.equiposEmisor[0].id_consumible) == false) {
      this.equiposEmisor[0].cantidad = this.cantidadConsumible
      this.equiposLista.push(this.equiposEmisor[0]),
        this.objetoConsumible["id"] = this.equiposEmisor[0].id_consumible,
        this.objetoConsumible["cantidad"] = this.equiposEmisor[0].cantidad,
        this.idLista.push(this.objetoConsumible),
        console.log(this.equiposLista),
        this.mostrarEquipoEmisor()
      this.filtrado = []
    } else {
      console.log("equipo ya en la lista");
    }
    this.modalRef.hide()
    this.cantidadConsumible = 0
  }

  agregarCajaLista() {
    this.equiposEmisor.forEach(e => {
      this.detallesArticuloService.obtenerData(e.id_articulo).subscribe(
        res => {
          this.equipo = res[0],
            this.id = res[0].id_articulo
          if (this.idLista.includes(this.id) == false) {
            this.equiposLista.push(this.equipo),
              this.idLista.push(this.id),
              this.mostrarEquipoEmisor()
            this.filtrado = []
          } else {
            console.log("equipo ya en la lista");
          }
        },
        err => console.log(err))
    });
  }

  eliminarEquipoLista(i: number, equipo: any) {

    if (this.tipoTransSelected == 1) {
      if (this.ingresoSelected == 1) {
        let equipoLista2: any = []
        let idLista2: any = []
        this.equiposLista.forEach(element => {
          if (element.serial_caja != equipo.serial_caja) {
            equipoLista2.push(element)
            idLista2.push(element.id_articulo)
          } else {
            //console.log(id)

            //this.idLista.splice(id, 1);
          }
        });
        this.equiposLista = equipoLista2;
        this.idLista = idLista2
      } else {
        console.log(equipo);
        this.equiposLista.splice(i, 1);
        this.idLista.splice(i, 1);
      }
    } else {
      console.log(equipo);
      this.equiposLista.splice(i, 1);
      this.idLista.splice(i, 1);
    }
  }
  /*
    transferirEquipos() {
  
  
      this.detallesArticuloService.transferirEquipos(this.zonaSelected, this.zonaSelected2, this.idLista, this.usuario.currentUser.id_user).subscribe(res => console.log(res), err => console.log(err));
      this.equiposLista = [];
      this.equiposEmisor = [];
      this.router.navigate(['/zonas2']);
  
    }
  */
  traerInstalador() {
    this.listaTransferenciaService.obtenerData7()
      .subscribe(
        res => {

          this.chofer = res,
            console.log(this.chofer)
        },
        err => console.log(err)
      );
  }


  atras() {
    this.router.navigate(['/zonas2'])
  }

  onChange() {
    this.equiposLista = [];
    this.ingresoSelected = 0
  }
  /*
    toPdf(cedula: HTMLInputElement, modelo: HTMLInputElement, color: HTMLInputElement, placa: HTMLInputElement, ano: HTMLInputElement) {
  
      this.detallesArticuloService.transferirEquipos(this.zonaSelected, this.zonaSelected2, this.idLista, this.usuario.currentUser.id_user)
        .subscribe(
          res => {
            console.log(res)
          },
          err => console.log(err)
        );
  
  
  
  
      this.equiposLista = [];
      this.equiposEmisor = [];
    }
  */
  confirmacion() {
    this.listaTransferenciaService.ultimaTransferencia()
      .subscribe(
        res => {
          console.log(res),
            this.id_transferencia = res[0].id_transferencia

          this.listaTransferenciaService.agregarOrdenTraslado(this.choferSelected, this.cedula, this.modelo, this.color, this.placa, this.ano, this.id_transferencia)
            .subscribe(res => console.log(res), err => console.log(err))

        },
        err => console.log(err)
      )
    this.modalRef2.hide()
    this.router.navigate(['/listaTransferencias']);
  }

  negacion() {
    this.listaTransferenciaService.ultimaTransferencia()
      .subscribe(
        res => {
          console.log(res),
            this.id_transferencia = res[0].id_transferencia

          this.listaTransferenciaService.agregarOrdenTraslado(this.choferSelected, this.cedula, this.modelo, this.color, this.placa, this.ano, this.id_transferencia)
            .subscribe(res => console.log(res), err => console.log(err))

        },
        err => console.log(err)
      )
    this.modalRef2.hide()
    this.router.navigate(['/zonas2']);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.traerVehiculos();
  }

  openModal2(template2: TemplateRef<any>) {
    
    if (this.tipoTransSelected == 1) {
      this.detallesArticuloService.transferirEquipos(this.zonaSelected, this.zonaSelected2, this.idLista, this.tipoTransSelected,this.choferSelected,this.cedulaSelected,this.vehiculoSelected, this.usuario.currentUser.id_user)
        .subscribe(
          res => {
            console.log(res)
          },
          err => console.log(err)
        );
    } else {
      this.detallesArticuloService.transferirEquipos(this.zonaSelected, this.zonaSelected2, this.equiposLista, this.tipoTransSelected,this.choferSelected,this.cedulaSelected,this.vehiculoSelected, this.usuario.currentUser.id_user)
        .subscribe(
          res => {
            console.log(res)
          },
          err => console.log(err)
        );
    }


    
    this.equiposLista = [];
    this.equiposEmisor = [];
    this.choferSelected = ""
    this.cedulaSelected = ""
    this.vehiculoSelected = 0

    //this.modalRef2 = this.modalService.show(template2, this.config);
    this.modalRef.hide()
   
  }

  closeModal() {
    this.modalRef.hide()
  }

  closeModal3() {
    this.modalRef.hide()
    this.cantidadConsumible = 0
  }

  BuscarEquipoEmisor(e) {

    if (e == "") {
      this.mostrarEquipoEmisor()
    } else {

      const result = this.equiposEmisor.filter((el) =>
        el.serial_articulo.includes(e)
      );
      this.equiposEmisor = result;
    }
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

}
