import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Location } from '@angular/common';
import {Observable} from 'rxjs/Observable';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-activos',
  templateUrl: './activos.component.html',
  styleUrls: ['./activos.component.css']
})
export class ActivosComponent implements OnInit, OnDestroy {
  activos_t:any
  activos:any
  autoupdate:boolean = true
  update: boolean = false
  constructor(private http: Http,
  public usuario: AuthGuard,
  public dialog: MdDialog,
  public snackBar:MdSnackBar,
  public router: Router) { }

  ngOnInit() {
    IntervalObservable.create(10000)
    .takeWhile(() => this.autoupdate)
    .subscribe(() => {
      this.refresh(false);
    });
    this.refresh(false);
  }

  ngOnDestroy(){
    this.autoupdate=false
  }

  AddEquipo(){
    //console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(AddActivoComponent, {
      //height: '80%',
      //data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
    //this.myService.refresh();

  }

  refresh(nf){
    this.update=true
    this.http.get(environment.apiEndpoint+'activos/')
      .subscribe((data) => {
        this.activos_t = data.json()
        this.update=false
        if (nf){
          this.snackBar.open("Lista Actualizada", null, {
          duration: 2000,
        });}
        setTimeout(()=>{this.activos=this.activos_t})
      });

  }
}
@Component({
  selector: 'app-activos',
  templateUrl: './Activos_Detallados.component.html',
  styleUrls: ['./activos.component.css']
})
export class ActivosDetComponent implements OnInit, OnDestroy {
  activos_t:any
  activos:any
  autoupdate:boolean = true
  update: boolean = false
  det:any
  constructor(private http: Http,
  public usuario: AuthGuard,
  public dialog: MdDialog,
  private route: ActivatedRoute,
  public snackBar:MdSnackBar,
  public router: Router) {
    this.route.params
      .subscribe(
        params => {
          this.det = params.det;
          console.log(this.det)
        }
      ); }

  ngOnInit() {
    IntervalObservable.create(10000)
    .takeWhile(() => this.autoupdate)
    .subscribe(() => {
      this.refresh(false);
    });
    this.refresh(false);
  }

  ngOnDestroy(){
    this.autoupdate=false
  }

  refresh(nf){
    this.update=true
    this.http.get(environment.apiEndpoint+'activosdet/', {params: {id: this.det}})
      .subscribe((data) => {
        this.activos_t = data.json()
        this.update=false
        if (nf){
          this.snackBar.open("Lista Actualizada", null, {
          duration: 2000,
        });}
        setTimeout(()=>{this.activos=this.activos_t})
      });

  }
}
@Component({
  templateUrl: './addActivos.component.html',
  styleUrls: ['./activos.component.css']
})
export class AddActivoComponent implements OnInit {
  zonas:any
  celdas:any
  cla_activos:any
  seriales:any=[]
  addActivo1:FormGroup
  constructor(
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddActivoComponent>,
    //@Inject(MD_DIALOG_DATA) public row: any,
    private http: Http,
    public usuario: AuthGuard,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    public router: Router)
    {
      this.addActivo1 = this.fb.group({
        obj_activos:['', [Validators.required]],
        cla_activos:['', [Validators.required]],
        cla_activos_s:['', [Validators.required]],
        ubi_activos:[[], [Validators.required]],
        ubi_activos_s:[[], [Validators.required]],
        det_activos:[[], [Validators.required]],
        det_activos_s:[[], [Validators.required]],
        com_activos:[[], [Validators.required]],

      })
      this.http.get(environment.apiEndpoint+'preloadActivos/')
      .subscribe((data)=>{
        this.zonas=data.json().zonas
        this.celdas=data.json().celdas
        this.cla_activos=data.json().cla_activos
        }
      )
    }

    ngOnInit(){
      // this.addActivo1.get('serial_inventario').valueChanges.subscribe(
      //   (EN)=>{
      //     setTimeout(()=>{
      //       //this.Agregar()
      //     }, 10)
      //   }
      // )
    }

    Agregar(){
        this.seriales.push(this.addActivo1.value.serial_inventario)
        setTimeout(()=>{
          this.addActivo1.patchValue({serial_inventario: '', seriales: this.seriales})
        }, 5)

    }

    Enviar(){
        this.addActivo1.addControl('responsable', new FormControl(this.usuario.currentUser.id_user))
        this.http.post(environment.apiEndpoint+'inventarios/', this.addActivo1.value)
        .subscribe((data)=>{
          this.addActivo1.removeControl('responsable')
          this.dialogRef.close();
          this.snackBar.open("Zona Editada", null, {
            duration: 2000,
          });
        })

    }
    onNoClick(): void {
      this.dialogRef.close();
    }

}
