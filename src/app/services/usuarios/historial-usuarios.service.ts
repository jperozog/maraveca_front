import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class HistorialUsuariosService {

  constructor(private http:HttpClient) { }


  traerUsuarios(){
    return this.http.get(environment.apiEndpoint+"traerUsuarios")
  }

  traerHistorialUsuario(id:number){
      return this.http.get(environment.apiEndpoint+"traerHistorialUsuario/"+id)
  }

  actualizarPermisosMk(id_user:number,permiso: string, zonas:any ){
    return this.http.post(environment.apiEndpoint+"actualizarPermisosMk",{id_user,permiso,zonas})
  } 

  traerPermisoMK(id:number){
    return this.http.get(environment.apiEndpoint+"traerPermisoMK/"+id)
  }

}
