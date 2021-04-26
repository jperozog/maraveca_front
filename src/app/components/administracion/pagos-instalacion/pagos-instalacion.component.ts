import { Component, OnInit, TemplateRef } from '@angular/core';
import { VentasService } from '../../../services/ventas/ventas.service'
import jsPDF from 'jspdf';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';




@Component({
  selector: 'app-pagos-instalacion',
  templateUrl: './pagos-instalacion.component.html',
  styleUrls: ['./pagos-instalacion.component.css']
})
export class PagosInstalacionComponent implements OnInit {
  p: number = 1
  pagosInsta: any = []
  id_pago: number = 0
  estatus: number = 0
  modalRef: BsModalRef;

  constructor(
    private ventasService: VentasService,
    private modalService: BsModalService

  ) {
    
   }

  ngOnInit() {
    this.traerPagosInst()
  }

  opciones(id: number, status: number, template: TemplateRef<any>) {
    if (status == 0) {
      this.id_pago = id
      this.estatus = status
      this.modalRef = this.modalService.show(template)
    }
  }

  procesarPago(id: number, status:number){
    this.id_pago = id
    this.estatus = status
    this.ventasService.updatePagoInstalacion(this.id_pago, this.estatus).subscribe(res => console.log(res), err => console.log(err))
    this.ngOnInit()
  }

  public downloadPDF(): void {
    const doc = new jsPDF();

    doc.text('Soporte de pago', 10, 10);
    doc.save('recibo.pdf');
  }

  traerPagosInst(){
    this.ventasService.traerPagoInstalaciones().subscribe(res => this.pagosInsta = res, err => console.log(err))
    console.log(this.pagosInsta);
  }


}
