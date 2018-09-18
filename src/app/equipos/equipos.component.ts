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

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent {


    myService: MyService | null;
    data: any = null;
    search: string = '';
    constructor(
      private http: Http,
      public dialog: MdDialog,
      public usuario: AuthGuard,
      public snackBar:MdSnackBar,
      private router: Router) {
      this.snackBar.open("Cargando Equipos", null, {
        duration: 2000,
      });
      this.myService = new MyService(http, router);
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/equipos/')
        .subscribe((data) => {
          this.data = data.json();
          console.log(this.data);
        });
      this.snackBar.open("Equipos Cargados", null, {
        duration: 2000,
      });
    }


    openDialog(): void {
      let dialogRef = this.dialog.open(AddequipoComponent, {
        width: '25%'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      })
    }
    show(row){
      console.log(row);
      //this.selectedRowIndex = row.id;
      let dialogRef = this.dialog.open(AddequipoComponent, {
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
      this.snackBar.open("Borrando Equipo: Por favor espere", null, {
        duration: 1000,
      });
      this.myService.refresh();

    }

  }


  export class MyService {

    constructor(private http: Http, private router: Router) {

    }

    deleteData(id){

      return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/equipos/'+id, {})
      .map((resp:Response)=>resp.json());



    }

    refresh(){
      var currentUrl = this.router.url;
      var refreshUrl = currentUrl.indexOf('equipo') > -1 ? '/clients' : '/equipo';
      setTimeout(() =>
      {
        this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
      },
      1000);
    }

  }


  @Component({
    selector: 'app-add-equipo',
    templateUrl: './add-equipo.component.html',
    styleUrls: ['./equipos.component.css']
  })
  export class AddequipoComponent{

    equipos : any;
    //servidor_celda : string;

    addClient: FormGroup;
    myService:MyService | null;


    constructor(private http:Http,
      private fb: FormBuilder,
      public dialogRef: MdDialogRef<AddequipoComponent>,
      @Inject(MD_DIALOG_DATA) public row: any,
      public snackBar: MdSnackBar,
      private router: Router){

        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/equipos/')
        .subscribe((data) => {
          this.equipos = data.json();
          console.log(this.equipos.slice(0,3));
        });

        this.myService = new MyService(http, router);

        if(row != null){
          console.log(row.servidor_celda)
          this.addClient = this.fb.group({
            name: row.name,
            id: row.id,
            search: '',


          });
          console.log(this.addClient.value.servidor_celda)
        }else{

          this.addClient = this.fb.group({
            search: '',
            name: '',

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
        "name="+client.name;
        var url = "http://186.167.32.27:81/maraveca/public/index.php/api/equipos?"+body;

        this.http.post(url, body).subscribe((data) => {});
        this.dialogRef.close();
        this.snackBar.open("Agregando Equipo: Por favor espere", null, {
          duration: 2000,
        });
        this.myService.refresh();

      }

      Editar(){
        var client = this.addClient.value;
        console.log(JSON.stringify(this.addClient.value));
        var body =
        "name="+client.name;
        var url = "http://186.167.32.27:81/maraveca/public/index.php/api/equipos/"+client.id+"?"+body;

        this.http.put(url, body).subscribe((data) => {});
        this.dialogRef.close();
        this.snackBar.open("Editando Equipo: Por favor espere", null, {
          duration: 2000,
        });
        this.myService.refresh();

      }




    }
