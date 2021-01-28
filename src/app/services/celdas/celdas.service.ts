import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class CeldasService {

  constructor(private http:HttpClient) { }

  traerCeldas(){
    return this.http.get(environment.apiEndpoint+"celdas");
  }

  traerMk(){
    return this.http.get(environment.apiEndpoint+"servidor");
  }

  guardarCelda(celda:string,mk:number){
    return this.http.post(environment.apiEndpoint+"celdas",{celda,mk})
  }

  editarCelda(datos:any){
    return this.http.put(environment.apiEndpoint+"celdas",{datos})
  }
}
