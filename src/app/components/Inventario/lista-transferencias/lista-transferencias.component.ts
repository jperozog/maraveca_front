import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaTransferenciasService } from '../../../services/Inventario/lista-transferencias.service';
import { DetallesArticulosService } from '../../../services/Inventario/detalles-articulos.service';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { AuthGuard } from '../../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Zonas2Service } from '../../../services/Inventario/zonas2.service'
import { OrdenTrasladoService } from '../../../services/Inventario/orden-traslado.service'

@Component({
  selector: 'app-lista-transferencias',
  templateUrl: './lista-transferencias.component.html',
  styleUrls: ['./lista-transferencias.component.css']
})
export class ListaTransferenciasComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  modalRef4: BsModalRef;
  modalRef5: BsModalRef;
  modalRef6: BsModalRef;
  modalRef8: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  transferencias: any = [];
  transferencias2: any = [];
  emisor: number;
  receptor: number;
  id_transferencia: number;
  respuesta: any = [];
  numero_equipos: number;
  nombre_emisor: string;
  nombre_receptor: string;
  responsable: number;
  confirmante: number;
  nombre_responsable: string;
  apellido_responsable: string;
  nombre_confirmante: string;
  apellido_confirmante: string;
  estatus: any;
  chofer: any = [];
  choferSelected: number;
  p: number;
  e: number;
  r: number;
  n: number
  isChecked: boolean = false;
  ProblemaSelected: number = 0;
  equipo: any = [];
  id: number;
  idLista: any = [];
  equiposLista: any = [];
  TextoSelected: string;
  comentario: string;
  anuncio: number
  autorizacion: number
  FiltroActivo: number = 1

  visualizar: boolean = false;
  visualizar2: boolean = false;
  mensajeN: boolean = false;
  mensajeA: boolean = false;
  mensajeAu: boolean = false;

  tipoModificacion: number = 0
  zonas: any = []
  zonaModificacionSelected2: number = 0
  zonaModificacionSelected: number = 0
  categorias: any = []
  zonaEquiposModificacion: number = 0
  categoriaSelected: string = ""
  equiposModificacion: any = []
  equipoAggSelected: number = 0
  listaEquiposAgg: any = []
  listaEquiposDel: any = []
  idLista2: any = []
  idLista3: any = []
  equipoDelSelected: number = 0
  vehiculos: any = []
  vehiculoSelected: number = 0


  constructor(
    private router: Router,
    private listaTransferenciaService: ListaTransferenciasService,
    private detallesArticuloService: DetallesArticulosService,
    private zonas2Service: Zonas2Service,
    public usuario: AuthGuard,
    private ordenTrasladoService: OrdenTrasladoService,
    private modalService: BsModalService,
  ) { }



  ngOnInit() {
    this.TraerTransferencias(1);
    console.log(this.usuario.currentUser.id_user)
  }

  TraerTransferencias(id: number) {
    console.log(id)
    this.listaTransferenciaService.obtenerData(id)
      .subscribe(
        res => {
          this.transferencias = res,
            this.transferencias2 = res,
            console.log(this.transferencias)
        },
        err => console.log(err)
      )
  }

  FiltroTransferencia() {
    if (this.FiltroActivo == 1) {
      this.TraerTransferencias(1)
    } else {
      this.TraerTransferencias(2)
    }
  }

  autorizar() {
    this.listaTransferenciaService.autorizar(this.autorizacion, this.FiltroActivo)
      .subscribe(
        res => {
          console.log(res),
            this.TraerTransferencias(this.FiltroActivo);
          this.modalRef8.hide();
          this.visualizar = false
          this.mensajeAu = true
        },
        err => console.log(err)
      )
  }

  verDetalles(id: number, lgModal) {
    lgModal.show()
    if (this.FiltroActivo == 1) {
      this.listaTransferenciaService.obtenerData2(id, this.FiltroActivo)
        .subscribe(
          res => {
            this.respuesta = res,
              this.emisor = res[0].desde,
              this.receptor = res[0].hacia,
              this.responsable = res[0].responsable
            this.confirmante = res[0].confirma
            console.log(this.respuesta)
            console.log(this.confirmante)
            this.id_transferencia = this.respuesta[0].id_transferencia
            this.numero_equipos = this.respuesta.length,
              this.estatus = this.respuesta[0].estatus_trans
            this.TraerEmisor()
            this.TraerReceptor()
            this.TraerResponsable()
            this.TraerConfirmante()
            this.visualizar2 = false
            this.equiposLista = []
          },
          err => console.log(err)
        );
    } else {
      this.listaTransferenciaService.obtenerData2(id, this.FiltroActivo)
        .subscribe(
          res => {
            this.respuesta = res,
              this.emisor = res[0].desde,
              this.receptor = res[0].hacia,
              this.responsable = res[0].responsable
            this.confirmante = res[0].confirma
            console.log(this.respuesta)
            console.log(this.confirmante)
            this.id_transferencia = this.respuesta[0].id_transferencia
            this.numero_equipos = this.respuesta.length,
              this.estatus = this.respuesta[0].estatus_trans
            this.TraerEmisor()
            this.TraerReceptor()
            this.TraerResponsable()
            this.TraerConfirmante()
            this.visualizar2 = false
            this.equiposLista = []
          },
          err => console.log(err)
        );
    }

  }

  modificarTransferencia(id: number, lgModal2) {
    this.idLista2 = []
    this.idLista3 = []
    this.listaEquiposAgg = []
    this.listaEquiposDel = []
    this.tipoModificacion = 0
    this.categoriaSelected = ""
    this.equipoAggSelected = 0
    this.equipoDelSelected = 0

    this.zonaModificacionSelected = 0
    this.zonaModificacionSelected2 = 0
    lgModal2.show()
    if (this.FiltroActivo == 1) {
      this.listaTransferenciaService.obtenerData2(id, this.FiltroActivo)
        .subscribe(
          res => {
            this.respuesta = res,
              this.zonaEquiposModificacion = res[0].desde
            console.log(this.respuesta)
            console.log(this.confirmante)
            this.id_transferencia = this.respuesta[0].id_transferencia
          },
          err => console.log(err)
        );
    } else {
      this.listaTransferenciaService.obtenerData2(id, this.FiltroActivo)
        .subscribe(
          res => {
            this.respuesta = res,
              this.zonaEquiposModificacion = res[0].desde
            console.log(this.respuesta)
            console.log(this.confirmante)
            this.id_transferencia = this.respuesta[0].id_transferencia
          },
          err => console.log(err)
        );
    }

  }

  cambiarModificacion() {
    if (this.tipoModificacion == 1) {
      this.zonas2Service.obtenerDataPermisos().subscribe(
        res => {
          this.zonas = res;
          console.log(res);
        },
        err => console.log(err)

      );
    }

    if (this.tipoModificacion == 2) {
      if (this.FiltroActivo == 1) {

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
    if (this.tipoModificacion == 4) {

      this.ordenTrasladoService.traerVehiculos()
        .subscribe(
          res => {

            this.vehiculos = res,
              console.log(this.vehiculos)
          },
          err => console.log(err)
        );
    }


    this.ordenTrasladoService.traerConductores()
      .subscribe(
        res => {

          this.chofer = res,
            console.log(this.chofer)
        },
        err => console.log(err)
      );

  }

  modificarSedesTranferencia(lgModal2) {
    this.listaTransferenciaService.modificarSedesTranferencia(this.id_transferencia, this.zonaModificacionSelected, this.zonaModificacionSelected2, this.usuario.currentUser.id_user, this.FiltroActivo)
      .subscribe(
        res => {
          if (this.FiltroActivo == 1) {
            this.TraerTransferencias(1)
          } else {
            this.TraerTransferencias(2)
          }
          this.zonaModificacionSelected = 0
          this.zonaModificacionSelected2 = 0
          this.tipoModificacion = 0
          lgModal2.hide()
        }
        ,
        err => console.log(err)
      )
  }

  buscarEquiposModificacion() {
    this.zonas2Service.obtenerDatosZona(this.zonaEquiposModificacion, this.categoriaSelected).subscribe(
      res => {
        this.equiposModificacion = res,
          console.log(this.equiposModificacion)
      },
      err => console.log(err)
    )
  }

  agregarListaAgg() {

    this.equiposModificacion.forEach(e => {
      if (this.equipoAggSelected == e.id_articulo) {
        if (this.idLista2.includes(e.id_articulo)) {

        } else {
          this.listaEquiposAgg.push(e)
          this.idLista2.push(e.id_articulo)
        }
      }
    });
  }

  agregarListaAggCon(e: number) {
    console.log(e)

    this.equiposModificacion.forEach(e => {
      if (this.equipoAggSelected == e.id_articulo) {
        if (this.idLista2.includes(e.id_articulo)) {

        } else {
          this.listaEquiposAgg.push(e)
          this.idLista2.push(e.id_articulo)
        }
      }
    });

  }

  aggEquiposTranferencia(lgModal2) {
    this.listaTransferenciaService.aggEquiposTranferencia(this.id_transferencia, this.listaEquiposAgg, this.usuario.currentUser.id_user)
      .subscribe(
        res => {
          this.TraerTransferencias(1)
          this.idLista2 = []
          this.listaEquiposAgg = []
          this.tipoModificacion = 0
          this.categoriaSelected = ""
          this.equipoAggSelected = 0
          lgModal2.hide()
        },
        err => console.log(err)
      )

  }

  agregarListaDel() {
    if (this.FiltroActivo == 1) {
      this.respuesta.forEach(e => {
        if (this.equipoDelSelected == e.id_articulo) {
          if (this.idLista3.includes(e.id_articulo)) {

          } else {
            this.listaEquiposDel.push(e)
            this.idLista3.push(e.id_articulo)
          }
        }
      });
    } else {
      this.respuesta.forEach(e => {
        if (this.equipoDelSelected == e.id_consumible) {
          if (this.idLista3.includes(e.id_consumible)) {

          } else {
            this.listaEquiposDel.push(e)
            this.idLista3.push(e.id_articulo)
          }
        }
      });
    }


  }

  delEquiposTranferencia(lgModal2) {
    this.listaTransferenciaService.delEquiposTranferencia(this.id_transferencia, this.listaEquiposDel, this.usuario.currentUser.id_user, this.FiltroActivo)
      .subscribe(
        res => {
          if (this.FiltroActivo == 1) {
            this.TraerTransferencias(1)
          } else {
            this.TraerTransferencias(2)
          }
          this.idLista3 = []
          this.listaEquiposDel = []
          this.tipoModificacion = 0
          this.equipoDelSelected = 0
          lgModal2.hide()
        },
        err => console.log(err)
      )

  }

  modificarOrdenTranferencia(lgModal2) {
    this.listaTransferenciaService.modificarOrdenTranferencia(this.id_transferencia, this.choferSelected, this.vehiculoSelected, this.usuario.currentUser.id_user)
      .subscribe(
        res => {

          if (this.FiltroActivo == 1) {
            this.TraerTransferencias(1)
          } else {
            this.TraerTransferencias(2)
          }
          this.choferSelected = 0
          this.vehiculoSelected = 0
          this.tipoModificacion = 0
          lgModal2.hide()

        }
        ,
        err => console.log(err)
      )

  }


  TraerEmisor() {
    this.listaTransferenciaService.obtenerData3(this.emisor)
      .subscribe(
        res => {

          this.nombre_emisor = res[0].nombre_zona
        },
        err => console.log(err)
      );

  }

  TraerResponsable() {

    this.listaTransferenciaService.obtenerData5(this.responsable)
      .subscribe(
        res => {
          this.nombre_responsable = res[0].nombre_user,
            this.apellido_responsable = res[0].apellido_user
        },
        err => console.log(err)
      );

  }

  TraerConfirmante() {

    if (this.estatus == 1) {
      this.nombre_confirmante = "Sin",
        this.apellido_confirmante = "Confimar"
    } else {
      this.listaTransferenciaService.obtenerData6(this.confirmante)
        .subscribe(
          res => {
            this.nombre_confirmante = res[0].nombre_user,
              this.apellido_confirmante = res[0].apellido_user
          },
          err => console.log(err)
        );
    }

  }

  TraerReceptor() {
    this.listaTransferenciaService.obtenerData4(this.receptor)
      .subscribe(
        res => {

          this.nombre_receptor = res[0].nombre_zona
        },
        err => console.log(err)
      );

  }

  aceptar() {
    this.mensajeA = true;
    this.visualizar = false;
    this.listaTransferenciaService.aceptarTransferencia(this.respuesta, this.receptor, this.usuario.currentUser.id_user, this.FiltroActivo)
      .subscribe(
        res => {
          console.log(res),
            this.TraerTransferencias(this.FiltroActivo);
        },
        err => console.log(err)
      )
    this.modalRef.hide();
  }

  aceptarDetalles(template5: TemplateRef<any>) {


    let idx: any;
    for (var i = 0; i < this.respuesta.length; i++) {
      for (var j = 0; j < this.equiposLista.length; j++) {
        idx = this.respuesta.indexOf(this.respuesta[i])
        if (this.respuesta[i].serial_articulo == this.equiposLista[j].serial_articulo)

          this.respuesta.splice(idx, 1);

      }
    }
    this.listaTransferenciaService.aceptarTransferenciaConDetalles(this.respuesta, this.receptor, this.usuario.currentUser.id_user, this.TextoSelected)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      )

    this.modalRef3.hide();

    this.finalizar(template5)

  }

  aceptarDetalles2() {
    this.listaTransferenciaService.aceptarTransferenciaConDetalles(this.respuesta, this.receptor, this.usuario.currentUser.id_user, this.TextoSelected)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      )

    this.modalRef3.hide();
  }


  finalizar(template5: TemplateRef<any>) {
    this.modalRef4 = this.modalService.show(template5);
    this.listaTransferenciaService.aceptarTransferenciaConDetalles2(this.equiposLista, this.receptor, this.usuario.currentUser.id_user)
      .subscribe(
        res => console.log(res),
        err => {
          console.log(err)
          this.visualizar = false;
          this.mensajeA = true;
          this.TraerTransferencias(this.FiltroActivo);
        }
      )
  }

  negar() {

    this.visualizar = false;
    this.mensajeN = true;
    this.listaTransferenciaService.negarTransferencia(this.respuesta, this.emisor, this.usuario.currentUser.id_user)
      .subscribe(
        res => {
          console.log(res),
            this.TraerTransferencias(this.FiltroActivo);
        },
        err => console.log(err)
      )
    this.modalRef4.hide();
  }

  agregarEquipoLista(id_articulo: number, o: number) {
    console.log(o)
    this.respuesta.splice(o, 1);
    this.detallesArticuloService.obtenerData(id_articulo).subscribe(
      res => {
        this.equipo = res[0],
          this.id = res[0].id_articulo
        if (this.idLista.includes(this.id) == false) {
          this.equiposLista.push(this.equipo),
            this.idLista.push(this.id)
        } else {
          console.log("equipo ya en la lista");
        }
      },
      err => console.log(err))
  }

  eliminarEquipoLista(id_articulo: number, i: number) {
    this.equiposLista.splice(i, 1);
    this.idLista.splice(i, 1);
    this.detallesArticuloService.obtenerData(id_articulo).subscribe(
      res => {
        this.equipo = res[0],
          this.id = res[0].id_articulo
        this.respuesta.push(this.equipo)
      },
      err => console.log(err))


  }

  irAorden() {
    this.router.navigate(['/ordenTraslado', this.id_transferencia, this.FiltroActivo])
  }

  hola() {
    alert("hola");
  }

  atras() {
    this.router.navigate(['/zonas2'])
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openModal2(template2: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template2, this.config);

  }

  openModal3(template3: TemplateRef<any>) {
    this.modalRef3 = this.modalService.show(template3, this.config);
    this.modalRef2.hide();

  }

  openModal4(template4: TemplateRef<any>) {
    this.modalRef4 = this.modalService.show(template4, this.config);

  }

  openModal5(template5: TemplateRef<any>) {
    this.modalRef4 = this.modalService.show(template5);

  }

  openModal6(template6: TemplateRef<any>) {
    this.modalRef6 = this.modalService.show(template6);

  }
  openModal8(template8: TemplateRef<any>, id: number) {
    this.autorizacion = id
    this.modalRef8 = this.modalService.show(template8);
    if (this.usuario.currentUser.id_user == 87 || this.usuario.currentUser.id_user == 3 || this.usuario.currentUser.id_user == 10 || this.usuario.currentUser.id_user == 28 || this.usuario.currentUser.id_user == 39) {
      this.anuncio = 1
    } else {
      this.anuncio = 0
    }



  }
  Comentario(template6: TemplateRef<any>) {
    this.modalRef6 = this.modalService.show(template6);

    this.listaTransferenciaService.traerComentario(this.id_transferencia).subscribe(res => this.comentario = res[0].comentario, err => console.log(err));
  }

  BuscarLista(e) {


    if (e == "") {
      this.TraerTransferencias(this.FiltroActivo)
    } else {

      const result = this.transferencias.filter((el) =>
        el.nombre_user.toUpperCase().includes(e.toUpperCase())
      );

      const result2 = this.transferencias.filter((el) =>
        el.nombre_zona.toUpperCase().includes(e.toUpperCase())
      );
      const result3 = result.concat(result2)
      this.transferencias = result3;
    }

  }

  BuscarListaBackSpace(e) {
    const algo = this.transferencias2
    const result = algo.filter((el) =>
      el.nombre_user.toUpperCase().includes(e.toUpperCase())
    );

    const result2 = algo.filter((el) =>
      el.nombre_zona.toUpperCase().includes(e.toUpperCase())
    );
    const result3 = result.concat(result2)
    this.transferencias = result3;
  }



  negacion() {
    this.modalRef.hide();
  }
  negacion2() {
    this.modalRef2.hide();
  }
  negacion3() {
    this.modalRef3.hide();
  }
  negacion4() {
    this.modalRef4.hide();
  }

  negacion5() {
    this.modalRef5.hide();
  }


}
