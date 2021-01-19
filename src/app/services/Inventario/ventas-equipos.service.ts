import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class VentasEquiposService {

  constructor(private http: HttpClient) { }

  traerData(){
    return this.http.get(environment.apiEndpoint+"traerData")
  }

  traerDetallesData(id:number){
    return this.http.get(environment.apiEndpoint+"traerData/"+id)
  }

  traerClientes(data:string){
    return this.http.get(environment.apiEndpoint+"buscarClienteVenta/"+data);
  }

  traerClientesP(data:string){
    return this.http.get(environment.apiEndpoint+"practica2/"+data);
  }

  traerSede(){
    return this.http.get(environment.apiEndpoint+"traerSede")
  }
  traerEquipo(){
    return this.http.get(environment.apiEndpoint+"traerEquipo")
  }
  traerArticulos(sede:string, equipo:string){
    return this.http.post(environment.apiEndpoint+"traerArticulos",{sede,equipo})

  }

  guardarData(cliente:string, id_articulo:number, tipo:string, monto:number, usuario:number,fecha:any,comentario:string){
    return this.http.post(environment.apiEndpoint+"guardarData",{cliente,id_articulo,tipo,monto,usuario,fecha,comentario})
  }
}
