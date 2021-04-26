import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../../services/ventas/ventas.service'
import jsPDF from 'jspdf';



@Component({
  selector: 'app-pagos-instalacion',
  templateUrl: './pagos-instalacion.component.html',
  styleUrls: ['./pagos-instalacion.component.css']
})
export class PagosInstalacionComponent implements OnInit {
  p: number = 1
  pagosInsta: any = []

  constructor(
    private ventasService: VentasService
  ) {
    this.downloadPDF();
   }

  ngOnInit() {
    this.traerPagosInst()
  }

  public downloadPDF(): void {
    const doc = new jsPDF();

    doc.text('Hello world!', 10, 10);
    doc.save('hello-world.pdf');
  }

  traerPagosInst(){
    this.ventasService.traerPagoInstalaciones().subscribe(res => this.pagosInsta = res, err => console.log(err))
    console.log(this.pagosInsta);
  }

}
