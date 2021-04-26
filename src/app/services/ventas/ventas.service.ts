import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class VentasService {

  constructor( public http:HttpClient) { }


  traerVentas(user:number){
    return this.http.post(environment.apiEndpoint+"traerVentas",{user})
  }

  traerPagoInstalaciones(){
    return this.http.get(environment.apiEndpoint+"traerPagosInst")
  }

  guardarVenta(cliente:number,user:number,desde:number){
    return this.http.post(environment.apiEndpoint+"guardarVenta",{cliente,user,desde});
  }

  guardarPromo(venta:number,promo:number){
    return this.http.post(environment.apiEndpoint+"guardarPromoVenta",{venta,promo});
  }

  guardarTipo(venta:number,tipo:number,tasa:number){
    return this.http.post(environment.apiEndpoint+"guardarTipoVenta",{venta,tipo,tasa});
  }

  guardarPagoInstalacion(venta:number,cliente:number,concepto:number,monto:number,monto_bs:number,user:number,tipo:number,ref:string,estatus:number){
    return this.http.post(environment.apiEndpoint+"guardarPagoInstalacion",{venta,cliente,concepto,monto,monto_bs,user,tipo,ref,estatus})
  }

  updatePagoInstalacion(id:number,estatus:number){
    return this.http.post(environment.apiEndpoint+"updatePagoInstalacion",{id,estatus})
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
