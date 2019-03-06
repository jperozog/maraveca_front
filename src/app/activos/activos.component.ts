import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Location } from '@angular/common';
import {Observable} from 'rxjs/Observable';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-activos',
  templateUrl: './activos.component.html',
  styleUrls: ['./activos.component.css']
})
export class ActivosComponent implements OnInit, OnDestroy {
  activos_t:any
  activos:any
  autoupdate:boolean = true
  update: boolean = false
  constructor(private http: Http,
  public usuario: AuthGuard,
  public dialog: MdDialog,
  public snackBar:MdSnackBar,
  public router: Router) { }

  ngOnInit() {
    IntervalObservable.create(10000)
    .takeWhile(() => this.autoupdate)
    .subscribe(() => {
      this.refresh(false);
    });
    this.refresh(false);
  }

  ngOnDestroy(){
    this.autoupdate=false
  }

  refresh(nf){
    this.update=true
    this.http.get(environment.apiEndpoint+'activos/')
      .subscribe((data) => {
        this.activos_t = data.json()
        this.update=false
        if (nf){
          this.snackBar.open("Lista Actualizada", null, {
          duration: 2000,
        });}
        setTimeout(()=>{this.activos=this.activos_t})
      });

  }
}
@Component({
  selector: 'app-activos',
  templateUrl: './Activos_Detallados.component.html',
  styleUrls: ['./activos.component.css']
})
export class ActivosDetComponent implements OnInit, OnDestroy {
  activos_t:any
  activos:any
  autoupdate:boolean = true
  update: boolean = false
  det:any
  constructor(private http: Http,
  public usuario: AuthGuard,
  public dialog: MdDialog,
  private route: ActivatedRoute,
  public snackBar:MdSnackBar,
  public router: Router) {
    this.route.params
      .subscribe(
        params => {
          this.det = params.det;
          console.log(this.det)
        }
      ); }

  ngOnInit() {
    IntervalObservable.create(10000)
    .takeWhile(() => this.autoupdate)
    .subscribe(() => {
      this.refresh(false);
    });
    this.refresh(false);
  }

  ngOnDestroy(){
    this.autoupdate=false
  }

  refresh(nf){
    this.update=true
    this.http.get(environment.apiEndpoint+'activosdet/', {params: {id: this.det}})
      .subscribe((data) => {
        this.activos_t = data.json()
        this.update=false
        if (nf){
          this.snackBar.open("Lista Actualizada", null, {
          duration: 2000,
        });}
        setTimeout(()=>{this.activos=this.activos_t})
      });

  }
}
