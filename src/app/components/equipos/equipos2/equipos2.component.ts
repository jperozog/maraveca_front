import { Component, OnInit, TemplateRef } from '@angular/core';
import {EquiposService} from '../../../services/equipos/equipos.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-equipos2',
  templateUrl: './equipos2.component.html',
  styleUrls: ['./equipos2.component.css']
})
export class Equipos2Component implements OnInit {
  equipos:any = []
  tipos:any = []
  nombre:string =""
  nombreCategoria:string = ""
  tipo:number=0
  p:number = 1
  e:number = 1
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(private equiposServices:EquiposService, private modalService: BsModalService,) { }

  ngOnInit() {
    this.traerEquipos()
    this.traerTipos()
  }

  traerEquipos(){
    this.equiposServices.traerEquipos().subscribe(res=>{console.log(res),this.equipos = res}, err=>console.log(err))
  }

  
  traerTipos(){
    this.equiposServices.traerTiposEquipos().subscribe(res=>{console.log(res),this.tipos = res}, err=>console.log(err))
  }

  agregarEquipo(){
    this.equiposServices.agregarEquipo(this.nombre,this.tipo).subscribe(res=>{console.log(res),this,this.traerEquipos(),this.closeModal()}, err=>console.log(err))
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,this.config);
  }

  openModal2(template2: TemplateRef<any>){
    this.modalRef2 = this.modalService.show(template2,this.config);
  }

  agregarCategoria(){
    this.equiposServices.agregarCategoria(this.nombreCategoria).subscribe(res=>this.traerTipos(), err=>console.log(err))
    this.closeModal2()
  }

  closeModal(){
    this.modalRef.hide()
    this.nombre = ""
    this.tipo = 0
  }

  closeModal2(){
    this.modalRef2.hide()
    this.nombreCategoria = ""
  }


}
