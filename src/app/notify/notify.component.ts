import { Component, Inject, Pipe, PipeTransform, Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { DatePipe, Location } from '@angular/common';
import { environment } from '../../environments/environment';
import { NotificacionesService } from '../services/notificaciones/notificaciones.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {
  e:number = 1
  messaje: any;
  a_search: any;
  c_search: any;
  servicios: any;
  planes: any;
  aps: any;
  celdas: any;
  mangas: any;
  olts: any;
  routers: any;
  cajas: any;
  clientes: any;
  tipo: any;
  detail: any;
  notify: FormGroup;
  notify1: FormGroup;
  contador: number
  tipoNotificacion: number = 0
  tipoGrupo: number = 0
  busqueda: any = []
  DatosSeleccionados: any = []
  mensajes:any = []
  


  constructor(private http: Http,
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private router: Router,
    private _fb: FormBuilder,
    private date: DatePipe,
    private notificacionesService: NotificacionesService) {
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

  ngOnInit() {


    this.planes = null;
    this.aps = null;
    this.celdas = null;
    this.routers = null;
    this.clientes = null;

    this.notify.get('detail').setValidators([Validators.required]);
    this.http.get(environment.apiEndpoint + 'clientes/')
      .subscribe((data) => {
        this.clientes = data.json();
      });


    this.notify.get('detail').setValidators([]);



    this.notify.get('detail').setValidators([Validators.required]);
    this.http.get(environment.apiEndpoint + 'planes/')
      .subscribe((data) => {
        this.planes = data.json();
        // console.log(this.planes.slice(0,3));
      });



    this.notify.get('detail').setValidators([Validators.required]);
    this.http.get(environment.apiEndpoint + 'aps/')
      .subscribe((data) => {
        this.aps = data.json();
        // console.log(this.aps);
      });




    this.notify.get('detail').setValidators([Validators.required]);
    this.http.get(environment.apiEndpoint + 'celdas/')
      .subscribe((data) => {
        this.celdas = data.json();
        // console.log(this.celdas);
      });


    this.notify.get('detail').setValidators([Validators.required]);
    this.http.get(environment.apiEndpoint + 'servidor/')
      .subscribe((data) => {
        this.routers = data.json();
      });

    this.notify.get('detail').setValidators([Validators.required]);
    this.http.get(environment.apiEndpoint + 'traerCajas/')
      .subscribe((data) => {
        this.cajas = data.json();
        console.log(this.cajas);
      });

    this.notify.get('detail').setValidators([Validators.required]);
    this.http.get(environment.apiEndpoint + 'traerMangasEmpalme/')
      .subscribe((data) => {
        this.mangas = data.json();
        console.log(this.cajas);
      });

    this.notify.get('detail').setValidators([Validators.required]);
    this.http.get(environment.apiEndpoint + 'traerOlts/')
      .subscribe((data) => {
        this.olts = data.json();
        console.log(this.cajas);
      });


    this.notify.patchValue({
      detail: ''
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

  onSearchDatos(e: string) {
    if (this.tipoGrupo == 1) {
      this.busqueda = []
      this.clientes.filter(el => {
        if (el.nombre.toUpperCase().includes(e.toUpperCase())) {
          this.busqueda.push(el)
        }
      });
      console.log(this.busqueda)
    }

    if (this.tipoGrupo == 2) {
      this.busqueda = []
      this.routers.filter(el => {
        if (el.nombre_srvidor.toUpperCase().includes(e.toUpperCase())) {
          this.busqueda.push(el)
        }
      });
      console.log(this.busqueda)
    }

    if (this.tipoGrupo == 3) {
      this.busqueda = []
      this.celdas.filter(el => {
        if (el.nombre_celda.toUpperCase().includes(e.toUpperCase())) {
          this.busqueda.push(el)
        }
      });
      console.log(this.busqueda)
    }

    if (this.tipoGrupo == 4) {
      this.busqueda = []
      this.aps.filter(el => {
        if (el.nombre_ap.toUpperCase().includes(e.toUpperCase())) {
          this.busqueda.push(el)
        }
      });
      console.log(this.busqueda)
    }

    if (this.tipoGrupo == 5) {
      this.busqueda = []
      this.cajas.filter(el => {
        if (el.nombre_caja.toUpperCase().includes(e.toUpperCase())) {
          this.busqueda.push(el)
        }
      });
      console.log(this.busqueda)
    }

    if (this.tipoGrupo == 6) {
      this.busqueda = []
      this.mangas.filter(el => {
        if (el.nombre_manga.toUpperCase().includes(e.toUpperCase())) {
          this.busqueda.push(el)
        }
      });
      console.log(this.busqueda)
    }

    if (this.tipoGrupo == 7) {
      this.busqueda = []
      this.olts.filter(el => {
        if (el.nombre_olt.toUpperCase().includes(e.toUpperCase())) {
          this.busqueda.push(el)
        }
      });
      console.log(this.busqueda)
    }

  }

  agregarDatosLista(datos: any) {
    this.DatosSeleccionados.push(datos)
    console.log(this.DatosSeleccionados)
  }

  DeseleccionarCliente(i: number) {
    console.log(i)
    this.DatosSeleccionados.splice(i, 1);
  }

  cambioGrupo() {
    this.DatosSeleccionados = []
    this.busqueda = []
  }

  enviarSMS() {

    this.notificacionesService.enviarNotificacion(this.usuario.currentUser.id_user, this.tipoGrupo, this.DatosSeleccionados, this.messaje)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      )


  }

  sendSMS() {
    console.log(this.notify.value);
    const url = environment.apiEndpoint + 'tnotify';
    const req = this.http.post(url, this.notify.value).subscribe((data) => {
      this.detail = []
      this.messaje = ""
      this.snackBar.open("Total de enviados: " + data.json().number + " mensajes", null, {
        duration: 5000,
      });

    });
    //});
  }
  onKey(event) {
    this.contador = event.target.value.length;
  }

}


@Component({
  selector: 'app-notify',
  templateUrl: './sms_morosos.component.html',
  styleUrls: ['./notify.component.css']
})
export class sms_morosoComponent {
  e: number = 0
  mensajes: any = []
  // messaje: any;
  notify: FormGroup;
  sms_moroso: any;
  txt: any;
  messaje: any;
  mensaje:any
  monto: any;
  contador: any;
  constructor(private http: Http,
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private router: Router,
    private location: Location,
    private _fb: FormBuilder,
    private date: DatePipe,
    private notificacionesService: NotificacionesService) {
    this.monto = '{{monto}}'
    this.http.get(environment.apiEndpoint + 'mensajes_morosos/')
      .subscribe((data) => {
        this.sms_moroso = data.json();
        console.log(this.sms_moroso[0]);
        console.log(this.sms_moroso[0].mensaje);
        console.log(this.sms_moroso[0].tipo_sms);


        this.txt = this.sms_moroso[0];



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
      mensaje: [this.messaje, [Validators.required]],
      tipo_sms: ['3', Validators.required],
      responsable: this.usuario.currentUser.id_user,
    });

    //}


  }

  ngOnInit() {
    this.traerLista()
  }

  traerLista() {
    this.notificacionesService.traerLista().subscribe(res => this.mensajes = res, err => console.log(err))
  }

  onKey(event) {
    this.contador = event.target.value.length;
  }


  sendSMS() {
    this.notificacionesService.enviarMensajeDeuda(this.usuario.currentUser.id_user, 3, this.messaje).subscribe(res => console.log(res), err => console.log(err))
    /*
    console.log(this.notify.value);
    const url = environment.apiEndpoint+'env_sms_morosos';
    const req = this.http.post(url, this.notify.value).subscribe((data) => {
      //this.messaje=""


    });
    */
    this.snackBar.open("Procediendo a enviar mensajes", null, {
      duration: 5000,
    });
    //});
  }
  Close() { this.location.back(); }

}
