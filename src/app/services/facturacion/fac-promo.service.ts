import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class FacPromoService {

  constructor(private http: HttpClient) { }

  traerPromociones(){
      return this.http.get(environment.apiEndpoint+"traerPromociones")
  }
  traerDatosClientes(id:number){
    return this.http.get(environment.apiEndpoint+'traerDatosCliente/'+id)
  }

  traerPlanes(id:number){
    return this.http.get(environment.apiEndpoint+"traerPlanesPromo/"+id)
  }

  guardarDataPromo(id:number,servicio:number,plan:number,fecha:string,id_user:number,comentario:number){
    return this.http.post(environment.apiEndpoint+"guardarDataPromo",{id,servicio,plan,fecha,id_user,comentario})
  }

  verificarPromocion(id:number){
    return this.http.get(environment.apiEndpoint+"verificarPromo/"+id)
  }
}
