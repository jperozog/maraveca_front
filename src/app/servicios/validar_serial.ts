
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable} from 'rxjs/observable';
import {  timer } from 'rxjs/observable/timer';
import { map, switchMap, filter ,  mergeMap   } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import 'rxjs/Rx';

@Injectable()
export class SerialValidators {
  constructor(private http: HttpClient) {}

  searchSerial( serial) {
    // debounce
    return timer(1000)
      .pipe(
        switchMap(() => {
          // Check if username is available
          return this.http.get<any>(environment.apiEndpoint + 'servicios_s/' + serial);
        })
      );
  }

  serialValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.searchSerial(control.value)
        .pipe(
          map((res: any[] ) => {
            // if username is already taken
            if (res.length) {
              // return error
              return { 'SerialExists': true};
            }
            console.log(control.value);
          })

        );
    };

  }

}
