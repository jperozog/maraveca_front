import {Component, Inject, Pipe, PipeTransform, OnInit, OnDestroy} from '@angular/core';
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
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';
@Component({
  templateUrl: './instalaciones.component.html',
  styleUrls: ['./instalaciones.component.css']
})
export class InstalacionesComponent implements OnInit, OnDestroy {


      myService: MyService | null;
      datai: any = [];
      datai_t: any = [];
      search: string = '';
      update:boolean = true;
      autoupdate:boolean=true;
      constructor(private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router) {
        this.snackBar.open("Cargando instalaciones", null, {
          duration: 2000,
        });
        this.myService = new MyService(http, router);
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/instalaciones/')
          .subscribe((data) => {
            this.datai = data.json();
            console.log(this.datai);
            this.update= false
            this.datai_t = this.datai;
          });
        this.snackBar.open("Instalaciones Cargadas", null, {
          duration: 2000,
        });
      }


      openAdd(): void {
        let dialogRef = this.dialog.open(AddInstallComponent, {
          width: '30%'
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');

        })
      }
      openEdit(row): void {
        console.log(row);
        let dialogRef = this.dialog.open(EditInstallComponent, {
          width: '30%',
          data: row
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');

        })
      }
      private openLINK(id){
        //console.log(url)
        window.open("../#/editticket/"+id, '_blank');
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
        this.update = true;
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/instalaciones/')
          .subscribe((data) => {
            this.update=false
            this.datai_t = data.json();
            if (nf){
              this.snackBar.open("Lista Actualizada", null, {
              duration: 2000,
            });
          }
        });
          this.datai = this.datai_t
      }
      show(row){
        //console.log(row);
        //this.selectedRowIndex = row.id;
        let dialogRef = this.dialog.open(null, {
          width: '75%',
          data: row
        });

        dialogRef.afterClosed().subscribe(result => {
          //console.log('The dialog was closed');
          this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/facturas/')
            .subscribe((data) => {
              this.datai = data.json();
              //console.log(this.data);
            });
          this.snackBar.open("Facturas Actualizadas", null, {
            duration: 2000,
          });
        });
        //this.myService.refresh();

      }

      private delete(id):void{
        //console.log(id); //show`s id
        this.myService.deleteData(id)
        .subscribe((data) => {console.log(data)});
        this.snackBar.open("Borrando Equipo: Por favor espere", null, {
          duration: 1000,
        });

      }

    }


    export class MyService {

      constructor(private http: Http, private router: Router) {

      }

      deleteData(id){

        return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/equipos/'+id, {})
        .map((resp:Response)=>resp.json());



      }

      refresh1(){
        var currentUrl = this.router.url;
        var refreshUrl = currentUrl.indexOf('facturacion') > -1 ? '/clients' : '/facturacion';
        setTimeout(() =>
        {
          this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
        },
        1000);
      }

    }

    @Component({
      templateUrl: './add-install.component.html',
      styleUrls: ['./instalaciones.component.css']
    })
    export class AddInstallComponent{

      /*dit : any;
      costo : any;
      nombre :string;
      */servicios: any;
      clientes: any;
      //cliente: any;
      equipo: any;
      celda: any;
      equipos: any;
      celdas: any;
      S_servicios:any;
      S_celda:any;
      S_equipos:any;
      addplan: FormGroup;
      //row: any;
      currentUser: any;
      //problemas: any;
      requ = [];
      //nombrer:any = "1";
      //valorr:any = "2";
      EN:boolean = false;
      valorplaceholder="";
      constructor(private http:Http,
        private fb: FormBuilder,
        public dialogRef: MdDialogRef<AddInstallComponent>,
        @Inject(MD_DIALOG_DATA) public row: any,
        //private route: ActivatedRoute,
        public snackBar: MdSnackBar,
        private router: Router){
          this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
          this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/clientes/')
          .subscribe((data) => {
            this.clientes = data.json();
            setTimeout(() =>
            {
              this.addplan.value.servicio_soporte = row.servicio;
            },
            3000);
          });
          this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/celdas/')
          .subscribe((data) => {
            this.celda = data.json();
            this.celdas = this.addplan.value.celda_soporte

          });
          this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/equipos/')
          .subscribe((data) => {
            this.equipos = data.json();
            this.equipo = this.addplan.value.equipo_soporte
          });
          this.addplan = this.fb.group({
            tipo_soporte: '1',
            problema_soporte: '',
            afectacion_soporte: '1',
            problems:'',
            servicio_soporte: ['', Validators.required],
            celda_soporte:['', Validators.required],
            equipo_soporte:['', Validators.required],
            seriale:['', Validators.required],
            status_soporte: '',
            user_soporte: this.currentUser.id_user,
            S_servicios:'',

            adicionales:[],
            nombrer:'',
            valorr:'',
            EN:false,
          });
          if(row != null){
            console.log(row.ptp)
            this.addplan.patchValue({
              servicio_soporte: row.servicio,
              celda_soporte:row.celda,
              equipo_soporte:row.equipo,
              user_soporte: this.currentUser.id_user
            });
            this.requ.push({nombre: 'Tubo', valor: row.tubo})
            if (row.ptp != null){
              this.requ.push({nombre: 'PTP', valor: row.ptp})
            }
            //this.celdas = row.celda;
            //this.equipo = row.equipo;
            //this.cliente = row.servicio;
            //console.log(row)
          }
          //this.addplan.value.servicio_soporte = this.cliente;
          //this.addplan.value.equipo_soporte = this.equipo;
          //this.addplan.value.celda_soporte = this.celda;

          console.log(this.addplan.value);
        }

        ngOnInit(){


          this.addplan.get('EN').valueChanges.subscribe(

            (EN) => {

              if (EN) {
                console.log(EN);
                this.addplan.get('seriale').setValidators([]);

              } else {
                console.log(EN);
                this.addplan.get('seriale').setValidators([Validators.required]);

              }

              this.addplan.get('seriale').updateValueAndValidity();

            }

          )
          this.addplan.get('nombrer').valueChanges.subscribe(

            (nombrer) => {

              if (nombrer==="Tubo") {
                console.log(nombrer)
                this.valorplaceholder="Metros";

              } else if (nombrer==="SerialPTP") {
                console.log(nombrer)
                this.valorplaceholder="Serial";
              } else if (nombrer==="Router") {
                console.log(nombrer)
                this.valorplaceholder="Serial";
              } else if (nombrer==="Switch") {
                console.log(nombrer)
                this.valorplaceholder="Cantidad";
              }

              this.addplan.get('seriale').updateValueAndValidity();

            }

          )
          this.addplan.get('tipo_soporte').valueChanges.subscribe(

            (tipo_soporte) => {

              if (tipo_soporte === "1") {
                console.log("instalacion")
                this.addplan.get('servicio_soporte').setValidators([Validators.required]);
                this.addplan.get('celda_soporte').setValidators([Validators.required]);
                this.addplan.get('equipo_soporte').setValidators([Validators.required]);
                this.addplan.get('seriale').setValidators([Validators.required]);
                this.addplan.get('afectacion_soporte').setValidators([]);
                this.addplan.get('servicio_soporte').setValidators([]);
                this.addplan.get('problems').setValidators([]);

              } else if (tipo_soporte === "2") {
                console.log("ticket")
                this.addplan.get('servicio_soporte').setValidators([]);
                this.addplan.get('celda_soporte').setValidators([]);
                this.addplan.get('equipo_soporte').setValidators([]);
                this.addplan.get('seriale').setValidators([]);
                this.addplan.get('afectacion_soporte').setValidators([Validators.required]);
                this.addplan.get('servicio_soporte').setValidators([Validators.required]);
                this.addplan.get('problems').setValidators([Validators.required]);

              }

              this.addplan.get('servicio_soporte').updateValueAndValidity();
              this.addplan.get('celda_soporte').updateValueAndValidity();
              this.addplan.get('equipo_soporte').updateValueAndValidity();
              this.addplan.get('seriale').updateValueAndValidity();
              this.addplan.get('afectacion_soporte').updateValueAndValidity();
              this.addplan.get('servicio_soporte').updateValueAndValidity();
              this.addplan.get('problems').updateValueAndValidity();

            }

          )

        }

        onNoClick(): void {
          this.dialogRef.close();
        }
        addr(){
          this.requ.push({nombre:this.addplan.value.nombrer, valor:this.addplan.value.valorr})
          this.addplan.patchValue({
            nombrer:'',
            valorr:''
          })
        }
        deleter(req){
          for(var i=0; i < this.requ.length; i++ ){
            if (this.requ[i]["nombre"]==req.nombre && this.requ[i]["valor"]==req.valor){
              this.requ.splice(i,1);
            }
          }
        }
        Enviar(){
          if (!this.EN){
            this.requ.push({nombre:'Serial', valor:this.addplan.value.seriale})
          }
          this.addplan.patchValue({
            adicionales: this.requ
          })
          if (!this.addplan.valid){
            this.addplan.patchValue({
              status_soporte: '-1'
            })
          }else{
            this.addplan.patchValue({
              status_soporte: '1'
            })
          }
          var plan = this.addplan.value;
          var url = "http://186.167.32.27:81/maraveca/public/index.php/api/soporte2";
          this.http.post(url, plan).subscribe((data) => {
            this.row = data.json();
          });
          setTimeout(()=>{
            /*          var body1=
            "user_th="+plan.id_user+
            "&ticket_th="+this.row.id+
            "&comment=Se apertura el ticket"
            var url1 = "http://186.167.32.27:81/maraveca/public/index.php/api/ticketh?"+body1;
            this.http.post(url1,body1).subscribe((data) => {});
            if (plan.tipo == 2){
            this.CC.addPb(this.row.id, plan.problems);
          }
          */
        }, 2000)
        this.dialogRef.close();
        this.snackBar.open("Agregando Ticket: Por favor espere", null, {
          duration: 2000,
        });


      }

}

    @Component({
      templateUrl: './add-install.component.html',
      styleUrls: ['./instalaciones.component.css']
    })
    export class EditInstallComponent{

      servicios: any;
      clientes: any;
      equipo: any;
      celda: any;
      equipos: any;
      celdas: any;
      S_servicios:any;
      S_celda:any;
      S_equipos:any;
      addplan: FormGroup;
      currentUser: any;
      requ = [];
      EN:boolean = false;
      valorplaceholder="";
      constructor(private http:Http,
        private fb: FormBuilder,
        public dialogRef: MdDialogRef<AddInstallComponent>,
        @Inject(MD_DIALOG_DATA) public row: any,
        public snackBar: MdSnackBar,
        private router: Router){
          this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
          this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/clientes/')
          .subscribe((data) => {
            this.clientes = data.json();
            setTimeout(() =>
            {
              this.addplan.value.servicio_soporte = row.servicio;
            },
            3000);
          });
          this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/celdas/')
          .subscribe((data) => {
            this.celda = data.json();
            this.celdas = this.addplan.value.celda_soporte

          });
          this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/equipos/')
          .subscribe((data) => {
            this.equipos = data.json();
            this.equipo = this.addplan.value.equipo_soporte
          });
          this.addplan = this.fb.group({
            tipo_soporte: '1',
            problema_soporte: '',
            afectacion_soporte: '1',
            problems:'',
            servicio_soporte: ['', Validators.required],
            celda_soporte:['', Validators.required],
            equipo_soporte:['', Validators.required],
            seriale:['', Validators.required],
            status_soporte: '',
            user_soporte: this.currentUser.id_user,
            S_servicios:'',

            adicionales:[],
            nombrer:'',
            valorr:'',
            EN:false,
          });
          if(row != null){
            console.log(row.ptp)
            this.addplan.patchValue({
              servicio_soporte: row.servicio,
              celda_soporte:row.celda,
              equipo_soporte:row.equipo,
              user_soporte: this.currentUser.id_user
            });
            //this.requ.push({nombre: 'Tubo', valor: row.tubo})
            if (row.ptp != null){
              this.requ.push({nombre: 'PTP', valor: row.ptp})
            }
          }
          console.log(this.addplan.value);
        }

        ngOnInit(){


          this.addplan.get('EN').valueChanges.subscribe(

            (EN) => {

              if (EN) {
                console.log(EN);
                this.addplan.get('seriale').setValidators([]);

              } else {
                console.log(EN);
                this.addplan.get('seriale').setValidators([Validators.required]);

              }

              this.addplan.get('seriale').updateValueAndValidity();

            }

          )
          this.addplan.get('nombrer').valueChanges.subscribe(

            (nombrer) => {

              if (nombrer==="Tubo") {
                console.log(nombrer)
                this.valorplaceholder="Metros";

              } else if (nombrer==="SerialPTP") {
                console.log(nombrer)
                this.valorplaceholder="Serial";
              } else if (nombrer==="Router") {
                console.log(nombrer)
                this.valorplaceholder="Serial";
              } else if (nombrer==="Switch") {
                console.log(nombrer)
                this.valorplaceholder="Cantidad";
              }

              this.addplan.get('seriale').updateValueAndValidity();

            }

          )
          this.addplan.get('tipo_soporte').valueChanges.subscribe(

            (tipo_soporte) => {

              if (tipo_soporte === "1") {
                console.log("instalacion")
                this.addplan.get('servicio_soporte').setValidators([Validators.required]);
                this.addplan.get('celda_soporte').setValidators([Validators.required]);
                this.addplan.get('equipo_soporte').setValidators([Validators.required]);
                this.addplan.get('seriale').setValidators([Validators.required]);
                this.addplan.get('afectacion_soporte').setValidators([]);
                this.addplan.get('servicio_soporte').setValidators([]);
                this.addplan.get('problems').setValidators([]);

              } else if (tipo_soporte === "2") {
                console.log("ticket")
                this.addplan.get('servicio_soporte').setValidators([]);
                this.addplan.get('celda_soporte').setValidators([]);
                this.addplan.get('equipo_soporte').setValidators([]);
                this.addplan.get('seriale').setValidators([]);
                this.addplan.get('afectacion_soporte').setValidators([Validators.required]);
                this.addplan.get('servicio_soporte').setValidators([Validators.required]);
                this.addplan.get('problems').setValidators([Validators.required]);

              }

              this.addplan.get('servicio_soporte').updateValueAndValidity();
              this.addplan.get('celda_soporte').updateValueAndValidity();
              this.addplan.get('equipo_soporte').updateValueAndValidity();
              this.addplan.get('seriale').updateValueAndValidity();
              this.addplan.get('afectacion_soporte').updateValueAndValidity();
              this.addplan.get('servicio_soporte').updateValueAndValidity();
              this.addplan.get('problems').updateValueAndValidity();

            }

          )

        }

        onNoClick(): void {
          this.dialogRef.close();
        }
        addr(){
          this.requ.push({nombre:this.addplan.value.nombrer, valor:this.addplan.value.valorr})
          this.addplan.patchValue({
            nombrer:'',
            valorr:''
          })
        }
        deleter(req){
          for(var i=0; i < this.requ.length; i++ ){
            if (this.requ[i]["nombre"]==req.nombre && this.requ[i]["valor"]==req.valor){
              this.requ.splice(i,1);
            }
          }
        }
        Enviar(){
          if (!this.EN){
            this.requ.push({nombre:'Serial', valor:this.addplan.value.seriale})
          }
          this.addplan.patchValue({
            adicionales: this.requ
          })
          if (!this.addplan.valid){
            this.addplan.patchValue({
              status_soporte: '-1'
            })
          }else{
            this.addplan.patchValue({
              status_soporte: '1'
            })
          }
          var plan = this.addplan.value;
          var url = "http://186.167.32.27:81/maraveca/public/index.php/api/soporte2";
          this.http.post(url, plan).subscribe((data) => {
            this.row = data.json();
          });
          setTimeout(()=>{
            /*          var body1=
            "user_th="+plan.id_user+
            "&ticket_th="+this.row.id+
            "&comment=Se apertura el ticket"
            var url1 = "http://186.167.32.27:81/maraveca/public/index.php/api/ticketh?"+body1;
            this.http.post(url1,body1).subscribe((data) => {});
            if (plan.tipo == 2){
            this.CC.addPb(this.row.id, plan.problems);
          }
          */
        }, 2000)
        this.dialogRef.close();
        this.snackBar.open("Agregando Ticket: Por favor espere", null, {
          duration: 2000,
        });


      }

}
