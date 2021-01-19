import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class ApsService {

  constructor(private http:HttpClient) { }

  traerAps(){
    return this.http.get(environment.apiEndpoint+"aps");
  }

  guardarAp(ap:string, ip: string, usuario:string, clave:string, celda:number){
    return this.http.post(environment.apiEndpoint+"aps",{ap,ip,usuario,clave,celda});
  }

}
