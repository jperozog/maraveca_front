import { Component, OnInit, TemplateRef } from '@angular/core';
import {OltService} from '../../services/olt/olt.service';
import {MangaEmpalmeService} from '../../services/manga-empalme/manga-empalme.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-manga-empalme',
  templateUrl: './manga-empalme.component.html',
  styleUrls: ['./manga-empalme.component.css']
})
export class MangaEmpalmeComponent implements OnInit {

  mangas:any = []
  olts:any = []
  puertos:any = []
  olt:number = 0
  servidores:any = []
  mangaEmpalme:string = ""
  mangaSeleccionada: any
  mk:number = 0
  p:number = 1
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(private oltService:OltService ,private modalService: BsModalService,private mangaService: MangaEmpalmeService) { }

  ngOnInit() {
    this.traerMangasEmpalme()
    this.traerOLT()
  }

  traerMangasEmpalme(){
    this.mangaService.traerMangaEmpalme().subscribe(res=>{console.log(res),this.mangas = res}, err=>console.log(err))
  }
  /*
  buscarPuertoOlt(){
   this.mangaService.traerPuertosOlt(this.olt).subscribe(res=>{this.puertos = res, console.log(res)}, err=>console.log(err))
  }
  */
  traerOLT(){
    this.oltService.traerOlts().subscribe(res=>{console.log(res), this.olts = res}, err=>console.log(err))
  } 
  
  agregarMangaEmpalme(){
    this.mangaService.guardarMangaEmpalme(this.mangaEmpalme,this.olt).subscribe(res=>{this.traerMangasEmpalme(),this.closeModal(),console.log(res)},err=>console.log(err))
  }
  
  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,this.config);
  }

  openModal2(template: TemplateRef<any>, id: number) {
    this.modalRef2 = this.modalService.show(template, this.config);

    this.mangas.forEach(element => {
      if (element.id_manga == id) {
        this.mangaSeleccionada = element
      }
    });

    console.log(this.mangaSeleccionada)
  }

  algo(id:number){
    console.log(id)
  }

  editarManga() {
    this.mangaService.editarManga(this.mangaSeleccionada).subscribe(
      res => {
        this.modalRef2.hide()
        this.ngOnInit()
      },
      err => console.log(err))

  }

  closeModal(){
    this.modalRef.hide()
    this.mangaEmpalme = ""
    this.olt = 0
    this.puertos = 0
  }

}
