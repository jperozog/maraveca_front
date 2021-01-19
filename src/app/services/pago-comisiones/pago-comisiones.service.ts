import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable()
export class PagoComisionesService {

  constructor(private http: HttpClient) { }


  traerInstalacionUser(id:number,mes:number,anio:number){
    return this.http.get(environment.apiEndpoint+'instalaciones/'+id+'/'+mes+'/'+anio);
  } 
  traerInstalacionUserPendiente(id:number,mes:number,anio:number){
    return this.http.get(environment.apiEndpoint+'instalacionesPendientes/'+id+'/'+mes+'/'+anio);
  }  

  busqueda(dato:string,id:number,mes:number,anio:number){
    return this.http.get(environment.apiEndpoint + "busqueda/"+id+'/'+mes+'/'+anio+'/'+dato)
  }
  guardarData(comision:number,tipoComision: string,emisor:string, receptor:string, tipo:string, id_user:number,responsable:number,referencia:string,mes:number,anio:number,fechaPago:string){
    return this.http.post(environment.apiEndpoint+"guardarComision",{comision,tipoComision,emisor,receptor,tipo,id_user,responsable,referencia,mes,anio,fechaPago})
  }
  traerPagosRealizadosDl(id:number,mes:number,anio:number){
    return this.http.get(environment.apiEndpoint+'pagosRealizadosComisionesDl/'+id+'/'+mes+'/'+anio)
  }
  traerPagosRealizadosBs(id:number,mes:number,anio:number){
    return this.http.get(environment.apiEndpoint+'pagosRealizadosComisionesBs/'+id+'/'+mes+'/'+anio)
  }

  traerPagosRecientesRealizadosDl(id:number,mes:number,anio:number){
    return this.http.get(environment.apiEndpoint+'pagosRealizadosRecientesComisionesDl/'+id+'/'+mes+'/'+anio)
  }

  traerPagosRecientesRealizadosBs(id:number,mes:number,anio:number){
    return this.http.get(environment.apiEndpoint+'pagosRealizadosRecientesComisionesBs/'+id+'/'+mes+'/'+anio)
  }

  traerListaPagos(id:number,mes:number,anio:number){
    return this.http.get(environment.apiEndpoint+"listaPagosComisiones/"+id+'/'+mes+'/'+anio)
  }
}
