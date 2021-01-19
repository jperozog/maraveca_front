import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
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
  factibi:any
  nofac:any
  fac:any
  answer:any = 1
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
    }else if(this.cliente.kind.toLowerCase == 'j' || this.cliente.kind.toLowerCase == 'g' || this.cliente.kind.toLowerCase == 'v-'){
      this.cli = this.cliente.social
    }
  }

ngOnInit(){
  //console.log(this.dialogRef)
  this.pre = this.fb.group({
    cliente: [this.cliente.id, Validators.required],
    tipo: [this.tipo, Validators.required],
    planes: ['', Validators.required],
    tipo_plan: ['', Validators.required],
    instalacion: ['', Validators.required],
    moneda: ['', Validators.required],
    responsable: [this.usuario.currentUser.id_user, Validators.required]

  });
  if(this.tipo == 'p'){
    this.pre.addControl('factibi', new FormControl(''))
    this.http.get(environment.apiEndpoint+'factible/'+this.cliente.id)
    .subscribe((data) => {
      this.fac_products = data.json().factibilidades;
      this.factibi = data.json().fact
      this.nofac = data.json().nofac
      this.fac = data.json().fac
      console.log(this.fac_products.slice(0,3));
    });
  }

}

confirm():void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {factibi: this.factibi, nofac: this.nofac, fac: this.fac, answer: this.answer}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.answer = result;
      console.log('The dialog was closed');
      console.log(result)
      if(result&&result==1){
        this.enviar()
      }

    });
  //this.dialogRef.close();
  }

enviar(){
  var client = this.pre.value;
  var url = environment.apiEndpoint+"presupuesto";
  this.snackBar.open("Enviando Presupuesto: Por favor espere", null, {
    duration: 2000,
  });

  this.http.post(url, client).subscribe(data => {
    console.log(data)
    this.dialogRef.close();
    this.snackBar.open("Presupuesto Enviado", null, {
      duration: 4000,
    });
    this.dialogRef.close();
  }, error => {
  });
  {
    this.dialogRef.close();
  }
  //this.myService.refresh();

  //this.router.navigate(['/clientes']);

}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'confirm-send.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MdDialogRef<DialogOverviewExampleDialog>,
    @Inject(MD_DIALOG_DATA) public data) {

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
