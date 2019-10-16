import { Component, Inject, Pipe, PipeTransform, Injectable, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment'
import {DeleteticketDialog} from '../soporte/soporte.component';
import {IpValidators} from './validar_ip';
import {SerialValidators} from './validar_serial';

const MAC_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit, OnDestroy {

  update = true;
  autoupdate: boolean

  data: any = [];
  installs: any = [];
  data_t: any = [];
  installs_t: any = [];
  search: string = '';
  search_p: string = '';
  search_s: string = '';
  p_search = null;
  planes: any;

  @ViewChildren('servicios') spr;
  constructor(
    public usuario: AuthGuard,
    private http: Http, public dialog: MdDialog, public snackBar: MdSnackBar, private router: Router) {
    this.autoupdate = true;
    this.snackBar.open("Cargando Clientes", null, {
      duration: 2000,

    });

  }

  ngOnInit() {
    console.log(this.spr)
    console.log('check')
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
        console.log(this.spr)
        console.log('check')
          });

    this.http.get(environment.apiEndpoint + 'planes/')
      .subscribe((data) => {
        this.planes = data.json().planes;
        console.log(this.data);
      });

    this.http.get(environment.apiEndpoint + 'servicios/')
      .subscribe((data) => {

        this.data = data.json().servicios;
        this.installs = data.json().soportes;
        this.data_t = this.data;
        this.installs_t = this.installs;
        this.snackBar.open("Clientes Cargados", null, {
          duration: 2000,
        });
        this.update = false
      });

  }
  ngOnDestroy() {
    this.autoupdate = false
  }

  stopPropagation(event) {
    event.stopPropagation();
    //console.log(this.plan_srv_s);
  }

  refresh(nf) {
    this.update = true
    this.autoupdate = false
    this.http.get(environment.apiEndpoint + 'servicios/')
      .subscribe((data) => {
        this.data_t = data.json().servicios;
        this.installs_t = data.json().soportes;
        this.autoupdate = true
        this.update = false
        this.data = this.data_t;
        this.installs = this.installs_t;
        if (nf) {
          this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          });
        }
      });

  }

  openDialog(): void {
    this.autoupdate = false;
    let dialogRef = this.dialog.open(AddservicesComponent, {
      panelClass: 'my-full-screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.autoupdate = true;
      this.ngOnInit();
      console.log('The dialog was closed');
    })
  }
  show(row) {
    console.log(row);
    this.autoupdate = false;

    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(AddservicesComponent, {
      panelClass: 'my-full-screen-dialog',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      this.autoupdate = true;
      this.ngOnInit();
      console.log('The dialog was AddClient closed');
      this.update = true
      this.http.get(environment.apiEndpoint + 'servicios/')
        .subscribe((data) => {
          this.data = data.json().servicios;
          this.installs = data.json().soportes;
          console.log(this.data);
          console.log(this.installs.length);
          this.update = false

        });
    });
    //this.myService.refresh();
  }

  register(row) {
    this.autoupdate = false;
    console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(AddPendingComponent, {
      panelClass: 'my-full-screen-dialog',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      this.autoupdate = true;
      this.ngOnInit();
      this.update = true
      console.log('The dialog was AddClientPending closed');
      this.http.get(environment.apiEndpoint + 'servicios/')
        .subscribe((data) => {
          this.data = data.json().servicios;
          this.installs = data.json().soportes;
          console.log(this.data);
          console.log(this.installs.length);
          this.update = false
        });
    });
    //this.myService.refresh();
  }
  deleteservice(row) : void {
    console.log(row); //show`s id
    let dialogRef = this.dialog.open(DeleteserviceDialog, {
      width: '250px',
      data:row

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });

  }
  private openLINK(url) {
    console.log(url)
    window.open("http://186.167.32.27:81/maraveca/test.php?ip=" + url, '_blank');
  }

  /*private delete(id): void {
    console.log(id); //show`s id
    this.myService.deleteData(id)
      .subscribe((data) => { console.log(data) });
    this.snackBar.open("Borrando Cliente: Por favor espere", null, {
      duration: 2000,
    });
    //this.myService.refresh();

  }*/

}

function capitalizeName(name) {
  return name.replace(/\b(\w)/g, s => s.toUpperCase());
}
@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-delete.html',
  styleUrls: ['./servicios.component.css']
})

export class DeleteserviceDialog {
  myService: MyService | null;


  constructor(
    public dialogRef: MdDialogRef<DeleteserviceDialog>,
    @Inject(MD_DIALOG_DATA) public data: any, private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router, private usuario: AuthGuard) {
    this.myService = new MyService(http, router, usuario);
 console.log(data);

  }


delete(): void {

  console.log("borrando"+" "+this.data+"...");
  this.myService.deleteData(this.data)
      .subscribe((data) => { console.log(data) });

    this.snackBar.open("Borrando Servicio: Por favor espere", null, {
      duration: 3000,
    });
    //this.myService.refresh();*!/
  this.dialogRef.close(

  );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


export class MyService {


  constructor(private http: Http, private router: Router, private usuario: AuthGuard, ) { }

  deleteData(id) {
    return this.http.delete(environment.apiEndpoint + 'servicios/' + id + '?responsable=' + this.usuario.currentUser.id_user, {})
      .map((resp: Response) => resp.json());

  }
  refresh() {

    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('services') > -1 ? '/celdas' : '/services';

    setTimeout(() => {
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
    },
      2000);
  }



}


@Component({
  selector: 'app-add-services',
  templateUrl: './add-Servicio.component.html',
  styleUrls: ['./servicios.component.css'],
  providers: [DatePipe, IpValidators , SerialValidators]
})
export class AddservicesComponent implements OnInit {

  addClient: FormGroup;
  funciones: MyService | null;
  planes: any = null;
  clientes: any = null;
  equipos: any = null;
  servidores: any = null;
  equipo: any = null;
  aps: any = null;
  cliente: any = null;
  c_search: string;
  p_search: string;
  C_search: string;
  a_search: string;
  planes1:any;
  planesd:any;
planes2:any;
  //address : string;
  direccion: any;
  valor_serie = 0;
nombre_ap: any;
ip_ap: any;
ap_srv: any;

  constructor(private http: Http,
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddservicesComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    private _fb: FormBuilder,
              private validacion_ip: IpValidators,
              private validacion_serial: SerialValidators,
    private date: DatePipe) {


    this.http.get(environment.apiEndpoint + 'add_preload/')
      .subscribe((data) => {
        this.clientes = data.json().clientes;
        this.equipo = data.json().equipos;
        this.aps = data.json().aps;
        this.planes = data.json().planes;
        this.planes1 = data.json().planes1;
        this.planes2 = data.json().planes2;
        this.planesd = data.json().planesd;
        this.direccion = data.json().clientes.direccion;
        console.log(this.direccion);
        console.log(this.clientes.slice(0, 3));
        console.log(this.planesd);
        console.log(this.planes1);
        console.log(this.planes2);

      });

    this.funciones = new MyService(http, router, usuario);
console.log(row);
    if (row != null) {
      this.ip_ap = row.ip_ap;
      this.nombre_ap = row.nombre_ap;
      this.ap_srv = row.ap_srv;

    }
    if (row != null) {
      this.addClient = this.fb.group({
        responsable: this.usuario.currentUser.id_user,
        plan_srv: [row.plan_srv,[Validators.required]],
        tipo_plan_srv: row.tipo_plan_srv,
        cliente_srv: row.cliente_srv,
       // direccion_srv: row.direccion_srv,
        modo_pago_srv: row.modo_pago_srv,
        serie_srv: row.serie_srv,
        instalacion_srv: row.instalacion_srv,
        recibo_srv: row.recibo_srv,
        costo_instalacion_srv: row.costo_instalacion_srv,
        credito_srv: row.credito_srv,
        notify_srv: row.notify_srv,
        start_srv: row.start_srv,
        ip_srv:  row.ip_srv,     //[row.ip_srv,[Validators.required], [this.validacion_ip.ipValidator()]],
        signal_srv: row.signal_srv,
        //servidor_srv: row.servidor_srv,
        ap_srv: row.ap_srv,
        serial_srv: row.serial_srv,
        mac_srv: [row.mac_srv, [Validators.required, Validators.pattern(MAC_REGEX)]],
        zona_srv: row.zona_srv,
        stat_srv: row.stat_srv,
        comment_srv: row.comment_srv,
        equipo_srv: row.equipo_srv,
        id_srv: row.id_srv,
        pro: '',
        c_search: '',
        p_search: '',
        C_search: '',
      //  a_search: '',

        //email: [row.email, [Validators.required, Validators.pattern(null)]],
        //phone1: [row.phone1, [Validators.required, Validators.pattern(null)]],

      });
      //console.log(row)
    } else {

      this.addClient = this.fb.group({
        responsable: this.usuario.currentUser.id_user,
        plan_srv: ['', Validators.required],
        modo_pago_srv: '',
        tipo_plan_srv: ['', Validators.required],
      //  direccion_srv: ['', Validators.required],
        serie_srv: [0, Validators.required],
        cliente_srv: ['', Validators.required],
        instalacion_srv: ['', Validators.required],
        recibo_srv: '',
        costo_instalacion_srv: '',
        credito_srv: '40',
        notify_srv: '',
        start_srv: ['', Validators.required],
        ip_srv: ['', [Validators.required], [this.validacion_ip.ipValidator()]],
        signal_srv: '',
        //servidor_srv: '',
        ap_srv: ['', Validators.required],
        serial_srv: ['', [Validators.required]],/*[this.validacion_serial.serialValidator()]],*/
        mac_srv: ['', [Validators.required, Validators.pattern(MAC_REGEX)]],
        zona_srv: '',
        stat_srv: ['', Validators.required],
        comment_srv: '',
        equipo_srv: ['', Validators.required],
        pro: '',
        c_search: '',
        p_search: '',
        C_search: '',
        a_search: '',

        //email: ['', [Validators.required, Validators.pattern(null)]],
        //phone1: ['', [Validators.required, Validators.pattern(null)]],

      });
      //console.log("llego vacio"+ row)
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.addClient.get('serial_srv').valueChanges.subscribe(
      (EN) => {
        setTimeout(() => {
          var pre = this.addClient.value.serial_srv.replace(/(.{2})/g, '$&:')
          this.addClient.patchValue(
            {
              serial_srv: this.addClient.value.serial_srv.replace(/[^a-zA-Z0-9 ]/g, ""),
              mac_srv: pre.replace(/(^:+|:+$)/g, "")
              //mac_srv: pre.replace(/(.{16})/g, '$&')
            }
          )
          this.addClient.updateValueAndValidity();
        }, 200);
      })
  }

  Enviar() {

    var client = this.addClient.value;
    //console.log(JSON.stringify(this.addClient.value));
    let dp = new DatePipe(navigator.language);
    var url = environment.apiEndpoint + "servicios";
    //console.log(body);
    var url2 = environment.apiEndpoint + "tplancl/" +  client.cliente_srv;
    var put: FormGroup
    put = this.fb.group({
      cliente_srv: client.cliente_srv
    })
    this.snackBar.open("Agregando Cliente: Por favor espere", null, {
      duration: 2000,
    });
      this.http.post(url, this.addClient.value).delay(1000).subscribe((data) => {
        this.http.put(url2, put.value).subscribe((data) => {

        });
      this.dialogRef.close();
    });
    console.log(this.addClient.value);
    //console.log(client.cliente_srv);

    /*var put: FormGroup
    put = this.fb.group({
      cliente_srv: client.cliente_srv
    })
    var url = environment.apiEndpoint + "tplancl/" +  client.cliente_srv;
    this.http.put(url, put.value).subscribe((data) => {

    });*/
    //  this.funciones.refresh();
    //this.router.navigate(['/clientes']);
   // console.log(client.cliente_srv);
  }
  Editar() {
    var client = this.addClient.value;
    //console.log(JSON.stringify(this.addClient.value));
    let dp = new DatePipe(navigator.language);
    var url = environment.apiEndpoint + "servicios/" + client.id_srv;
    //console.log(body);
    var url2 = environment.apiEndpoint + "tplancl/" +  client.cliente_srv;
    var put: FormGroup

    put = this.fb.group({
      cliente_srv: client.cliente_srv
    })
    this.snackBar.open("Agregando Cliente: Por favor espere", null, {
      duration: 2000,
    });

    this.http.put(url, this.addClient.value).delay(1000).subscribe((data) => {
      this.http.put(url2, put.value).subscribe((data) => {

      });
      this.dialogRef.close();

    });
  /*  console.log(this.addClient.value);
    var put: FormGroup

    put = this.fb.group({
      cliente_srv: client.cliente_srv
    })
    var url = environment.apiEndpoint + "tplancl/" +  client.cliente_srv;
    this.http.put(url, put.value).subscribe((data) => {

    });*/
    //this.funciones.refresh();
    //this.router.navigate(['/clientes']);
  }


}

@Component({
  selector: 'app-add-Pending',
  templateUrl: './add-Servicio.pending.component.html',
  styleUrls: ['./servicios.component.css'],
  providers: [DatePipe, IpValidators , SerialValidators]
})
export class AddPendingComponent implements OnInit {

  addClient: FormGroup;
  post: FormGroup;
  funciones: MyService | null;
  planes: any = [];
  clientes: any = [];
  equipos: any = [];
  aps: any = [];
  servidores: any = null;
  equipo: any = [];
  cliente: any = [];
  c_search: string;
  p_search: string;
  C_search: string;
  a_search: string;
  planes_ = [];
  ap_edit = true;
  plan_edit = true;
  cliente_edit = true;
  equipo_edit = true;
  planesd: any = [];
  planes1:any = [];
  planes2:any = [];
  planes_p:any = [];
  plan_f:any;
  valor_serie = 0;
 // address: string;

  //value.replace(/\b\w/g, first => first.toLocaleUpperCase())


  constructor(private http: Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddPendingComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
              private validacion_ip: IpValidators,
              //private validacion_serial: SerialValidators,
    private _fb: FormBuilder,
    private date: DatePipe,
    public usuario: AuthGuard) {

console.log(row);
    this.http.get(environment.apiEndpoint + 'planes/'+ row.plan)
      .subscribe((data) => {
        this.planes_p = data.json();

        this.plan_f= this.planes_p[0];
        console.log(this.plan_f);
        //this.id_plan= this.planes_p[0].id_plan;
      });
    this.http.get(environment.apiEndpoint + 'add_preload/')
      .subscribe((data) => {
        this.clientes = data.json().clientes;
        this.equipo = data.json().equipos;
        this.aps = data.json().aps;
        this.planes = data.json().planes;
        this.planes1 = data.json().planes1;
        this.planes2 = data.json().planes2;
        this.planesd = data.json().planesd;

        console.log(this.planes);
        console.log(this.equipo);
        console.log(this.planesd);
        console.log(this.planes1);
        console.log(this.planes2);
console.log(this.equipo);
      });
    this.funciones = new MyService(http, router, usuario);

  this.addClient = this.fb.group({
    plan_srv: ['', Validators.required],
    tipo_plan_srv: ['', Validators.required],
    cliente_srv: ['', Validators.required],
    // direccion_srv: ['', Validators.required],
    instalacion_srv: [this.row.updated_at, Validators.required],
    recibo_srv: '',
    costo_instalacion_srv: '',
    modo_pago_srv: 1,
    credito_srv: '40',
    notify_srv: '',
    start_srv: ['', Validators.required],
    ip_srv: ['', [Validators.required], [this.validacion_ip.ipValidator()]],
    planes_: '',
    serie_srv: [0, Validators.required],
    comment_: '',
    //celda_srv: '',
    //servidor_srv: '',
    ap_srv: ['', Validators.required],
    serial_srv: ['', Validators.required],
    mac_srv: ['', [Validators.required, Validators.pattern(MAC_REGEX)]],
    zona_srv: '',
    stat_srv: ['', Validators.required],
    comment_srv: '',
    equipo_srv: ['', Validators.required],
    c_search: '',
    p_search: '',
    C_search: '',
    a_search: '',
    //email: ['', [Validators.required, Validators.pattern(null)]],
    //phone1: ['', [Validators.required, Validators.pattern(null)]],

  });


    //console.log("llego vacio"+ row)


    }




  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (this.row) {
      var serial = "";
      var pre = "";
      setTimeout(() => {
        if (this.row.serial) {
          pre = this.row.serial.replace(/(.{2})/g, '$&:')
          serial = this.row.serial
        }
        console.log(this.row.plan);

        this.addClient.patchValue({
          plan_srv: +this.row.plan_srv,
          tipo_plan_srv:  this.row.tipo_plan_srv,

          serie_srv: 0,
          modo_pago_srv: 1,
          //direccion_srv: this.row.direccion,
          cliente_srv: +this.row.servicio_soporte,
          equipo_srv: +this.row.equipo,
          ap_srv: Number(this.row.ap),
          instalacion_srv: +this.row.updated_at,
          recibo_srv: +this.row.recibo_srv,
          costo_instalacion_srv: '0',
          credito_srv: '40',
          notify_srv: +this.row.notify_srv,
          start_srv: this.row.start_srv,
          ip_srv: this.row.ipP,
          serial_srv: serial,
          zona_srv: +this.row.zona_srv,
          comment_srv: this.row.comment_srv,
          planes_: this.plan_f,
          mac_srv: pre.replace(/(^:+|:+$)/g, "")

        })
        this.addClient.updateValueAndValidity();

      },
        200);

    }

    this.addClient.get('ap_srv').valueChanges.subscribe(
      (ap_srv) => {

      }
    )


    this.addClient.get('serial_srv').valueChanges.subscribe(
      (EN) => {
        setTimeout(() => {
          var pre = this.addClient.value.serial_srv.replace(/(.{2})/g, '$&:')
          this.addClient.patchValue(
            {
              serial_srv: this.addClient.value.serial_srv.replace(/[^a-zA-Z0-9 ]/g, ""),
              mac_srv: pre.replace(/(^:+|:+$)/g, "")
              //mac_srv: pre.replace(/(.{16})/g, '$&')
            }
          )
          this.addClient.updateValueAndValidity();
        }, 200);
      })
  }
  deleter(req) {
    for (var i = 0; i < this.planes_.length; i++) {
      if (this.planes_[i]["name_plan"] == req.name_plan && this.planes_[i]["comment_"] == req.valor) {
        this.planes_.splice(i, 1);
      }
    }
  }
  edit_ap(ap) {
    this.ap_edit = true;
  }
  edit_client() {
    this.cliente_edit = true;
  }
  edit_equipo() {
    this.equipo_edit = true;

  }
  edit_plan() {
    this.plan_edit = true;
  }
  addr() {
    this.planes_.push({ id_plan: this.addClient.value.planes_.id_plan, name_plan: this.addClient.value.planes_.name_plan, comment: this.addClient.value.comment_ })
    console.log(this.planes);
    console.log (this.planes_)
    console.log (this.planes_.length)
    console.log(this.addClient.value.planes_.id_plan);
    console.log(this.addClient.value.planes_.name_plan);
    this.addClient.patchValue({
      planes_: '',
      comment_: ''
    })
  }

  Enviar() {

    if (this.planes_.length >= 1) {
      var post = this.addClient.value;
      this.planes_.forEach((item, key) => {
        this.post = this.fb.group({
          cliente_srv: post.cliente_srv,
          modo_pago_srv: post.modo_pago_srv,
          instalacion_srv: post.instalacion_srv,
          serie_srv: post.serie_srv,
         // direccion_srv: post.direccion_srv,
          tipo_plan_srv:  post.tipo_plan_srv,
          recibo_srv: post.recibo_srv,
          costo_instalacion_srv: post.costo_instalacion_srv,
          credito_srv: post.credito_srv,
          start_srv: post.start_srv,
          notify_srv: post.notify_srv,
          equipo_srv: post.equipo_srv,
          ip_srv: post.ip_srv,
          mac_srv: post.mac_srv,
          serial_srv: post.serial_srv,
          ap_srv: post.ap_srv,
          zona_srv: post.zona_srv,
          plan_srv: item.id_plan,
          stat_srv: post.stat_srv,
          comment_srv: item.comment,
          planes_: post.plan_srv,
          responsable: this.usuario.currentUser.id_user,

        });

        var url = environment.apiEndpoint + "retirar_ip_mk/" + this.row.id_soporte;
        this.http.put(url, this.post.value).subscribe((data) => {

        });
        var url = environment.apiEndpoint + "servicios";
        this.http.post(url, this.post.value).subscribe((data) => {
          var put: FormGroup
          put = this.fb.group({
            status_soporte: "4"

          })
          console.log(this.row.id_soporte);
          console.log(put.value);
          var url = environment.apiEndpoint + "soporte/" + this.row.id_soporte;
          this.http.put(url, put.value).subscribe((data) => {
            console.log(put.value);
          });
          var put1: FormGroup
          put1 = this.fb.group({
            cliente_srv: post.cliente_srv
          })
          var url = environment.apiEndpoint + "tplancl/" + this.row.servicio_soporte;
          this.http.put(url, put1.value).subscribe((data) => {
console.log(put1.value);
          });
        });
        this.dialogRef.close();
        this.snackBar.open("Servicio Registrado", null, {
          duration: 2000,
        });

      });

    }
    /*var client = this.addClient.value;
    //console.log(JSON.stringify(this.addClient.value));
    let dp = new DatePipe(navigator.language);
    var body =
    "plan_srv=" + client.plan_srv +
    "&cliente_srv=" + client.cliente_srv +
    "&instalacion_srv=" + client.instalacion_srv +
    "&recibo_srv="+client.recibo_srv+
    "&costo_instalacion_srv="+client.costo_instalacion_srv+
    "&credito_srv="+client.credito_srv+
    "&start_srv="+client.start_srv+
    //"&notify_srv="+client.notify_srv+
    "&equipo_srv="+client.equipo_srv+
    "&ip_srv="+client.ip_srv+
    "&mac_srv="+client.mac_srv+
    "&serial_srv="+client.serial_srv+
    //"&servidor_srv="+client.servidor_srv+
    //"&celda_srv="+client.celda_srv+
    "&ap_srv="+client.ap_srv+
    "&zona_srv="+client.zona_srv+
    "&stat_srv="+client.stat_srv+
    "&comment_srv="+client.comment_srv

    var url = environment.apiEndpoint+"servicios?"+body;
    //console.log(body);

    this.http.post(url, body).subscribe((data) => {});
    this.dialogRef.close();
    this.funciones.refresh();
    this.snackBar.open("Agregando Cliente: Por favor espere", null, {
      duration: 2000,
    });
    //this.router.navigate(['/clientes']);*/
  }

}




//sshfs oroxo@186.167.32.27:81:/var/www/htdocs/filemanager Plantillas && scrot 'screen.png' -e 'mv $f ~/shots/' && fusermount -u Plantillas

@Component({
  selector: 'app-add-services',
  templateUrl: './update_service.component.html',
  styleUrls: ['./servicios.component.css'],
  providers: [DatePipe, IpValidators , SerialValidators]
})
export class UpdateserviceComponent implements OnInit {

  addClient: FormGroup;
  funciones: MyService | null;
  planes: any = null;
  clientes: any = null;
  equipos: any = null;
  servidores: any = null;
  equipo: any = null;
  aps: any = null;
  cliente: any = null;
  c_search: string;
  p_search: string;
  C_search: string;
  a_search: string;
  planes1:any;
  planesd:any;
  planes2:any;
  //address : string;
  direccion: any;
  valor_serie = 0;
  nombre_ap: any;
  ip_ap: any;
  ap_srv: any;
  editable: boolean = true;

  constructor(private http: Http,
              public usuario: AuthGuard,
              private fb: FormBuilder,
              public dialogRef: MdDialogRef<AddservicesComponent>,
              @Inject(MD_DIALOG_DATA) public row: any,
              public snackBar: MdSnackBar,
              private router: Router,
              private _fb: FormBuilder,
              private validacion_ip: IpValidators,
              private validacion_serial: SerialValidators,
              private date: DatePipe) {


    this.http.get(environment.apiEndpoint + 'add_preload/')
      .subscribe((data) => {
        this.clientes = data.json().clientes;
        this.equipo = data.json().equipos;
        this.aps = data.json().aps;
        this.planes = data.json().planes;
        this.planes1 = data.json().planes1;
        this.planes2 = data.json().planes2;
        this.planesd = data.json().planesd;
        this.direccion = data.json().clientes.direccion;
        console.log(this.direccion);
        console.log(this.clientes.slice(0, 3));
        console.log(this.planesd);
        console.log(this.planes1);
        console.log(this.planes2);

      });

    this.funciones = new MyService(http, router, usuario);
    console.log(row);

    if (row != null) {
      this.addClient = this.fb.group({
        responsable: this.usuario.currentUser.id_user,
        plan_srv: [row.plan_srv,[Validators.required]],
        tipo_plan_srv: row.tipo_plan_srv,
        cliente_srv: row.cliente_srv,
        // direccion_srv: row.direccion_srv,
        modo_pago_srv: row.modo_pago_srv,
        serie_srv: row.serie_srv,
        instalacion_srv: row.instalacion_srv,
        recibo_srv: row.recibo_srv,
        costo_instalacion_srv: row.costo_instalacion_srv,
        credito_srv: row.credito_srv,
        notify_srv: row.notify_srv,
        start_srv: row.start_srv,
        ip_srv: [row.ip_srv,[Validators.required],[this.validacion_ip.ipValidator()]],
        signal_srv: row.signal_srv,
        //servidor_srv: row.servidor_srv,
        ap_srv: row.ap_srv,
        serial_srv: row.serial_srv,
        mac_srv: [row.mac_srv, [Validators.required, Validators.pattern(MAC_REGEX)]],
        zona_srv: row.zona_srv,
        stat_srv: row.stat_srv,
        comment_srv: row.comment_srv,
        equipo_srv: row.equipo_srv,
        id_srv: row.id_srv,
        pro: '',
        a_search: '',
        c_search: '',
        p_search: '',
        C_search: '',
        //  a_search: '',

        //email: [row.email, [Validators.required, Validators.pattern(null)]],
        //phone1: [row.phone1, [Validators.required, Validators.pattern(null)]],

      });
      //console.log(row)
    } else {

      this.addClient = this.fb.group({
        responsable: this.usuario.currentUser.id_user,
        plan_srv: ['', Validators.required],
        modo_pago_srv: '',
        tipo_plan_srv: ['', Validators.required],
        //  direccion_srv: ['', Validators.required],
        serie_srv: [0, Validators.required],
        cliente_srv: ['', Validators.required],
        instalacion_srv: ['', Validators.required],
        recibo_srv: '',
        costo_instalacion_srv: '',
        credito_srv: '40',
        notify_srv: '',
        start_srv: ['', Validators.required],
        ip_srv: ['', [Validators.required], [this.validacion_ip.ipValidator()]],
        signal_srv: '',
        //servidor_srv: '',
        ap_srv: ['', Validators.required],
        serial_srv: ['', [Validators.required]/*, [this.validacion_serial.serialValidator()]*/],
        mac_srv: ['', [Validators.required, Validators.pattern(MAC_REGEX)]],
        zona_srv: '',
        stat_srv: ['', Validators.required],
        comment_srv: '',
        equipo_srv: ['', Validators.required],
        pro: '',
        c_search: '',
        p_search: '',
        C_search: '',
        a_search: '',

        //email: ['', [Validators.required, Validators.pattern(null)]],
        //phone1: ['', [Validators.required, Validators.pattern(null)]],

      });
      //console.log("llego vacio"+ row)
    }

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.addClient.get('serial_srv').valueChanges.subscribe(
      (EN) => {
        setTimeout(() => {
          var pre = this.addClient.value.serial_srv.replace(/(.{2})/g, '$&:')
          this.addClient.patchValue(
            {
              serial_srv: this.addClient.value.serial_srv.replace(/[^a-zA-Z0-9 ]/g, ""),
              mac_srv: pre.replace(/(^:+|:+$)/g, "")
              //mac_srv: pre.replace(/(.{16})/g, '$&')
            }
          )
          this.addClient.updateValueAndValidity();
        }, 200);
      })
  }

  Enviar() {

    var client = this.addClient.value;
    //console.log(JSON.stringify(this.addClient.value));
    let dp = new DatePipe(navigator.language);
    var url = environment.apiEndpoint + "servicios";
    //console.log(body);

    this.snackBar.open("Actualizando Cliente: Por favor espere", null, {
      duration: 2000,
    });
    this.http.post(url, this.addClient.value).subscribe((data) => {
      this.dialogRef.close();
    });
    console.log(this.addClient.value);
    //console.log(client.cliente_srv);


    //  this.funciones.refresh();
    //this.router.navigate(['/clientes']);
    // console.log(client.cliente_srv);
  }
  Editar() {
    var client = this.addClient.value;
    //console.log(JSON.stringify(this.addClient.value));
    let dp = new DatePipe(navigator.language);
    var url = environment.apiEndpoint + "servicios/" + client.id_srv;
    //console.log(body);

    this.snackBar.open("Agregando Cliente: Por favor espere", null, {
      duration: 2000,
    });

    this.http.put(url, this.addClient.value).subscribe((data) => {
      this.dialogRef.close();
    });

    //this.funciones.refresh();
    //this.router.navigate(['/clientes']);
  }


}
