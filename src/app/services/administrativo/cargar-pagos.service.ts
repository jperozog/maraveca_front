import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class CargarPagosService {

  constructor(private http: HttpClient) { }

  traerPagosPendientes(){
    return this.http.get(environment.apiEndpoint+"traerPagosPendientes");
  }

  cargaPagosMasivos(){
    return this.http.get(environment.apiEndpoint+"cargaPagosMasivos");
  }

  traerMetodos(){
    return this.http.get(environment.apiEndpoint+"traerMetodos");
  }

  traerRegistroDePagos(){
    return this.http.get(environment.apiEndpoint+"balances/");
  }

  registrarPago(metodo:number, referencia:string, fecha:string, conversion:number, monto:number,usuario:number,cliente:number){
    return this.http.post(environment.apiEndpoint+"registrarPago",{metodo,referencia,fecha,conversion,monto,usuario,cliente})
  }

  registrarPagoMasivo(metodo:number, referencia:string, fecha:string, conversion:number, monto:number,usuario:number,cliente:number){
    return this.http.post(environment.apiEndpoint+"registrarPagoMasivo",{metodo,referencia,fecha,conversion,monto,usuario,cliente})
  }

  editarPago(datos:any,tipo:number){
    return this.http.post(environment.apiEndpoint+"editarPago",{datos,tipo})
  }

  traerTaza(){
    return this.http.get(environment.apiEndpoint+"traerTaza/");
  }

  traerCierresPendientes(){
    return this.http.get(environment.apiEndpoint+"cierresPendientes/")
  }

  traerDetallesCierre(id){
    return this.http.get(environment.apiEndpoint+"datosCierrePendiente/"+id)
  }
  traerEfectivoCierre(id){
    return this.http.get(environment.apiEndpoint+"efectivoCierre/"+id)
  }
  traerNacionalesCierre(id){
    return this.http.get(environment.apiEndpoint+"nacionalesCierre/"+id)
  }
  traerZelleCierre(id){
    return this.http.get(environment.apiEndpoint+"zelleCierre/"+id)
  }
  confimarCierre(movimientos:any = []){
    return this.http.post(environment.apiEndpoint+"confimarCierre/",{movimientos})
  }
  cancerlarCierre(movimientos:any = []){
    return this.http.post(environment.apiEndpoint+"cancelarCierre/",{movimientos})
  }
}
