import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'
import { appInitializerFactory } from '@angular/platform-browser/src/browser/server-transition';

@Injectable()
export class ListaTransferenciasService {

  constructor(private http: HttpClient) { }

  obtenerData(id:number){
    return this.http.get(environment.apiEndpoint+"transferencia/"+id);
  }

  obtenerData2(id:number, filtro:number){
    return this.http.get(environment.apiEndpoint+"transferencias/"+id+"/"+filtro);
  }

  obtenerData3(id:number){
    return this.http.get(environment.apiEndpoint+"transferenciasE/"+id);
  }

  obtenerData4(id:number){
    return this.http.get(environment.apiEndpoint+"transferenciasR/"+id);
  }

  obtenerData5(id:number){
    return this.http.get(environment.apiEndpoint+"transferenciasRes/"+id);
  }

  obtenerData6(id:number){
    return this.http.get(environment.apiEndpoint+"transferenciasCon/"+id);
  }
  obtenerData7(){
    return this.http.get(environment.apiEndpoint+"instaladores");
  }
  autorizar(id:number, filtro:number){
    return this.http.get(environment.apiEndpoint+"autorizar/"+id+"/"+filtro);
  }

  traerDatosCajas(id:number){
    return this.http.get(environment.apiEndpoint+"traerDatosCajas/"+id)
  }

  traerEquiposCajas(id:string){
    return this.http.get(environment.apiEndpoint+"traerEquiposCajas/"+id)
  }

  aceptarTransferencia(equipos:any =[], id, confirmante: number,filtro:number ){
    return this.http.post(environment.apiEndpoint+"aceptarTransferir",{equipos,id,confirmante,filtro})
  }

  aceptarTransferenciaConDetalles(equipos:any =[], id, confirmante: number,texto:string ){
    return this.http.post(environment.apiEndpoint+"aceptarTransferirDetalles",{equipos,id,confirmante,texto})
  }

  aceptarTransferenciaConDetalles2(equipos:any =[], id, confirmante: number ){
    return this.http.post(environment.apiEndpoint+"aceptarTransferirDetalles2",{equipos,id,confirmante})
  }

  negarTransferencia(equipos:any =[], id, confirmante: number ){
    return this.http.post(environment.apiEndpoint+"negarTransferir",{equipos,id,confirmante})
  }

  agregarOrdenTraslado(chofer:string,cedula:string, modelo:string,color:string, placa:string, ano:string, id_transferencia:number){
    return this.http.post(environment.apiEndpoint+"aggOrdenTraslado",{chofer,cedula,modelo,color,placa,ano,id_transferencia});
  }

  ultimaTransferencia(){
    return this.http.get(environment.apiEndpoint+"ultimaTransferencia");
  }

  traerComentario(id:number){
    return this.http.get(environment.apiEndpoint+"traerComentario/"+id)
  }

  modificarSedesTranferencia(id:number,sede:number,sede2:number,usuario:number,tipo:number){
    return this.http.post(environment.apiEndpoint+"modificarSedesTranferencia",{id,sede,sede2,usuario,tipo})
  }
  aggEquiposTranferencia(id:number,datos:any,usuario:number){
    return this.http.post(environment.apiEndpoint+"aggEquiposTranferencia",{id,datos,usuario})
  }
  delEquiposTranferencia(id:number,datos:any,usuario:number,tipo){
    return this.http.post(environment.apiEndpoint+"delEquiposTranferencia",{id,datos,usuario,tipo})
  }

  modificarOrdenTranferencia(id:number,chofer:number,vehiculo:number,usuario:number){
    return this.http.post(environment.apiEndpoint+"modificarOrdenTranferencia",{id,chofer,vehiculo,usuario})
  }
/*
  traerOrdenTraslado(){
    return this.http.get(environment.apiEndpoint+"ordenTraslado");
  }
*/
}
