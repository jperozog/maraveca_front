import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {Router} from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.css']
})
export class ZonaComponent implements OnInit, OnDestroy {
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
  ngOnDestroy(){
    this.autoupdate=false
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
        setTimeout(()=>{this.zonas=this.zonas_t}, 100)
      });

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
    private router: Router,
    public usuario: AuthGuard){
      this.addZona = this.fb.group({
        nombre_zona:['', [Validators.required]],
        routers:[[], [Validators.required]],
        r_celda:''
      });
      this.http.get(environment.apiEndpoint+'servidor/')
      .subscribe((data) => {
        this.routers = data.json();
        console.log(this.routers.slice(0,3));
          if(row != null){
            console.log(row.routers.split(','))
            this.addZona.patchValue({
              nombre_zona:row.nombre_zona,
              routers:row.routers.split(',').map(Number),
              r_celda:''
            });
          }else{
            console.log("llego vacio"+ row)
          }


      });


    }
    Editar(){
      if(this.row != null){
        this.addZona.addControl('responsable', new FormControl(this.usuario.currentUser.id_user))
        this.addZona.addControl('id', new FormControl(this.row.id))
        this.addZona.removeControl('r_celda')
        this.http.put(environment.apiEndpoint+'zonas/', this.addZona.value)
        .subscribe((data)=>{
          this.dialogRef.close();
          this.snackBar.open("Zona Creada", null, {
            duration: 2000,
          });
          this.addZona.removeControl('responsable')
          this.addZona.removeControl('id')
          this.addZona.addControl('r_celda', new FormControl(''))
        })
      }
    }
    Enviar(){
      if(this.row == null){
        this.addZona.removeControl('r_celda')
        this.addZona.addControl('responsable', new FormControl(this.usuario.currentUser.id_user))
        this.http.post(environment.apiEndpoint+'zonas/', this.addZona.value)
        .subscribe((data)=>{
          this.addZona.removeControl('responsable')
          this.addZona.addControl('r_celda', new FormControl(''))
          this.dialogRef.close();
          this.snackBar.open("Zona Editada", null, {
            duration: 2000,
          });
        })
      }
    }

    onNoClick(): void {
      this.dialogRef.close();
    }


}
