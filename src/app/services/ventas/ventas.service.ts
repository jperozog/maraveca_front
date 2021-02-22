import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class VentasService {

  constructor( public http:HttpClient) { }


  traerVentas(user:number){
    return this.http.post(environment.apiEndpoint+"traerVentas",{user})
  }

  guardarVenta(cliente:number,user:number){
    return this.http.post(environment.apiEndpoint+"guardarVenta",{cliente,user});
  }

  guardarPromo(venta:number,promo:number){
    return this.http.post(environment.apiEndpoint+"guardarPromoVenta",{venta,promo});
  }

  guardarTipo(venta:number,tipo:number,tasa:number){
    return this.http.post(environment.apiEndpoint+"guardarTipoVenta",{venta,tipo,tasa});
  }

  ventaInstalacion(
    id_user:number,
     id_cliente:number,
     celda:number,
     ip:string,
     plan:number,
     tipoPlan:number,
     serial:string,
     modeloEquipo:string,
     check:number,
     instalacion:number,){

    return this.http.post(environment.apiEndpoint+"guardaVentaInstalacion",{id_user,id_cliente,celda,ip,plan,tipoPlan,serial,modeloEquipo,check,instalacion})

  }

}
