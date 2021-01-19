import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdenTrasladoService } from '../../../services/Inventario/orden-traslado.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-pdf-traslado',
  templateUrl: './pdf-traslado.component.html',
  styleUrls: ['./pdf-traslado.component.css']
})
export class PdfTrasladoComponent implements OnInit {

  id_traslado: number;
  filtro: number;
  id_chofer: string;
  nombre_chofer: string;
  cedula: string;
  vehiculo: string;
  color: string;
  placa: string;
  ano: number;
  equipos: any = [];
  contador: number = 0
  serialCaja: string = ""
  desde:string = ""
  hasta:string = ""


  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private ordenTrasladoService: OrdenTrasladoService) { }

  ngOnInit() {

    this.id_traslado = this.activateRoute.snapshot.params.id_traslado
    console.log(this.id_traslado)
    console.log(this.filtro)


    this.traerDatos();

  }

  traerDatos() {
    this.ordenTrasladoService.traerDatosTraslado(this.id_traslado)
      .subscribe(
        res => {
          console.log(res),
            this.equipos = res
            this.contador = res[0].contador,
            this.id_chofer = res[0].chofer,
            this.cedula = res[0].cedula,
            this.vehiculo = res[0].marca+" "+res[0].modelo,
            this.color = res[0].color,
            this.placa = res[0].placa,
            this.ano = res[0].anio
            this.serialCaja =res[0].serial_caja
            this.desde = res[0].desde
            this.hasta = res[0].hasta
        },
        err => console.log(err))
  }

  pdf() {
    const opciones = {
      margin: [5, 0, 30, 0],
      filename: "Orden de Traslado",
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

  atras() {
    this.router.navigate(['/soporteTraslado'])
  }
}
