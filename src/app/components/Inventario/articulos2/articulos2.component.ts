import { Component, Pipe, PipeTransform, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Zonas2Service } from '../../../services/Inventario/zonas2.service';
import { ArticuloService } from '../../../services/Inventario/articulo.service';
import { MatPaginator } from '@angular/material/paginator';
import { Articulo } from '../../../models/Articulo';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthGuard } from '../../../_guards/index';

@Component({
  selector: 'app-articulos2',
  templateUrl: './articulos2.component.html',
  styleUrls: ['./articulos2.component.css']
})
export class Articulos2Component implements OnInit {
  zonaSeleccionada: string = ""
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  e: number = 1;
  p: number = 1;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  detallesConsumible: any
  listaConsumibles: any = []
  id: number = 0
  ConsumibleBajo: boolean = false
  CBequipo: string = ""
  equiposConsumibles: any = []
  nuevaLista: any = []
  aggCantidad: number = 0
  NuevoEquipoSelected: number = 0
  NuevaCantidadSelected: number = 0
  NuevaUnidadSelected: string = ""
  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private Zona2Service: Zonas2Service,
    private ArticuloService: ArticuloService,
    private usuario: AuthGuard
  ) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.params.id;
    this.traerConsumibles()
  }

  atras() {
    this.router.navigate(['/zonas2'])
  }

  traerConsumibles() {
    this.ArticuloService.traerConsumibles(this.id).subscribe(
      res => {
        console.log(res),
          this.zonaSeleccionada = res["0"].nombre_zona,
          this.listaConsumibles = res,

          this.listaConsumibles.forEach(element => {
            if (element.nombre_equipo.includes("UTP") || element.nombre_equipo.includes("CONECTORES RJ")) {

              if (element.cantidad < 100) {
                this.ConsumibleBajo = true
                this.CBequipo = element.nombre_equipo
              }
            }
          });


        this.ArticuloService.traerEquiposConsumbles().subscribe(
          res => {
            this.equiposConsumibles = res
            console.log(this.equiposConsumibles)
            for (let i = 0; i < this.listaConsumibles.length; i++) {
              this.equiposConsumibles.forEach(element => {

                if (this.listaConsumibles[i].nombre_equipo == element.nombre_equipo) {
                  var o = this.equiposConsumibles.indexOf(element);
                  this.equiposConsumibles.splice(o, 1);
                }

              });
            }
            this.nuevaLista = this.equiposConsumibles;
            console.log(this.nuevaLista)
          },
          err => console.log(err))
      },
      err => console.log(err))
  }

  agregarConsumible() {
    this.ArticuloService.agregarConsumible(this.NuevoEquipoSelected, this.NuevaCantidadSelected, this.NuevaUnidadSelected, this.id)
      .subscribe(
        res => {
          this.ngOnInit()
          this.NuevoEquipoSelected = 0,
            this.NuevaCantidadSelected = 0,
            this.NuevaUnidadSelected = ""

        },
        err => console.log(err)
      )
  }

  openModal2(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.listaConsumibles.forEach(element => {
      if (element.id_consumible == id) {
        this.detallesConsumible = element
      }
    });
    console.log(this.detallesConsumible)
  }

  modificarConsumible(id: number) {

    this.ArticuloService.modificarConsumible(this.aggCantidad, id)
      .subscribe(
        res => {
          console.log(res),
            this.modalRef.hide()
          this.ngOnInit()
        },
        err => console.log(err)
      )

  }


}
