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

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent {


    myService: MyService | null;
    data:any = null;
    search: string = '';
    constructor(
      private http: Http,
      public dialog: MdDialog,
      public snackBar:MdSnackBar,
      public router: Router) {
      this.snackBar.open("Cargando Planes", null, {
        duration: 2000,
      });
      this.myService = new MyService(http, router);
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/planes/')
        .subscribe((data) => {
          this.data = data.json();
          console.log(this.data);
        });
      this.snackBar.open("Planes Cargadas", null, {
        duration: 2000,
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
    show(row){
      console.log(row);
      //this.selectedRowIndex = row.id;
      let dialogRef = this.dialog.open(AddplanesComponent, {
        width: '25%',
        data: row
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      });
      this.myService.refresh();

    }

    private delete(id):void{
      console.log(id); //show`s id
      this.myService.deleteData(id)
      .subscribe((data) => {console.log(data)});
      this.snackBar.open("Borrando Plan: Por favor espere", null, {
        duration: 2000,
      });
      this.myService.refresh();

    }

  }


  export class MyService {

    constructor(private http: Http, private router: Router) {

    }

    deleteData(id){

      return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/planes/'+id, {})
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
            id: row.id_plan

          });
          //console.log(row)
        }else{

          this.addplan = this.fb.group({
            cost_plan: '',
            nombre: '',

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
        "cost_plan=" + plan.cost_plan +
        "&name_plan="+plan.name_plan;
        var url = "http://186.167.32.27:81/maraveca/public/index.php/api/planes?"+body;

        this.http.post(url, body).subscribe((data) => {});
        this.dialogRef.close();
        this.snackBar.open("Agregando Plan: Por favor espere", null, {
          duration: 2000,
        });
        this.CC.refresh();

      }
      Editar(){
        var plan = this.addplan.value;
        console.log(JSON.stringify(this.addplan.value));
        var body =
        "cost_plan=" + plan.cost_plan +
        "&name_plan="+plan.name_plan;
        var url = "http://186.167.32.27:81/maraveca/public/index.php/api/planes/"+plan.id+"?"+body;

        this.http.put(url, body).subscribe((data) => {});
        this.dialogRef.close();
        this.snackBar.open("Editando Plan: Por favor espere", null, {
          duration: 2000,
        });
        this.CC.refresh();

      }





    }
