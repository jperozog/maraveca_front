import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class NotaCreditoService {

  constructor(private http:HttpClient) { }

  traerNotasDeCredito(id:number){
    return this.http.get(environment.apiEndpoint+"notasCredito/"+id)
  }

  traerProductos(id:number){
    return this.http.get(environment.apiEndpoint+"productosNota/"+id)
  }

  guardarNota(tipo_nota,cliente:number,factura:number,producto:number,nota:number){
    return this.http.post(environment.apiEndpoint+"notaCredito",{tipo_nota,cliente,factura,producto,nota})
  }

  guardarPagoNota(datos:any,id_nota:number,id_usuario:number){
    return this.http.post(environment.apiEndpoint+"guardarPagoNota",{datos,id_nota,id_usuario})
  }

}
