import { Component, OnInit, Inject } from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {Router} from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.css']
})
export class ZonaComponent implements OnInit {
  zonas:any
  zonas_t:any
  update:boolean=true
  autoupdate:boolean=true
  constructor(
    private http: Http,
    public usuario: AuthGuard,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    public router: Router)
    {

    }

  ngOnInit() {
    IntervalObservable.create(10000)
    .takeWhile(() => this.autoupdate)
    .subscribe(() => {
      this.refresh(false);
    });
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(AddZonaComponent, {
      width: '25%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  show(row){
    console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(AddZonaComponent, {
      width: '25%',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
    //this.myService.refresh();

  }
  refresh(nf){
    this.update=true
    this.http.get(environment.apiEndpoint+'zonas/')
      .subscribe((data) => {
        this.zonas_t = data.json()
        this.update=false
        if (nf){
          this.snackBar.open("Lista Actualizada", null, {
          duration: 2000,
        });}
      });
      this.zonas=this.zonas_t
  }
}
@Component({
  selector: 'app-zona',
  templateUrl: './Add-zona.component.html',
  styleUrls: ['./zona.component.css']
})
export class AddZonaComponent {
  routers:any
  addZona: FormGroup;
  update:boolean=true
  autoupdate:boolean=true
  r_celda=''
  constructor(private http:Http,
    private fb: FormBuilder,

    public dialogRef: MdDialogRef<AddZonaComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router){

      this.http.get(environment.apiEndpoint+'servidor/')
      .subscribe((data) => {
        this.routers = data.json();
        console.log(this.routers.slice(0,3));
      });

      if(row != null){
        console.log(row.routers.split(','))
        var routers4=row.routers.split(',')
        this.addZona = this.fb.group({
          nombre_zona:row.nombre_zona,
          routers:routers4,
          r_celda:''
        });

      }else{

        this.addZona = this.fb.group({
          nombre_zona:'',
          routers:[],
          r_celda:''
        });
        console.log("llego vacio"+ row)
      }

    }

    onNoClick(): void {
      this.dialogRef.close();
    }


}
