import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable()
export class ServiciosService {

  constructor(private http:HttpClient) { }
  servicios(id:number){
    return this.http.get(environment.apiEndpoint+"Servicios/"+id);
  }

  servicioCliente(id:number){
    return this.http.get(environment.apiEndpoint+"servicioCliente/"+id);
  }

  usuariosComision(){
    return this.http.get(environment.apiEndpoint+"usuariosComision");
  }
  
  editarData(datos:any){
    return this.http.post(environment.apiEndpoint+"editarServicio",{datos})
  }

  guardarData(datos:any){
    return this.http.post(environment.apiEndpoint+"guardarServicio",{datos})
  }
  
  activarServicio(datos:any){
    return this.http.post(environment.apiEndpoint+"activarServicio",{datos})
  }

  servicioIndividual(id:number,tipo){
    return this.http.post(environment.apiEndpoint+"servicioIndividual/",{id,tipo});
  }

  generarCompromisoServicio(cliente:number,compromiso:number,tipo_plan:number,plan:number,fecha:string,id_user){
    return this.http.post(environment.apiEndpoint+"generarCompromisoServicio",{cliente,compromiso,tipo_plan,plan,fecha,id_user})
  }

  verificarCompromisoServicio(servicio:number){
    return this.http.post(environment.apiEndpoint+"verificarCompromisoServicio",{servicio})
  }

  EliminarCompromisoServicio(compromiso:number,servicio:number,id_user){
    return this.http.post(environment.apiEndpoint+"EliminarCompromisoServicio",{compromiso,servicio,id_user})
  }

  EditarCompromisoServicio(compromiso:number,servicio:number,cliente:number,tipo_plan:number,plan:number,fecha:string){
    return this.http.post(environment.apiEndpoint+"EditarCompromisoServicio",{compromiso,servicio,cliente,tipo_plan,plan,fecha})
  }

  generarCompromisoCorte(cliente:number,nservicio:number,responsable:number,fecha:string){
    return this.http.post(environment.apiEndpoint+"Prog_corte",{cliente,fecha,nservicio,responsable})
  }

  generarFacturaProrateada(id_usuario: number,cliente:number,servicio:number,id_fac:number,tipoPlan:number,plan:number){
    return this.http.post(environment.apiEndpoint+"GenerarFacturaPro",{id_usuario,cliente,servicio,id_fac,tipoPlan,plan})
  }
}
