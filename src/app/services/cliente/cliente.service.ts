import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'
import { appInitializerFactory } from '@angular/platform-browser/src/browser/server-transition';

@Injectable()
export class ClienteService {

  constructor(private http:HttpClient) { }

  traerClientes(id:number){
      return this.http.get(environment.apiEndpoint+"clientes1/"+id)
  }

  traerClientes1(id:number,tipo:number){
    return this.http.post(environment.apiEndpoint+"clientes2/",{id,tipo})
    }


  traerDatosCliente(id: number){
    return this.http.get(environment.apiEndpoint+"cliente/"+id)
  }

  traerEstados(){
    return this.http.get(environment.apiEndpoint+"estados")
  }

  traerMunicipios(id:number){
    return this.http.post(environment.apiEndpoint+"municipios",{id})
  }

  traerClientesPorMunicipio(estado:number,muni:number){
    return this.http.post(environment.apiEndpoint+"traerCMunicipio",{estado,muni})
  }

  traerParroquias(id:number){
    return this.http.post(environment.apiEndpoint+"parroquias",{id})
  }

  traerCiudades(id:number){
    return this.http.post(environment.apiEndpoint+"ciudades",{id})
  }

  guardarCliente(nombres:string,apellidos:string,kni:string,dni:string,fecha:string,numero:string,email:string,estado:number,municipio:number,parroquia:number,social:any,direccion:string,facturable:boolean,id_user:number){
    return this.http.post(environment.apiEndpoint+"guardarCliente",{nombres,apellidos,kni,dni,fecha,numero,email,estado,municipio,parroquia,social,direccion,facturable,id_user})
  }

  traerDatosEstado(id:number){
    return this.http.get(environment.apiEndpoint+"datosEstado/"+id)
  }

  editarDatosCliente(datos:any){
    return this.http.post(environment.apiEndpoint+"editarDatosClientes",{datos})
  }

}
