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
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css']
})
export class SoporteComponent {


      myService: MyService | null;
      data:any = null;
      search: string = '';
      constructor(private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, public router: Router) {
        this.snackBar.open("Cargando Tickets", null, {
          duration: 2000,
        });
        this.myService = new MyService(http, router);
        this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/soporte/')
          .subscribe((data) => {
            this.data = data.json();
            console.log(this.data);
          });
        this.snackBar.open("Tickets Cargados", null, {
          duration: 2000,
        });
      }



      openDialog(): void {
        let dialogRef = this.dialog.open(null, {
          width: '25%'
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');

        })
      }
      show(row){
        console.log(row);
        //this.selectedRowIndex = row.id;
        let dialogRef = this.dialog.open(null, {
          width: '25%',
          data: row
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');

        });
        this.myService.refresh();

      }

      deleteDialog(row): void {
      let dialogRef = this.dialog.open(null, {
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

        return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/soporte/'+id, {})
        .map((resp:Response)=>resp.json());



      }

      refresh(){
        var currentUrl = this.router.url;
        var refreshUrl = currentUrl.indexOf('soporte') > -1 ? '/clients' : '/soporte';
        setTimeout(() =>
        {
          this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
        },
        1000);
      }

    }
