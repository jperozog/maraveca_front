import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'

@Injectable()
export class MangaEmpalmeService {

  constructor(private http:HttpClient) { }


  traerMangaEmpalme(){
    return this.http.get(environment.apiEndpoint+"traerMangasEmpalme");
  }

  guardarMangaEmpalme(manga:string,olt:number){
    return this.http.post(environment.apiEndpoint+"mangaEmpalme",{manga,olt})
  }

  traerPuertosOlt(id:number){
    return this.http.get(environment.apiEndpoint+"puertosOlt/"+id)
  }

  editarManga(datos:any){
    return this.http.post(environment.apiEndpoint+"editarManga",{datos})
  }

}
