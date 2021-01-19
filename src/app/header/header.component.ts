import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  OnInit
} from '@angular/core';
import { User } from '../_models/index';
import { AuthGuard } from '../_guards/index';
import { AuthenticationService } from '../_services/index';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";

import { environment } from '../../environments/environment'
import { AlarmasService } from '../services/alarmas/alarmas.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  autoupdate = true;
  dash_t = [];
  dash = [];
  averias: number;
  total: number;
  balance: number;
  balance_in: number;
  instalaciones: number;
  tickets: number;
  factibilidades: number;
  otrost: number;
  alarmas: any = []
  alerta: number = 0
  cantidadAlertas: number = 0
  constructor(
    public usuario: AuthGuard,
    public test: AuthenticationService,
    public http: Http,
    public alarmarService: AlarmasService
  ) {
    if (this.usuario.currentUser) {
      this.refresh(true);
    }
  }

  ngOnInit() {
    IntervalObservable.create(10000)
      .takeWhile(() => (this.usuario.currentUser))
      .subscribe(() => {
        this.refresh(false);
      });

    this.notificacion();
  }

  refresh(test) {
    this.http.get(environment.apiEndpoint + 'dash/', { params: { uid: this.usuario.currentUser.id_user } })

      .subscribe((data) => {
        this.dash_t = data.json();
        this.dash = this.dash_t;
        this.total = data.json().total;
        this.averias = data.json().averias;
        this.instalaciones = data.json().instalaciones;
        this.tickets = data.json().tickets;
        this.balance = data.json().balance;
        this.factibilidades = data.json().factibilidades;
        this.otrost = data.json().otrost;
        this.balance_in = data.json().balance_in;
      });
    this.notificacion();
  }

  notificacion() {
    this.alarmarService.notificacion().subscribe(res => { console.log(res), this.alarmas = res }, err => console.log(err))
  }
  cambiarAlerta() {
    if (this.alerta < this.alarmas.length - 1) {
      this.alerta++
    } else {
      this.alerta = 0
      
    }
  }

}
