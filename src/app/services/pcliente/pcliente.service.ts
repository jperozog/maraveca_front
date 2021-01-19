import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'
import { appInitializerFactory } from '@angular/platform-browser/src/browser/server-transition';

@Injectable()
export class PclienteService {

  constructor(private http:HttpClient) { }
  traerPCliente(id:number){
    return this.http.get(environment.apiEndpoint+"traerPClientes/"+id);
  }

  traerFactibilidad(id:number){
    return this.http.get(environment.apiEndpoint+"traerFactibilidadPCliente/"+id)
  }

  guardarCliente(nombres:string,apellidos:string,kni:string,dni:string,fecha:string,numero:string,email:string,estado:number,municipio:number,parroquia:number,social:any,facturable:boolean,direccion:string){
    return this.http.post(environment.apiEndpoint+"guardarPcliente",{nombres,apellidos,kni,dni,fecha,numero,email,estado,municipio,parroquia,social,facturable,direccion})
  }

  editarCliente(datos:any){
    return this.http.post(environment.apiEndpoint+"editarPcliente",{datos});
  }
}
