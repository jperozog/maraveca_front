import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class NotificacionesService {

  constructor(private http: HttpClient) { }

  traerLista(){
    return this.http.get(environment.apiEndpoint+"traerLista")
  }

  enviarMensajeDeuda(responsable:number,tipo_sms:number,mensaje:string){
    return this.http.post(environment.apiEndpoint+"env_sms_morosos",{responsable,tipo_sms,mensaje})
  }

  enviarNotificacion(responsable:number, tipo:number,datos:any,mensaje:string){
    return this.http.post(environment.apiEndpoint+"tnotify",{responsable,tipo,datos,mensaje})
  }

}
