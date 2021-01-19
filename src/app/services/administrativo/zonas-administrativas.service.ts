import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable()
export class ZonasAdministrativasService {

  constructor(private http: HttpClient) { }


  traerZonas() {
    return this.http.get(environment.apiEndpoint + "zonasAministrativas/")
  }

  traerUltimoCierre(){
    return this.http.get(environment.apiEndpoint+"ultimoCierre")
  }

  traerDatosZona(id:number) {
    return this.http.get(environment.apiEndpoint + "datosZona/"+id)
  }

  busqueda(dato:string,zona:number){
    return this.http.get(environment.apiEndpoint + "busqueda/"+dato+"/"+zona)
  }

  traerDatosUser(id:number) {
    return this.http.get(environment.apiEndpoint + "datosUser/"+id)
  }

  traerCantidadEfectivo(id:number){
    return this.http.get(environment.apiEndpoint + "cantidadEfectivo/"+id)
  }

  traerCantidadTransferencias(id:number){
    return this.http.get(environment.apiEndpoint + "cantidadTransferencia/"+id)
  }

  traerCantidadZelle(id:number){
    return this.http.get(environment.apiEndpoint + "cantidadZelle/"+id)
  } 
  traerUsers(id:number){
    return this.http.get(environment.apiEndpoint + "traerUsers/"+id)
  }


  traerCantidadEfectivoUser(id:number){
    return this.http.get(environment.apiEndpoint + "cantidadEfectivoUser/"+id)
  }

  traerCantidadTransferenciasUser(id:number){
    return this.http.get(environment.apiEndpoint + "cantidadTransferenciaUser/"+id)
  }

  traerCantidadZelleUser(id:number){
    return this.http.get(environment.apiEndpoint + "cantidadZelleUser/"+id)
  }

  hacerCierreCaja(movimientos:any = []){
    return this.http.post(environment.apiEndpoint + "cierreCaja/",{movimientos})
  }

}
