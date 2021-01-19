import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PromocionesService {

  constructor(private http:HttpClient) { }

  promociones(){
    return this.http.get(environment.apiEndpoint+"promociones")
  }

  guardarPromocion(nombre:string,meses:number,mbGratis:number,mbAdicionales:number,duracion:number,equipoAdi){
    return this.http.post(environment.apiEndpoint+"guardarPromocion",{nombre,meses,mbGratis,mbAdicionales,duracion,equipoAdi})
  }
}
