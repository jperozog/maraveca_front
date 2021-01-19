import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Articulo} from '../../models/Articulo'
import {environment} from '../../../environments/environment'

@Injectable()
export class DetallesArticulosService {

  constructor(private http: HttpClient) {}

  obtenerData(id: number){
    return this.http.get<Articulo>(environment.apiEndpoint+"articulo/"+id);
  }


  editarEquipo(id:number, modelo:String, serial:string, id_tipo:Number, id_zona: Number ){
    
    return this.http.put(environment.apiEndpoint+"articulos/"+id,{modelo,serial,id_tipo,id_zona});
  }

  eliminarArticulo(id:Number){
    return this.http.delete(environment.apiEndpoint+"articulos/"+id);
  }

  transferirEquipos(idzonaEmisor: number,idzonaReceptor:number, equipos:any =[],tipo:number,chofer:string,cedula:string,vehiculo:number,usuario:number){

    return this.http.put(environment.apiEndpoint+"transferirArchivos/"+idzonaReceptor,{equipos,tipo,idzonaEmisor,chofer,cedula,vehiculo,usuario})
  }
}
