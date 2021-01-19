import { Component, OnInit, TemplateRef } from '@angular/core';
import { FactibilidadesService } from '../../../services/factibilidades/factibilidades.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthGuard } from '../../../_guards/index';


@Component({
  selector: 'app-factibilidad',
  templateUrl: './factibilidad.component.html',
  styleUrls: ['./factibilidad.component.css']
})
export class FactibilidadComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  idFac: number = 0
  nombreCliente: string = ""
  apellidoCliente: string = ""
  coorLatCliente: string = ""
  coorLonCliente: string = ""
  ciudadCliente: string = ""
  celdaCliente: string = ""
  equipoCliente: string = ""
  alturaCliente: string = ""
  usuarioCliente: string = ""
  statusCliente: number
  factibleCliente: number
  ptpCliente: string = ""
  factibilidades: any = []
  factibilidades2: any = []
  e: number = 1
  existe: number
  equipos: any = []
  celdas: any = []
  equipo: number = 0
  celda: number = 0
  altura: number = 0
  ptp: number = 0
  estado: number = 0
  editar: boolean = false
  constructor(
    private factibilidadService: FactibilidadesService,
    private snackBar: MdSnackBar,
    private modalService: BsModalService,
    private usuario: AuthGuard) { }

  ngOnInit() {
    if (this.usuario.perm && this.usuario.perm.includes('factibilidades_w')) {
      this.traerData()
    } else {
      this.traerData2()
    }
    this.traerEquipos()
    this.traerCeldas()
  }

  traerData() {
    this.factibilidadService.traerData(this.usuario.currentUser.id_user).subscribe(
      res => {
        this.factibilidades = res,
          this.factibilidades2 = res,
          this.e = 1
        this.snackBar.open("Factibilidades Cargadas", null, {
          duration: 2000,
        });
      },
      err => console.log(err))
  }

  traerData2() {
    this.factibilidadService.traerData2(this.usuario.currentUser.id_user).subscribe(
      res => {
        this.factibilidades = res,
          this.factibilidades2 = res,
          this.e = 1
        this.snackBar.open("Factibilidades Cargadas", null, {
          duration: 2000,
        });
      },
      err => console.log(err))
  }

  traerEquipos() {
    this.factibilidadService.traerEquiposFac().subscribe(res => this.equipos = res, err => console.log(err))
  }

  traerCeldas() {
    this.factibilidadService.traerCeldasFac().subscribe(res => this.celdas = res, err => console.log(err))
  }

  buscarFact(e) {
    if (e == "") {
      this.traerData()
    } else {
      const result = this.factibilidades.filter((el) =>
        el.nombre.toUpperCase().includes(e.toUpperCase())
      );

      const result2 = this.factibilidades.forEach(el => {
        if (el.social === null || el.social === "null") {

        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase())) {
            result.push(el)
          }
        }
      });

      this.factibilidades = result;
    }
  }

  BuscarFactBackSpace(e) {
    const algo = this.factibilidades2
    const result = algo.filter((el) =>
      el.nombre.toUpperCase().includes(e.toUpperCase())
    );

    const result2 = this.factibilidades2.forEach(el => {
      if (el.social === null || el.social === "null") {

      } else {
        if (el.social.toUpperCase().includes(e.toUpperCase())) {
          result.push(el)
        }
      }
    });

    this.factibilidades = result;
    
  }

  actualizarFact() {
    if (this.usuario.perm && this.usuario.perm.includes('factibilidades_w')) {
      this.traerData()
    } else {
      this.traerData2()
    }
  }

  guardarData() {
    this.factibilidadService.guardarFac(this.idFac, this.estado, this.equipo, this.celda, this.altura, this.ptp, this.usuario.currentUser.id_user).subscribe(
      res =>{
        if (this.usuario.perm && this.usuario.perm.includes('factibilidades_w')) {
          this.traerData()
        } else {
          this.traerData2()
        }
      },
        err => console.log(err))
    this.ocultarModal()
  }

  editarData() {

    this.factibilidadService.editarFac(this.idFac, this.estado, this.equipo, this.celda, this.altura, this.ptp, this.usuario.currentUser.id_user).subscribe(
      res =>{
        if (this.usuario.perm && this.usuario.perm.includes('factibilidades_w')) {
          this.traerData()
        } else {
          this.traerData2()
        }
      },
        err => console.log(err))
    this.ocultarModal()

  }

  openModal(id: number, template: TemplateRef<any>) {

    const idFac = this.factibilidades.filter((el) =>
      el.id == id
    );
    console.log(idFac)
    this.nombreCliente = idFac[0].nombre
    this.apellidoCliente = idFac[0].apellido
    this.coorLatCliente = idFac[0].coordenadaslat
    this.coorLonCliente = idFac[0].coordenadaslon
    this.ciudadCliente = idFac[0].ciudad
    this.factibleCliente = idFac[0].factible
    this.idFac = idFac[0].id
    this.statusCliente = idFac[0].status
    this.modalRef = this.modalService.show(template, this.config);

    this.factibilidadService.traerDetallesFac(this.idFac).subscribe(
      res => {
        this.existe = res["existe"],
          this.celdaCliente = res["celda"],
          this.equipoCliente = res["equipo"],
          this.ptpCliente = res["ptp"],
          this.alturaCliente = res["altura"],
          this.usuarioCliente = res["usuario"],
          console.log(this.existe)
      }
      , err => console.log(err))

  }

  openModal2(id: number, template2: TemplateRef<any>) {

    const idFac = this.factibilidades.filter((el) =>
      el.id == id
    );
    this.nombreCliente = idFac[0].nombre
    this.apellidoCliente = idFac[0].apellido
    this.coorLatCliente = idFac[0].coordenadaslat
    this.coorLonCliente = idFac[0].coordenadaslon
    this.ciudadCliente = idFac[0].ciudad
    this.idFac = idFac[0].id
    this.modalRef2 = this.modalService.show(template2, this.config);

    this.factibilidadService.traerDetallesFac(this.idFac).subscribe(
      res => {
        this.existe = res["existe"],
          this.celdaCliente = res["celda"],
          this.equipoCliente = res["equipo"],
          this.alturaCliente = res["altura"],
          this.usuarioCliente = res["usuario"],
          console.log(this.existe)
      }
      , err => console.log(err))

  }

  ocultarModal() {
    this.nombreCliente = ""
    this.apellidoCliente = ""
    this.coorLatCliente = ""
    this.coorLonCliente = ""

    this.equipo = 0
    this.celda = 0
    this.altura = 0
    this.estado = 0
    this.ptp = 0
    this.modalRef.hide();
    this.editar = false
  }

  ocultarModal2() {
    this.nombreCliente = ""
    this.apellidoCliente = ""
    this.coorLatCliente = ""
    this.coorLonCliente = ""

    this.equipo = 0
    this.celda = 0
    this.altura = 0
    this.estado = 0
    this.modalRef2.hide();
  }

  editarEstado() {
    this.editar = true
  }

  estadoFact() {
    console.log(this.estado)
    this.equipo = 0
    this.celda = 0
    this.altura = 0
  }

}
