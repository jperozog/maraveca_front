import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdenTrasladoService } from '../../../services/Inventario/orden-traslado.service';
import * as html2pdf from 'html2pdf.js';
import { PagoComisionesService } from '../../../services/pago-comisiones/pago-comisiones.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-pdf-comisiones',
  templateUrl: './pdf-comisiones.component.html',
  styleUrls: ['./pdf-comisiones.component.css']
})
export class PdfComisionesComponent implements OnInit {

  user: number
  mes: number
  anio: number
  instalaciones: any = []


  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private pagoComisiones: PagoComisionesService,
    public snackBar: MdSnackBar) { }

  ngOnInit() {

    this.user = this.activateRoute.snapshot.params.userSeleccionado
    this.mes = this.activateRoute.snapshot.params.mesSeleccionado
    this.anio = this.activateRoute.snapshot.params.anioSeleccionado
    console.log(this.user)
    console.log(this.mes)
    console.log(this.anio)
    this.verDetalles()
  }

  verDetalles() {


    this.pagoComisiones.traerInstalacionUser(this.user, this.mes, this.anio).subscribe(
      res => {
        console.log(res),
          this.instalaciones = res['facturas'],
          this.snackBar.open("Comisiones Cargadas", null, {
            duration: 2000,
          });
      },
      err => console.log(err))
  }

  atras() {
    this.router.navigate(['/pagar_comisiones'])
  }

  pdf() {
    const opciones = {
      margin: [8, 0, 20, 0],
      filename: "Comisiones",
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        bottom: 20
      },
      pagebreak: { mode: ['css'] },
      jsPDF: {
        unit: 'mm',
        orientation: 'portrait',
      }
    };

    const contenido = document.getElementById('pdf');

    html2pdf()
      .from(contenido)
      .set(opciones)
      .save();
  }
}
