import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdenTrasladoService } from '../../../services/Inventario/orden-traslado.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-orden-traslado',
  templateUrl: './orden-traslado.component.html',
  styleUrls: ['./orden-traslado.component.css']
})
export class OrdenTrasladoComponent implements OnInit {

  id_transferencia: number;
  filtro: number;
  id_chofer: number;
  nombre_chofer: string;
  cedula: string;
  vehiculo: string;
  color: string;
  placa: string;
  ano: number;
  equipos: any = [];
  contador: number = 0
  serialCaja: string = ""
  zonaDesde:string = ""
  zonaHacia: string = ""


  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private ordenTrasladoService: OrdenTrasladoService) { }

  ngOnInit() {

    this.id_transferencia = this.activateRoute.snapshot.params.id_transferencia
    this.filtro = this.activateRoute.snapshot.params.filtro
    console.log(this.id_transferencia)
    console.log(this.filtro)


    this.traerDatos();

  }

  traerDatos() {
    this.ordenTrasladoService.traerDatos(this.id_transferencia,this.filtro)
      .subscribe(
        res => {
          console.log(res),
            this.equipos = res
            this.contador = res[0].contador,
          this.id_chofer = res[0].chofer,
            this.cedula = res[0].cedula,
            this.vehiculo = res[0].vehiculo,
            this.color = res[0].color,
            this.placa = res[0].placa,
            this.ano = res[0].año_vehiculo
            this.serialCaja =res[0].serial_caja
            this.zonaDesde = res[0].nombre_zona
            this.zonaHacia = res[0].sedeHacia
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
    this.router.navigate(['/listaTransferencias'])
  }

}
