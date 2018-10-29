import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
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
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit, OnDestroy {
  inventarios:any
  inventarios_t:any
  update:boolean=false
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
      let dialogRef = this.dialog.open(AddEquipoComponent, {
        width: '25%'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      })
    }
    show(row){
      console.log(row);
      //this.selectedRowIndex = row.id;
      let dialogRef = this.dialog.open(AddEquipoComponent, {
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
      this.http.get(environment.apiEndpoint+'inventarios/')
        .subscribe((data) => {
          this.inventarios_t = data.json()
          this.update=false
          if (nf){
            this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          });}
          setTimeout(()=>{this.inventarios=this.inventarios_t})
        });
    }

}
@Component({
  selector: 'app-inventarios',
  templateUrl: './AddEquipo.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class AddEquipoComponent {
  zonas:any
  equipos:any
  addEquipo:FormGroup
  constructor(
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddEquipoComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    private http: Http,
    public usuario: AuthGuard,
    public dialog: MdDialog,
    public snackBar:MdSnackBar,
    public router: Router)
    {
      this.addEquipo = this.fb.group({
        model_inventario:['', [Validators.required]],
        serial_inventario:['', [Validators.required]],
        zona_inventario:['', [Validators.required]],
        zona_s:'',
        model_s:''
      })
      this.http.get(environment.apiEndpoint+'PreloadInventarios/')
      .subscribe((data)=>{
        this.zonas=data.json().zonas
        this.equipos=data.json().equipos
        if(row!=null){
          this.addEquipo.patchValue({
            model_inventario:+row.model_inventario,
            serial_inventario:row.serial_inventario,
            zona_inventario:+row.zona_inventario,
          })
        }
      })
    }
    Editar(){
      if(this.row != null){
        this.addEquipo.addControl('responsable', new FormControl(this.usuario.currentUser.id_user))
        this.addEquipo.addControl('id', new FormControl(this.row.id))
        this.addEquipo.removeControl('model_s')
        this.addEquipo.removeControl('zona_s')
        this.http.put(environment.apiEndpoint+'inventarios/', this.addEquipo.value)
        .subscribe((data)=>{
          this.dialogRef.close();
          this.snackBar.open("Zona Creada", null, {
            duration: 2000,
          });
          this.addEquipo.removeControl('responsable')
          this.addEquipo.removeControl('id')
          this.addEquipo.addControl('model_s', new FormControl(''))
          this.addEquipo.addControl('zona_s', new FormControl(''))
        })
      }
    }
    Enviar(){
      if(this.row == null){
        this.addEquipo.removeControl('zona_s')
        this.addEquipo.removeControl('model_s')
        this.addEquipo.addControl('responsable', new FormControl(this.usuario.currentUser.id_user))
        this.http.post(environment.apiEndpoint+'inventarios/', this.addEquipo.value)
        .subscribe((data)=>{
          this.addEquipo.removeControl('responsable')
          this.addEquipo.addControl('model_s', new FormControl(''))
          this.addEquipo.addControl('zona_s', new FormControl(''))
          this.dialogRef.close();
          this.snackBar.open("Zona Editada", null, {
            duration: 2000,
          });
        })
      }
    }

}
