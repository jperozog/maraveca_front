import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class BuscadorService {

  constructor(private http:HttpClient) { }

  buscarSerial(serial:string){
    return this.http.post(environment.apiEndpoint+"buscarSerial",{serial});
  }

  MasDetalles(equipo:any){
    return this.http.post(environment.apiEndpoint+"masDetalles",{equipo});
  }

}
