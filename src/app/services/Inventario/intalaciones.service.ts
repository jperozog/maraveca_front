import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class IntalacionesService {

  constructor(private http: HttpClient) { }


  
  practica(data:string){
    return this.http.get(environment.apiEndpoint+"practica/"+data);
  }

  listaip(data:string){
    return this.http.get(environment.apiEndpoint+"listaip/"+data);
  }

  traerCeldaPractica(){
    return this.http.get(environment.apiEndpoint+"celdas");
  }

  traerEquiposPractica(){
    return this.http.get(environment.apiEndpoint+"equipos2");
  }

  traerPlanesPractica(plan:number){
    return this.http.get(environment.apiEndpoint+"traerPlanes/"+plan);
  }

  ingresarDataInstalaciones(
    id_user:number,
     id_cliente:number,
     celda:number,
     ip:string,
     plan:number,
     tipoPlan:number,
     serial:string,
     serial2:string,
     modeloEquipo:string,
     modeloEquipo2:string,
     check:number,
     instalacion:number,
     promocion:number,
     desde:number,
     tasa_insta:number){

    return this.http.post(environment.apiEndpoint+"instalaciones",{id_user,id_cliente,celda,ip,plan,tipoPlan,serial,serial2,modeloEquipo,modeloEquipo2,check,instalacion,promocion,desde,tasa_insta})

  }
}
