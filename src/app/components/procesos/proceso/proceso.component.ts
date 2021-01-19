import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, RouteConfigLoadStart } from '@angular/router'
import { AuthGuard } from '../../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProcesosService } from '../../../services/procesos/procesos.service';
import {DescuentosService} from '../../../services/descuentos/descuentos.service'
import { TemporalType } from '@novalinc/datepicker';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css']
})
export class ProcesoComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  d:number = 1
  cargando: boolean = false
  cargando2: boolean = false
  fechasFacturacion: any = []
  facturacion: boolean = false
  correos: boolean = false
  descuentos: boolean = false
  listaDescuentos: any = []
  descuentoIndividual:number = 0
  constructor(private procesosService: ProcesosService,
    private descuentosService: DescuentosService,
    public usuario: AuthGuard,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.traerDatosFacturacion()
    this.traerDescuentos()
  }

  traerDatosFacturacion() {
    this.procesosService.traerDatosFacturacion().subscribe(res => this.fechasFacturacion = res, err => console.log(err))
  }

  traerDescuentos(){
    this.descuentosService.traerDescuentos().subscribe(res=>{console.log(res),this.listaDescuentos = res},err=>console.log(err))
  }

  hola(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template)
  }

  confirmar(template2: TemplateRef<any>) {
    this.cargando = true
    this.modalRef.hide()
    this.procesosService.procesoFacturacion().subscribe(
      res => {
        console.log(res),
          this.cargando = false
        this.modalRef2 = this.modalService.show(template2)
        this.ngOnInit()
      },
      err => console.log(err))
  }

  negar() {
    this.modalRef.hide();
  }

  mostrarFacturacion() {
    this.facturacion = !this.facturacion
    this.correos = false
    this.descuentos = false
  }

  mostrarCorreos() {
    this.correos = !this.correos
    this.facturacion = false
    this.descuentos = false
  }

  mostrarDescuentos() {
    this.descuentos = !this.descuentos
    this.facturacion = false
    this.correos = false
  }


  enviarCorreo(template3: TemplateRef<any>) {
    this.cargando2 = true
    this.procesosService.procesoCorreos().subscribe(
      res => {
        console.log(res),
          this.cargando2 = false
        this.modalRef2 = this.modalService.show(template3)
        this.ngOnInit()
      },
      err => console.log(err))
  }


  OperacionesDescuento(id:number,status:number,template4: TemplateRef<any>){
    if(status == 0){
      this.descuentoIndividual = id
    this.modalRef3 = this.modalService.show(template4)
    }
  }


  aprobar(){
    this.descuentosService.aprobarDescuentos(this.descuentoIndividual).subscribe(res=>console.log(res),err=>console.log(err))
   
  }

  cancelar(){
    this.descuentosService.cancelarDescuentos(this.descuentoIndividual).subscribe(res=>console.log(res),err=>console.log(err))
   
  }


}
