import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Zona2} from '../../models/Zonas2'
import {environment} from '../../../environments/environment'



@Injectable()
export class Zonas2Service {

  constructor(private http: HttpClient) { }

  obtenerDataPermisos(){
    return this.http.get<Zona2[]>(environment.apiEndpoint+"zonas2Permisos");
  }

  obtenerData(){
    return this.http.get<Zona2[]>(environment.apiEndpoint+"zonas2");
  }

  
  obtenerCategorias(){
    return this.http.get(environment.apiEndpoint+"tiposCategorias");
  }
  obtenerConsumibles(){
    return this.http.get(environment.apiEndpoint+"tiposConsumibles");
  }

  
  

  guardarData(sede: string,ubicacion: string){
    if(sede != " "){
    const data =new FormData();

    data.append('sede',sede);
    data.append('ubicacion',ubicacion);

   return this.http.post(environment.apiEndpoint+"zonas2",data);
    }
    else{
      console.log("Empty Input")
    }
  }

  obtenerDatosZona1(id: Number){
    return this.http.get(environment.apiEndpoint+"zonas2/"+id);
  }

  obtenerDatosZona(id: Number, id2: string){
    return this.http.get(environment.apiEndpoint+"zonas2/"+id+"/"+id2);
  }

  obtenerDatosZonaAsignados(id: Number, id2: string){
    return this.http.get(environment.apiEndpoint+"zonas2Asignados/"+id+"/"+id2);
  }

  obtenerDatosZonaVendidos(id: Number, id2: string){
    return this.http.get(environment.apiEndpoint+"zonas2Vendidos/"+id+"/"+id2);
  }

  eliminarZona(id: Number){
    return this.http.delete(environment.apiEndpoint+"zonas2/"+id)
  }

  practica(data:string){
    console.log(data)
    return this.http.get(environment.apiEndpoint+"practica/"+data);
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

  ingresarDataInstalaciones(id_user:number, id_cliente:number,celda:number,ip:string,plan:number,tipoPlan:number,serial:string,modeloEquipo:string){

    return this.http.post(environment.apiEndpoint+"instalaciones",{id_user,id_cliente,celda,ip,plan,tipoPlan,serial,modeloEquipo})

  }

  chequearConsumibles(zona:number,equipo:string){
    return this.http.post(environment.apiEndpoint+"chequearConsumible",{zona,equipo})
  }

  historial(){
    return this.http.get(environment.apiEndpoint+"traerHistorialInventario");
  }

}
