import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class ConfigAdminService {

  constructor(private http:HttpClient) { }

  guardarData(tasa:number,tasaBCV:number,moneda_local:string,moneda_ex:string,iva:number,responsable:number){
    return this.http.put(environment.apiEndpoint+"Configuraciones",{tasa,tasaBCV,moneda_local,moneda_ex,iva,responsable})
  }

}
