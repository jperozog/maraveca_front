import { Component, OnInit } from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {Router} from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {
  inventarios:any
  inventarios_t:any
  update:boolean=false
  autoupdate:boolean=true

  constructor(
    private http: Http,
    public usuario: AuthGuard,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    public router: Router)
    {

    }

    ngOnInit() {
      IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
    }
    refresh(nf){
      this.update=true
      this.http.get(environment.apiEndpoint+'inventarios/')
        .subscribe((data) => {
          this.inventarios_t = data.json()
          this.update=false
          if (nf){
            this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          });}
        });
        this.inventarios=this.inventarios_t
    }

}
