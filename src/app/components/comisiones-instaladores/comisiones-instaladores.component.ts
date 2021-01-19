import { Component, OnInit,TemplateRef } from '@angular/core';
import { AuthGuard } from '../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import {ComisionesInstaladoresService} from '../../services/comisiones-instaladores/comisiones-instaladores.service'

@Component({
  selector: 'app-comisiones-instaladores',
  templateUrl: './comisiones-instaladores.component.html',
  styleUrls: ['./comisiones-instaladores.component.css']
})
export class ComisionesInstaladoresComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  cuota: number = 0
  mesSeleccionado: number = 0
  anioSeleccionado:number = 0
  instaladorSeleccionado:number = 0
  instaladores: any = []
  comisionesInstalador: any =  []
  comisionesInstaladorMi: any =  []
  comisionesInstaladorMu: any =  []
  e:number = 1
  m:number = 1
  visualizar: boolean = false
  comisionesTotales: number = 0
  constructor(
                public usuario: AuthGuard,
                public snackBar: MdSnackBar,
                private modalService: BsModalService,
                
                private comisionesIService: ComisionesInstaladoresService) { }

  ngOnInit() {
    this.traerVendedores()
  }

  traerVendedores(){
    this.comisionesIService.traerInstaladores().subscribe(res=>{console.log(res),this.instaladores = res}, err=>console.log(err))
  }

  verDetalles(){
    this.comisionesIService.traerComisionesInstalador(this.mesSeleccionado,this.anioSeleccionado,this.instaladorSeleccionado)
    .subscribe(
      res=>
      {
        console.log(res),
        this.comisionesInstalador = res["comisiones"],
        this.comisionesInstaladorMi = res["comisionesMi"],
        this.comisionesInstaladorMu = res["comisionesMu"],
        this.visualizar = true

        this.comisionesInstalador.forEach(e => {
          this.comisionesTotales = this.comisionesTotales + e.montoCuota
        });

        this.comisionesInstaladorMi.forEach(e => {
          this.comisionesTotales = this.comisionesTotales + e.montoCuota
        });

        this.comisionesInstaladorMu.forEach(e => {
          this.comisionesTotales = this.comisionesTotales + e.montoCuota
        });

      },
       err=>console.log(err))
  }

  guardarCuota(){
    this.comisionesIService.guardarCuota(this.cuota,this.instaladorSeleccionado).subscribe(
      res=>{this.ngOnInit(),this.closeModal()},
      err=>console.log(err)
      )
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  closeModal(){
    this.modalRef.hide()
  }

}
