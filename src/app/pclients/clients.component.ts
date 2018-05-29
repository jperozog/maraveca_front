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
import { FacturacionPagos } from '../facturacion/facturacion.component'
import {Router} from '@angular/router';
import { User } from '../_models/index';
import { AuthGuard } from '../_guards/index';
import { AuthenticationService } from '../_services/index';
import {AddticketComponent} from '../soporte/soporte.component';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PHONE_REGEX = /^(0414\d|0412\d|0416\d|0426\d|0424\d|0415\d)+\d{6}/;
const KIND_REGEX= /^(V|J|E|G)/

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})

export class PClientsComponent {


  myService: MyService | null;
  data: any = null;
  search: string = '';
  constructor(private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router, public usuario: AuthGuard, public test: AuthenticationService) {
    this.snackBar.open("Cargando Clientes", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router);
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/pclientes/')
      .subscribe((data) => {
        this.data = data.json();
        console.log(this.data);
      });
    this.snackBar.open("Clientes Cargados", null, {
      duration: 2000,
    });
  }

  openDialog(): void {
    /*let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%'
    });*/
    let dialogRef = this.dialog.open(AddPclientsComponent, {
      width: '25%'
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }

  NFactibilidad(): void {
    /*let dialogRef = this.dialog.open(AddclientsComponent, {
      width: '25%'
    });*/
    let dialogRef = this.dialog.open(AddFactComponent, {
      width: '25%'
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    })
  }
  show(row){
    console.log(row);
    //this.selectedRowIndex = row.id;
    let dialogRef = this.dialog.open(AddPclientsComponent, {
      width: '25%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was AddClient closed');

    });
    //this.myService.refresh();
  }

  status(row){
    console.log(row);
    //this.selectedRowIndex = row.id;
    if(this.usuario.perm && this.usuario.perm.includes('facturacion')){
    let dialogRef = this.dialog.open(PClientesStatus, {
      width: '80%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was AddClient closed');
    });
    //this.myService.refresh();

  }
  }
  deleteDialog(row): void {
    console.log(row);
  let dialogRef = this.dialog.open(DeletePCliente, {
    data: row
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    //this.animal = result;
  });
  }
  private delete(id):void{
    console.log(id); //show`s id
    this.myService.deleteData(id)
    .subscribe((data) => {console.log(data)});
    this.snackBar.open("Borrando Cliente: Por favor espere", null, {
      duration: 2000,
    });
    this.myService.refresh();

  }

}

function capitalizeName(name) {
  return name.replace(/\b(\w)/g, s => s.toUpperCase());
}

export class MyService {

  constructor(private http: Http, private router: Router) {}

  deleteData(id){
    return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/pclientes/'+id, {})
    .map((resp:Response)=>resp.json());
    //return null;

  }
  refresh(){

    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('clients') > -1 ? '/celdas' : '/clients';

    setTimeout(() =>
    {
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
    },
    2000);
  }
}

@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class AddPclientsComponent{


  tipo : string;
  dni :string;
  email :string;
  name : string;
  last : string;
  dayofbirth : string;
  social : string;
  phone : string;
  phone2 : string;
  serie : string;
  address : string;
  comment: string;
  form: string;
  addClient: FormGroup;
  myService: MyService | null;



  constructor(private http:Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddPclientsComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
  private _fb: FormBuilder){

      this.myService = new MyService(http, router);

      if(row != null){
        this.addClient = this.fb.group({
          kind: [row.kind, [Validators.required, Validators.pattern(KIND_REGEX)]],
          dni: [row.dni, [Validators.required]],
          //email: [row.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
          email: [row.email, [Validators.pattern(EMAIL_REGEX)]],
          nombre: [row.nombre, [Validators.required]],
          apellido: [row.apellido, [Validators.required]],
          direccion: [row.direccion, [Validators.required]],
          day_of_birth: [row.day_of_birth, [Validators.required]],
          serie: [row.serie, [Validators.required]],
          phone1: [row.phone1, [Validators.required, Validators.pattern(PHONE_REGEX)]],
          phone2: [row.phone2, [Validators.required]],
          comment: row.comment,
          id: [row.id, [Validators.required]],
          social: [row.social]

        });
        //console.log(row)
      }else{

        this.addClient = this.fb.group({
          kind: ['', [Validators.required, Validators.pattern(KIND_REGEX)]],
          dni:['', [Validators.required]],
          //email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
          email: ['', [Validators.pattern(EMAIL_REGEX)]],
          nombre: ['', [Validators.required]],
          apellido: ['', [Validators.required]],
          direccion: ['', [Validators.required]],
          day_of_birth: ['', [Validators.required]],
          serie: ['', [Validators.required]],
          phone1: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
          phone2: ['', [Validators.required]],
          comment: '',
          social: [''],

        });
        //console.log("llego vacio"+ row)
      }

    }

    onNoClick(): void {
      this.dialogRef.close();
    }


    Enviar(){
      var client = this.addClient.value;
      console.log(JSON.stringify(this.addClient.value));
      if(!client.email)(client.email = "")
      var body =
      "kind=" + client.kind +
      "&dni="+client.dni+
      "&email="+client.email+
      "&nombre="+client.nombre+
      "&apellido="+client.apellido+
      "&direccion="+client.direccion+
      "&day_of_birth="+client.day_of_birth+
      "&serie="+client.serie+
      "&phone1="+client.phone1+
      "&phone2="+client.phone2+
      "&comment="+client.comment+
      "&social="+client.social
      var url = "http://186.167.32.27:81/maraveca/public/index.php/api/pclientes?"+body;

      this.http.post(url, body).subscribe((data) => {});
      this.dialogRef.close();
      this.myService.refresh();
      this.snackBar.open("Agregando Cliente: Por favor espere", null, {
        duration: 2000,
      });
      //this.router.navigate(['/clientes']);
    }
    Editar(){
      var client = this.addClient.value;
      console.log(JSON.stringify(this.addClient.value));
      if(!client.email)(client.email = "")
      var body =
      "kind=" + client.kind +
      "&dni="+client.dni+
      "&email="+client.email+
      "&nombre="+client.nombre+
      "&apellido="+client.apellido+
      "&direccion="+client.direccion+
      "&day_of_birth="+client.day_of_birth+
      "&serie="+client.serie+
      "&phone1="+client.phone1+
      "&phone2="+client.phone2+
      "&comment="+client.comment+
      "&social="+client.social

      var url = "http://186.167.32.27:81/maraveca/public/index.php/api/pclientes/"+client.id+"?"+body;
      this.http.put(url, body).subscribe((data) => {});
      this.dialogRef.close();
      this.myService.refresh();
      this.snackBar.open("Agregando Cliente: Por favor espere", null, {
        duration: 2000,
      });
      //this.router.navigate(['/clientes']);
    }


    sendSMS(){
      var client = this.addClient.value;
      //console.log(this.phone);
      if(
        client.phone1 != "" &&
        client.phone1 != null &&
        client.nombre != null &&
        client.nombre != "" &&
        client.apellido != null &&
        client.apellido != ""){


          const req = this.http.post('http://186.167.32.27:81/maraveca/public/api/sms', {
            numero: client.phone1 ,
            mensaje: 'Este es un mensaje de prueba de MARAVECA, saludos '+ client.nombre + " " + client.apellido,
            userId: 1
          })

          .subscribe(
            res => {
              console.log(res);

            },
            err => {
              console.log("Error occured");
            }
          );
          this.snackBar.open("Mensaje Enviado", null, {
            duration: 2000,
          });
        }else{
          console.log("complete los campos");
          this.snackBar.open("Para enviar mensajes debe completar los campos nombre, apellido y telefono", null, {
            duration: 2000,
          });
        }
      }

    }

    @Component({
  selector: 'app-clients-astatus',
  templateUrl: './clients-astatus.component.html',
  styleUrls: ['./clients.component.css']
})
export class PClientesStatus {

  fac_products : any = null;
  cliente : any;
  email : any;
  phone : any;
  address : any;
  dni : any;
  opcion: string;
  nada: string;
  id: any;
  NewService:FormGroup;
  resp: any;
  constructor(
    private http:Http,
    private fb: FormBuilder,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<PClientsComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router,
    private _fb: FormBuilder
){
  //console.log(row);
  this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/factibi/'+row.id)
  .subscribe((data) => {
    this.fac_products = data.json();
    console.log(this.fac_products.slice(0,3));
    this.fac_products.forEach(linea => {
    });
    this.id = row.id;
  });

}

//aqui comenzara el dialog de detalles de una facturas
status(row){
  if(row.status == 2 && row.factible == 1){
  //console.log(row)
  if(row.id_cli != null){
    this.NewService = this.fb.group({
      servicio: row.id_cli,
      celda: row.adicionales[0].valor,
      equipo: row.adicionales[1].valor,
      tubo:row.adicionales[3].valor,
      ptp: row.adicionales[4].valor
      /*adicionales: [{'nombre':'tubo', 'valor':row.adicionales[3].valor},
                    {'nombre':'PTP', 'valor': row.adicionales[4].det}]*/
    });
    row = this.NewService.value;
  }else{
    var url = "http://186.167.32.27:81/maraveca/public/index.php/api/pclienttc/";
    this.http.post(url, row).subscribe((data) => {
      row.id_cli= data.json().id
      console.log("prueba")
      console.log(row)
      this.NewService = this.fb.group({
        servicio: row.id_cli,
        celda: row.adicionales[0].valor,
        equipo: row.adicionales[1].valor,
        tubo:row.adicionales[3].valor,
        ptp: row.adicionales[4].valor
      });
    });
    row = this.NewService.value;
  }
  let dialogRef = this.dialog.open(AddticketComponent, {
    width: '30%',
    data: row
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was AddClient closed');
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/factibi/'+this.id)
    .subscribe((data) => {
      this.fac_products = data.json();
      this.fac_products.forEach(linea => {
      });
    });
  });
}
}
}

@Component({
selector: 'delete-dialog',
templateUrl: 'confirm-delete.html',
styleUrls: ['./clients.component.css']
})
export class DeletePCliente {
  myService: MyService | null;

  constructor(
    public dialogRef: MdDialogRef<DeletePCliente>,
    @Inject(MD_DIALOG_DATA) public data: any, private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, private router: Router) {
      this.myService = new MyService(http, router);
      console.log(this.data);
     }




    delete(): void {
      console.log(this.data);
      this.myService.deleteData(this.data.id_plan)
      .subscribe((data) => {console.log(data)});
      this.dialogRef.close();
      this.snackBar.open("Borrando cliente: Por favor espere", null, {
        duration: 1000,
      });
      this.myService.refresh();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'app-add-celdas',
  templateUrl: './add-fact.component.html',
  styleUrls: ['./clients.component.css']
})
export class AddFactComponent{

  pclientes:any;
  pclient : string;
  coordenadaslat :string;
  coordenadasllon :string;
  p_search: string;
  c_search: string;
  addFact: FormGroup;
  myService:MyService | null;


  constructor(private http:Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddFactComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    public snackBar: MdSnackBar,
    private router: Router){

      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/pclientes/')
      .subscribe((data) => {
        this.pclientes = data.json();
        //console.log(this.celdas);
      });

      this.myService = new MyService(http, router);
      console.log(row)
      if(row != null){
        this.addFact = this.fb.group({
          id_pot: [row.id, [Validators.required]],
          coordenadaslat: ['', [Validators.required]],
          coordenadaslon: ['', [Validators.required]],
          comentario: ['', [Validators.required]],
          status: '1',
          c_search: '',

        });
        //console.log(row)
      }else{

        this.addFact = this.fb.group({
          id_pot: ['', [Validators.required]],
          coordenadaslat: ['', [Validators.required]],
          coordenadaslon: ['', [Validators.required]],
          comentario: ['', [Validators.required]],
          status: '1',
          c_search: '',

        });
        //console.log("llego vacio"+ row)
      }

    }

    onNoClick(): void {
      this.dialogRef.close();
    }


    Enviar(){
      /*var client = this.addFact.value;
      console.log(JSON.stringify(this.addClient.value));
      var body =
      "ip_ap=" + client.ip_ap +
      "&user_ap="+client.user_ap+
      "&password_ap="+client.password_ap+
      "&celda_ap="+client.celda_ap+
      "&nombre_ap="+client.nombre_ap;
      console.log(url);*/
      var url = "http://186.167.32.27:81/maraveca/public/index.php/api/factibi/";
      var resp = this.http.post(url, this.addFact.value).subscribe((data) => {
        console.log(data);
      });
      //console.log(resp);
      this.dialogRef.close();
      this.snackBar.open("Agregando AccessPoint: Por favor espere", null, {
        duration: 2000,
      });
      this.myService.refresh();

    }

  }


    //regex to validate phones (^0414\d+|^0412\d+|^0416\d+|^0426\d+|^0424\d+)(\d{6})
