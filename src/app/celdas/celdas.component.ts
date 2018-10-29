import {Component, Inject, Pipe, PipeTransform} from '@angular/core';
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
import { environment } from '../../environments/environment'


@Component({
  selector: 'app-celdas',
  templateUrl: './celdas.component.html',
  styleUrls: ['./celdas.component.css']
})
export class CeldasComponent {


  myService: MyService | null;
  data: any = null;
  search: string = '';
  constructor(public usuario: AuthGuard, private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router) {
    this.snackBar.open("Cargando Clientes", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router);
    this.http.get(environment.apiEndpoint+'celdas/')
      .subscribe((data) => {
        this.data = data.json();
        console.log(this.data);
      });
    this.snackBar.open("Celdas Cargadas", null, {
      duration: 2000,
    });
  }


  openDialog(): void {
    let dialogRef = this.dialog.open(AddceldasComponent, {
      width: '25%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  show(row){
    console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(AddceldasComponent, {
      width: '25%',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
    //this.myService.refresh();

  }

  private delete(id):void{
    console.log(id); //show`s id
    this.myService.deleteData(id)
    .subscribe((data) => {console.log(data)});
    this.snackBar.open("Borrando Celda: Por favor espere", null, {
      duration: 1000,
    });
    this.myService.refresh();

  }

}


export class MyService {

  constructor(private http: Http, private router: Router) {

  }

  deleteData(id){

    return this.http.delete(environment.apiEndpoint+'celdas/'+id, {})
    .map((resp:Response)=>resp.json());



  }

  refresh(){
    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('celdas') > -1 ? '/clients' : '/celdas';
    setTimeout(() =>
    {
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
    },
    1000);
  }

}


@Component({
  selector: 'app-add-celdas',
  templateUrl: './add-celda.component.html',
  styleUrls: ['./celdas.component.css']
})
export class AddceldasComponent{

  ip : string;
  nombre :string;
  password :string;
  usuario : string;
  routers : any;
  r_celda : string;
  //servidor_celda : string;

  addClient: FormGroup;
  myService:MyService | null;


  constructor(private http:Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddceldasComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router){

      this.http.get(environment.apiEndpoint+'servidor/')
      .subscribe((data) => {
        this.routers = data.json();
        console.log(this.routers.slice(0,3));
      });

      this.myService = new MyService(http, router);

      if(row != null){
        console.log(row.servidor_celda)
        this.addClient = this.fb.group({
          nombre_celda: row.nombre_celda,
          id_celda: row.id_celda,
          servidor_celda: row.servidor_celda,
          r_celda: '',


        });
        console.log(this.addClient.value.servidor_celda)
      }else{

        this.addClient = this.fb.group({
          ip_celda: '',
          usuario_celda:'',
          password_celda: '',
          nombre_celda: '',
          servidor_celda: '',
          r_celda: '',

        });
        console.log("llego vacio"+ row)
      }

    }

    onNoClick(): void {
      this.dialogRef.close();
    }


    Enviar(){
      var client = this.addClient.value;
      //console.log(JSON.stringify(this.addClient.value));
      var body =
      "nombre_celda="+client.nombre_celda+
      "&servidor_celda="+client.servidor_celda;
      var url = environment.apiEndpoint+"celdas?"+body;

      this.http.post(url, body).subscribe((data) => {});
      this.dialogRef.close();
      this.snackBar.open("Agregando Celda: Por favor espere", null, {
        duration: 2000,
      });
      this.myService.refresh();

    }

    Editar(){
      var client = this.addClient.value;
      console.log(JSON.stringify(this.addClient.value));
      var body =
      "nombre_celda="+client.nombre_celda+
      "&servidor_celda="+client.servidor_celda;
      var url = environment.apiEndpoint+"celdas/"+client.id_celda+"?"+body;

      this.http.put(url, body).subscribe((data) => {});
      this.dialogRef.close();
      this.snackBar.open("Editando Celda: Por favor espere", null, {
        duration: 2000,
      });
      this.myService.refresh();

    }




  }
