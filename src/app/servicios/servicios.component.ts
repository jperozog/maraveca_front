import {Component, Inject, Pipe, PipeTransform, Injectable, OnInit, OnDestroy} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { DatePipe } from '@angular/common';

const MAC_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit, OnDestroy {

    update=true;
    autoupdate:boolean
    myService: MyService | null;
    data: any = [];
    installs: any = [];
    data_t: any = [];
    installs_t: any = [];
    search: string = '';
    constructor(private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router) {
      this.autoupdate=true;
      this.snackBar.open("Cargando Clientes", null, {
        duration: 2000,
      });
      this.myService = new MyService(http, router);
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/servicios/')
        .subscribe((data) => {
          this.data = data.json().servicios;
          this.installs = data.json().soportes;
          this.data_t=this.data;
          this.installs_t=this.installs;
          this.snackBar.open("Clientes Cargados", null, {
            duration: 2000,
          });
          this.update=false
        });
    }

    ngOnInit(){
      IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
    }
    ngOnDestroy(){
      this.autoupdate=false
    }
    refresh(nf){
      this.update=true
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/servicios/')
        .subscribe((data) => {
          this.data_t = data.json().servicios;
          this.installs_t = data.json().soportes;
          this.update=false
          if (nf){
            this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          });
        }
        });
          this.data=this.data_t;
          this.installs=this.installs_t;

    }

    openDialog(): void {
      let dialogRef = this.dialog.open(AddservicesComponent, {
        panelClass: 'my-full-screen-dialog',
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      })
    }
    show(row){
      console.log(row);
      //this.selectedRowIndex = row.id;
      let dialogRef = this.dialog.open(AddservicesComponent, {
        panelClass: 'my-full-screen-dialog',
        data: row
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was AddClient closed');
        this.update=true
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/servicios/')
          .subscribe((data) => {
            this.data = data.json().servicios;
            this.installs = data.json().soportes;
            console.log(this.data);
            console.log(this.installs.length);
            this.update=false

          });
      });
      //this.myService.refresh();
    }

    register(row){
      console.log(row);
      //this.selectedRowIndex = row.id;
      let dialogRef = this.dialog.open(AddPendingComponent, {
        panelClass: 'my-full-screen-dialog',
        data: row
      });
      dialogRef.afterClosed().subscribe(result => {
        this.update=true
        console.log('The dialog was AddClientPending closed');
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/servicios/')
          .subscribe((data) => {
            this.data = data.json().servicios;
            this.installs = data.json().soportes;
            console.log(this.data);
            console.log(this.installs.length);
            this.update=false
          });
      });
      //this.myService.refresh();
    }

    private openLINK(url){
      console.log(url)
      window.open("http://186.167.32.27:81/maraveca/test.php?ip="+url, '_blank');
    }

    private delete(id):void{
      console.log(id); //show`s id
      this.myService.deleteData(id)
      .subscribe((data) => {console.log(data)});
      this.snackBar.open("Borrando Cliente: Por favor espere", null, {
        duration: 2000,
      });
      //this.myService.refresh();

    }

  }

  function capitalizeName(name) {
    return name.replace(/\b(\w)/g, s => s.toUpperCase());
  }

  export class MyService {

    constructor(private http: Http, private router: Router) {}

    deleteData(id){
      return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/servicios/'+id, {})
      .map((resp:Response)=>resp.json());

    }
    refresh(){

      var currentUrl = this.router.url;
      var refreshUrl = currentUrl.indexOf('services') > -1 ? '/celdas' : '/services';

      setTimeout(() =>
      {
        this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
      },
      2000);
    }



  }


  @Component({
    selector: 'app-add-services',
    templateUrl: './add-Servicio.component.html',
    styleUrls: ['./servicios.component.css'],
    providers: [DatePipe]
  })
  export class AddservicesComponent implements OnInit{

    addClient: FormGroup;
    funciones: MyService | null;
    planes: any = null;
    clientes:any = null;
    equipos:any = null;
    servidores:any = null;
    equipo:any = null;
    aps:any = null;
    cliente: any = null;
    c_search: string;
    p_search: string;
    C_search: string;
    a_search: string;



    constructor(private http:Http,
      private fb: FormBuilder,
      public dialogRef: MdDialogRef<AddservicesComponent>,
      @Inject(MD_DIALOG_DATA) public row: any,
      public snackBar: MdSnackBar,
      private router: Router,
      private _fb: FormBuilder,
      private date: DatePipe){


        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/clientes/')
        .subscribe((data) => {
          this.clientes = data.json();
          console.log(this.clientes.slice(0,3));
        });
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/equipos/')
        .subscribe((data) => {
          this.equipo = data.json();
          console.log(this.equipo);
        });
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/aps/')
        .subscribe((data) => {
          this.aps = data.json();
          console.log(this.aps);
        });
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/planes/')
        .subscribe((data) => {
          this.planes = data.json();
          console.log(this.planes);
        });

        this.funciones = new MyService(http, router);

        if(row != null){
          this.addClient = this.fb.group({
            plan_srv: row.plan_srv,
            cliente_srv: row.cliente_srv,
            instalacion_srv: row.instalacion_srv,
            recibo_srv: row.recibo_srv,
            costo_instalacion_srv: row.costo_instalacion_srv,
            credito_srv: row.credito_srv,
            notify_srv: row.notify_srv,
            start_srv: row.start_srv,
            ip_srv: row.ip_srv,
            //celda_srv: row.celda_srv,
            //servidor_srv: row.servidor_srv,
            ap_srv: row.ap_srv,
            serial_srv: row.serial_srv,
            mac_srv: [row.mac_srv, [Validators.required, Validators.pattern(MAC_REGEX)]],
            zona_srv: row.zona_srv,
            stat_srv: row.stat_srv,
            comment_srv: row.comment_srv,
            equipo_srv: row.equipo_srv,
            id_srv: row.id_srv,
            c_search: '',
            p_search: '',
            C_search: '',
            a_search: '',

            //email: [row.email, [Validators.required, Validators.pattern(null)]],
            //phone1: [row.phone1, [Validators.required, Validators.pattern(null)]],

          });
          //console.log(row)
        }else{

          this.addClient = this.fb.group({
            plan_srv: '',
            cliente_srv: ['', Validators.required],
            instalacion_srv: ['', Validators.required],
            recibo_srv: '',
            costo_instalacion_srv: '',
            credito_srv: '40',
            notify_srv: '',
            start_srv: ['', Validators.required],
            ip_srv: ['', Validators.required],
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

      }

      onNoClick(): void {
        this.dialogRef.close();
      }

      ngOnInit(){
        this.addClient.get('serial_srv').valueChanges.subscribe(
          (EN) => {
            setTimeout(()=>{
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

      Enviar(){
        var client = this.addClient.value;
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

        var url = "http://186.167.32.27:81/maraveca/public/index.php/api/servicios?"+body;
        //console.log(body);

        this.http.post(url, body).subscribe((data) => {});
        this.dialogRef.close();
      //  this.funciones.refresh();
        this.snackBar.open("Agregando Cliente: Por favor espere", null, {
          duration: 2000,
        });
        //this.router.navigate(['/clientes']);
      }
      Editar(){
        var client = this.addClient.value;
        //console.log(JSON.stringify(this.addClient.value));
        let dp = new DatePipe(navigator.language);
        var body =
        "plan_srv=" + client.plan_srv +
        "&cliente_srv=" + client.cliente_srv +
        "&instalacion_srv=" + client.instalacion_srv +
        //"&recibo_srv="+client.recibo_srv+
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
        //"&zona_srv="+client.zona_srv+
        "&stat_srv="+client.stat_srv+
        "&comment_srv="+client.comment_srv

        var url = "http://186.167.32.27:81/maraveca/public/index.php/api/servicios/"+client.id_srv+"?"+body;
        //console.log(body);

        this.http.put(url, body).subscribe((data) => {});
        this.dialogRef.close();
        //this.funciones.refresh();
        this.snackBar.open("Agregando Cliente: Por favor espere", null, {
          duration: 2000,
        });
        //this.router.navigate(['/clientes']);
      }


      }

      @Component({
        selector: 'app-add-Pending',
        templateUrl: './add-Servicio.pending.component.html',
        styleUrls: ['./servicios.component.css'],
        providers: [DatePipe]
      })
      export class AddPendingComponent implements OnInit{

        addClient: FormGroup;
        post: FormGroup;
        funciones: MyService | null;
        planes: any = [];
        clientes:any = [];
        equipos:any = [];
        servidores:any = null;
        equipo:any = [];
        aps:any = [];
        cliente: any = [];
        c_search: string;
        p_search: string;
        C_search: string;
        a_search: string;
        ap_srv: string
        planes_= [];
        ap_edit=false;
        cliente_edit=false;
        equipo_edit=false;
        //value.replace(/\b\w/g, first => first.toLocaleUpperCase())


        constructor(private http:Http,
          private fb: FormBuilder,
          public dialogRef: MdDialogRef<AddPendingComponent>,
          @Inject(MD_DIALOG_DATA) public row: any,
          public snackBar: MdSnackBar,
          private router: Router,
          private _fb: FormBuilder,
          private date: DatePipe){


            this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/add_preload/')
            .subscribe((data) => {
              this.clientes = data.json().clientes;
              this.equipo = data.json().equipos;
              this.aps = data.json().aps;
              this.planes = data.json().planes;
              console.log(this.clientes.slice(0,3));
            });
            this.funciones = new MyService(http, router);

            this.addClient = this.fb.group({
                plan_srv: '',
                cliente_srv: ['', Validators.required],
                instalacion_srv: ['', Validators.required],
                recibo_srv: '',
                costo_instalacion_srv: '',
                credito_srv: '40',
                notify_srv: '',
                start_srv: ['', Validators.required],
                ip_srv: ['', Validators.required],
                planes_: '',
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

          ngOnInit(){
            console.log(this.row)
            if(this.row){
              this.ap_srv=this.row.ap;
              setTimeout(() =>
              {
                var pre = this.row.serial.replace(/(.{2})/g, '$&:')
                this.addClient.patchValue({
                  plan_srv: this.row.plan_srv,
                  cliente_srv: this.row.servicio_soporte,
                  equipo_srv: this.row.equipo,
                  ap_srv: this.row.ap,
                  instalacion_srv: this.row.instalacion_srv,
                  recibo_srv: this.row.recibo_srv,
                  costo_instalacion_srv: '0',
                  credito_srv: '40',
                  notify_srv: this.row.notify_srv,
                  start_srv: this.row.start_srv,
                  ip_srv: this.row.ip,
                  serial_srv: this.row.serial,
                  zona_srv: this.row.zona_srv,
                  comment_srv: this.row.comment_srv,
                  mac_srv: pre.replace(/(^:+|:+$)/g, "")
                })
                this.addClient.updateValueAndValidity();

              },
              200);

              }

              this.addClient.get('ap_srv').valueChanges.subscribe(
                (ap_srv)=>{
                  console.log('Nuevo AP Seleccionado:'+ap_srv)
                }
              )

            this.addClient.get('serial_srv').valueChanges.subscribe(
              (EN) => {
                setTimeout(()=>{
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
          deleter(req){
            for(var i=0; i < this.planes_.length; i++ ){
              if (this.planes_[i]["name_plan"]==req.name_plan && this.planes_[i]["comment_"]==req.valor){
                this.planes_.splice(i,1);
              }
            }
          }
          edit_ap(ap){
            this.ap_edit = true;
          }
          edit_client(){
            this.cliente_edit = true;
          }
          edit_equipo(){
            this.equipo_edit = true;
          }
          addr(){
            this.planes_.push({id_plan:this.addClient.value.planes_.id_plan,name_plan:this.addClient.value.planes_.name_plan, comment:this.addClient.value.comment_})
            console.log(this.planes)
            this.addClient.patchValue({
              planes_:'',
              comment_:''
            })
          }

          Enviar(){
            if(this.planes_.length>=1){
              var post = this.addClient.value;
              this.planes_.forEach((item, key) => {
                this.post = this.fb.group({
                  cliente_srv: post.cliente_srv,
                  instalacion_srv: post.instalacion_srv,
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
                });
                var url = "http://186.167.32.27:81/maraveca/public/index.php/api/servicios";
                this.http.post(url, this.post.value).subscribe((data) => {
                  var put:FormGroup
                  put=this.fb.group({
                    status_soporte:"4"
                  })
                  var url = "http://186.167.32.27:81/maraveca/public/index.php/api/soporte/"+this.row.id_soporte;
                  this.http.put(url, put.value).subscribe((data) => {

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

            var url = "http://186.167.32.27:81/maraveca/public/index.php/api/servicios?"+body;
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
