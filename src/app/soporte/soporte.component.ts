import {Component, Inject, OnInit, OnDestroy, ViewChildren} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {Router, ActivatedRoute} from '@angular/router';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import 'rxjs/add/operator/takeWhile';
import {AuthGuard} from '../_guards/index';
import {AuthenticationService} from '../_services/index';
import {DatePipe, Location} from '@angular/common';
import {environment} from '../../environments/environment';
import {SelectEquipoComponent, SelectTipoComponent} from '../inventarios/inventarios.component';
import {IpValidators} from '../servicios/validar_ip';
import {SerialValidators} from '../servicios/validar_serial';


const MAC_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
const PHONE_REGEX = /^(0414\d|0412\d|0416\d|0426\d|0424\d|0415\d)+\d{6}/;

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css']
})
export class SoporteComponent implements OnInit, OnDestroy {
  myService: MyService;
  datat: any = [];
  datai: any = [];
  dataa: any = [];
  datao: any = [];
  pi: any;
  pt: any;
  pa: any;
  po: any;
  datat_t: any = [];
  datai_t: any = [];
  dataa_t: any = [];
  datao_t: any = [];
  pi_t: any;
  pt_t: any;
  pa_t: any;
  po_t: any;
  update: boolean = true;
  autoupdate: boolean;
  //datai= [];
  search: string;
  modouno: any = 1;
  mododos: any =2;
  position: string = '2';

  constructor(
    private http: Http,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public router: Router,
    public usuario: AuthGuard) {
    this.snackBar.open('Cargando Tickets', null, {
      duration: 2000,
    });
    this.autoupdate = true;
    this.myService = new MyService(http, router, usuario);
    console.log(usuario.currentUser);
    this.http.get(environment.apiEndpoint + 'soportesm/?user=' + usuario.currentUser.id_user)
      .subscribe((data) => {
        this.datat_t = data.json().soporte;
        this.datai_t = data.json().instalaciones;
        this.dataa_t = data.json().averias;
        this.datao_t = data.json().otrost;
        this.pi_t = data.json().pendingi;
        this.pt_t = data.json().pendingt;
        this.pa_t = data.json().pendinga;
        this.po_t = data.json().pendingo;
        this.datat = this.datat_t;
        this.datai = this.datai_t;
        this.dataa = this.dataa_t;
        this.datao = this.datao_t;
        this.pi = this.pi_t;
        this.pa = this.pa_t;
        this.po = this.po_t;
        this.pt = this.pt_t;
        this.update = false;
      });

    this.snackBar.open('Tickets Cargados', null, {
      duration: 2000,
    });


  }

  ngOnInit() {
    //this.modo =2;
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });
  }

  ngOnDestroy() {
    this.autoupdate = false;
  }

  private openLINK(id) {
    //console.log(url)
    window.open('../#/editticket/' + id, '_blank');
  }

  refresh(nf) {
    this.update = true;
    this.http.get(environment.apiEndpoint + 'soportesm/?user=' + this.usuario.currentUser.id_user)
      .subscribe((data) => {
        this.datat_t = data.json().soporte;
        this.datai_t = data.json().instalaciones;
        this.dataa_t = data.json().averias;
        this.datao_t = data.json().otrost;
        this.pi_t = data.json().pendingi;
        this.pt_t = data.json().pendingt;
        this.pa_t = data.json().pendinga;
        this.po_t = data.json().pendingo;
        this.update = false;
        this.datat = this.datat_t;
        this.datai = this.datai_t;
        this.pi = this.pi_t;
        this.pt = this.pt_t;
        this.pa = this.pa_t
        this.po = this.po_t
        if (nf) {
          this.snackBar.open('Lista Actualizada', null, {
            duration: 2000,
          });
        }
      });

  }



  openDialog(): void {
    //this.router.navigate(['/addticket']);
    let dialogRef = this.dialog.open(AddticketComponent, {
      width: '40%',
      //data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.myService.refresh();
      this.http.get(environment.apiEndpoint + 'soportesm/?user=' + this.usuario.currentUser.id_user)
        .subscribe((data) => {
          this.datat = data.json().soporte;
          this.datai = data.json().instalaciones;
          this.dataa_t = data.json().averias;
          this.datao_t = data.json().otrost;

          console.log(this.datat);
        });

    });
  }

  show(row) {

    this.router.navigate(['/addticket']);
    //console.log(row);
    //this.selectedRowIndex = row.id;
    /*let dialogRef = this.dialog.open(AddticketComponent, {
    width: '25%',
    data: row
  });

  dialogRef.afterClosed().subscribe(result => {
  console.log('The dialog was closed');
  this.myService.refresh();

  });
  */
  }


}


export class MyService {

  constructor(private http: Http, private router: Router, public usuario: AuthGuard) {

  }

  Close() {
    window.close();
  }

  deleteData(id) {

    return this.http.delete(environment.apiEndpoint + 'soporte/' + id + '?responsable=' + this.usuario.currentUser.id_user, {})
      .map((resp: Response) => resp.json());


  }

  refresh() {
    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('soporte') > -1 ? '/clients' : '/soporte';
    setTimeout(() => {
        this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
      },
      1000);
  }

  addPb(ticket, pb) {
    pb.forEach(i => {
      this.http.post(environment.apiEndpoint + 'ticketp/?ticket_pb=' + ticket + '&problem_pb=' + i, i).subscribe((data) => {
      });


    });
  }
}

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./soporte.component.css'],
  providers: [SerialValidators, IpValidators ]
})
export class AddticketComponent implements OnInit {
  edit: any;
  costo: any;
  nombre: string;
  servicios: any = null;
  clientes: any;
  cliente: any;
  equipo: any;
  celda: any;
  equipos: any;
  radio: any;
  antena: any;
  routers: any;
  antenas: any;
  switch: any;
  celdas: any;
  S_servicios: any;
  S_celda: any;
  S_equipos: any;
  addplan: FormGroup;
  //row: any;
  currentUser: any;
  problemas: any;
  requ = [];
  tes = false;
  antenna = false;
  EN: boolean = false;
  valorplaceholder = '';
  p_search: string;
  planes: any;
  planes1: any;
  planes2: any;
  planesd: any;

  constructor(private http: Http,
              private fb: FormBuilder,
              public dialogRef: MdDialogRef<AddticketComponent>,
              @Inject(MD_DIALOG_DATA) public row: any,
              //private route: ActivatedRoute,
              public dialog: MdDialog,
              private validacion_serial: SerialValidators,
              public snackBar: MdSnackBar,
              private validacion_ip: IpValidators,
              public usuario: AuthGuard,
              private router: Router) {
    this.edit = false;
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.http.get(environment.apiEndpoint + 'servicios/')
      .subscribe((data) => {
        this.servicios = data.json().servicios;
        console.log('servicios');
        console.log(this.servicios);
      });
    this.http.get(environment.apiEndpoint + 'clientes/')
      .subscribe((data) => {
        this.clientes = data.json();
        setTimeout(() => {
            this.addplan.value.servicio_soporte = row.servicio;
            console.log(row.servicio);
          },
          3000);
      });
    this.http.get(environment.apiEndpoint + 'celdas/')
      .subscribe((data) => {
        this.celda = data.json();
        this.celdas = this.addplan.value.celda_soporte;

      });
    this.http.get(environment.apiEndpoint + 'equit/1')
      .subscribe((data) => {
        this.equipos = data.json();
        this.equipo = this.addplan.value.equipo_soporte;
      });
    this.http.get(environment.apiEndpoint + 'equit/2')
      .subscribe((data) => {
        this.radio = data.json();
      });
    this.http.get(environment.apiEndpoint + 'equit/3')
      .subscribe((data) => {
        this.antenas = data.json();
      });
    this.http.get(environment.apiEndpoint + 'add_preload/')
      .subscribe((data) => {
        this.planes = data.json().planes;
        this.planes1 = data.json().planes1;
        this.planes2 = data.json().planes2;
        this.planesd = data.json().planesd;

      });
    this.addplan = this.fb.group({
      tipo_soporte: '1',
      problema_soporte: '',
      afectacion_soporte: '1',
      problems: '',
      comment_soporte: '',
      plan_srv: '',
      tipo_plan_srv: '',
      servicio_soporte: ['', Validators.required],
      celda_soporte: ['', Validators.required],
      tipo_equipo_soporte: ['', Validators.required],
      equipo_soporte: ['', Validators.required],
      antenna_soporte: '',
      seriale: '', /*['', [Validators.required],[this.validacion_serial.serialValidator()]],*/
      seriala: '',
      status_soporte: '1',
      user_soporte: this.currentUser.id_user,
      S_servicios: '',
      ptp_equipo: '',
      adicionales: [],
      nombrer: '',
      valorr: '',
      ip_srv: '', /*['', [Validators.required], [this.validacion_ip.ipValidator()]],*/
      p_search: '',
      EN: false,
    });
    if (row != null) {
      console.log(row.ptp);
      this.addplan.patchValue({
        servicio_soporte: +row.servicio,
        celda_soporte: +row.celda,
        equipo_soporte: +row.equipo,
        ptp_equipo: +row.ptp,
        user_soporte: +this.currentUser.id_user
      });
      this.requ.push({nombre: 'Tubo', valor: row.tubo});
      //this.celdas = row.celda;
      //this.equipo = row.equipo;
      //this.cliente = row.servicio;
      //console.log(row)
    }
    //this.addplan.value.servicio_soporte = this.cliente;
    //this.addplan.value.equipo_soporte = this.equipo;
    //this.addplan.value.celda_soporte = this.celda;

    console.log(this.addplan.value);
  }


  select(): void {
    //this.router.navigate(['/addticket']);
    let datos = {'celda': this.addplan.value.celda_soporte, 'equipo': this.addplan.value.equipo_soporte};
    let dialogRef = this.dialog.open(SelectEquipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        seriale: result.selected
      });
    });
  }

  selectptp(): void {
    //this.router.navigate(['/addticket']);
    let datos = {'celda': this.addplan.value.celda_soporte, 'equipo': this.addplan.value.ptp_equipo, 'usado': this.addplan.value.seriale};
    let dialogRef = this.dialog.open(SelectEquipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        valorr: result.selected
      });
    });
  }

  selectrouter(): void {
    //this.router.navigate(['/addticket']);
    let datos = {'celda': this.addplan.value.celda_soporte, 'equipo': '4'};
    let dialogRef = this.dialog.open(SelectTipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        valorr: result.selected
      });
    });
  }

  selectswitch(): void {
    //this.router.navigate(['/addticket']);
    let datos = {'celda': this.addplan.value.celda_soporte, 'equipo': '5'};
    let dialogRef = this.dialog.open(SelectTipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        valorr: result.selected
      });
    });
  }

  selectantena(): void {
    //this.router.navigate(['/addticket']);
    let datos = {'celda': this.addplan.value.celda_soporte, 'equipo': '3'};
    let dialogRef = this.dialog.open(SelectTipoComponent, {
      width: '30%',
      data: datos
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addplan.patchValue({
        seriala: result.selected
      });
    });
  }

  ngOnInit() {

    this.addplan.get('tipo_equipo_soporte').valueChanges.subscribe(
      () => {
        this.tes = true;
      }
    );
    this.addplan.get('seriale').valueChanges.subscribe(
      (seriale) => {
        if (this.tes && this.addplan.value.equipo_soporte != '' && seriale != '') {
          this.antenna = true;
        } else {
          this.antenna = false;
        }
      }
    );

    this.addplan.get('EN').valueChanges.subscribe(
      (EN) => {

        if (EN) {
          console.log(EN);
          this.addplan.get('seriale').setValidators([]);

        } else if (!EN && this.addplan.get('tipo_soporte').value == 1) {
          console.log(EN);
          this.addplan.get('seriale').setValidators([Validators.required]);

        }

        this.addplan.get('seriale').updateValueAndValidity();

      }
    );
    this.addplan.get('nombrer').valueChanges.subscribe(
      (nombrer) => {

        if (nombrer === 'Tubo') {
          console.log(nombrer);
          this.valorplaceholder = 'Metros';

        } else if (nombrer === 'SerialPTP') {
          console.log(nombrer);
          this.valorplaceholder = 'Serial';
        } else if (nombrer === 'Router') {
          console.log(nombrer);
          this.valorplaceholder = 'Serial';
        } else if (nombrer === 'Switch') {
          console.log(nombrer);
          this.valorplaceholder = 'Cantidad';
        }

        this.addplan.get('seriale').updateValueAndValidity();

      }
    );
    this.addplan.get('tipo_soporte').valueChanges.subscribe(
      (tipo_soporte) => {

        if (tipo_soporte === '1') {
          console.log('instalacion');
          this.addplan.get('plan_srv').setValidators([Validators.required]);
          this.addplan.get('tipo_plan_srv').setValidators([Validators.required]);
          this.addplan.get('servicio_soporte').setValidators([Validators.required]);
          this.addplan.get('celda_soporte').setValidators([Validators.required]);
          this.addplan.get('equipo_soporte').setValidators([Validators.required]);
          this.addplan.get('seriale').setValidators([Validators.required]);
          this.addplan.get('seriale').setAsyncValidators([this.validacion_serial.serialValidator()]);
          this.addplan.get('tipo_equipo_soporte').setValidators([Validators.required]);
          this.addplan.get('equipo_soporte').setValidators([Validators.required]);
          this.addplan.get('afectacion_soporte').setValidators([]);
          this.addplan.get('comment_soporte').setValidators([]);
          this.addplan.get('servicio_soporte').setValidators([]);
          this.addplan.get('problems').setValidators([]);
          this.addplan.get('ip_srv').setValidators([Validators.required]);
          this.addplan.get('ip_srv').setAsyncValidators([this.validacion_ip.ipValidator()]);


        } else if (tipo_soporte === '2') {
      console.log('ticket');
      this.addplan.get('plan_srv').setValidators([]);
      this.addplan.get('tipo_plan_srv').setValidators([]);
      this.addplan.get('ip_srv').setValidators([]);
      this.addplan.get('servicio_soporte').setValidators([]);
          this.addplan.get('celda_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('seriale').setValidators([]);
          this.addplan.get('tipo_equipo_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('afectacion_soporte').setValidators([Validators.required]);
          this.addplan.get('comment_soporte').setValidators([]);
          this.addplan.get('servicio_soporte').setValidators([Validators.required]);
          this.addplan.get('problems').setValidators([Validators.required]);

        } else if (tipo_soporte === '3') {
          console.log('averia');
          this.addplan.get('servicio_soporte').setValidators([Validators.required]);
          this.addplan.get('celda_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('seriale').setValidators([]);
          this.addplan.get('tipo_equipo_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('afectacion_soporte').setValidators([]);
          this.addplan.get('comment_soporte').setValidators([Validators.required]);
          this.addplan.get('problems').setValidators([]);
          this.addplan.get('plan_srv').setValidators([]);
          this.addplan.get('tipo_plan_srv').setValidators([]);
          this.addplan.get('ip_srv').setValidators([]);

        } else if (tipo_soporte === '4') {
          console.log('Otros trabajos e instalaciones');
          this.addplan.get('servicio_soporte').setValidators([Validators.required]);
          this.addplan.get('celda_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('seriale').setValidators([]);
          this.addplan.get('tipo_equipo_soporte').setValidators([]);
          this.addplan.get('equipo_soporte').setValidators([]);
          this.addplan.get('afectacion_soporte').setValidators([]);
          this.addplan.get('comment_soporte').setValidators([Validators.required]);
          this.addplan.get('problems').setValidators([]);
          this.addplan.get('plan_srv').setValidators([]);
          this.addplan.get('tipo_plan_srv').setValidators([]);
          this.addplan.get('ip_srv').setValidators([]);

        }

        this.addplan.get('servicio_soporte').updateValueAndValidity();
        this.addplan.get('celda_soporte').updateValueAndValidity();
        this.addplan.get('equipo_soporte').updateValueAndValidity();
        this.addplan.get('seriale').updateValueAndValidity();
        this.addplan.get('afectacion_soporte').updateValueAndValidity();
        this.addplan.get('servicio_soporte').updateValueAndValidity();
        this.addplan.get('problems').updateValueAndValidity();
        this.addplan.get('tipo_equipo_soporte').updateValueAndValidity();
        this.addplan.get('equipo_soporte').updateValueAndValidity();
        this.addplan.get('plan_srv').updateValueAndValidity();
        this.addplan.get('tipo_plan_srv').updateValueAndValidity();
        this.addplan.get('ip_srv').updateValueAndValidity();

      }
    );

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addr() {
    console.log(this.addplan.value.valorr);
    this.requ.push({nombre: this.addplan.value.nombrer, valor: this.addplan.value.valorr});
    this.addplan.patchValue({
      nombrer: '',
      valorr: ''
    });
  }

  deleter(req) {
    for (var i = 0; i < this.requ.length; i++) {
      if (this.requ[i]['nombre'] == req.nombre && this.requ[i]['valor'] == req.valor) {
        this.requ.splice(i, 1);
      }
    }
  }

  Enviar() {
    //this.addplan.value.adicionales.array_push()
    //console.log(JSON.stringify(this.addplan.value));
    //console.log(plan.problems)
    /*var body =
    "status_soporte="+plan.status_soporte+
    "&servicio_soporte="+plan.servicio_soporte+
    "&user_soporte="+plan.id_user+
    "&afectacion_soporte="+plan.afectacion+
    "&tipo_soporte="+plan.tipo
    */
    if (!this.EN) {
      this.requ.push({nombre: 'SerialEquipo', valor: this.addplan.value.seriale});
      this.requ.push({nombre: 'ModeloEquipo', valor: this.addplan.value.equipo_soporte});
    }
    if (this.antenna) {
      this.requ.push({nombre: 'SerialAntenna', valor: this.addplan.value.seriala});
      this.requ.push({nombre: 'ModeloAntena', valor: this.addplan.value.antenna_soporte});
    }

    this.addplan.patchValue({
      adicionales: this.requ
    });
    var plan = this.addplan.value;
    var url = environment.apiEndpoint + 'soporte2';
    this.http.post(url, plan).subscribe((data) => {
      this.row = data.json();
    console.log(plan);
    });
    setTimeout(() => {
      /*          var body1=
      "user_th="+plan.id_user+
      "&ticket_th="+this.row.id+
      "&comment=Se apertura el ticket"
      var url1 = environment.apiEndpoint+"ticketh?"+body1;
      this.http.post(url1,body1).subscribe((data) => {});
      if (plan.tipo == 2){
      this.CC.addPb(this.row.id, plan.problems);
    }
    */
    }, 2000);
    this.dialogRef.close();
    this.snackBar.open('Agregando Ticket: Por favor espere', null, {
      duration: 2000,
    });


  }

}

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./soporte.component.css']
})
export class EditticketComponent implements OnInit, OnDestroy {
  edit: any;
  id: any;
  prueba;
  addplan: FormGroup;
  row: any;
  currentUser: any;
  problems = [];
  problemas = [];
  history: any;
  status = [];
  stat = [];
  autoupdate: boolean = true;
  update: boolean = true;

  constructor(private http: Http,
              private fb: FormBuilder,
              //public dialogRef: MdDialogRef<AddticketComponent>,
              //@Inject(MD_DIALOG_DATA) public row: any,
              private route: ActivatedRoute,
              public snackBar: MdSnackBar,
              private location: Location,
              public dialog: MdDialog,
              private router: Router) {
    this.edit = true;
    this.prueba = this.route.params
      .subscribe(
        params => {
          this.id = params.ticket;
          console.log(this.id);
        }
      );
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    //console.log(this.currentUser)
    this.http.get(environment.apiEndpoint + 'soporte/' + this.id)
      .subscribe((data) => {
        this.row = data.json()[0];
        console.log(this.row);
        this.addplan.value.status_soporte = this.row.status_soporte;
        this.addplan.value.tipo = this.row.tipo_soporte;
        console.log(this.addplan.value);
        this.history = this.row.history;
        this.row.problems.forEach(perm => {
          this.problems.push(perm.problem_pb);
          this.problemas = this.problems;

        });
      });
    this.addplan = this.fb.group({
      servicio: '',
      problema_soporte: '',
      status_soporte: '',
      id: this.currentUser.id_user,
      problems: '',
      historia: '',
      tipo: '',
    });


    if (this.row) {
      //this.addplan.value.problems
    }

  }

  ngOnDestroy() {
    this.autoupdate = false;
  }

  ngOnInit() {
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {
        this.refresh(false);
      });

  }

  refresh(nf) {
    this.update = true;
    this.http.get(environment.apiEndpoint + 'soporte/' + this.id)
      .subscribe((data) => {
        this.row = data.json()[0];
        this.addplan.value.status_soporte = this.row.status_soporte;
        this.addplan.value.tipo = this.row.tipo_soporte;
        console.log(this.addplan.value);
        this.history = this.row.history;
        this.row.problems.forEach(perm => {
          this.problems.push(perm.problem_pb);
          this.problemas = this.problems;
        });
        if (nf) {
          this.snackBar.open('Lista Actualizada', null, {
            duration: 2000,
          });
        }
      });
  }

  onNoClick(): void {
    //this.dialogRef.close();
  }

  private openLINK(id) {
    //console.log(url)
    window.open('http://186.167.32.27:81/maraveca/test.php?ip=' + id, '_blank');
  }

  Close() {
    this.location.back();
  }

  addh() {
    //console.log(this.addplan.value.historia)
    var body =
      'ticket_th=' + this.id +
      '&user_th=' + this.addplan.value.id +
      '&comment=' + this.addplan.value.historia;
    var url = environment.apiEndpoint + 'ticketh?' + body;
    this.http.post(url, body).subscribe((data) => {
      this.refresh(false);
    });
  }

  closeticket(): void {
    let dialogRef = this.dialog.open(DeleteticketDialog, {
      width: '250px',
      data: {nombre: this.row.nombre + ' ' + this.row.apellido, ap: this.row.nombre_ap, id: this.row.id_soporte}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  closeinstall(): void {
    let dialogRef = this.dialog.open(DeleteInstallDialog, {
      width: '40%',
      data: {row: this.row}
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  closeotherinstall(): void {
    let dialogRef = this.dialog.open(Deleteotherinstall, {
      width: '350px',
      data: {row: this.row}
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }


}


@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-delete.html',
  styleUrls: ['./soporte.component.css']
})

export class DeleteticketDialog {
  myService: MyService | null;
  currentUser: any;

  constructor(
    public dialogRef: MdDialogRef<DeleteticketDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard) {
    this.myService = new MyService(http, router, usuario);
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(data);
  }

  delete(): void {
    console.log('cerrando' + this.data.id);
    var post = this.fb.group({
      status_soporte: 2,
      responsable: this.usuario.currentUser.id_user
    });
    var body = 'status_soporte=2';
    var url = environment.apiEndpoint + 'soporte/' + this.data.id + '?' + body;
    this.http.put(url, body).subscribe((data) => {
      this.myService.refresh();
      this.myService.Close();
    });
    var body1 =
      'user_th=' + this.currentUser.id_user +
      '&ticket_th=' + this.data.id +
      '&comment=Se Cierra el ticket';
    var url1 = environment.apiEndpoint + 'ticketh?' + body1;
    this.http.post(url1, body1).subscribe((data) => {

    });


    this.dialogRef.close();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'delete-dialog',
  templateUrl: 'confirm-newService.html',
  styleUrls: ['./soporte.component.css'],
  providers: [IpValidators]
})
export class DeleteInstallDialog implements OnInit {
  myService: MyService | null;
  addDetails: FormGroup;
  currentUser: any;
  consumibles: any;
  serial: any;
  aps: any;
  installers: any;
  a_search: any = '';
  u_search: any = '';
  sending = false;
  used = false;
  ip: any;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MdDialogRef<DeleteticketDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    private validar: IpValidators,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard) {
    console.log(data.row);
    this.ip = data.row.ipP;
    console.log(this.ip);
    if (data.row.ipP) {
      this.addDetails = this.fb.group({
        ap: ['', [Validators.required]],
        ip: this.ip,
        conectores: ['', [Validators.required]],
        cable: '',
        cable1: ['', [Validators.required]],
        cable2: ['', [Validators.required]],
        serial: '',
        ser1al: '',
        id: '',
        status_soporte: '2',
        user: '',
        installer: ['', [Validators.required]],
        u_search: '',
        a_search: '',
        tmp: '',
        servicio_soporte: '',
        plan: '',
        celda: ''
      });
      /* if (!this.ip) {
         this.addDetails.get('ip').setValidators([ Validators.required, this.validar.ipValidator()] );

       }*/
      if (data.row.ser1al == 0 || (data.row.ser1al == 1 && data.row.serial == 0)) {
        this.addDetails.get('serial').setValidators([Validators.required]);

      }
    } else if (!data.row.ipP) {

      this.addDetails = this.fb.group({
        ap: ['', [Validators.required]],
        ip: ['', [Validators.required], [this.validar.ipValidator()]],
        conectores: ['', [Validators.required]],
        cable: '',
        cable1: ['', [Validators.required]],
        cable2: ['', [Validators.required]],
        serial: '',
        ser1al: '',
        id: '',
        status_soporte: '2',
        user: '',
        installer: ['', [Validators.required]],
        u_search: '',
        a_search: '',
        tmp: '',
        servicio_soporte: '',
        plan: '',
        celda: ''
      });
      /* if (!this.ip) {
         this.addDetails.get('ip').setValidators([ Validators.required, this.validar.ipValidator()] );

       }*/
      if (data.row.ser1al == 0 || (data.row.ser1al == 1 && data.row.serial == 0)) {
        this.addDetails.get('serial').setValidators([Validators.required]);

      }
    }

  }

  ngOnInit() {
    //186.167.32.27:81/maraveca/public/index.php/api/installer
    this.myService = new MyService(this.http, this.router, this.usuario);
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.http.get(environment.apiEndpoint + 'installer')
      .subscribe((data) => {
        this.installers = data.json();
        console.log(this.aps);
      });

    this.http.get(environment.apiEndpoint + 'aps/')
      .subscribe((data) => {
        this.aps = data.json();
        console.log(this.aps);
      });

    if (this.currentUser.installer == 1) {
      this.addDetails.patchValue({
        installer: this.currentUser.id_user
      });
    }
    this.addDetails.get('serial').valueChanges.subscribe(
      (EN) => {
        setTimeout(() => {
          var pre = this.addDetails.value.serial.replace(/(.{2})/g, '$&:');
          this.addDetails.patchValue(
            {
              serial: this.addDetails.value.serial.replace(/[^a-zA-Z0-9 ]/g, ''),
              mac_srv: pre.replace(/(^:+|:+$)/g, '')
              //mac_srv: pre.replace(/(.{16})/g, '$&')
            }
          );
          if (this.addDetails.value.tmp != EN) {

            this.addDetails.patchValue({tmp: EN});
            this.http.get(environment.apiEndpoint + 'verificar', {params: {serial: EN}})
              .subscribe((data) => {
                console.log(data.json());
                setTimeout(() => {
                  if (data.json() == 0) {
                    this.addDetails.get('tmp').setValidators([Validators.required, Validators.pattern(PHONE_REGEX)]);
                    this.addDetails.updateValueAndValidity();
                    this.used = false;
                  } else {
                    this.addDetails.get('tmp').setValidators([]);
                    this.addDetails.updateValueAndValidity();
                    this.used = true;
                  }
                }, 200);

              });
          }
          //this.addDetails.get('tmp').setValidators([Validators.required])
        }, 200);
        this.addDetails.updateValueAndValidity();
      });
  }

  nosymbol() {
    setTimeout(() => {
      this.addDetails.patchValue({
        serial: this.addDetails.value.serial.replace(/[^a-zA-Z0-9 ]/g, '')
      });
    }, 200);
  }

  service(row): void {
    this.sending = true;
    var cable = this.addDetails.value.cable1 - this.addDetails.value.cable2;
    if (cable < 0) {
      cable = cable * (-1);
    }
    var test = this.addDetails;
    test.patchValue({
      cable: cable,
      ser1al: this.data.row.ser1al,
      id: this.data.row.id_soporte,
      status_soporte: '2',
      user: this.currentUser.id_user,
      servicio_soporte: this.data.row.servicio_soporte,
      plan: this.data.row.plan,
      celda: this.data.row.celda
    });
  console.log(test);
    var url = environment.apiEndpoint + 'install/' + this.data.row.id_soporte;
    this.http.put(url, test.value).subscribe((data) => {
      this.myService.refresh();
      this.dialogRef.close();
      this.sending = false;


    }, error => {
      this.sending = false;
    });


  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'cerrar-oinstall.html',
  styleUrls: ['./soporte.component.css']
})
export class Deleteotherinstall implements OnInit {
  myService: MyService | null;
  currentUser: any;
  sending: any;
  addDetails: FormGroup;
  installers: any;
  a_search: any = '';
  u_search: any = '';
  tmp: '';
  comment:any;
  constructor(
    public dialogRef: MdDialogRef<DeleteticketDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private http: Http,
    public dialog: MdDialog,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard) {
    this.myService = new MyService(http, router, usuario);
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(data);
    this.addDetails = this.fb.group({

      id: '',
      status_soporte: '2',
      user: '',
      installer: ['', [Validators.required]],
      a_search: '',
      u_search: '',

    });
  }


  ngOnInit() {
    //186.167.32.27:81/maraveca/public/index.php/api/installer
    this.myService = new MyService(this.http, this.router, this.usuario);
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.http.get(environment.apiEndpoint + 'installer')
      .subscribe((data) => {
        this.installers = data.json();
        //console.log(this.myService);
      });
  }

  service(row): void {
    this.sending = true;

    var test = this.addDetails;
    test.patchValue({

      id: this.data.row.id_soporte,
      status_soporte: '2',
      user: this.currentUser.id_user,
      comment: this.data.row.comment_soporte,
    });
    var url = environment.apiEndpoint + 'oinstall/' + this.data.row.id_soporte;
    this.http.post(url, test.value).subscribe((data) => {
      this.myService.refresh();
      this.dialogRef.close();
      this.sending = false;
      console.log(test.value);

    }, error => {
      this.sending = false;
    });


    /* var url = environment.apiEndpoint + "oinstall/" + this.data.row.id_soporte;
     this.http.put(url, test.value).subscribe((data) => {
       this.myService.refresh()
       this.dialogRef.close();
       this.sending=false

     }, error =>{
       this.sending=false
     });*/
    /*var body1 =
      "user_th=" + this.currentUser.id_user +
      "&ticket_th=" + this.data.id +
      "&comment=Se Cierra el ticket"
    var url1 = environment.apiEndpoint + "ticketh?" + body1;
    this.http.post(url1, body1).subscribe((data) => {

    });
*/

    this.dialogRef.close();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'show-ip',
  templateUrl: './show-IP.component.html',
  styleUrls: ['./soporte.component.css']
})
export class Ipasignadascomponent  {

  autoupdate: boolean
  ip_asig: any = [];
  ip_p: any = [];
  search: string = '';
  modouno: any = 1;
  mododos: any =2;

  @ViewChildren('servicios') spr;
  constructor(
    public usuario: AuthGuard,
    private location: Location,
    private http: Http, public dialog: MdDialog, public snackBar: MdSnackBar, private router: Router) {
    this.autoupdate = true;
    this.snackBar.open("Cargando Clientes", null, {
      duration: 2000,
    });
  }
  ngOnInit() {
    console.log(this.spr)
    console.log('check')
    IntervalObservable.create(10000)
      .takeWhile(() => this.autoupdate)
      .subscribe(() => {

        console.log(this.spr)
        console.log('check')
      });
    this.http.get(environment.apiEndpoint + 'show_ip')
      .subscribe((data) => {

        this.ip_asig = data.json().ip_asignadas;
        this.ip_p = data.json().ip_pendientes;




        this.snackBar.open("Clientes cargados", null, {
          duration: 2000,
        });
        console.log(this.ip_asig);
        console.log(this.ip_p);
      });
  }
  Close(){this.location.back();}
}
