
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable} from 'rxjs/observable';
import {  timer } from 'rxjs/observable/timer';
import { map, switchMap, filter ,  mergeMap   } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {UpdateserviceComponent} from './servicios.component';
import 'rxjs/Rx';

@Injectable()
export class IpValidators {

  constructor(private http: HttpClient) {}

  searchIp(ip_srv) {
    // debounce
    return timer(1000)
      .pipe(
        switchMap(() => {
          // Check if username is available
          return this.http.get<any>(environment.apiEndpoint + 'servicios_v/' + ip_srv);
        })
      );
  }

  ipValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.searchIp(control.value)
        .pipe(
          map((res: any[] ) => {
            // if username is already taken
            if (res.length ) {
             if (res[0].status_ip === 1) {
              // return error
              return { 'IpExists': true};
            }else if (res[0].status_ip === 2) {

               return { 'IpInstall': true};
             }

              console.log(res[0].status_ip);
              console.log(control.value);
            }

          })
        );
    };

  }

}
