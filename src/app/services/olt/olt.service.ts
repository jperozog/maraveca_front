import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class OltService {

  constructor(private http:HttpClient) { }


  traerOlts(){
    return this.http.get(environment.apiEndpoint+"traerOlts");
  }

  guardarOlt(olt:string,mk:number,puertos:number){
    return this.http.post(environment.apiEndpoint+"Olt",{olt,mk,puertos})
  }

  editarOlt(datos:any){
    return this.http.post(environment.apiEndpoint+"editarOlt",{datos})
  }

}
