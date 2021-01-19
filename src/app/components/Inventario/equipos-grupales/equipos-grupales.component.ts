import { Component, OnInit, TemplateRef } from '@angular/core';
import { Zonas2Service } from '../../../services/Inventario/zonas2.service';
import { Router } from '@angular/router'
import { AuthGuard } from '../../../_guards/index';
import { ArticuloService } from '../../../services/Inventario/articulo.service';
import { BuscadorService } from '../../../services/Inventario/buscador.service';

@Component({
  selector: 'app-equipos-grupales',
  templateUrl: './equipos-grupales.component.html',
  styleUrls: ['./equipos-grupales.component.css']
})
export class EquiposGrupalesComponent implements OnInit {
  zonas: any = []
  equipos: any = []
  disponibles: any = []
  grupales: any = []
  zona: number = 0
  e: number = 1
  equipoSelected: string = ""
  articulo: number = 0
  comentario: string = ""
  constructor(
    private Zonas2Service: Zonas2Service,
    private articuloService: ArticuloService,
    private router: Router,
    public usuario: AuthGuard,
    private buscadorService: BuscadorService
  ) { }

  ngOnInit() {
    this.Zonas2Service.obtenerDataPermisos().subscribe(
      res => {
        this.zonas = res;
        console.log(res);
      },
      err => console.log(err)
    );
    this.traerGrupal()
    this.traerModelos()
  }

  traerGrupal() {
    this.articuloService.traerGrupal().subscribe(res => { console.log(res), this.grupales = res }, err => console.log(err))
  }
  traerModelos() {
    this.articuloService.obtenerData().subscribe(res => { console.log(res), this.equipos = res }, err => console.log(err));
  }

  traerDisponibles() {
    this.articuloService.obtenerDataEquiposPorModelo2(this.zona, this.equipoSelected)
      .subscribe(
        res => {
          this.disponibles = res,
            console.log(this.disponibles)

        },
        err => console.log(err))
  }

  agregarGrupal() {
  
    this.articuloService.agregarGrupal(this.articulo, this.comentario, this.usuario.currentUser.id_user)
      .subscribe(
        res => {
          console.log(res),
          this.traerGrupal(),
          this.articulo = 0,
          this.comentario = "",
          this.zona = 0,
          this.equipoSelected = ""
        }, err => console.log(err))
  }

  atras() {
    this.router.navigate(['/zonas2'])
  }


}
