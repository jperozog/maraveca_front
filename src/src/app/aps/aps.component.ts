import {Component, Inject} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {Router} from '@angular/router';
//import 'rxjs/add/operator/map';

@Component({
  selector: 'app-aps',
  templateUrl: './aps.component.html',
  styleUrls: ['./aps.component.css']
})
export class ApsComponent {


    myService: MyService | null;
    data:any = null;
    search: string = '';
    constructor(private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, public router: Router) {
      this.snackBar.open("Cargando AccessPoints", null, {
        duration: 2000,
      });
      this.myService = new MyService(http, router);
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/aps/')
        .subscribe((data) => {
          this.data = data.json();
          console.log(this.data);
        });
      this.snackBar.open("AccessPoints Cargados", null, {
        duration: 2000,
      });
    }



    openDialog(): void {
      let dialogRef = this.dialog.open(AddapsComponent, {
        width: '25%'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      })
    }
    show(row){
      console.log(row);
      //this.selectedRowIndex = row.id;
      let dialogRef = this.dialog.open(AddapsComponent, {
        width: '25%',
        data: row
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      });
      this.myService.refresh();

    }

    deleteDialog(row): void {
    let dialogRef = this.dialog.open(DeleteApsDialog, {
      width: '250px',
      data: { nombre: row.nombre_ap, ip: row.ip_ap, id: row.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

    

  }


    export class MyService {

    constructor(private http: Http, private router: Router) {

    }

    deleteData(id){

      return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/aps/'+id, {})
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
    templateUrl: './add-ap.component.html',
    styleUrls: ['./aps.component.css']
  })
  export class AddapsComponent{

    ip : string;
    nombre :string;
    password :string;
    usuario : string;
    celdas: any;
    c_search: string;

    addClient: FormGroup;
    myService:MyService | null;


    constructor(private http:Http,
      private fb: FormBuilder,
      public dialogRef: MdDialogRef<AddapsComponent>,
      @Inject(MD_DIALOG_DATA) public row: any,
      public snackBar: MdSnackBar,
      private router: Router){

        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/celdas/')
        .subscribe((data) => {
          this.celdas = data.json();
          //console.log(this.celdas);
        });

        this.myService = new MyService(http, router);
        console.log(row)
        if(row != null){
          this.addClient = this.fb.group({
            ip_ap: row.ip_ap,
            user_ap: row.user_ap,
            password_ap: row.password_ap,
            nombre_ap: row.nombre_ap,
            celda_ap: row.celda_ap,
            id: row.id,
            c_search: '',

          });
          //console.log(row)
        }else{

          this.addClient = this.fb.group({
            ip_ap: '',
            user_ap:'',
            password_ap: '',
            nombre_ap: '',
            celda_ap:'',
            c_search: '',

          });
          //console.log("llego vacio"+ row)
        }

      }

      onNoClick(): void {
        this.dialogRef.close();
      }


      Enviar(){
        var client = this.addClient.value;
        //console.log(JSON.stringify(this.addClient.value));
        var body =
        "ip_ap=" + client.ip_ap +
        "&user_ap="+client.user_ap+
        "&password_ap="+client.password_ap+
        "&celda_ap="+client.celda_ap+
        "&nombre_ap="+client.nombre_ap;
        var url = "http://186.167.32.27:81/maraveca/public/index.php/api/aps/?"+body;
        console.log(url);
        this.http.post(url, body).subscribe((data) => {});
        this.dialogRef.close();
        this.snackBar.open("Agregando AccessPoint: Por favor espere", null, {
          duration: 2000,
        });
        this.myService.refresh();

      }
      Editar(){
        var client = this.addClient.value;
        //console.log(JSON.stringify(this.addClient.value));
        var body =
        "ip_ap=" + client.ip_ap +
        "&user_ap="+client.user_ap+
        "&password_ap="+client.password_ap+
        "&celda_ap="+client.celda_ap+
        "&nombre_ap="+client.nombre_ap;
        var url = "http://186.167.32.27:81/maraveca/public/index.php/api/aps/"+client.id+"?"+body;
        console.log(url);
        this.http.put(url, body).subscribe((data) => {});
        this.dialogRef.close();
        this.snackBar.open("Editando AccessPoint: Por favor espere", null, {
          duration: 2000,
        });
        this.myService.refresh();

      }




    }

        @Component({
      selector: 'delete-dialog',
      templateUrl: 'confirm-delete.html',
      styleUrls: ['./aps.component.css']
    })
    export class DeleteApsDialog {
      myService: MyService | null;

      constructor(
        public dialogRef: MdDialogRef<DeleteApsDialog>,
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
