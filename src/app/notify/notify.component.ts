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
import { AuthGuard } from '../_guards/index';
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
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private router: Router,
    private _fb: FormBuilder,
    private date: DatePipe) {
    this.notify = this.fb.group({
      tipo: ['', [Validators.required]],
      detail: ['', [Validators.required]],
      message: ['', [Validators.required]],
      responsable: this.usuario.currentUser.id_user,
      a_search: [''],
      p_search: [''],
      c_search: [''],
      r_celda: [''],
      u_celda: [''],


    });
   }

   ngOnInit(){
     this.notify.get("tipo").valueChanges.subscribe((tipo)=>{
       if (tipo ==='6'){
         this.planes=null;
         this.aps=null;
         this.celdas=null;
         this.routers=null;
         this.clientes=null;

         this.notify.get('detail').setValidators([Validators.required]);
         this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/clientes/')
         .subscribe((data) => {
           this.clientes = data.json();
           // console.log(this.routers);
         });
       }else if (tipo ==='5'){
         this.planes=null;
         this.aps=null;
         this.celdas=null;
         this.routers=null;
         this.clientes=null;

         this.notify.get('detail').setValidators([]);

       }else if(tipo === '4'){
         this.planes=null;
         this.aps=null;
         this.celdas=null;
         this.routers=null;
         this.clientes=null;

         this.notify.get('detail').setValidators([Validators.required]);
         this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/planes/')
         .subscribe((data) => {
           this.planes = data.json();
           // console.log(this.planes.slice(0,3));
         });

       }else if(tipo === '3'){
         this.planes=null;
         this.aps=null;
         this.celdas=null;
         this.routers=null;
         this.clientes=null;

         this.notify.get('detail').setValidators([Validators.required]);
         this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/aps/')
         .subscribe((data) => {
           this.aps = data.json();
           // console.log(this.aps);
         });

       }else if(tipo === '2'){
         this.planes=null;
         this.aps=null;
         this.celdas=null;
         this.routers=null;
         this.clientes=null;

         this.notify.get('detail').setValidators([Validators.required]);
         this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/celdas/')
         .subscribe((data) => {
           this.celdas = data.json();
           // console.log(this.celdas);
         });

       }else if(tipo === '1'){
         this.planes=null;
         this.aps=null;
         this.celdas=null;
         this.routers=null;
         this.clientes=null;

         this.notify.get('detail').setValidators([Validators.required]);
         this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/servidor/')
         .subscribe((data) => {
           this.routers = data.json();
           // console.log(this.routers);
         });

       }
       this.notify.patchValue({
         detail:''
       })
     })
   }

   sendSMS() {
     /*let params= {message: this.messaje,
     tipo: this.tipo,
     detail: this.detail}*/
     //this.notify.value.detail.forEach(n => {
    // const url = 'http://200.209.74.4/maraveca/public/index.php/api/tnotify';
    const url = 'http://186.167.32.27:81/maraveca/public/index.php/api/tnotify';
       const req = this.http.post(url, this.notify.value).subscribe((data) => {
         this.detail = []
         this.messaje=""
         this.snackBar.open("Total de enviados: "+data.json().number+" mensajes", null, {
           duration: 5000,
         });

       });
     //});
   }


}
