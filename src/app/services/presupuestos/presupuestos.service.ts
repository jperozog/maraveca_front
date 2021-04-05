import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable()
export class PresupuestosService {

  constructor(private http: HttpClient) { }


  enviarPresupuesto(servicio:number,costo:number,moneda:string,cliente:any,user:number){
    return this.http.post(environment.apiEndpoint + "presupuesto",{servicio,costo,moneda,cliente,user})
  }

}
