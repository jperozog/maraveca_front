import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DetallesArticulosService } from '../../../services/Inventario/detalles-articulos.service';
import { ArticuloService } from '../../../services/Inventario/articulo.service';
import { Articulo } from '../../../models/Articulo';

@Component({
  selector: 'app-detalles-articulos',
  templateUrl: './detalles-articulos.component.html',
  styleUrls: ['./detalles-articulos.component.css']
})
export class DetallesArticulosComponent implements OnInit {

  idEquipo: number;
  idZona: number;
  equipo: Articulo;
  tipoSelected: Number;
  modeloSelected:String;
  equipos:any =[];

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private http: HttpClient,
    private detallesArticulosService: DetallesArticulosService,
    private ArticuloService: ArticuloService
  ) { }

  ngOnInit() {
    this.idZona = this.activateRoute.snapshot.params.idzona;
    this.idEquipo = this.activateRoute.snapshot.params.id;

    this.detallesArticulosService.obtenerData(this.idEquipo)
      .subscribe(
        res => {
          this.equipo = res[0],
            this.tipoSelected = this.equipo.id_tipo_articulo,
            this.modeloSelected = this.equipo.modelo_articulo
        },
        err => console.log(err)
      );

      this.ArticuloService.obtenerData().subscribe(res=> {this.equipos = res,console.log(this.equipos)} , err=>console.log(err));
  }
  atras() {
    this.router.navigate(['/zonas2', this.idZona])
  }

  Actualizar(serial: HTMLInputElement) {

    this.detallesArticulosService.editarEquipo(this.idEquipo, this.modeloSelected, serial.value, this.tipoSelected, this.idZona)
      .subscribe(
        res => { this.router.navigate(['/zonas2', this.idZona]) }
        , err => console.log(err)
      )
  }

  Eliminar() {
    this.detallesArticulosService.eliminarArticulo(this.idEquipo)
    .subscribe(
      res=>{
           this.router.navigate(['/zonas2', this.idZona])
        },
        err=> console.log(err)
      )
  }
}
