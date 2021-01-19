import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class FactibilidadesService {

  constructor(private http: HttpClient) { }

  traerData(id:number){
    return this.http.get(environment.apiEndpoint+"factibilidad/"+id);
  }

  traerData2(id:number){
    return this.http.get(environment.apiEndpoint+"factibilidad1/"+id);
  }

  traerFactibilidades(){
    return this.http.get(environment.apiEndpoint+"factibilidades");
  }

  traerDetallesFac(id:number){
    return this.http.get(environment.apiEndpoint+"verificarFac/"+id)
  }

  traerEquiposFac(){
    return this.http.get(environment.apiEndpoint+"equiposFact")
  }

  traerCeldasFac(){
    return this.http.get(environment.apiEndpoint+"celdasFact")
  }
  guardarNuevaFac(id:number,latitud:string,longitud:string,ciudad:string,direccion:string,id_user:number){
    return this.http.post(environment.apiEndpoint+"guardarNuevaFac",{id,latitud,longitud,ciudad,direccion,id_user})
  }

  guardarFac(id:number,estado:number,equipo:number,celda:number,altura:number,ptp:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"guardarFac",{id,estado,equipo,celda,altura,ptp,id_user})
  }

  editarFac(id:number,estado:number,equipo:number,celda:number,altura:number,ptp:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"editarFac",{id,estado,equipo,celda,altura,ptp,id_user})
  }
}
