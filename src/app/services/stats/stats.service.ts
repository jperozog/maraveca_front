import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable()
export class StatsService {

  constructor(private http: HttpClient) { }

  traerData(){
    return this.http.get(environment.apiEndpoint+"statdl/");
  }

}
