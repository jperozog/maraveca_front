import { Component, Inject, Pipe, PipeTransform, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/index';
import 'rxjs/add/operator/takeWhile';
import { AuthGuard } from '../_guards/index';
import { AuthenticationService } from '../_services/index';
import { APP_CONFIG } from '../app.config';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/takeWhile';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { environment } from '../../environments/environment';
import { PreComponent } from '../presupuestos/pre.component';
import { AddservicesComponent, UpdateserviceComponent } from '../servicios/servicios.component';
import { forEach } from '@angular/router/src/utils/collection';
import { DatePipe, Location } from '@angular/common';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Editar_ref_dl, FacturacionPagos, MyService, UpdatePlanPricesFacDialog } from '../facturacion/facturacion.component';
import { IpValidators } from '../servicios/validar_ip';
import { SerialValidators } from '../servicios/validar_serial';
import { DateModel, DatepickerOptions } from '@novalinc/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CargarPagosService } from '../services/administrativo/cargar-pagos.service'
import { ConfigAdminService } from '../services/config-admin/config-admin.service'


@Component({
  selector: 'app-equipos',
  templateUrl: './config-admin.component.html',
  styleUrls: ['./config-admin.component.css']
})
export class ConfigAdminComponent implements OnInit {


  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  data: any = null;
  search: string = '';
  iva: any;
  moneda_local: any;
  moneda_ex: any;
  tasa: any;
  tasaBCV: any;
  historial: any;
  autoupdate: boolean = true;
  p: number = 1
  constructor(
    private http: Http,
    public dialog: MdDialog,
    private location: Location,
    public usuario: AuthGuard,
    public snackBar: MdSnackBar,
    public test: AuthenticationService,
    private modalService: BsModalService,
    private configService: ConfigAdminService,
    private router: Router) {



  }


  ngOnInit() {
    this.http.get(environment.apiEndpoint + 'history_config/')
      .subscribe((data) => {
        this.historial = data.json();
        console.log(this.historial);
      });
    this.http.get(environment.apiEndpoint + 'Configuraciones/')
      .subscribe((data) => {
        this.data = data.json();
        console.log(this.data);

        this.iva = this.data[2].valor;
        this.moneda_local = this.data[3].valor;
        this.moneda_ex = this.data[5].valor;
        this.tasa = this.data[0].valor;
        this.tasaBCV = this.data[6].valor;
      });
    /*
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh();
      });
      */
  }
  ngOnDestroy() {
    // this.autoupdate = false
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  editar_conf() {
    //console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(edit_conf_adm, {
      width: '25%',
      data: this.data


    });



  }

  guardarData() {
    this.configService.guardarData(this.tasa, this.tasaBCV, this.moneda_local, this.moneda_ex, this.iva, this.usuario.currentUser.id_user)
      .subscribe(
        res => this.closeModal(),
        err => console.log(err))
  }


  closeModal() {
    this.modalRef.hide(),
      this.ngOnInit()
  }


  Close() { this.location.back(); }


}


@Component({
  selector: 'delete-dialog',
  templateUrl: 'Edit_conf_adm.html',
  styleUrls: ['./config-admin.component.css']
})
export class edit_conf_adm {
  editconfig: FormGroup;
  search: string = '';
  iva: any;
  moneda_local: any;
  moneda_ex: any;
  tasa: any;
  responsable: any;

  constructor(
    public dialogRef: MdDialogRef<edit_conf_adm>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private usuario: AuthGuard) {

    console.log(this.data);
    this.iva = this.data[2].valor;
    this.moneda_local = this.data[3].valor;
    this.moneda_ex = this.data[5].valor;
    this.tasa = this.data[0].valor;
    console.log(this.iva);
    console.log(this.moneda_local);
    console.log(this.moneda_ex);
    console.log(this.tasa);
    this.responsable = this.usuario.currentUser.id_user;
    console.log(this.responsable);

    if (this.data != null) {
      this.editconfig = this.fb.group({
        responsable: this.usuario.currentUser.id_user,
        iva: [this.iva, [Validators.required]],
        moneda_local: this.moneda_local,
        moneda_ex: this.moneda_ex,

        tasa: this.tasa,



        //email: [datos.row.email, [Validators.required, Validators.pattern(null)]],
        //phone1: [datos.row.phone1, [Validators.required, Validators.pattern(null)]],

      });

    } else {

      this.editconfig = this.fb.group({
        responsable: this.usuario.currentUser.id_user,
        iva: ['', Validators.required],
        moneda_local: ['', Validators.required],
        // direccion_srv: datos.row.direccion_srv,
        moneda_ex: ['', Validators.required],
        tasa: ['', Validators.required],

      });

    }



  }





  editar(): void {

    let dialogRef = this.dialog.open(eliminar_prod_pag, {
      width: '25%',
      data: this.editconfig.value


    });
    this.dialogRef.close();



  }
  onNoClick(): void {
    this.dialogRef.close();


  }

}



@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.config.html',
  styleUrls: ['../facturacion/facturacion.component.css']
})
export class Facturacionconfig implements OnInit, OnDestroy {
  today: number = Date.now();

  mes = ''
  year = ''
  stat = false;
  fac = 'tod';
  status = '';
  meses = [];
  anos = [];
  myService: MyService | null;
  facturacion = [];
  facturacion_t = [];
  search: string = '';
  update: boolean = true;
  autoupdate: boolean = true;

  constructor(
    private http: Http,
    private datePipe: DatePipe,
    public usuario: AuthGuard,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.snackBar.open("Cargando Facturas", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router);
    this.http.get(environment.apiEndpoint + 'facturas/')
      .subscribe((data) => {
        this.facturacion = data.json();
        this.facturacion_t = this.facturacion;
        this.update = false;
        // console.log(this.facturacion );
      });
    this.snackBar.open("Facturas Cargadas", null, {
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
  stopPropagation(event) {
    event.stopPropagation();
    // console.log("Clicked!");
  }
  ngOnInit() {
    this.route.params.forEach((urlParams) => {
      console.log(urlParams)
      if (urlParams.fecha) {
        var params = urlParams.fecha.split('-')
        console.log(params)
        this.mes = params[0]
        this.year = params[1]
        this.stat = false;
        this.status = 'pendiente';
        this.fac = urlParams.fac;
      } else {
        this.mes = this.datePipe.transform(Date.now(), 'M')
        this.year = this.datePipe.transform(Date.now(), 'y')
        this.stat = false;
        this.status = '';
      }
      console.log('parametros')
    });
    this.refresh(true)
    this.meses = [
      { numero: "1", nombre: 'Enero' },
      { numero: "2", nombre: 'Febrero' },
      { numero: "3", nombre: 'Marzo' },
      { numero: "4", nombre: 'Abril' },
      { numero: "5", nombre: 'Mayo' },
      { numero: "6", nombre: 'Junio' },
      { numero: "7", nombre: 'Julio' },
      { numero: "8", nombre: 'Agosto' },
      { numero: "9", nombre: 'Septiembre' },
      { numero: "10", nombre: 'Octubre' },
      { numero: "11", nombre: 'Noviembre' },
      { numero: "12", nombre: 'Diciembre' },
    ]
    this.anos = [
      { year: "2018" },
      { year: "2019" },
      { year: "2020" }
    ]
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
  }
  ngOnDestroy() {
    this.autoupdate = false
  }

  refresh(nf) {
    this.update = true;
    this.http.get(environment.apiEndpoint + 'facturas/', { params: { month: this.mes, year: this.year, status: this.stat, fac: this.fac } })
      .subscribe((data) => {
        this.facturacion_t = data.json();
        this.update = false
        this.facturacion = this.facturacion_t;
        if (nf) {
          this.snackBar.open("Lista Actualizada", null, {
            duration: 2000,
          })
        }
      });
  }
  updatePricesfac(): void {
    let dialogRef = this.dialog.open(UpdatePlanPricesFacDialog, {
      width: '25%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  notify() {
    this.update = true;
    this.http.post(environment.apiEndpoint + 'notificar/', { responsable: this.usuario.currentUser.id_user })
      .subscribe((data) => { });
  }
  show(row) {
    //console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(FacturacionPagos, {
      width: '75%',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.refresh(false);
      this.snackBar.open("Facturas Actualizadas", null, {
        duration: 2000,
      });
    });
    //this.myService.refresh();

  }

  editar(row) {
    //console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(prod_pagos_fac_component, {
      width: '70%',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.refresh(false);
      this.snackBar.open("Facturas Actualizadas", null, {
        duration: 2000,
      });
    });
    //this.myService.refresh();

  }

  private delete(id): void {
    //console.log(id); //show`s id
    this.myService.deleteData(id)
      .subscribe((data) => { console.log(data) });
    this.snackBar.open("Borrando Equipo: Por favor espere", null, {
      duration: 1000,
    });
    this.myService.refresh();

  }
  Close() { this.location.back(); }



}

@Component({
  selector: 'app-facturacion',
  templateUrl: './edicion_fac.html',
  styleUrls: ['./config-admin.component.css']
})

export class prod_pagos_fac_component {
  myService: MyService | null;
  data_prod: any = null;
  data_pag: any = null;
  n_prod: any;
  constructor(
    public usuario: AuthGuard,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public dialogRef: MdDialogRef<prod_pagos_fac_component>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public router: Router) {

    this.myService = new MyService(http, router);
    console.log(data);

    this.http.get(environment.apiEndpoint + 'facprod/' + this.data.id)
      .subscribe((data) => {
        this.data_prod = data.json();
        console.log(this.data_prod);

        let n_prod = 0;
        for (var i = 0; i < this.data_prod.length; i++) {
          n_prod++;

        }
        this.n_prod = n_prod;
        console.log(this.n_prod);


      });
    this.http.get(environment.apiEndpoint + 'facpag/' + this.data.id)
      .subscribe((data) => {
        this.data_pag = data.json();
        console.log(this.data_pag);

      });



  }



  edit_prod(row) {
    //console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(EditFacProdComponent, {
      panelClass: 'my-full-screen-dialog',
      data: { row, cliente: this.data.cliente, dni: this.data.dni }


    });
    this.dialogRef.close();
    /*dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.refresh(false);
      this.snackBar.open("Facturas Actualizadas", null, {
        duration: 2000,
      });
    });
    //this.myService.refresh();*/

  }

  edit_pag(row) {
    //console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(EditFacPagComponent, {
      panelClass: 'my-full-screen-dialog',
      data: { row, cliente: this.data.cliente, dni: this.data.dni }
    });
    this.dialogRef.close();
    /*dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.refresh(false);
      this.snackBar.open("Facturas Actualizadas", null, {
        duration: 2000,
      });
    });
    //this.myService.refresh();*/

  }

  delete_fac_prog(row) {
    //console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(eliminar_prod_pag, {
      width: '25%',
      data: { row, cliente: this.data.cliente, dni: this.data.dni, n_prod: this.n_prod }


    });
    this.dialogRef.close();
    /*dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.refresh(false);
      this.snackBar.open("Facturas Actualizadas", null, {
        duration: 2000,
      });
    });
    //this.myService.refresh();*/

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-facturacion',
  templateUrl: './EditFacProd.component.html',
  styleUrls: ['./config-admin.component.css'],

})
export class EditFacProdComponent {

  editFacProd: FormGroup;

  dni: any;
  cliente: any = null;
  denominacion: any;
  coment: string;
  serie_fac: any;
  id_facProd: any;
  data_fac: any;

  constructor(private http: Http,
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<EditFacProdComponent>,
    @Inject(MD_DIALOG_DATA) public datos: any,
    public snackBar: MdSnackBar,
    public dialog: MdDialog,
    private router: Router,
    private _fb: FormBuilder,
    private date: DatePipe) {


    console.log(datos);
    console.log(datos.row);
    this.data_fac = datos.row;
    this.cliente = datos.cliente;
    this.dni = datos.dni;
    this.denominacion = this.datos.row.denominacion;
    this.serie_fac = this.datos.row.serie_fac;
    this.id_facProd = datos.row.id_facProd;
    console.log(this.denominacion);
    console.log(this.cliente);
    console.log(this.serie_fac);

    if (datos.row != null) {
      this.editFacProd = this.fb.group({
        responsable: this.usuario.currentUser.id_user,
        codigo_factura: [datos.row.codigo_factura, [Validators.required]],
        nombre_articulo: datos.row.nombre_articulo,
        IVA: datos.row.IVA,
        // direccion_srv: datos.row.direccion_srv,
        precio_articulo: datos.row.precio_articulo,
        cantidad: datos.row.cantidad,
        comment_articulo: datos.row.comment_articulo,
        precio_unitario: datos.row.precio_unitario,
        precio_dl: datos.row.precio_dl,
        precio_bs: datos.row.precio_bs,
        cliente: datos.row.id_cliente,
        edit: 'pr'

        //email: [datos.row.email, [Validators.required, Validators.pattern(null)]],
        //phone1: [datos.row.phone1, [Validators.required, Validators.pattern(null)]],

      });

    } else {

      this.editFacProd = this.fb.group({
        responsable: this.usuario.currentUser.id_user,
        codigo_factura: [datos.row.codigo_factura, [Validators.required]],
        nombre_articulo: ['', Validators.required],
        IVA: ['', Validators.required],
        // direccion_srv: datos.row.direccion_srv,
        precio_articulo: ['', Validators.required],
        cantidad: ['', Validators.required],
        comment_articulo: '',
        precio_unitario: datos.row.precio_unitario,
        precio_dl: datos.row.precio_dl,
        precio_bs: datos.row.precio_bs,
        cliente: datos.row.id_cliente,
        edit: 'pr'

      });

    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  Editar() {

    let dialogRef = this.dialog.open(eliminar_prod_pag, {
      width: '25%',
      data: { data_fac: this.data_fac, row: this.editFacProd.value, cliente: this.datos.cliente, dni: this.datos.dni }


    });
    this.dialogRef.close();

  }


}


@Component({
  selector: 'app-facturacion',
  templateUrl: './EditFacPag.component.html',
  styleUrls: ['./config-admin.component.css'],

})
export class EditFacPagComponent {

  editFacPag: FormGroup;
  funciones: MyService | null;
  dni: any;
  cliente: any = null;
  denominacion: any;
  coment: string;
  serie_fac: any;
  data_fac: any;
  id_facPag: any;



  constructor(private http: Http,
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<EditFacPagComponent>,
    @Inject(MD_DIALOG_DATA) public datos: any,
    public snackBar: MdSnackBar,
    private router: Router,
    private _fb: FormBuilder,
    private date: DatePipe) {

    this.data_fac = datos.row;
    this.id_facPag = datos.row.id_facPag;
    console.log(datos);
    console.log(datos.row);
    this.cliente = datos.cliente;
    this.dni = datos.dni;
    this.denominacion = this.datos.row.denominacion;
    this.serie_fac = this.datos.row.serie_fac;
    console.log(this.denominacion);
    console.log(this.cliente);
    console.log(this.serie_fac);

    if (datos.row != null) {
      this.editFacPag = this.fb.group({
        responsable: this.usuario.currentUser.id_user,
        fac_id: [datos.row.fac_id, [Validators.required]],
        pag_monto: datos.row.pag_monto,
        pag_tip: datos.row.pag_tip,
        pag_comment: datos.row.pag_comment,
        responsable_edit: this.usuario.currentUser.id_user,
        status: datos.row.status,
        balance_pago: datos.row.balance_pago,
        balance_pago_in: datos.row.balance_pago_in,
        cliente: datos.row.id_cliente,
        denominacion: datos.row.denominacion,
        edit: 'pg'
        //email: [datos.row.email, [Validators.required, Validators.pattern(null)]],
        //phone1: [datos.row.phone1, [Validators.required, Validators.pattern(null)]],

      });

    } else {

      this.editFacPag = this.fb.group({
        responsable: [this.usuario.currentUser.id_user, Validators.required],
        fac_id: [datos.row.codigo_factura, [Validators.required]],
        pag_monto: ['', Validators.required],
        pag_tip: ['', Validators.required],
        pag_comment: ['', Validators.required],
        responsable_edit: this.usuario.currentUser.id_user,
        status: datos.row.status,
        balance_pago: datos.row.balance_pago,
        balance_pago_in: datos.row.balance_pago_in,
        cliente: datos.row.id_cliente,
        denominacion: datos.row.denominacion,
        edit: 'pg'

      });

    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  Editar() {



    let dialogRef = this.dialog.open(eliminar_prod_pag, {
      width: '25%',
      data: { data_fac: this.data_fac, row: this.editFacPag.value, cliente: this.datos.cliente, dni: this.datos.dni }


    });
    this.dialogRef.close();

  }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm_eliminar_config.html',
  styleUrls: ['./config-admin.component.css']
})
export class eliminar_prod_pag {
  dni: any;
  cliente: any = null;
  id_client: any;
  responsable: any;
  datat: any;
  id_facpago: any;
  id_facProd: any;
  nro_prod: any;
  tasa: any;
  denominacion: any;
  edicion: any;
  constructor(
    public dialogRef: MdDialogRef<eliminar_prod_pag>,
    @Inject(MD_DIALOG_DATA) public datos: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {

    console.log(this.datos);
    console.log(datos.row);
    this.responsable = this.usuario.currentUser.id_user;
    console.log(this.responsable);
    this.cliente = datos.cliente;
    this.dni = datos.dni;
    console.log(this.cliente);
    console.log(this.dni);
    this.tasa = this.datos.tasa;
    if (!this.tasa) {
      this.id_client = datos.row.id_cliente;
      this.id_facProd = datos.row.id_facProd;
      this.id_facpago = datos.row.id_facPag;
      this.nro_prod = datos.n_prod;
      this.denominacion = datos.row.denominacion;
      this.edicion = this.datos.row.edit;
    }
    console.log(this.edicion);
    console.log(this.nro_prod);
    console.log(this.id_client);



  }




  eliminar_producto(): void {
    let responsable = this.responsable;
    let cliente = this.id_client;
    let denominacion = this.denominacion;
    this.snackBar.open("Eliminando producto/servicio: Por favor espere", null, {
      duration: 1000,
    });
    this.http.delete(environment.apiEndpoint + "facprod/" + this.id_facProd, { params: { responsable: responsable, cliente: cliente, denominacion: denominacion } }).subscribe((data) => {
      this.dialogRef.close();
    });
    setTimeout(() => {
      let dialogRef = this.dialog.open(prod_pagos_fac_component, {
        width: '70%',
        data: this.datos.row


      });
    }, 500);
    //this.myService.refresh();
  }

  eliminar_pago(): void {
    let cliente = this.id_client;
    let responsable = this.responsable;
    let denominacion = this.denominacion;
    this.snackBar.open("Eliminando Pago: Por favor espere", null, {
      duration: 1000,
    });
    this.http.delete(environment.apiEndpoint + "facpag/" + this.id_facpago, { params: { responsable: responsable, cliente: cliente, denominacion: denominacion } }).subscribe((data) => {
      this.dialogRef.close();
    });

    setTimeout(() => {
      let dialogRef = this.dialog.open(prod_pagos_fac_component, {
        width: '70%',
        data: this.datos.row


      });
    }, 500);
  }
  confir_edit_config(): void {

    var url = environment.apiEndpoint + "Configuraciones/";
    //console.log(body);


    this.snackBar.open("Editando Configuraciones: Por favor espere", null, {
      duration: 1000,
    });

    this.http.put(url, this.datos).subscribe((data) => {
      this.dialogRef.close();
    });
  }
  confir_edit_pg(): void {

    console.log(this.datos.row);

    var url = environment.apiEndpoint + "facpag/" + this.datos.data_fac.id_facPag;
    // tslint:disable-next-line:comment-format
    //console.log(body);

    this.snackBar.open("Editando Factura: Por favor espere", null, {
      duration: 1000,
    });

    this.http.put(url, this.datos.row).subscribe((data) => {
      this.dialogRef.close();
    });
    setTimeout(() => {
      let dialogRef = this.dialog.open(prod_pagos_fac_component, {
        width: '70%',
        data: this.datos.data_fac


      });
    }, 1300);
  }


  confir_edit_pr(): void {

    console.log(this.datos.row);

    var url = environment.apiEndpoint + "facprod/" + this.datos.data_fac.id_facProd;



    this.snackBar.open("Editando Factura: Por favor espere", null, {
      duration: 1000,
    });

    this.http.put(url, this.datos.row).subscribe((data) => {
      this.dialogRef.close();
    });
    setTimeout(() => {
      let dialogRef = this.dialog.open(prod_pagos_fac_component, {
        width: '70%',
        data: this.datos.data_fac


      });
    }, 1300);
  }


  onNoClick(): void {
    this.dialogRef.close();

  }

}

@Component({
  templateUrl: 'edicion_pagos.html',
  styleUrls: ['./config-admin.component.css']
})
export class edit_balances implements OnInit, OnDestroy {
  p: number = 1
  myService: MyService | null;
  balanced: any = [];
  balanceb: any = [];
  balanced2: any = [];
  balanceb2: any = [];
  balance_t: any = [];
  search: string = '';
  autoupdate: boolean = true;
  modouno: any = 1;
  mododos: any = 2;
  pendienteB: any;
  pendienteD: any;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  pagoSeleccionado: any = {}
  tipoActivo: number = 1

  constructor(
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private location: Location,
    private usuario: AuthGuard,
    private modalService: BsModalService,
    private cargarPagosService: CargarPagosService) {
    console.log(this.usuario.currentUser.id_user);


  }
 
  ngOnInit() {

    this.cargarPagosService.traerRegistroDePagos()
      .subscribe(
        res => {
          console.log(res),
            this.balance_t = res;
          this.balanced = res["balanced"];
          this.balanceb = res["balanceb"];
          this.balanced2 = res["balanced"];
          this.balanceb2 = res["balanceb"];
          this.snackBar.open("Pagos Cargados", null, {
            duration: 2000,
          });
        },
        err => console.log(err)
      )
  }
  ngOnDestroy() {
    this.autoupdate = false
  }

  Edit_ref_bs(row): void {
    let dialogRef = this.dialog.open(EditPagoBs, {
      data: row,
      width: '40%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })

  }

  Edit_ref_dl(row): void {
    let dialogRef = this.dialog.open(EditPagoDl, {
      data: row,
      width: '40%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })

  }

  anular_pag_bs(row): void {

    let dialogRef = this.dialog.open(confirm_anular_bal_pagos, {
      width: '25%',
      data: { row: row, anular: 'anular bs' }


    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }

  anular_pag_dl(row): void {

    let dialogRef = this.dialog.open(confirm_anular_bal_pagos, {
      width: '25%',
      data: { row: row, anular: 'anular dl' }


    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }

  openModal(template: TemplateRef<any>, id: number) {
    if (this.tipoActivo == 1) {
      this.balanced.forEach(e => {
        if (e.id_bal_in == id) {
          this.pagoSeleccionado = e

        }
      });
    } else {
      this.balanceb.forEach(e => {
        if (e.id == id) {
          this.pagoSeleccionado = e

        }
      });
    }

    console.log(this.pagoSeleccionado)
    this.modalRef = this.modalService.show(template, this.config);
  }

  GuardarData() {
    this.cargarPagosService.editarPago(this.pagoSeleccionado,this.tipoActivo).subscribe(res => { this.ngOnInit(), console.log(res) }, err => { console.log(err), this.ngOnInit() })
    this.closeModal()
  }

  buscarPagos(e: string) {
    if (this.tipoActivo == 1) {
      const busqueda = []
      this.balanced.filter(el => {
        if (el.social === null || el.social === "null") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        }
      })
      this.balanced = busqueda
    } else {
      const busqueda2 = []
      this.balanceb.filter(el => {
        if (el.social === null || el.social === "null") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase())) {
            busqueda2.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase())) {
            busqueda2.push(el)
          }
        }
      })

      this.balanceb = busqueda2
    }

  }

  buscarPagosBackSpace(e: string) {
    if (this.tipoActivo == 1) {
      const busqueda = []
      this.balanced2.filter(el => {
        if (el.social === null || el.social === "null") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase())) {
            busqueda.push(el)
          }
        }
      })

      this.balanced = busqueda;
    } else {
      const busqueda2 = []
      this.balanceb2.filter(el => {
        if (el.social === null || el.social === "null") {
          if (el.nombre.toUpperCase().includes(e.toUpperCase()) || el.apellido.toUpperCase().includes(e.toUpperCase())) {
            busqueda2.push(el)
          }
        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase())) {
            busqueda2.push(el)
          }
        }
      })

      this.balanceb = busqueda2;
    }
  }

  closeModal() {
    this.modalRef.hide()
    this.pagoSeleccionado = {}
  }


  Close() { this.location.back(); }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'Edit_bal_pago_bs.html',
  styleUrls: ['./config-admin.component.css']
})
export class EditPagoBs {

  editAbono: FormGroup;



  constructor(
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public datepipe: DatePipe,
    public dialogRef: MdDialogRef<EditPagoBs>,
    @Inject(MD_DIALOG_DATA) public row) {
    console.log(row);

    if (row != null) {
      this.editAbono = this.fb.group({
        bal_tip: row.bal_tip,
        bal_from: row.bal_from,
        bal_monto: row.bal_monto,
        bal_comment: row.bal_comment,
        bal_cli: row.bal_cli,

        responsable: this.usuario.currentUser.id_user
      })
    } else {

      this.editAbono = this.fb.group({
        bal_tip: ['', Validators.required],
        bal_monto: ['', Validators.required],
        bal_comment: ['', Validators.required],
        bal_from: ['', Validators.required],
        bal_cli: row.bal_cli,

        responsable: this.usuario.currentUser.id_user
      });
    }
  }

  Editar(): void {


    let dialogRef = this.dialog.open(confirm_edit_bal_pagos, {
      width: '25%',
      data: { row: this.row, form: this.editAbono.value, }


    });
    this.dialogRef.close();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'Edit_bal_pago_dl.html',
  styleUrls: ['./config-admin.component.css']
})
export class EditPagoDl {

  editAbono: FormGroup;



  constructor(
    public usuario: AuthGuard,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public datepipe: DatePipe,
    public dialogRef: MdDialogRef<EditPagoDl>,
    @Inject(MD_DIALOG_DATA) public row) {
    console.log(row);

    if (row != null) {
      this.editAbono = this.fb.group({
        bal_tip_in: row.bal_tip_in,
        bal_from_in: row.bal_from_in,
        bal_monto_in: row.bal_monto_in,
        bal_comment_in: row.bal_comment_in,
        bal_cli_in: row.bal_cli_in,

        responsable: this.usuario.currentUser.id_user
      })
    } else {

      this.editAbono = this.fb.group({
        bal_tip_in: ['', Validators.required],
        bal_monto_in: ['', Validators.required],
        bal_comment_in: ['', Validators.required],
        bal_from_in: ['', Validators.required],
        bal_cli_in: row.bal_cli_in,

        responsable: this.usuario.currentUser.id_user
      });
    }
  }

  Editar(): void {


    let dialogRef = this.dialog.open(confirm_edit_bal_pagos, {
      width: '25%',
      data: { row: this.row, form: this.editAbono.value, }


    });
    this.dialogRef.close();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm_editar_config_pagos.html',
  styleUrls: ['./config-admin.component.css']
})
export class confirm_edit_bal_pagos {
  row: any;
  form: any;

  constructor(
    public dialogRef: MdDialogRef<confirm_edit_bal_pagos>,
    @Inject(MD_DIALOG_DATA) public datos: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {

    console.log(this.datos);
    console.log(datos.row);
    console.log(datos.form);
    this.row = this.datos.row;
    this.form = this.datos.form;


  }




  editar_pago_bs(): void {

    //console.log(JSON.stringify(this.addClient.value));
    let dp = new DatePipe(navigator.language);
    var url = environment.apiEndpoint + "edit_balance_config/" + this.row.id_bal;
    //console.log(body);

    this.snackBar.open("Agregando Cliente: Por favor espere", null, {
      duration: 2000,
    });

    this.http.put(url, this.form).subscribe((data) => {
      this.dialogRef.close();
    });

  }

  editar_pago_dl(): void {
    let dp = new DatePipe(navigator.language);
    var url = environment.apiEndpoint + "edit_balance_in_config/" + this.row.id_bal_in;
    //console.log(body);

    this.snackBar.open("Agregando Cliente: Por favor espere", null, {
      duration: 2000,
    });

    this.http.put(url, this.form).subscribe((data) => {
      this.dialogRef.close();
    });
  }





  onNoClick(): void {
    this.dialogRef.close();

  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm_anular_config_pagos.html',
  styleUrls: ['./config-admin.component.css']
})
export class confirm_anular_bal_pagos {
  row: any;
  anular: any;

  constructor(
    public dialogRef: MdDialogRef<confirm_anular_bal_pagos>,
    @Inject(MD_DIALOG_DATA) public datos: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private usuario: AuthGuard) {

    console.log(this.datos);
    console.log(datos.row);
    console.log(datos.anular);
    this.row = this.datos.row;
    this.anular = this.datos.anular;

  }




  anular_pago_bs(): void {
    let datos = this.row;
    let responsable = this.usuario.currentUser.id_user;
    //console.log(JSON.stringify(this.addClient.value));
    let dp = new DatePipe(navigator.language);
    //console.log(body);
    this.snackBar.open("Anulando pago: Por favor espere", null, {
      duration: 2000,
    });
    this.http.put(environment.apiEndpoint + "anular_balance_config/" + this.row.id_bal, { params: { responsable: responsable, datos: datos, } }).subscribe((data) => {
      this.dialogRef.close();


    });

  }

  editar_pago_dl(): void {
    let datos = this.row;
    let responsable = this.usuario.currentUser.id_user;
    //console.log(JSON.stringify(this.addClient.value));
    let dp = new DatePipe(navigator.language);
    //console.log(body);
    this.snackBar.open("Anulando pago: Por favor espere", null, {
      duration: 2000,
    });
    this.http.put(environment.apiEndpoint + "anular_balance_in_config/" + this.row.id_bal_in, { params: { responsable: responsable, datos: datos, } }).subscribe((data) => {
      this.dialogRef.close();


    });
  }





  onNoClick(): void {
    this.dialogRef.close();

  }

}
