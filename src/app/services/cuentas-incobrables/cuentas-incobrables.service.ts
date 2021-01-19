import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class CuentasIncobrablesService {

  constructor(private http:HttpClient) { }

  traeCuentas(año:number,mes:number){
    return this.http.post(environment.apiEndpoint+"traerCuentas",{año,mes})
  }

  datosGraficaCuentasIncobrables(){
      return this.http.get(environment.apiEndpoint + "datosGraficaCuentasIncobrables/")
  }

  clientesExonerados(){
    return this.http.get(environment.apiEndpoint + "traerClientesExonerados")
  }

  datosGraficaCuentasExonerados(){
    return this.http.get(environment.apiEndpoint + "datosGraficaCuentasExonerados/")
}



}
