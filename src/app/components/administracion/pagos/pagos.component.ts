import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from '../../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {CargarPagosService} from '../../../services/administrativo/cargar-pagos.service'

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  p:number = 1
  e:number = 1
  pendientes:any = []
  detalles:any = []
  detalles2:any = []
  estatusCierre:number
  id_cierre : number
  visualizar:boolean = false
  mensajeN:boolean=false
  mensajeA:boolean=false
  mensajeAu:boolean=false
  cantidadEfectivo:number
  cantidadNacionales:number
  cantidadZelle:number
  constructor(private router: Router, private modalService: BsModalService,private cargaPagos:CargarPagosService) { }

  ngOnInit() {
    this.traerCierresPendientes();
  }

  atras(){
    this.router.navigate(['/administrativo'])
    }

  traerCierresPendientes(){
    this.cargaPagos.traerCierresPendientes().subscribe(res=>{console.log(res),this.pendientes = res}, err=>console.log(err))
  }  

  verDetalles(id:number, nombre:string, apellido:string){
      this.id_cierre = id
      console.log(nombre+" "+apellido)
      this.visualizar = true

      this.cargaPagos.traerDetallesCierre(id).subscribe(
        res=>
        {
          console.log(res),
          this.detalles = res
          this.detalles2 = res
          this.estatusCierre = res[0].estatus
        }
        ,
        err=>console.log(err))

      this.cargaPagos.traerEfectivoCierre(id).subscribe(res=>this.cantidadEfectivo = res[0].suma,err=>console.log(err));

      this.cargaPagos.traerNacionalesCierre(id).subscribe(res=>this.cantidadNacionales = res[0].suma,err=>console.log(err));

      this.cargaPagos.traerZelleCierre(id).subscribe(res=>this.cantidadZelle = res[0].suma,err=>console.log(err));
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  openModal2(template2: TemplateRef<any>){
    this.modalRef2 = this.modalService.show(template2);
  }

  onSearchMovimiento(e: string): void {
   const filtro = []
   this.detalles.forEach(element => {
      if (element.nombreCliente.toUpperCase().includes(e.toUpperCase())) {
          filtro.push(element)
      }
   });

   this.detalles = filtro
  }

  onSearchMoviemientoBackSpace(e: string){
    const filtro = []
    this.detalles2.forEach(element => {
      if (element.nombreCliente.toUpperCase().includes(e.toUpperCase())) {
          filtro.push(element)
      }
   });

   this.detalles = filtro
  }


  confirmar(){
    console.log(this.detalles)
    this.cargaPagos.confimarCierre(this.detalles).subscribe(res=>console.log(res),err=>console.log(err))
    this.traerCierresPendientes();
    this.visualizar = false;
    this.modalRef.hide()
  }

  cancelar(){
    console.log(this.detalles)
    this.cargaPagos.cancerlarCierre(this.detalles).subscribe(res=>console.log(res),err=>console.log(err))
    this.traerCierresPendientes();
    this.visualizar = false;
    this.modalRef2.hide()
  }

}
