import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class FacturacionService {

  constructor(private http:HttpClient) { }

  generarFactura(cliente:number,fac_serv:string,fecha:string, fecha2:string,nservicio:any,pro:number,responsable:number){
    return this.http.post(environment.apiEndpoint+"factura",{cliente,fac_serv,fecha,fecha2,nservicio,pro,responsable})
  }

  generarFacturaBlanco(cliente:number,fecha:string,pro:number,denominacion:number,serie:number,responsable:number){
    return this.http.post(environment.apiEndpoint+"factura_blanco",{cliente,fecha,pro,denominacion,serie,responsable})
  }

  anularFactura(id:number,id_user:number, razon:string){
    return this.http.put(environment.apiEndpoint+"facturas/anular/"+id,{id_user,razon})
  }

  comprobarAnulacion(id:number){
    return this.http.post(environment.apiEndpoint+"ComprobarAnulacion",{id})
  }

}
