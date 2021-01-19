import { Component, OnInit, TemplateRef } from '@angular/core';
import {OltService} from '../../services/olt/olt.service';
import {MangaEmpalmeService} from '../../services/manga-empalme/manga-empalme.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {CajaDistribucionService} from '../../services/caja-distribucion/caja-distribucion.service'

@Component({
  selector: 'app-caja-distribucion',
  templateUrl: './caja-distribucion.component.html',
  styleUrls: ['./caja-distribucion.component.css']
})
export class CajaDistribucionComponent implements OnInit {

  mangas:any = []
  cajas:any = []
  cajaDistribucion: string = ""
  cajaSeleccionada: any
  puertos:number = 0
  olt:number = 0
  servidores:any = []
  manga:number = 0
  mk:number = 0
  p:number = 1
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  zonas: any = []
  zona:number = 0
  constructor(private cajaServices:CajaDistribucionService ,private modalService: BsModalService,private mangaService: MangaEmpalmeService) { }

  ngOnInit() {
    this.traerCajasDistribucion()
    this.traerMangasEmpalme()
    this.traerZonas()
  }

  traerZonas(){
    this.cajaServices.traerZonas().subscribe(res=>{console.log(res), this.zonas = res},err=>console.log(err))
  }

  traerCajasDistribucion(){
    this.cajaServices.traerCajaDistribucion().subscribe(res=>{console.log(res),this.cajas = res }, err=>console.log(err))
  }

  traerMangasEmpalme(){
    this.mangaService.traerMangaEmpalme().subscribe(res=>{console.log(res),this.mangas = res}, err=>console.log(err))
  }
  
  
  agregarCajaDistribucion(){
    this.cajaServices.guardarCajaDistribucion(this.cajaDistribucion,this.manga,this.puertos,this.zona).subscribe(res=>{this.traerMangasEmpalme(),this.closeModal(),console.log(res)},err=>console.log(err))
  }
  
  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,this.config);
  }

  openModal2(template: TemplateRef<any>, id: number) {
    this.modalRef2 = this.modalService.show(template, this.config);

    this.cajas.forEach(element => {
      if (element.id_caja == id) {
        this.cajaSeleccionada = element
      }
    });

    console.log(this.cajaSeleccionada)
  }

  editarCaja() {
    this.cajaServices.editarCaja(this.cajaSeleccionada).subscribe(
      res => {
        this.modalRef2.hide()
        this.ngOnInit()
      },
      err => console.log(err))

  }

  algo(id:number){
    console.log(id)
  }

  closeModal(){
    this.modalRef.hide()
    this.cajaDistribucion = ""
    this.manga = 0
    this.puertos = 0
  }
}
