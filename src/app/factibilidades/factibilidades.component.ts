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
  selector: 'app-factibilidades',
  templateUrl: './factibilidades.component.html',
  styleUrls: ['./factibilidades.component.css']
})
export class FactibilidadesComponent {


      myService: MyService | null;
      data: any = null;
      search: string = '';
      constructor(
        private http: Http,
        public dialog: MdDialog,
        public usuario: AuthGuard,
        public snackBar:MdSnackBar,
        private router: Router) {
        this.snackBar.open("Cargando Facturas", null, {
          duration: 2000,
        });
        this.myService = new MyService(http, router);
        this.http.get(environment.apiEndpoint+'factibi/')
          .subscribe((data) => {
            this.data = data.json();
            console.log(this.data[0].adicionales);

          });
        this.snackBar.open("Factibilidades Cargadas", null, {
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
      refresh(){
        this.http.get(environment.apiEndpoint+'factibi/')
          .subscribe((data) => {
            this.data = data.json();
            console.log(this.data);
          });
      }
      show(row){
        //console.log(row);
        //this.selectedRowIndex = row.id;

        if (this.usuario.perm && this.usuario.perm.includes('factibilidades_w')){

        let dialogRef = this.dialog.open(FactibilidadesDetComponent, {
          width: '25%',
          data: row
        });

        dialogRef.afterClosed().subscribe(result => {
          //console.log('The dialog was closed');
          this.http.get(environment.apiEndpoint+'factibi/')
            .subscribe((data) => {
              this.data = data.json();
              //console.log(this.data);
            });
          this.snackBar.open("Factibilidades Actualizadas", null, {
            duration: 2000,
          });
        });
        //this.myService.refresh();
      }

      }

      private delete(id):void{
        //console.log(id); //show`s id
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

        return this.http.delete(environment.apiEndpoint+'equipos/'+id, {})
        .map((resp:Response)=>resp.json());



      }

      refresh(){
        var currentUrl = this.router.url;
        var refreshUrl = currentUrl.indexOf('facturacion') > -1 ? '/clients' : '/facturacion';
        setTimeout(() =>
        {
          this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
        },
        1000);
      }

    }

    @Component({
  selector: 'app-facturacion-pagos',
  templateUrl: './factibilidades.det.html',
  styleUrls: ['./factibilidades.component.css']
})
export class FactibilidadesDetComponent {

  fac_control : string ;
  fact_details : any = null;
  fac_pagos : any = null;
  cliente : any;
  email : any;
  phone : any;
  address : any;
  dni : any;
  equipos : any;
  celdas : any;
  user: any;
  c_search: any;
  e_search: any;
  ptp= false;
  show = false;
  user_act: any;
  EditFact: FormGroup;
  constructor(
    private http:Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<FactibilidadesDetComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    private _fb: FormBuilder,
    public usuario: AuthGuard
){
  //console.log(row);
  this.http.get(environment.apiEndpoint+'factibil/'+row.id)
  .subscribe((data) => {
    //console.log(data.json())
    this.fact_details = data.json()[0].factibilidad[0];
    this.equipos = data.json()[1].equipos;
    this.celdas = data.json()[2].celdas;
    this.user = this.fact_details.adicionales[2];
    this.user_act = this.fact_details.adicionales[5];
    this.cliente = this.fact_details.nombre+" "+this.fact_details.apellido;
console.log(this.fact_details );
  });
  this.EditFact=this.fb.group({
    equipo:'',
    celda:'',
    factible:['', Validators.required],
    ptp: '',
    ptp_det:'',
    altura: '',
    status:'2',
    e_search:'',
    c_search:'',
    usuario: this.usuario.currentUser.id_user
  })


      this.EditFact.get('factible').valueChanges.subscribe(
    (factible) => {

      if (factible === '1') {

        this.EditFact.get('equipo').setValidators([Validators.required]);
        this.EditFact.get('celda').setValidators([Validators.required]);
        this.EditFact.get('altura').setValidators([Validators.required]);

      } else if (factible === '2') {

        this.EditFact.get('equipo').setValidators([]);
        this.EditFact.get('celda').setValidators([]);
        this.EditFact.get('altura').setValidators([]);

      } else if (factible === '3') {

        this.EditFact.get('equipo').setValidators([]);
        this.EditFact.get('celda').setValidators([]);
        this.EditFact.get('altura').setValidators([]);

    } else if (factible === '4') {

      this.EditFact.get('equipo').setValidators([]);
      this.EditFact.get('celda').setValidators([]);
      this.EditFact.get('altura').setValidators([]);
    }
      this.EditFact.get('equipo').updateValueAndValidity();
      this.EditFact.get('celda').updateValueAndValidity();
      this.EditFact.get('altura').updateValueAndValidity();



    }
);
  }
      mostrar_edicion(){
        this.show = true;


      }
agregar(){
  if(this.EditFact.value.ptp){
    this.EditFact.patchValue(
      {ptp: '1'}
    )
  }else{
    this.EditFact.patchValue(
      {ptp: '0'}
    )
  }
  //console.log(this.EditFact.value)
  var url = environment.apiEndpoint+'factibi/'+this.fact_details.id
  this.http.put(url, this.EditFact.value).subscribe((data) => {
    this.dialogRef.close();
 console.log( this.EditFact.value);
  });

}
editar(){

  var url = environment.apiEndpoint+'factibi_act/'+this.fact_details.id
  this.http.put(url, this.EditFact.value).subscribe((data) => {
    this.dialogRef.close();
    console.log( this.EditFact.value);
  });
}

}
