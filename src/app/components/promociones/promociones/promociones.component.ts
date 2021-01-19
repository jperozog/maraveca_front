import { Component, OnInit } from '@angular/core';
import { PromocionesService } from '../../../services/promociones/promociones.service';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {
  isChecked: boolean = false
  isChecked2: boolean = false
  isChecked3: boolean = false
  isChecked4: boolean = false
  Facturacion: number = 0
  Gratis: number = 0
  Adicionales: number = 0
  Promocion: string = ''
  Duracion: number = 0
  equipoAdi:number = 0
  promociones:any = []
  e:number = 1
  constructor(private promocionSerice: PromocionesService) { }

  ngOnInit() {
    this.traerPromociones()
  }

  traerPromociones(){
    this.promocionSerice.promociones().subscribe(res=>this.promociones = res,err=>console.log(err))
  }

  GuardarData() {
    if(this.isChecked4){
      this.equipoAdi = 1
    }
    this.promocionSerice.guardarPromocion(this.Promocion, this.Facturacion, this.Gratis, this.Adicionales, this.Duracion,this.equipoAdi)
      .subscribe(
        res => {
          this.Facturacion = 0
          this.Gratis = 0
          this.Adicionales = 0
          this.Duracion = 0
          this.equipoAdi = 0
          this.isChecked = false
          this.isChecked2 = false
          this.isChecked3 = false
          this.isChecked4 = false
          this.Promocion = ""
          this.traerPromociones()
        },
        err => console.log(err))
  }

}
