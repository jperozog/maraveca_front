import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Articulo} from '../../models/Articulo'
import {environment} from '../../../environments/environment'

@Injectable()
export class InfraestructuraService {

  constructor(private http: HttpClient) { }

  traerData(){
    return this.http.get(environment.apiEndpoint+"traerInfraestructura");
  }

  traerZonasPermisos(){
    return this.http.get(environment.apiEndpoint+"traerZonaPermisos")
  }  

  traerZonas(){
    return this.http.get(environment.apiEndpoint+"traerZona")
  }  


  traerEquipos(tipo:number){
    return this.http.post(environment.apiEndpoint+"traerEquipos",{tipo})
  }  

  traerDisponibles(id:number, modelo:string,tipo:number){
    return this.http.post(environment.apiEndpoint+"traerDisponibles",{modelo,id,tipo})
  }

  guardarDate(id:number,comentario:string,tipo:number, cantidad:number, id_user:number){
    return this.http.post(environment.apiEndpoint+"guardarInfra",{id,comentario,tipo,cantidad,id_user})
  }

  agregarIncidencia(id_equipo:number,incidencia:string,comentario:string,id_user:number){
    return this.http.post(environment.apiEndpoint+"agregarIncidencia",{id_equipo,incidencia,comentario,id_user})
  }
}
