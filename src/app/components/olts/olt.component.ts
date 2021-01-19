import { Component, OnInit, TemplateRef } from '@angular/core';
import { CeldasService } from '../../services/celdas/celdas.service';
import { OltService } from '../../services/olt/olt.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-olt',
  templateUrl: './olt.component.html',
  styleUrls: ['./olt.component.css']
})
export class OltComponent implements OnInit {

  olts: any = []
  servidores: any = []
  olt: string = ""
  oltSeleccionada: any
  puertos: number = 0
  mk: number = 0
  p: number = 1
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(private celdaService: CeldasService, private modalService: BsModalService, private oltService: OltService) { }

  ngOnInit() {
    this.traerOlts()
    this.traerMk()
  }

  traerOlts() {
    this.oltService.traerOlts().subscribe(res => { console.log(res), this.olts = res }, err => console.log(err))
  }

  traerMk() {
    this.celdaService.traerMk().subscribe(res => { console.log(res), this.servidores = res }, err => console.log(err))
  }

  agregarOlt() {
    this.oltService.guardarOlt(this.olt, this.mk, this.puertos).subscribe(res => { this.traerOlts(), this.closeModal(), console.log(res) }, err => console.log(err))
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openModal2(template: TemplateRef<any>, id: number) {
    this.modalRef2 = this.modalService.show(template, this.config);

    this.olts.forEach(element => {
      if (element.id_olt == id) {
        this.oltSeleccionada = element
      }
    });

    console.log(this.oltSeleccionada)
  }

  editarOlt() {
    this.oltService.editarOlt(this.oltSeleccionada).subscribe(
      res => {
        this.modalRef2.hide()
        this.ngOnInit()
      },
      err => console.log(err))

  }

  closeModal() {
    this.modalRef.hide()
    this.olt = ""
    this.mk = 0
    this.puertos = 0
  }

  closeModal2(){
    this.modalRef2.hide()
    this.olt = ""
    this.mk = 0
    this.puertos = 0
  }

}
