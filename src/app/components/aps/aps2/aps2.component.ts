import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApsService } from '../../../services/aps/aps.service';
import { CeldasService } from '../../../services/celdas/celdas.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ClassField } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-aps2',
  templateUrl: './aps2.component.html',
  styleUrls: ['./aps2.component.css']
})
export class Aps2Component implements OnInit {
  apSeleccionada: any
  aps: any = []
  ap: string = ""
  celdas: any = []
  celda: number = 0
  usuario: string = ""
  ip: string = ""
  clave: string = ""
  p: number = 1
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(private apsService: ApsService, private modalService: BsModalService, private celdaService: CeldasService) { }

  ngOnInit() {
    this.traerAps();
    this.traerCeldas();
  }

  traerAps() {
    this.apsService.traerAps().subscribe(res => this.aps = res, err => console.log(err))
  }

  traerCeldas() {
    this.celdaService.traerCeldas().subscribe(res => { this.celdas = res, console.log(res) }, err => console.log(err))
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openModal2(template: TemplateRef<any>, id: number) {
    this.modalRef2 = this.modalService.show(template, this.config);

    this.aps.forEach(element => {
      if (element.id == id) {
    this.apSeleccionada = element
  }
    });

      console.log(this.apSeleccionada)
    
  }

  agregarAps() {
    this.apsService.guardarAp(this.ap, this.ip, this.usuario, this.clave, this.celda)
      .subscribe(
        res => {
          console.log(res),
            this.closeModal()
        },
        err => console.log(err))
  }

  editarAp() {
    this.apsService.editarAp(this.apSeleccionada).subscribe(
      res => {
     
        this.modalRef2.hide()
        this.ngOnInit()
      },
      err => console.log(err))

  }

  closeModal() {
    this.ap = ""
    this.ip = ""
    this.usuario = ""
    this.clave = ""
    this.celda = 0
    this.modalRef.hide()
  }

  closeModal2(){
    this.ap = ""
    this.ip = ""
    this.usuario = ""
    this.clave = ""
    this.celda = 0
    this.modalRef2.hide()
  }

}
