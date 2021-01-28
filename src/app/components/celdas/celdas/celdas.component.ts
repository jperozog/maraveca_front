import { Component, OnInit, TemplateRef } from '@angular/core';
import {CeldasService} from '../../../services/celdas/celdas.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-celdas',
  templateUrl: './celdas.component.html',
  styleUrls: ['./celdas.component.css']
})
export class Celdas2Component implements OnInit {
  celdaSeleccionada: any
  celdas:any = []
  servidores:any = []
  celda:string = ""
  mk:number = 0
  p:number = 1
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(private celdaService:CeldasService ,private modalService: BsModalService) { }

  ngOnInit() {
    this.traerCeldas()
    this.traerMk()
  }

  traerCeldas(){
    this.celdaService.traerCeldas().subscribe(res=>{console.log(res),this.celdas= res}, err=>console.log(err))
  }

  traerMk(){
    this.celdaService.traerMk().subscribe(res=>{console.log(res), this.servidores = res}, err=>console.log(err))
  } 

  agregarCelda(){
    this.celdaService.guardarCelda(this.celda,this.mk).subscribe(res=>{this.traerCeldas(),this.closeModal(),console.log(res)},err=>console.log(err))
  }

  editarCelda(){
    this.celdaService.editarCelda(this.celdaSeleccionada).subscribe(res => {this.modalRef2.hide(),this.ngOnInit()},err => console.log(err))
      this.closeModal2()
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,this.config);
  }

  openModal2(template: TemplateRef<any>, id: number) {
    this.modalRef2 = this.modalService.show(template, this.config);

    this.celdas.forEach(element => {
      if (element.id_celda == id) {
        this.celdaSeleccionada = element
      }
    });
      
      console.log(this.celdaSeleccionada)
    
  }

  closeModal(){
    this.modalRef.hide()
    this.celda = ""
    this.mk = 0
  }

  closeModal2(){
    this.modalRef2.hide()
    this.celda = ""
    this.mk = 0
  }

}
