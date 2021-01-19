import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable()
export class InstalacionesService {

  constructor(private http: HttpClient) { }

  traerInstalaciones(id:number,nivel:number,tipo:number,mk:number,caja:number){
    return this.http.post(environment.apiEndpoint+"traerInstalaciones",{id,nivel,tipo,mk,caja});
  }

  traerMigraciones(id:number,nivel:number,tipo:number,mk:number,caja:number){
    return this.http.post(environment.apiEndpoint+"traerMigraciones",{id,nivel,tipo,mk,caja});
  }

  traerMudanzas(id:number,nivel:number,tipo:number,mk:number,caja:number){
    return this.http.post(environment.apiEndpoint+"traerMudanzas",{id,nivel,tipo,mk,caja});
  }
  
  traerInstalacionesActivos(){
    return this.http.get(environment.apiEndpoint+"instalacionesActivas/");
  }

  practica(data:string){
    return this.http.get(environment.apiEndpoint+"practica/"+data);
  }

  listaip(data:string){
    return this.http.get(environment.apiEndpoint+"listaip/"+data);
  }

  listaip2(mk:number){
    return this.http.post(environment.apiEndpoint+"BusquedaIpMk",{mk});
  }

  traerApsPractica(){
    return this.http.get(environment.apiEndpoint+"aps");
  }

  traerCeldaPractica(){
    return this.http.get(environment.apiEndpoint+"celdas");
  }

  traerServidores(){
    return this.http.get(environment.apiEndpoint+"servidor");
  }

  traerEquiposPractica(id:number){
    return this.http.get(environment.apiEndpoint+"equiposInstalacion/"+id);
  }

  traerPlanesPractica(plan:number){
    return this.http.get(environment.apiEndpoint+"traerPlanes/"+plan);
  }

  obtenerDataEquiposPorModelo2(id_zona:Number,modelo:string){
    return this.http.post(environment.apiEndpoint+"articulosCategorias2/",{id_zona,modelo});
}

busqueda(id:string){
  return this.http.get(environment.apiEndpoint + "instalaciones/"+id)
}

  ingresarDataInstalaciones(
    id_user:number,
     id_cliente:number,
     celda:number,
     ip:string,
     plan:number,
     tipoPlan:number,
     serial:string,
     serial2:string,
     modeloEquipo:string,
     modeloEquipo2:string,
     check:number,
     instalacion:number,
     promocion:number,
     desde:number,
     tasa_insta:number){

    return this.http.post(environment.apiEndpoint+"instalaciones",{id_user,id_cliente,celda,ip,plan,tipoPlan,serial,serial2,modeloEquipo,modeloEquipo2,check,instalacion,promocion,desde,tasa_insta})

  }

  ingresarDataMigracion(cliente:number,id:number,lugar:number,serial:string,promo:number,tasa:number,plan:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"guardarMigracion",{cliente,id,lugar,serial,promo,tasa,plan,id_user})
  }

  ingresarDataMudanza(cliente:number,id:number,lugar:number,ip:string,tasa:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"guardarMudanza",{cliente,id,lugar,ip,tasa,id_user})
  }

  traerDatosInstalacion(id:number){
    return this.http.get(environment.apiEndpoint+"datosInstalacion/"+id)
  }

  traerDatosMigracion(id:number){
    return this.http.get(environment.apiEndpoint+"datosMigracion/"+id)
  }

  traerDatosMudanza(id:number){
    return this.http.get(environment.apiEndpoint+"datosMudanza/"+id)
  }

  editarData(datos:any){
    return this.http.post(environment.apiEndpoint+"editarInstalacion",{datos})
  }

  anularData(id:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"anularInstalacion",{id,id_user})
  }

  traerips(){
    return this.http.get(environment.apiEndpoint+"ips")
  }

  cerrarInstalacion(id:number,instaladores:any,ap:number,celda:number,plan:number,id_exterior:number, cexterior:number, id_interior:number,cinterior:number,id_conector:number,cconector:number,id_zona:number,base:number,grapa:number,alambre:number,tipo_insta:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"cerrarInstalacion/"+id,{instaladores,ap,celda, plan,id_exterior,cexterior,id_interior,cinterior,id_conector,cconector,id_zona,base,grapa,alambre,tipo_insta,id_user})
  }

  cerrarInstalacionF(id:number,celda:number,plan:number,cableFibra:number, fconnector:number,id_zona:number,tipo_insta:number,instaladores:any,id_user:number){
    return this.http.post(environment.apiEndpoint+"cerrarInstalacion/"+id,{celda, plan,cableFibra,fconnector,id_zona,tipo_insta,instaladores,id_user})
  }

  cerrarMigracionF(id:number,cliente:number,cableFibra:number, fconnector:number,id_zona:number,instaladores:any,id_user:number){
    return this.http.post(environment.apiEndpoint+"cerrarMigracion/"+id,{cliente,cableFibra,fconnector,id_zona,instaladores,id_user})
  }

  cerrarMudanzaF(id:number,instaladores:any,ap:number,celda:number,plan:number,id_exterior:number, cexterior:number, id_interior:number,cinterior:number,id_conector:number,cconector:number,id_zona:number,base:number,grapa:number,alambre:number,tipo_insta:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"cerrarMudanza/"+id,{instaladores,ap,celda, plan,id_exterior,cexterior,id_interior,cinterior,id_conector,cconector,id_zona,base,grapa,alambre,tipo_insta,id_user})
  }

}
