import { ChangeDetectionStrategy,
Component,
EventEmitter,
Output,
OnInit } from '@angular/core';
import { User } from '../_models/index';
import { AuthGuard } from '../_guards/index';
import { AuthenticationService } from '../_services/index';
import { Observable } from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";

import { environment } from '../../environments/environment'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
autoupdate=true;
dash_t=[];
dash=[];
  constructor(
    public usuario: AuthGuard,
    public test: AuthenticationService,
    public http: Http,
    ) {
      if(this.usuario.currentUser){
        this.refresh(true);
      }
   }

  ngOnInit() {
    IntervalObservable.create(10000)
    .takeWhile(() => (this.usuario.currentUser))
    .subscribe(() => {
      this.refresh(false);
    });


  }

  refresh(test){
    this.http.get(environment.apiEndpoint+'dash/', {params:{uid: this.usuario.currentUser.id_user}})
    .subscribe((data) => {
      this.dash_t = data.json();
      this.dash = this.dash_t;
      //console.log(this.dash);

    });
  }
}
