import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import { AuthGuard } from '../_guards/index';
import {Router} from '@angular/router';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-planes',
  templateUrl: './pre.component.html',
  styleUrls: ['./pre.component.css']
})

export class PreComponent implements OnInit{
  pre: FormGroup;
  cli: string = null;
  cliente : any
  tipo : any
  fac_products: any = []

  constructor(
    public usuario: AuthGuard,
    private http: Http,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<PreComponent>,
    @Inject(MD_DIALOG_DATA) public datos: any,
    public snackBar:MdSnackBar,
    public router: Router,
    private fb: FormBuilder,
  ){
    this.cliente=datos[0]
    this.tipo = datos[1]
    if(this.cliente.kind.toLowerCase == 'v' || this.cliente.kind.toLowerCase == 'e'){
      this.cli = this.cliente.nombre+" "+this.cliente.apellido
    }else if(this.cliente.kind.toLowerCase == 'j' || this.cliente.kind.toLowerCase == 'g'){
      this.cli = this.cliente.social
    }
  }

ngOnInit(){
  //console.log(this.dialogRef)
  this.pre = this.fb.group({
    cliente: this.cliente.id,
    tipo: this.tipo,
    planes: [],
    instalacion: '',
    moneda: '',
    responsable: this.usuario.currentUser.id_user

  });
  if(this.tipo == 'p'){
    this.pre.addControl('factibi', new FormControl(''))
    this.http.get(environment.apiEndpoint+'factible/'+this.cliente.id)
    .subscribe((data) => {
      this.fac_products = data.json();
      console.log(this.fac_products.slice(0,3));
    });
  }

}



enviar(){
  var client = this.pre.value;
  var url = environment.apiEndpoint+"presupuesto";

  this.http.post(url, client).subscribe(data => {
    this.dialogRef.close();
    this.snackBar.open("Enviando Presupuesto: Por favor espere", null, {
      duration: 2000,
    });
  }, error => {
  });
  //this.myService.refresh();
  //this.router.navigate(['/clientes']);
}

}
