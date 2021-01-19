import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class AlarmasService {

    constructor(private http:HttpClient) { }


  traerAlarmas(){
    return this.http.get(environment.apiEndpoint+"traerAlarmas")
  }

  taerDatosMk(){
    return this.http.get(environment.apiEndpoint+"traerDatosMk")
  }

  taerDatosCelda(){
    return this.http.get(environment.apiEndpoint+"traerDatosCeldas")
  }

  taerDatosAp(){
    return this.http.get(environment.apiEndpoint+"traerDatosAps")
  }

  guardarData(id:number,equipo:string, comentario:string, id_user:number){
    return this.http.post(environment.apiEndpoint+"guardarAlarma",{id,equipo,comentario,id_user})
  }

  notificacion(){
    return this.http.get(environment.apiEndpoint+"notificacionAlarma");
  }

  cambiarStatusP(id:number){
    return this.http.post(environment.apiEndpoint+"cambiarStatusP",{id})
  }
  cambiarStatusN(id:number){
    return this.http.post(environment.apiEndpoint+"cambiarStatusN",{id})
  }

}
