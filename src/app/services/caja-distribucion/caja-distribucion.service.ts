import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class CajaDistribucionService {

  constructor(private http:HttpClient) { }


  traerCajaDistribucion(){
    return this.http.get(environment.apiEndpoint+"traerCajas");
  }

  guardarCajaDistribucion(caja:string,manga:number,puertos:number,zona:number){
    return this.http.post(environment.apiEndpoint+"cajaDistribucion",{caja,manga,puertos,zona})
  }

  traerZonas(){
    return this.http.get(environment.apiEndpoint+"zonas2Permisos")
  }

  editarCaja(datos:any){
    return this.http.post(environment.apiEndpoint+"editarCaja",{datos})
  }

}
