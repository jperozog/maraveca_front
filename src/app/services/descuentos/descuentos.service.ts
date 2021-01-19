import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class DescuentosService {

  constructor(private http: HttpClient) { }

  traerDescuentos(){
    return this.http.get(environment.apiEndpoint+"descuentos");
  }

  guardarDescuento(factura:number,tipo:number,dias:number,comentario:string,usuario:number){
    return this.http.post(environment.apiEndpoint+"guardarDescuento",{factura,tipo,dias,comentario,usuario})
  }

  aprobarDescuentos(id:number){
    return this.http.post(environment.apiEndpoint+"aprobarDescuento",{id})
  }

  cancelarDescuentos(id:number){
    return this.http.post(environment.apiEndpoint+"cancelarDescuento",{id})
  }
}
