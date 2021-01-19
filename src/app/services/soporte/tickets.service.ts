import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable()
export class TicketsService {

  constructor(private http: HttpClient) { }

  traerTickets(){
    return this.http.get(environment.apiEndpoint+"tickets/");
  }
  traerTicketsActivos(){
    return this.http.get(environment.apiEndpoint+"ticketsActivos/");
  }

  busqueda(id:string){
    return this.http.get(environment.apiEndpoint + "tickets/"+id)
  }

  practica(data:string){
    return this.http.get(environment.apiEndpoint+"practica/"+data);
  }

  guardarTicket(check1:boolean, check2:boolean, check3:boolean, check4: boolean, prioridad:number,id:number,nombre:string,apellido:string, id_user:number){
    return this.http.post(environment.apiEndpoint+"guardarTicket/",{check1,check2,check3,check4,prioridad,id,nombre,apellido,id_user});
  }

  traerDetallesTicket(ticket:number){
    return this.http.post(environment.apiEndpoint+"detallesTicket",{ticket})
  }

  agregarComentarioTicket(id:number,tipo:number,comentario:string,usuario:number){
    return this.http.post(environment.apiEndpoint+"aggComentarioTicket",{id,tipo,comentario,usuario})
  }

  guardarAveria(tecnologia:number, lugar:number,comentario:string,usuario:number){
    return this.http.post(environment.apiEndpoint+"guardarAveria",{tecnologia,lugar,comentario,usuario})
  }

  traerDetallesAveria(averia:number){
    return this.http.post(environment.apiEndpoint+"detallesAveria",{averia})
  }

  agregarComentarioAveria(id:number,tipo:number,comentario:string,usuario:number){
    return this.http.post(environment.apiEndpoint+"aggComentarioAveria",{id,tipo,comentario,usuario})
  }


  guardarReposicion(cliente:number,servicio:number, lugar:number,id_equipo:number,comentario:string,usuario:number){
    return this.http.post(environment.apiEndpoint+"guardarReposicion",{cliente,servicio,lugar,id_equipo,comentario,usuario})
  }

  traerDetallesReposicion(repo:number){
    return this.http.post(environment.apiEndpoint+"detallesReposicion",{repo})
  }

  cerrarReposicion(datos:any,tipo:number,usuario:number){
    return this.http.post(environment.apiEndpoint+"cerrarReposicion",{datos,tipo,usuario})
  }


}
