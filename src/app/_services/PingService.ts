import {Component, Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Subject, Observable} from 'rxjs/Rx';
import 'rxjs/Rx';


@Injectable()
export class PingService {
  pingStream: Subject<number> = new Subject<number>();
  ping: number = 0;
  PublicURL: string = "http://186.167.32.27:81/maraveca/public/index.php/api/users/1/permission";
  PrivateURL: string = "http://200.209.74.4/maraveca/public/index.php/api/users/1/permission";


  constructor(private _http: Http) {
    Observable.interval(5000)
      .subscribe((data) => {
        let timeStart: number = performance.now();

        this._http.get(this.PublicURL)
          .timeout(3000)
          .subscribe((data) => {
            let timeEnd: number = performance.now();

            let ping: number = timeEnd - timeStart;
            this.ping = ping;
            console.log(this.ping)
            this.pingStream.next(ping);
          });
      });
  }
}
