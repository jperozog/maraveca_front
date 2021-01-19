import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment'
@Injectable()
export class OrdenTrasladoService {

  constructor(private http :HttpClient, private router:Router) { }


  traerDatos(id:number,filtro:number){
    return this.http.get(environment.apiEndpoint+"ordenTraslado/"+id+"/"+filtro);
  }

  traerDatosTraslado(id:number){
    return this.http.get(environment.apiEndpoint+"PdfTraslado/"+id);
  }

  traerDatosChofer(id){
    return this.http.get(environment.apiEndpoint+"datosChofer/"+id);
  }

  traerTraslados(){
    return this.http.get(environment.apiEndpoint+"traerTraslados")
  }

  traerConductores(){
    return this.http.get(environment.apiEndpoint+"datosConductores")
  }

  traerVehiculos(){
    return this.http.get(environment.apiEndpoint+"datosVehiculos")
  }

  agregarVehiculo(marca:string, modelo:string,placa:string,color:string,año:number,id_user:number){
    return this.http.post(environment.apiEndpoint+"agregarVehiculo",{marca,modelo,placa,color,año,id_user})
  }

  realizarTraslado(equipos:any,chofer:string,vehiculo:number,usuario:number,desde:string,hasta:string){
    return this.http.post(environment.apiEndpoint+"realizarTraslado",{equipos,chofer,vehiculo,usuario,desde,hasta})
  }

}
