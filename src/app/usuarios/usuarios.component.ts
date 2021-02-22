import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';
import { AuthGuard } from '../_guards/index';
import { AuthenticationService } from '../_services/index';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment'
import { HistorialUsuariosService } from '../services/usuarios/historial-usuarios.service'

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  myService: MyService | null;
  data: any = null;
  search: string = '';
  constructor(
    public usuario: AuthGuard,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public router: Router) {
    this.snackBar.open("Cargando Usuarios", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router);
    this.http.get(environment.apiEndpoint + 'users/')
      .subscribe((data) => {
        this.data = data.json();
        //console.log(this.data);
      });
    this.snackBar.open("Usuarios Cargadas", null, {
      duration: 2000,
    });
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(AdduserComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    })
  }
  show(row) {
    console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(AdduserComponent, {
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    this.myService.refresh();
  }
  deleteDialog(row): void {
    let dialogRef = this.dialog.open(DeleteuserDialog, {
      data: { nombre: row.nombre_user + " " + row.apellido_user, id: row.id_user }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }
  private delete(id): void {
    console.log(id); //show`s id
    this.myService.deleteData(id)
      .subscribe((data) => { console.log(data) });
    this.snackBar.open("Borrando Usuario: Por favor espere", null, {
      duration: 2000,
    });
    this.myService.refresh();
  }
}
export class MyService {
  constructor(private http: Http, private router: Router) {
  }
  deleteData(id) {
    return this.http.delete(environment.apiEndpoint + 'users/' + id, {})
      .map((resp: Response) => resp.json());
  }
  refresh() {
    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('users') > -1 ? '/clients' : '/users';
    setTimeout(() => {
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
    },
      2000);
  }
  deletePerm(user) {
    return this.http.delete(environment.apiEndpoint + 'users/' + user + '/permission/', {})
      .map((resp: Response) => resp.json());

  }
  addPerm(user, perm) {
    perm.forEach(i => {
      this.http.post(environment.apiEndpoint + 'users/permission/?user=' + user + '&perm=' + i, i).subscribe((data) => { });


    });
  }
}
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class AdduserComponent {
  costo: string;
  nombre: string;
  addplan: FormGroup;
  CC: MyService | null;
  constructor(private http: Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AdduserComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router) {
    this.CC = new MyService(http, router);
    if (row != null) {
      this.addplan = this.fb.group({
        nombre_user: row.nombre_user,
        apellido_user: row.apellido_user,
        username: row.username,
        email_user: row.email_user,
        phone_user: row.phone_user,
        password_user: row.password_user,
        confirm: row.password_user,
        id: row.id_user
      });
      //console.log(row)
    } else {
      this.addplan = this.fb.group({
        nombre_user: '',
        apellido_user: '',
        username: '',
        email_user: '',
        phone_user: '',
        password_user: '',
        confirm: '',
      });
      //console.log("llego vacio"+ row)
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  Enviar() {
    var plan = this.addplan.value;
    console.log(JSON.stringify(this.addplan.value));
    var body =
      "nombre_user=" + plan.nombre_user +
      "&apellido_user=" + plan.apellido_user +
      "&username=" + plan.username +
      "&email_user=" + plan.email_user +
      "&phone_user=" + plan.phone_user +
      "&password=" + plan.password_user;
    var url = environment.apiEndpoint + "users?" + body;

    this.http.post(url, body).subscribe((data) => {
      this.dialogRef.close();
      this.snackBar.open("Agregando Usuario: Por favor espere", null, {
        duration: 2000,
      });
      this.CC.refresh();
    });
  }
  Editar() {
    var plan = this.addplan.value;
    console.log(JSON.stringify(this.addplan.value));
    var body =
      "nombre_user=" + plan.nombre_user +
      "&apellido_user=" + plan.apellido_user +
      "&username=" + plan.username +
      "&email_user=" + plan.email_user +
      "&phone_user=" + plan.phone_user +
      "&password=" + plan.password_user;
    var url = environment.apiEndpoint + "users/" + plan.id + "?" + body;

    this.http.put(url, body).subscribe((data) => {
      this.dialogRef.close();
      this.snackBar.open("Editando Usuario: Por favor espere", null, {
        duration: 2000,
      });
      this.CC.refresh();
    });
  }
}
@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-delete.html',
  styleUrls: ['./usuarios.component.css']
})
export class DeleteuserDialog {
  myService: MyService | null;

  constructor(
    public dialogRef: MdDialogRef<DeleteuserDialog>,
    @Inject(MD_DIALOG_DATA) public data: any, private http: Http, public dialog: MdDialog, public snackBar: MdSnackBar, private router: Router) {
    this.myService = new MyService(http, router);
  }

  delete(): void {
    console.log("borrando" + this.data.id);
    this.myService.deleteData(this.data.id)
      .subscribe((data) => { console.log(data) });
    this.dialogRef.close();
    this.snackBar.open("Borrando Usuario: Por favor espere", null, {
      duration: 1000,
    });
    this.myService.refresh();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'detalles-usuario.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class DetallesUsuarios implements OnInit, OnDestroy {
  //data usuario
  test: any;
  id: any;
  data: any;
  historial: any = null;
  edituser: FormGroup;
  wrongpass: boolean = false;
  //permisos
  permisos = [];
  editpermisos: FormGroup;
  ap: boolean = false;
  celdas: boolean = false;
  clientes: boolean = false;
  equipos: boolean = false;
  factibilidades: boolean = false;
  facturacion: boolean = false;
  instalaciones: boolean = false;
  notificaciones: boolean = false;
  potenciales: boolean = false;
  planes: boolean = false;
  routers: boolean = false;
  servicios: boolean = false;
  soporte: boolean = false;
  pagarI: boolean = false;
  usuarios: boolean = false;
  arqueo: boolean = false;
  ap_w: boolean = false;
  celdas_w: boolean = false;
  clientes_w: boolean = false;
  equipos_w: boolean = false;
  factibilidades_w: boolean = false;
  facturacion_w: boolean = false;
  facturacion_esp: boolean = false;
  instalaciones_w: boolean = false;
  inventarios_w: boolean = false;
  inventarios: boolean = false;
  inventarios_esp: boolean = false;
  notificaciones_w: boolean = false;
  potenciales_w: boolean = false;
  planes_w: boolean = false;
  planes_esp: boolean = false;
  routers_w: boolean = false;
  servicios_w: boolean = false;
  soporte_w: boolean = false;
  usuarios_w: boolean = false;
  installer: boolean = false;
  cobrar: boolean = false;
  cobrar_w: boolean = false;
  pagar: boolean = false;
  pagar_w: boolean = false;
  arqueo_w: boolean = false;
  facturacion_mod: boolean = false;
  planes_mod: boolean = false;
  soporte_esp: boolean = false;
  seniat: boolean = false
  gerencia: boolean = false
  ventas: boolean = false;
  ventas_w: boolean = false
  ventas_esp: boolean = false
  //zonas
  editzona: FormGroup;
  zonas = [];
  dabajuro: boolean = false;
  cabimas: boolean = false;
  galicia: boolean = false;
  purureche: boolean = false;
  mene: boolean = false;
  ptofjo: boolean = false;
  sanfrancisco: boolean = false;
  seque: boolean = false;
  socopo: boolean = false;
  inter: boolean = false;
  gladiolas: boolean = false;

  churuguara: boolean = false;
  bachaquero: boolean = false;

  comision: boolean = false;
  comision_r: boolean = false;
  comision_w: boolean = false;
  reportes_r: boolean = false;
  reportes_w: boolean = false;
  sms_w: boolean = false;
  config_adm: boolean = false;
  config_adm_w: boolean = false;
  config_adm_esp: boolean = false;

  permisosMK: boolean = false

  permisoMikrotic: string = ""

  errorClave: boolean = false

  permisoActivo:string = ""


  constructor(
    //public dialogRef: MdDialogRef<DeleteuserDialog>,
    //@Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    public usuario: AuthGuard,
    private userService: HistorialUsuariosService
  ) {
    this.test = this.route.params
      .subscribe(
        params => {
          this.id = params.id_user;
        }
      )
    this.edituser = this.fb.group({
      responsable: this.usuario.currentUser.id_user,
      nombre_user: '',
      installer: '',
      comision: '',
      apellido_user: '',
      username: ['', [Validators.required]],
      email_user: '',
      phone_user: '',
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required]],
    });
    this.editpermisos = this.fb.group({
      responsable: '',
      permisos: '',
      usuario: ''
    })
    this.editzona = this.fb.group({
      responsable: '',
      zonas: '',
      usuario: ''
    })



  }

  Close() { this.location.back(); }

  listToglePermisos(nombre, valor) {
    console.log(nombre)
    console.log(valor)

    if (valor) {
      this.permisos.push(nombre)
      console.log(this.permisos)
    } else {
      const index: number = this.permisos.indexOf(nombre);
      if (index !== -1) {
        this.permisos.splice(index, 1);
        console.log(this.permisos)
      }
    }

  }
  listTogleZonas(nombre, valor) {
    if (valor) {
      this.zonas.push(nombre)
      console.log(this.zonas)
    } else {
      const index: number = this.zonas.indexOf(nombre);
      if (index !== -1) {
        this.zonas.splice(index, 1);
        console.log(this.zonas)
      }
    }
  }
  installerToggle(valor) {
    if (valor) {
      this.edituser.patchValue({
        installer: '1'
      })
    } else {
      this.edituser.patchValue({
        installer: '0'
      })
    }
    console.log(valor)
  } comisionToggle(valor) {
    if (valor) {
      this.edituser.patchValue({
        comision: '1'
      })
    } else {
      this.edituser.patchValue({
        comision: '0'
      })
    }
    console.log(valor)
  }
  ResetCounter(row): void {
    let dialogRef = this.dialog.open(ResetCounter, {
      data: { nombre: row.nombre_user + " " + row.apellido_user, id: row.id_user }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  permisoMk() {
    this.permisosMK = !this.permisosMK
  }


  actualizarPermisosMk() {
    this.userService.actualizarPermisosMk(this.id, this.permisoMikrotic, this.zonas).subscribe(res => console.log(res), err => console.log(err))
  }

  onItemChange(valor: string) {
    this.permisoMikrotic = valor
  }


  ngOnInit() {

    //http://186.167.32.27:81/maraveca/public/index.php/api/uh/1
    this.http.get(environment.apiEndpoint + 'uh/' + this.id)
      .subscribe((data) => {
        this.historial = data.json();
        console.log(this.historial);
      })
    this.http.get(environment.apiEndpoint + 'users/' + this.id + '/zona')
      .subscribe((data) => {
        data.json().forEach(permi => {
          this.zonas.push(permi.zona);
        });
        this.zonas.forEach(zonas => {
          if (zonas == '3') { this.dabajuro = true }
          else if (zonas == '14') { this.cabimas = true }
          else if (zonas == '12') { this.galicia = true }
          else if (zonas == '6') { this.mene = true }
          else if (zonas == '11') { this.ptofjo = true }
          else if (zonas == '21') { this.sanfrancisco = true }
          else if (zonas == '10') { this.seque = true }
          else if (zonas == '13') { this.socopo = true }
          else if (zonas == '15') { this.inter = true }
          else if (zonas == '23') { this.gladiolas = true }
          else if (zonas == '25') { this.churuguara = true }
          else if (zonas == '2') { this.bachaquero = true }
          else if (zonas == '28') { this.purureche = true }

        })
      });

    this.http.get(environment.apiEndpoint + 'users/' + this.id)
      .subscribe((data) => {
        this.data = data.json()[0];
        console.log(this.data)
        this.edituser.patchValue({
          nombre_user: this.data.nombre_user,
          apellido_user: this.data.apellido_user,
          username: this.data.username,
          email_user: this.data.email_user,
          phone_user: this.data.phone_user,
          password: '',
          confirm: '',
          installer: this.data.installer,
          comision: this.data.comision,
        })
        if (this.data.installer == '1') {
          this.installer = true
        } else {
          this.installer = false
        } if (this.data.comision == '1') {
          this.comision = true
        } else {
          this.comision = false
        }
      });
    this.http.get(environment.apiEndpoint + 'users/' + this.id + '/permission')
      .subscribe((data) => {
        data.json().forEach(permi => {
          this.permisos.push(permi.perm);
        })
        this.permisos.forEach(perm => {
          if (perm == 'ap') { this.ap = true }
          else if (perm == 'ap_w') { this.ap_w = true }
          else if (perm == 'celdas') { this.celdas = true }
          else if (perm == 'celdas_w') { this.celdas_w = true }
          else if (perm == 'clientes') { this.clientes = true }
          else if (perm == 'clientes_w') { this.clientes_w = true }
          else if (perm == 'pclientes') { this.potenciales = true }
          else if (perm == 'pclientes_w') { this.potenciales_w = true }
          else if (perm == 'equipos') { this.equipos = true }
          else if (perm == 'equipos_w') { this.equipos_w = true }
          else if (perm == 'factibilidades') { this.factibilidades = true }
          else if (perm == 'factibilidades_w') { this.factibilidades_w = true }
          else if (perm == 'facturacion') { this.facturacion = true }
          else if (perm == 'facturacion_w') { this.facturacion_w = true }
          else if (perm == 'instalaciones') { this.instalaciones = true }
          else if (perm == 'instalaciones_w') { this.instalaciones_w = true }
          else if (perm == 'inventarios') { this.inventarios = true }
          else if (perm == 'inventarios_w') { this.inventarios_w = true }
          else if (perm == 'notify') { this.notificaciones = true }
          else if (perm == 'notify_w') { this.notificaciones_w = true }
          else if (perm == 'planes') { this.planes = true }
          else if (perm == 'planes_w') { this.planes_w = true }
          else if (perm == 'router') { this.routers = true }
          else if (perm == 'router_w') { this.routers_w = true }
          else if (perm == 'servicios') { this.servicios = true }
          else if (perm == 'servicios_w') { this.servicios_w = true }
          else if (perm == 'soporte') { this.soporte = true }
          else if (perm == 'pagarI') { this.pagarI = true }
          else if (perm == 'soporte_w') { this.soporte_w = true }
          else if (perm == 'soporte_esp') { this.soporte_esp = true }  //26-10-2019
          else if (perm == 'usuarios') { this.usuarios = true }
          else if (perm == 'usuarios_w') { this.usuarios_w = true }
          else if (perm == 'cobrar') { this.cobrar = true }
          else if (perm == 'cobrar_w') { this.cobrar_w = true }
          else if (perm == 'pagar') { this.pagar = true }
          else if (perm == 'pagar_w') { this.pagar_w = true }
          else if (perm == 'planes_esp') { this.planes_esp = true }
          else if (perm == 'facturacion_mod') { this.facturacion_mod = true }
          else if (perm == 'facturacion_esp') { this.facturacion_esp = true }
          else if (perm == 'planes_mod') { this.planes_mod = true }
          else if (perm == 'comision_r') { this.comision_r = true }
          else if (perm == 'comision_w') { this.comision_w = true }
          else if (perm == 'reportes_r') { this.reportes_r = true }
          else if (perm == 'reportes_w') { this.reportes_w = true }
          else if (perm == 'sms_w') { this.sms_w = true }
          else if (perm == 'config_adm') { this.config_adm = true }
          else if (perm == 'config_adm_w') { this.config_adm_w = true }
          else if (perm == 'config_adm_esp') { this.config_adm_esp = true }
          else if (perm == 'arqueo') { this.arqueo = true }
          else if (perm == 'arqueo_w') { this.arqueo_w = true }
          else if (perm == 'inventarios_esp') { this.inventarios_esp = true }
          else if (perm == 'seniat') { this.seniat = true }
          else if (perm == 'gerencia') { this.gerencia = true }
          else if (perm == 'ventas') { this.gerencia = true }
          else if (perm == 'ventas_w') { this.gerencia = true }
          else if (perm == 'ventas_esp') { this.gerencia = true }
        })
      });

      this.userService.traerPermisoMK(this.id).subscribe(
        res=>
        {
        
          if(res != []){
            this.permisoActivo = res["0"].permiso
          }
        }
      ,err=>console.log(err))

  }

  actualizarPermisos() {

    this.editpermisos.patchValue({
      responsable: this.usuario.currentUser.id_user,
      permisos: this.permisos,
      usuario: this.data.id_user
    })
    var url = environment.apiEndpoint + 'users/permission/'
    this.http.post(url, this.editpermisos.value)
      .subscribe((data) => {

      });

  }

  actualizarZonas() {
    this.editzona.patchValue({
      responsable: this.usuario.currentUser.id_user,
      zonas: this.zonas,
      usuario: this.data.id_user
    })
    var url = environment.apiEndpoint + 'users/zona'
    this.http.post(url, this.editzona.value)
      .subscribe((data) => {

      });
  }

  actualizarUsuario() {

    if (!/[a-z]/.test(this.edituser.controls["password"].value) || !/[A-Z]/.test(this.edituser.controls["password"].value) || !/[0-9]/.test(this.edituser.controls["password"].value)) {
      this.errorClave = true
    } else {
      this.errorClave = false
      if (this.edituser.value.password == '') {
        this.edituser.patchValue({
          password: this.data.password
        })
        var url = environment.apiEndpoint + "users/" + this.id;
        this.http.put(url, this.edituser.value).subscribe((data) => {
          this.snackBar.open("usuario_editado", null, {
            duration: 2000,
          });
          this.edituser.patchValue({
            password: ''
          })
          this.wrongpass = false;

        })
      } else if (this.edituser.value.password == this.edituser.value.confirm) {

        var url = environment.apiEndpoint + "users/" + this.id;
        this.http.put(url, this.edituser.value).subscribe((data) => {
          this.snackBar.open("usuario_editado", null, {
            duration: 2000,
          });
          this.wrongpass = false;

        })
      } else {
        this.wrongpass = true;

      }
    }

  }

  ngOnDestroy() { }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'reset-counter.html',
  styleUrls: ['./usuarios.component.css']
})
export class ResetCounter {
  myService: MyService | null;
  resetCounter: FormGroup;
  constructor(
    public dialogRef: MdDialogRef<DeleteuserDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private fb: FormBuilder,
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }
  Enviar() {
    this.myService.deletePerm(this.data.id).subscribe((data) => { console.log(data) });;
    setTimeout(() => {
    },
      2000);
    this.dialogRef.close();
    this.snackBar.open("Agregando Plan: Por favor espere", null, {
      duration: 500,
    });
    //this.myService.refresh();
  }
}
