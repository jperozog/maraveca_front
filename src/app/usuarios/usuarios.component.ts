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
import { AuthGuard } from '../_guards/index';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent{
      myService: MyService | null;
      data:any = null;
      search: string = '';
      constructor(
        private http: Http,
        public dialog: MdDialog,
        public snackBar:MdSnackBar,
        public router: Router) {
        this.snackBar.open("Cargando Usuarios", null, {
          duration: 2000,
        });
        this.myService = new MyService(http, router);
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/users/')
          .subscribe((data) => {
            this.data = data.json();
            //console.log(this.data);
          });
        this.snackBar.open("Usuarios Cargadas", null, {
          duration: 2000,
        });
      }
      openDialog(): void {
        let dialogRef = this.dialog.open(AdduserComponent);
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        })
      }
      show(row){
        console.log(row);
        //this.selectedRowIndex = row.id;
        let dialogRef = this.dialog.open(AdduserComponent, {
          data: row
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
        this.myService.refresh();
      }
      deleteDialog(row): void {
      let dialogRef = this.dialog.open(DeleteuserDialog, {
        data: { nombre: row.nombre_user+" "+row.apellido_user, id: row.id_user }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        //this.animal = result;
      });
      }
      privDialog(row): void {
      let dialogRef = this.dialog.open(PrivuserDialog, {
        data: { nombre: row.nombre_user, apellido: row.apellido_user, id: row.id_user }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        //this.animal = result;
      });
      }
      zoneDialog(row): void {
      let dialogRef = this.dialog.open(ZoneuserDialog, {
        data: { nombre: row.nombre_user+" "+row.apellido_user, id: row.id_user }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        //this.animal = result;
      });
      }
      private delete(id):void{
        console.log(id); //show`s id
        this.myService.deleteData(id)
        .subscribe((data) => {console.log(data)});
        this.snackBar.open("Borrando Usuario: Por favor espere", null, {
          duration: 2000,
        });
        this.myService.refresh();
      }
    }
    export class MyService {
      constructor(private http: Http, private router: Router) {
      }
      deleteData(id){
        return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/users/'+id, {})
        .map((resp:Response)=>resp.json());
      }
      refresh(){
        var currentUrl = this.router.url;
        var refreshUrl = currentUrl.indexOf('users') > -1 ? '/clients' : '/users';
        setTimeout(() =>
        {
          this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
        },
        2000);
      }
      deletePerm(user){
        return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/users/'+user+'/permission/', {})
        .map((resp:Response)=>resp.json());

      }
      addPerm(user, perm){
        perm.forEach(i => {
          this.http.post('http://186.167.32.27:81/maraveca/public/index.php/api/users/permission/?user='+user+'&perm='+i, i).subscribe((data) => {});


        });
      }
    }
    @Component({
      selector: 'app-add-user',
      templateUrl: './add-user.component.html',
      styleUrls: ['./usuarios.component.css']
    })
    export class AdduserComponent{
      costo : string;
      nombre :string;
      addplan: FormGroup;
      CC:MyService | null;
      constructor(private http:Http,
        private fb: FormBuilder,
        public dialogRef: MdDialogRef<AdduserComponent>,
        @Inject(MD_DIALOG_DATA) public row: any,
        public snackBar: MdSnackBar,
        private router: Router){
          this.CC = new MyService(http, router);
          if(row != null){
            this.addplan = this.fb.group({
              nombre_user: row.nombre_user,
              apellido_user: row.apellido_user,
              username: row.username,
              email_user: row.email_user,
              phone_user: row.phone_user,
              password_user: row.password_user,
              confirm: row.password_user,
              id: row.id_user
            });
            //console.log(row)
          }else{
            this.addplan = this.fb.group({
              nombre_user: '',
              apellido_user: '',
              username: '',
              email_user: '',
              phone_user: '',
              password_user: '',
              confirm: '',
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
          var body =
          "nombre_user=" + plan.nombre_user +
          "&apellido_user="+plan.apellido_user+
          "&username="+plan.username+
          "&email_user="+plan.email_user+
          "&phone_user="+plan.phone_user+
          "&password_user="+plan.password_user;
          var url = "http://186.167.32.27:81/maraveca/public/index.php/api/users?"+body;

          this.http.post(url, body).subscribe((data) => {});
          this.dialogRef.close();
          this.snackBar.open("Agregando Usuario: Por favor espere", null, {
            duration: 2000,
          });
          this.CC.refresh();
        }
        Editar(){
          var plan = this.addplan.value;
          console.log(JSON.stringify(this.addplan.value));
          var body =
          "nombre_user=" + plan.nombre_user +
          "&apellido_user="+plan.apellido_user+
          "&username="+plan.username+
          "&email_user="+plan.email_user+
          "&phone_user="+plan.phone_user+
          "&password_user="+plan.password_user;
          var url = "http://186.167.32.27:81/maraveca/public/index.php/api/users/"+plan.id+"?"+body;

          this.http.put(url, body).subscribe((data) => {});
          this.dialogRef.close();
          this.snackBar.open("Editando Usuario: Por favor espere", null, {
            duration: 2000,
          });
          this.CC.refresh();
        }
      }
      @Component({
    selector: 'delete-dialog',
    templateUrl: 'confirm-delete.html',
    styleUrls: ['./usuarios.component.css']
  })
  export class DeleteuserDialog {
    myService: MyService | null;

    constructor(
      public dialogRef: MdDialogRef<DeleteuserDialog>,
      @Inject(MD_DIALOG_DATA) public data: any, private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router) {
        this.myService = new MyService(http, router);
       }

      delete(): void {
        console.log("borrando"+this.data.id);
        this.myService.deleteData(this.data.id)
        .subscribe((data) => {console.log(data)});
        this.dialogRef.close();
        this.snackBar.open("Borrando Usuario: Por favor espere", null, {
          duration: 1000,
        });
        this.myService.refresh();
      }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }
  @Component({
selector: 'delete-dialog',
templateUrl: 'priv-user.component.html',
styleUrls: ['./usuarios.component.css']
})
export class PrivuserDialog {
myService: MyService | null;
addplan: FormGroup;
permisos =["facturacion", "clientes", "pclientes", "servicios", "planes", "notify", "soporte", "factibilidades", "usuarios","celdas", "router", "equipos", "ap" ];
perm = []
prev=[]
constructor(
  public dialogRef: MdDialogRef<DeleteuserDialog>,
  @Inject(MD_DIALOG_DATA) public data: any,
  private http: Http,
  public dialog: MdDialog,
  public snackBar:MdSnackBar,
  private router: Router,
  private fb: FormBuilder,
  ) {
    this.myService = new MyService(http, router);
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/users/'+this.data.id+'/permission')
    .subscribe((data) => {
      data.json().forEach(permi => {
          this.perm.push(permi.perm);
          this.prev = this.perm
          //console.log(this.perm)
      });
    });

   }


onNoClick(): void {
  this.dialogRef.close();
}
Enviar(){
  this.myService.deletePerm(this.data.id).subscribe((data) => {console.log(data)});;
  setTimeout(() =>
  {
    this.myService.addPerm(this.data.id, this.prev)
  },
  2000);
  this.dialogRef.close();
  this.snackBar.open("Agregando Plan: Por favor espere", null, {
    duration: 500,
  });
  //this.myService.refresh();
}
}
@Component({
selector: 'zone-user',
templateUrl: 'zon-user.component.html',
styleUrls: ['./usuarios.component.css']
})
export class ZoneuserDialog {
  myService: MyService | null;
  addplan: FormGroup;
  permisos: any;
  perm = []
  prev=[]
  zona=[]
  constructor(
    public dialogRef: MdDialogRef<DeleteuserDialog>,
    @Inject(MD_DIALOG_DATA)
    public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    private router: Router,
    private fb: FormBuilder,
    public usuario: AuthGuard
    ) {
      this.myService = new MyService(http, router);
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/servidor/')
        .subscribe((data) => {
          data.json().forEach(zona => {
              this.zona.push(zona);
          });
        });
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/users/'+this.data.id+'/zona')
          .subscribe((data) => {
            data.json().forEach(permi => {
                this.prev.push(permi.zona);
                this.perm = this.prev;
            });
          });
          //console.log(this.perm)
          //console.log(this.zona)
     }


  onNoClick(): void {
    this.dialogRef.close();
  }
  Enviar(){
    /*this.myService.deletePerm(this.data.id).subscribe((data) => {console.log(data)});;
    setTimeout(() =>
    {
      this.myService.addPerm(this.data.id, this.prev)
    },
    2000);*/
    this.http.post(
      'http://186.167.32.27:81/maraveca/public/index.php/api/users/'+
      this.data.id+
      '/zona', this.perm).subscribe((data) => {});
    this.dialogRef.close();
    this.snackBar.open("Agregando Plan: Por favor espere", null, {
      duration: 500,
    });
    //this.myService.refresh();
  }
  }
