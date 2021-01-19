import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable()
export class ProcesosService {

  constructor(private http: HttpClient) { }

  procesoFacturacion(){
    return this.http.get(environment.apiEndpoint+"procesoFacturacion/");
  }

  procesoCorreos(){
    return this.http.get(environment.apiEndpoint+"procesoCorreos/");
  }

  traerDatosFacturacion(){
    return this.http.get(environment.apiEndpoint+"datosFacturacion/");
  }
}
