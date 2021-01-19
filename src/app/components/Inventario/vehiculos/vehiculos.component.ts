import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../../../_guards/index';
import { OrdenTrasladoService } from '../../../services/Inventario/orden-traslado.service'

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  vehiculos: any = []
  e: number = 1
  marca: string = ""
  modelo: string = ""
  placa: string = ""
  color: string = ""
  anio: number = 0
  constructor(
    private router: Router,
    private usuario: AuthGuard,
    private ordenTrasladoService: OrdenTrasladoService
  ) { }

  ngOnInit() {
    this.traerVehiculos()
  }

  traerVehiculos() {
    this.ordenTrasladoService.traerVehiculos()
      .subscribe(
        res => {

          this.vehiculos = res,
            console.log(this.vehiculos)
        },
        err => console.log(err)
      );
  }

  agregarVehiculo() {
    this.ordenTrasladoService.agregarVehiculo(this.marca, this.modelo, this.placa, this.color, this.anio, this.usuario.currentUser.id_user).subscribe(
      res => {
        console.log(res)
        this.ngOnInit()
        this.marca = ""
        this.modelo = ""
        this.placa = ""
        this.color = ""
        this.anio = 0
      },
      err => console.log(err))
  }

  atras() {
    this.router.navigate(['/zonas2'])
  }

}
