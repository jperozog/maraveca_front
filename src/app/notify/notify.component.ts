import {Component, Inject, Pipe, PipeTransform, Injectable, OnInit} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit{
  messaje: any;
  a_search: any;
  c_search: any;
  servicios: any;
  planes: any;
  aps: any;
  celdas: any;
  routers: any;
  clientes: any;
  tipo: any;
  detail: any;
  notify: FormGroup;
  notify1: FormGroup;



  constructor(private http: Http,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private router: Router,
    private _fb: FormBuilder,
    private date: DatePipe) {
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/planes/')
    .subscribe((data) => {
      this.planes = data.json();
      // console.log(this.planes.slice(0,3));
    });
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/aps/')
    .subscribe((data) => {
      this.aps = data.json();
      // console.log(this.aps);
    });
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/celdas/')
    .subscribe((data) => {
      this.celdas = data.json();
      // console.log(this.celdas);
    });
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/servidor/')
    .subscribe((data) => {
      this.routers = data.json();
      // console.log(this.routers);
    });
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/clientes/')
    .subscribe((data) => {
      this.clientes = data.json();
      // console.log(this.routers);
    });

    this.notify = this.fb.group({
      tipo: ['', [Validators.required]],
      detail: ['', [Validators.required]],
      message: ['', [Validators.required]],
      a_search: [''],
      p_search: [''],
      c_search: [''],
      r_celda: [''],
      u_celda: [''],


    });
   }

   ngOnInit(){
     this.notify.get("tipo").valueChanges.subscribe(()=>{
       this.notify.patchValue({
         detail:''
       })
     })
   }

   sendSMS() {
     /*let params= {message: this.messaje,
     tipo: this.tipo,
     detail: this.detail}*/
     this.notify.value.detail.forEach(n => {
       this.notify1 = this.fb.group({
         tipo: [this.notify.value.tipo],
         detail: [n],
         message: [this.notify.value.message],
       });
       const url = 'http://186.167.32.27:81/maraveca/public/index.php/api/tnotify';
       const req = this.http.post(url, this.notify1.value).subscribe((data) => {
         this.detail = []
         this.messaje=""
         this.snackBar.open("Mensajes Enviados", null, {
           duration: 2000,
         });

       });
     });
   }


}
