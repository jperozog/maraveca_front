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
  selector: 'app-servidores',
  templateUrl: './servidores.component.html',
  styleUrls: ['./servidores.component.css']
})
export class ServidoresComponent {

    ip: string;
    nombre:string;
    myService: MyService | null;
    data: any = null;
    search: string = '';
    constructor(
      private http: Http,
      public usuario: AuthGuard,
      public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router) {
      this.snackBar.open("Cargando Clientes", null, {
        duration: 2000,
      });
      this.myService = new MyService(http, router);
      this.http.get(environment.apiEndpoint+'servidor/')
        .subscribe((data) => {
          this.data = data.json();
          console.log(this.data);
        });
      this.snackBar.open("Clientes Cargados", null, {
        duration: 2000,
      });
    }


    openDialog(): void {
      let dialogRef = this.dialog.open(AddServidoresComponent, {
        width: '25%'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      })
    }
    show(row){
      console.log(row);
      //this.selectedRowIndex = row.id;
      let dialogRef = this.dialog.open(AddServidoresComponent, {
        width: '25%',
        data: row
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      });
      //this.myService.refresh();

    }


    deleteDialog(row): void {
    let dialogRef = this.dialog.open(DeleteRouterDialog, {
      width: '250px',
      data: { nombre: row.nombre_srvidor, ip: row.ip_srvidor, id: row.id_srvidor }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }



    private delete(id):void{
      console.log(); //show`s id
      this.myService.deleteData(id)
      .subscribe((data) => {console.log(data)});
      this.snackBar.open("Borrando Router: Por favor espere", null, {
        duration: 1000,
      });
      this.myService.refresh();

    }

  }


  export class MyService {

    constructor(private http: Http, private router: Router) {

    }

    deleteData(id){

      return this.http.delete(environment.apiEndpoint+'servidor/'+id, {})
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
    selector: 'app-add-servidores',
    templateUrl: './add-servidor.component.html',
    styleUrls: ['./servidores.component.css']
  })
  export class AddServidoresComponent{

    ip : string;
    nombre :string;
    password :string;
    usuario : string;

    addClient: FormGroup;
    myService:MyService | null;


    constructor(private http:Http,
      private fb: FormBuilder,
      public dialogRef: MdDialogRef<AddServidoresComponent>,
      @Inject(MD_DIALOG_DATA) public row: any,
      public snackBar: MdSnackBar,
      private router: Router){
        this.myService = new MyService(http, router);

        if(row != null){
          this.addClient = this.fb.group({
            ip_srvidor: row.ip_srvidor,
            user_srvidor: row.user_srvidor,
            password_srvidor: row.password_srvidor,
            nombre_srvidor: row.nombre_srvidor,
            id_srvidor: row.id

          });
          //console.log(row)
        }else{

          this.addClient = this.fb.group({
            ip_srvidor: '',
            user_srvidor:'',
            password_srvidor: '',
            nombre_srvidor: '',

          });
          //console.log("llego vacio"+ row)
        }

      }

      onNoClick(): void {
        this.dialogRef.close();
      }


      Enviar(){
        var client = this.addClient.value;
        console.log(JSON.stringify(this.addClient.value));
        var body =
        "ip_srvidor=" + client.ip_srvidor +
        "&user_srvidor="+client.user_srvidor+
        "&password_srvidor="+client.password_srvidor+
        "&nombre_srvidor="+client.nombre_srvidor;
        var url = environment.apiEndpoint+"servidor?"+body;

        this.http.post(url, body).subscribe((data) => {});
        this.dialogRef.close();
        this.snackBar.open("Agregando Router: Por favor espere", null, {
          duration: 2000,
        });
        this.myService.refresh();

      }

      Editar(){
        var client = this.addClient.value;
        console.log(JSON.stringify(this.addClient.value));
        var body =
        "ip_srvidor=" + client.ip_srvidor +
        "&user_srvidor="+client.user_srvidor+
        "&password_srvidor="+client.password_srvidor+
        "&nombre_srvidor="+client.nombre_srvidor;
        var url = environment.apiEndpoint+"servidor/"+client.id+"?"+body;

        this.http.put(url, body).subscribe((data) => {});
        this.dialogRef.close();
        this.snackBar.open("Editando Router: Por favor espere", null, {
          duration: 2000,
        });
        this.myService.refresh();

      }




    }

    @Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-delete.html',
  styleUrls: ['./servidores.component.css']
})
export class DeleteRouterDialog {
  myService: MyService | null;

  constructor(
    public dialogRef: MdDialogRef<DeleteRouterDialog>,
    @Inject(MD_DIALOG_DATA) public data: any, private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router) {
      this.myService = new MyService(http, router);
     }

    delete(): void {
      console.log("borrando"+this.data.id);
      this.myService.deleteData(this.data.id)
      .subscribe((data) => {console.log(data)});
      this.dialogRef.close();
      this.snackBar.open("Borrando Router: Por favor espere", null, {
        duration: 1000,
      });
      this.myService.refresh();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
