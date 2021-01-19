import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class ComisionesVendedoresService {

  constructor(private http:HttpClient) { }

  traerVendedores(){
    return this.http.get(environment.apiEndpoint+"traerVendedores");
  }

  traerComisionesVendedor(mes:number, anio:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"traerComisionesVendedor",{mes,anio,id_user});
  }

  realizarPagoComision(tipo_pago:number,monto:number, fecha:string,id_vendedor:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"realizarPagoComisionVendedor",{tipo_pago,monto,fecha,id_vendedor,id_user})
  }

  pagosRealizados(mes:number, anio:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"traerPagosComisionesVendedor",{mes,anio,id_user})
  }

}
