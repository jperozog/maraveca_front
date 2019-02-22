import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import { AuthGuard } from '../_guards/index';
import {Router} from '@angular/router';
import { environment } from '../../environments/environment'
import { IntervalObservable } from "rxjs/observable/IntervalObservable";

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit, OnDestroy{


    myService: MyService | null;
    data:any = null;
    data_t:any = null;
    mb:any = null;
    mb_t:any = null;
    search: string = '';
    update:boolean=true;
    autoupdate = true;
    plan="p";
    constructor(
      public usuario: AuthGuard,
      private http: Http,
      public dialog: MdDialog,
      public snackBar:MdSnackBar,
      public router: Router) {
      this.snackBar.open("Cargando Planes", null, {
        duration: 2000,
      });
      //this.myService = new MyService(http, router);
      this.refresh(false);
    }

    ngOnInit(){
      IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
    }

    ngOnDestroy(){
      this.autoupdate = false;

    }

    refresh(nf){
      this.update=true;
      this.http.get(environment.apiEndpoint+'planes/', {params:{responsable: this.usuario.currentUser.id_user, plan: this.plan}})
        .subscribe((data) => {
          this.data_t = data.json().planes;
          this.data=this.data_t;
          this.mb_t = data.json().mb;
          this.mb=this.mb_t;
          this.update=false
          if(nf){
            this.snackBar.open("Planes Cargadas", null, {
              duration: 2000,
            });
          }
        });

    }

    openDialog(): void {
      let dialogRef = this.dialog.open(AddplanesComponent, {
        width: '25%'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      })
    }
    updatePrices(): void {
      let dialogRef = this.dialog.open(UpdatePlanPricesDialog, {
        width: '25%'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      })
    }
    show(row){
      //console.log(row);
      //this.selectedRowIndex = row.id;
      let dialogRef = this.dialog.open(AddplanesComponent, {
        width: '25%',
        data: row
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      });
      this.refresh(false);

    }
    deleteDialog(row): void {
      console.log(row);
    let dialogRef = this.dialog.open(DeletePlanDialog, {
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
    }
    private delete(id):void{
      //console.log(id); //show`s id
      this.myService.deleteData(id)
      .subscribe((data) => {console.log(data)});
      this.snackBar.open("Borrando Plan: Por favor espere", null, {
        duration: 2000,
      });
      this.refresh(false);

    }

  }


  export class MyService {

    constructor(private http: Http, private router: Router) {

    }

    deleteData(id){

      return this.http.delete(environment.apiEndpoint+'planes/'+id, {})
      .map((resp:Response)=>resp.json());



    }
    refresh(){
      var currentUrl = this.router.url;
      var refreshUrl = currentUrl.indexOf('celdas') > -1 ? '/clients' : '/celdas';
      setTimeout(() =>
      {
        this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
      },
      2000);
    }

  }






  @Component({
    selector: 'app-add-planes',
    templateUrl: './add-plan.component.html',
    styleUrls: ['./planes.component.css']
  })
  export class AddplanesComponent{

    costo : string;
    nombre :string;

    addplan: FormGroup;
    CC:MyService | null;


    constructor(private http:Http,
      private fb: FormBuilder,
      public dialogRef: MdDialogRef<AddplanesComponent>,
      @Inject(MD_DIALOG_DATA) public row: any,
      public snackBar: MdSnackBar,
      private router: Router){
        this.CC = new MyService(http, router);

        if(row != null){
          this.addplan = this.fb.group({
            cost_plan: row.cost_plan,
            name_plan: row.name_plan,
            taza: row.taza,
            tipo_plan: row.tipo_plan,
            id_plan: row.id_plan,
            carac_plan: row.carac_plan,
            dmb_plan: row.dmb_plan,
            umb_plan: row.umb_plan,
            descripcion: row.descripcion
          });
          //console.log(row)
        }else{

          this.addplan = this.fb.group({
            cost_plan: '',
            name_plan: '',
            taza: '',
            tipo_plan: '',
            id_plan: '',
            carac_plan: '',
            dmb_plan: '',
            umb_plan: '',
            descripcion: ''


          });
          //console.log("llego vacio"+ row)
        }

      }

      onNoClick(): void {
        this.dialogRef.close();
      }


      Enviar(){
        var plan = this.addplan.value;
        console.log(JSON.stringify(this.addplan.value));
        var url = environment.apiEndpoint+"planes";

        this.http.post(url, plan).subscribe((data) => {
          this.dialogRef.close();
          this.snackBar.open("Agregando Plan: Por favor espere", null, {
            duration: 2000,
          });
          this.CC.refresh();
        });

      }
      Editar(){
        var plan = this.addplan.value;
        console.log(JSON.stringify(this.addplan.value));
        var url = environment.apiEndpoint+"planes/"+plan.id_plan;
        this.http.put(url, plan).subscribe((data) => {
          this.dialogRef.close();
          this.snackBar.open("Editando Plan: Por favor espere", null, {
            duration: 2000,
          });
          this.CC.refresh();
        });

      }

    }
    @Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-delete.html',
  styleUrls: ['./planes.component.css']
})
    export class DeletePlanDialog {
      myService: MyService | null;

      constructor(
        public dialogRef: MdDialogRef<DeletePlanDialog>,
        @Inject(MD_DIALOG_DATA) public data: any, private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router) {
          this.myService = new MyService(http, router);
         }

        delete(): void {
          console.log(this.data);
          this.myService.deleteData(this.data.id_plan)
          .subscribe((data) => {console.log(data)});
          this.dialogRef.close();
          this.snackBar.open("Borrando Plan: Por favor espere", null, {
            duration: 1000,
          });
          this.myService.refresh();
        }

      onNoClick(): void {
        this.dialogRef.close();
      }

    }
    @Component({
  selector: 'Update-Prices',
  templateUrl: 'UpdatePrices.component.html',
  styleUrls: ['./planes.component.css']
})
    export class UpdatePlanPricesDialog {
      myService: MyService | null;
      addplan: FormGroup;
      constructor(
        public dialogRef: MdDialogRef<DeletePlanDialog>,
        @Inject(MD_DIALOG_DATA) public data: any,
         private http: Http,
         public dialog: MdDialog,
         public snackBar:MdSnackBar,
         private router: Router,
         private fb: FormBuilder) {
          this.myService = new MyService(http, router);
          this.addplan = this.fb.group({
            taza: '',

          });
         }

        update(): void {
          var plan = this.addplan.value;
          console.log(JSON.stringify(this.addplan.value));
          var body = "taza=" + plan.taza;
          var url = environment.apiEndpoint+"planes/update";

          this.http.post(url, this.addplan.value).subscribe((data) => {
            this.dialogRef.close();
            this.snackBar.open("Editando Plan: Por favor espere", null, {
              duration: 2000,
            });

          });

        }

      onNoClick(): void {
        this.dialogRef.close();
      }

    }
