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
import {DatePipe, Location} from '@angular/common';
import { environment } from '../../environments/environment';

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
      via: ['', [Validators.required]],
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
         this.http.get(environment.apiEndpoint+'clientes/')
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
         this.http.get(environment.apiEndpoint+'planes/')
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
         this.http.get(environment.apiEndpoint+'aps/')
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
         this.http.get(environment.apiEndpoint+'celdas/')
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
         this.http.get(environment.apiEndpoint+'servidor/')
         .subscribe((data) => {
           this.routers = data.json();
           // console.log(this.routers);
         });

       }
       this.notify.patchValue({
         detail:''
       })
     })

     this.notify.get('via').valueChanges.subscribe(
       (via) => {

         if (via === '2') {

           this.notify.get('message').setValidators([]);
  }
         this.notify.get('message').updateValueAndValidity();
  }
     );
  }

   sendSMS() {
     /*let params= {message: this.messaje,
     tipo: this.tipo,
     detail: this.detail}*/
     //this.notify.value.detail.forEach(n => {
    // const url = 'http://200.209.74.4/maraveca/public/index.php/api/tnotify';
     console.log(this.notify.value);
    const url = environment.apiEndpoint+'tnotify';
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


@Component({
  selector: 'app-notify',
  templateUrl: './sms_morosos.component.html',
  styleUrls: ['./notify.component.css']
})
export class sms_morosoComponent{
 // messaje: any;
  notify: FormGroup;
sms_moroso: any;
txt: any;
  messaje: any;
monto: any;
contador:any;
  constructor(private http: Http,
              public usuario: AuthGuard,
              private fb: FormBuilder,
              public snackBar: MdSnackBar,
              private router: Router,
              private location: Location,
              private _fb: FormBuilder,
              private date: DatePipe) {
this.monto= '{{monto}}'
    this.http.get(environment.apiEndpoint+'mensajes_morosos/')
      .subscribe((data) => {
        this.sms_moroso = data.json();
        console.log(this.sms_moroso[0]);
        console.log(this.sms_moroso[0].mensaje);
        console.log(this.sms_moroso[0].tipo_sms);


 this.txt= this.sms_moroso[0];



    console.log(this.txt);
    console.log(this.txt.mensaje);
    console.log(this.txt.tipo_sms);
    this.messaje = this.txt.mensaje;
    console.log(this.messaje);
      });
      /*this.notify = this.fb.group({
        message: this.txt.mensaje,
        tipo_sms: this.txt.tipo_sms,
        responsable: this.usuario.currentUser.id_user,
      });*/
    //} else
      this.notify = this.fb.group({
        mensaje: ['', [Validators.required]],
        tipo_sms: ['3', Validators.required],
        responsable: this.usuario.currentUser.id_user,
      });

    //}


  }
  onKey(event){
    this.contador = event.target.value.length;
  }


  sendSMS() {
    /*let params= {message: this.messaje,
    tipo: this.tipo,
    detail: this.detail}*/
    //this.notify.value.detail.forEach(n => {
    // const url = 'http://200.209.74.4/maraveca/public/index.php/api/tnotify';

    console.log(this.notify.value);
    const url = environment.apiEndpoint+'env_sms_morosos';
    const req = this.http.post(url, this.notify.value).subscribe((data) => {
      //this.messaje=""


    });
    this.snackBar.open("Procediendo a enviar mensajes", null, {
      duration: 5000,
    });
    //});
  }
  Close(){this.location.back();}

}
