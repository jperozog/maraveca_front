import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class EquiposService {

  constructor(private http:HttpClient) { }

  traerEquipos(){
    return this.http.get(environment.apiEndpoint+"equipos2");
  }

  traerTiposEquipos(){
    return this.http.get(environment.apiEndpoint+"tiposEquipos");
  }

  agregarEquipo(nombre:string,id:number){
    return this.http.post(environment.apiEndpoint+"agregarEquipo2",{nombre,id})
  }

  agregarCategoria(nombreCategoria:string){
    return this.http.post(environment.apiEndpoint+"agregarCategoria",{nombreCategoria})
  }


}
