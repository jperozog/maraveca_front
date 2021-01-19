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
  celdas:any = []
  servidores:any = []
  celda:string = ""
  mk:number = 0
  p:number = 1
  modalRef: BsModalRef;
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

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,this.config);
  }

  closeModal(){
    this.modalRef.hide()
    this.celda = ""
    this.mk = 0
  }

}
