import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthGuard } from '../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { ComisionesVendedoresService } from '../../services/comisiones-vendedores/comisiones-vendedores.service'

@Component({
  selector: 'app-comisiones-vendedores',
  templateUrl: './comisiones-vendedores.component.html',
  styleUrls: ['./comisiones-vendedores.component.css']
})
export class ComisionesVendedoresComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  config2 = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'gray modal-lg'
  };

  cantidadPago: number = 0
  fechaPago: string = ""
  tipoPagoSelected: number = 0
  mesSeleccionado: number = 0
  anioSeleccionado: number = 0
  vendedorSeleccionado: number = 0
  vendedores: any = []
  comisionesVendedor: any = []
  pagosVendedor: any = []
  e: number = 1
  p: number = 1
  visualizar: boolean = false
  constructor(
    public usuario: AuthGuard,
    public snackBar: MdSnackBar,
    private modalService: BsModalService,
    private comisionesVService: ComisionesVendedoresService) { }

  ngOnInit() {
    this.traerVendedores()
  }

  traerVendedores() {
    this.comisionesVService.traerVendedores().subscribe(res => { console.log(res), this.vendedores = res }, err => console.log(err))
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openModal2(template2: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template2, this.config2);
  }

  cambioTipoPago(){
    this.cantidadPago = 0
  }

  verDetalles() {
    this.comisionesVService.pagosRealizados(this.mesSeleccionado, this.anioSeleccionado, this.vendedorSeleccionado).subscribe(res => this.pagosVendedor = res, err => console.log(err))
    this.comisionesVService.traerComisionesVendedor(this.mesSeleccionado, this.anioSeleccionado, this.vendedorSeleccionado)
      .subscribe(
        res => {
          console.log(res),
            this.comisionesVendedor = res,
            this.visualizar = true
          let contadorD = 0, contadorP = 0, contadorT = 0, contadorPA = 0
          let contadorDBs = 0, contadorPBs = 0, contadorTBs = 0, contadorPABs = 0


          this.comisionesVendedor.forEach(element => {
            if (element["serial_det"] == "0") {
              if (element["tasa_insta"] > 0) {
                element["porcentajeComisionBs"] = 10 * element["tasa_insta"]
                element["porcentajeComision"] = 0
              } else {
                element["porcentajeComision"] = 10
                element["porcentajeComisionBs"] = 0
              }
            } else {
              if (element["tasa_insta"] > 0) {
                element["porcentajeComisionBs"] = 20 * element["tasa_insta"]
                element["porcentajeComision"] = 0
              } else {
                element["porcentajeComision"] = 20
                element["porcentajeComisionBs"] = 0
              }
            }
          });

          this.pagosVendedor.forEach(element =>
            element.tipo_pago_comision == 1 ? contadorPA += element.monto : contadorPABs += element.monto );

          this.comisionesVendedor.forEach(element => {
            contadorT = element.porcentajeComision + contadorT
            contadorTBs = element.porcentajeComisionBs + contadorTBs

            if (element.estadoComision == 1 && element.status_insta == 4) {
              contadorD += element.porcentajeComision
              contadorDBs += element.porcentajeComisionBs
            } else {
              contadorP += element.porcentajeComision
              contadorPBs += element.porcentajeComisionBs
            }
          });

          this.comisionesVendedor["cantidadTodalD"] = contadorD - contadorPA
          this.comisionesVendedor["cantidadTodalP"] = contadorP
          this.comisionesVendedor["cantidadTodalT"] = contadorT
          this.comisionesVendedor["cantidadTodalPA"] = contadorPA

          this.comisionesVendedor["cantidadTodalDBs"] = contadorDBs - contadorPABs
          this.comisionesVendedor["cantidadTodalPBs"] = contadorPBs
          this.comisionesVendedor["cantidadTodalTBs"] = contadorTBs
          this.comisionesVendedor["cantidadTodalPABs"] = contadorPABs

        },
        err => console.log(err))
  }

  realizarPago() {
    this.comisionesVService.realizarPagoComision(this.tipoPagoSelected,this.cantidadPago, this.fechaPago, this.vendedorSeleccionado, this.usuario.currentUser.id_user)
      .subscribe(res => this.closeModal(), err => console.log(err))
  }

  closeModal() {
    this.verDetalles()
    this.cantidadPago = 0
    this.fechaPago = ""
    this.modalRef.hide()
  }
  closeModal2() {
    this.verDetalles()
    this.modalRef.hide()
  }

}
