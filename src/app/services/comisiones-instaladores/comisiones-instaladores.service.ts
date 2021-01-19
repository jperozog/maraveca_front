import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class ComisionesInstaladoresService {

  constructor(private http:HttpClient) { }

  traerInstaladores(){
    return this.http.get(environment.apiEndpoint+"traerInstaladores");
  }

  traerComisionesInstalador(mes:number, anio:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"traerComisionesInstalador",{mes,anio,id_user});
  }

  guardarCuota(cuota:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"guardarCuotaInstalador",{cuota,id_user})
  }
}
