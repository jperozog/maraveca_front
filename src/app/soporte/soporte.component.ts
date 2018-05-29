import {Component, Inject, OnInit} from '@angular/core';
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
import { AuthGuard } from '../_guards/index';
import { AuthenticationService } from '../_services/index';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css']
})
export class SoporteComponent {
  myService: MyService | null;
  datat: any = null;
  datai: any = null;
  //datai= [];
  search: string;
  modo: any = 2;
  position: string = '2';
  constructor(private http: Http, public dialog: MdDialog, public snackBar:MdSnackBar, public router: Router, public usuario: AuthGuard) {
    this.snackBar.open("Cargando Tickets", null, {
      duration: 2000,
    });
    this.myService = new MyService(http, router);
    console.log(usuario.currentUser)
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/soportesm/?user=' + usuario.currentUser.id_user)
    .subscribe((data) => {
      this.datat = data.json()[1].soporte;
      this.datai = data.json()[0].instalaciones;
      console.log(this.datat);
    });

    this.snackBar.open("Tickets Cargados", null, {
      duration: 2000,
    });
  }


  private openLINK(id){
    //console.log(url)
    window.open("../#/editticket/"+id, '_blank');
  }

  refresh(){
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/soportesm/?user=' + this.usuario.currentUser.id_user)
    .subscribe((data) => {
      this.datat = data.json()[1].soporte;
      this.datai = data.json()[0].instalaciones;
      console.log(this.datat);
    });
  }

  openDialog(): void {
    //this.router.navigate(['/addticket']);
    let dialogRef = this.dialog.open(AddticketComponent, {
    width: '30%',
    //data: row
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    //this.myService.refresh();
    this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/soportesm/?user=' + this.usuario.currentUser.id_user)
    .subscribe((data) => {
      this.datat = data.json()[1].soporte;
      this.datai = data.json()[0].instalaciones;
      console.log(this.datat);
    });

  });
}

show(row){

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

  constructor(private http: Http, private router: Router) {

  }

  Close(){
    window.close();
  }
  deleteData(id){

    return this.http.delete('http://186.167.32.27:81/maraveca/public/index.php/api/soporte/'+id, {})
    .map((resp:Response)=>resp.json());



  }

  refresh(){
    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('soporte') > -1 ? '/clients' : '/soporte';
    setTimeout(() =>
    {
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
    },
    1000);
  }
  addPb(ticket, pb){
    pb.forEach(i => {
      this.http.post('http://186.167.32.27:81/maraveca/public/index.php/api/ticketp/?ticket_pb='+ticket+'&problem_pb='+i, i).subscribe((data) => {});


    });
  }
}
@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./soporte.component.css']
})
export class AddticketComponent implements OnInit{
  edit : any;
  costo : any;
  nombre :string;
  servicios: any;
  clientes: any;
  cliente: any;
  equipo: any;
  celda: any;
  equipos: any;
  celdas: any;
  S_servicios:any;
  S_celda:any;
  S_equipos:any;
  addplan: FormGroup;
  CC:MyService | null;
  //row: any;
  currentUser: any;
  problemas: any;
  requ = [];
  nombrer:any = "1";
  valorr:any = "2";
  EN:boolean = false;
  valorplaceholder="";
  constructor(private http:Http,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddticketComponent>,
    @Inject(MD_DIALOG_DATA) public row: any,
    private route: ActivatedRoute,
    public snackBar: MdSnackBar,
    private router: Router){
      this.edit = false;
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/servicios/')
      .subscribe((data) => {
        this.servicios = data.json().servicios;
        console.log("servicios")
        console.log(this.servicios)
      });
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/clientes/')
      .subscribe((data) => {
        this.clientes = data.json();
        setTimeout(() =>
        {
          this.addplan.value.servicio_soporte = row.servicio;
          //console.log(row.servicio)
        },
        3000);
      });
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/celdas/')
      .subscribe((data) => {
        this.celda = data.json();
        this.celdas = this.addplan.value.celda_soporte

      });
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/equipos/')
      .subscribe((data) => {
        this.equipos = data.json();
        this.equipo = this.addplan.value.equipo_soporte
      });
      this.CC = new MyService(http, router);
      this.addplan = this.fb.group({
        tipo_soporte: '1',
        problema_soporte: '',
        afectacion_soporte: '1',
        problems:'',
        servicio_soporte: ['', Validators.required],
        celda_soporte:['', Validators.required],
        equipo_soporte:['', Validators.required],
        seriale:['', Validators.required],
        status_soporte: "1",
        user_soporte: this.currentUser.id_user,
        S_servicios:'',
        adicionales:[],
        nombrer:'',
        valorr:'',
        EN:false,
      });
      if(row != null){
        console.log(row.ptp)
        this.addplan.patchValue({
          servicio_soporte: row.servicio,
          celda_soporte:row.celda,
          equipo_soporte:row.equipo,
          user_soporte: this.currentUser.id_user
        });
        this.requ.push({nombre: 'Tubo', valor: row.tubo})
        if (row.ptp != null){
          this.requ.push({nombre: 'PTP', valor: row.ptp})
        }
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

    ngOnInit(){


      this.addplan.get('EN').valueChanges.subscribe(

        (EN) => {

          if (EN) {
            console.log(EN);
            this.addplan.get('seriale').setValidators([]);

          } else {
            console.log(EN);
            this.addplan.get('seriale').setValidators([Validators.required]);

          }

          this.addplan.get('seriale').updateValueAndValidity();

        }

      )
      this.addplan.get('nombrer').valueChanges.subscribe(

        (nombrer) => {

          if (nombrer==="Tubo") {
            console.log(nombrer)
            this.valorplaceholder="Metros";

          } else if (nombrer==="SerialPTP") {
            console.log(nombrer)
            this.valorplaceholder="Serial";
          } else if (nombrer==="Router") {
            console.log(nombrer)
            this.valorplaceholder="Serial";
          } else if (nombrer==="Switch") {
            console.log(nombrer)
            this.valorplaceholder="Cantidad";
          }

          this.addplan.get('seriale').updateValueAndValidity();

        }

      )
      this.addplan.get('tipo_soporte').valueChanges.subscribe(

        (tipo_soporte) => {

          if (tipo_soporte === "1") {
            console.log("instalacion")
            this.addplan.get('servicio_soporte').setValidators([Validators.required]);
            this.addplan.get('celda_soporte').setValidators([Validators.required]);
            this.addplan.get('equipo_soporte').setValidators([Validators.required]);
            this.addplan.get('seriale').setValidators([Validators.required]);
            this.addplan.get('afectacion_soporte').setValidators([]);
            this.addplan.get('servicio_soporte').setValidators([]);
            this.addplan.get('problems').setValidators([]);

          } else if (tipo_soporte === "2") {
            console.log("ticket")
            this.addplan.get('servicio_soporte').setValidators([]);
            this.addplan.get('celda_soporte').setValidators([]);
            this.addplan.get('equipo_soporte').setValidators([]);
            this.addplan.get('seriale').setValidators([]);
            this.addplan.get('afectacion_soporte').setValidators([Validators.required]);
            this.addplan.get('servicio_soporte').setValidators([Validators.required]);
            this.addplan.get('problems').setValidators([Validators.required]);

          }

          this.addplan.get('servicio_soporte').updateValueAndValidity();
          this.addplan.get('celda_soporte').updateValueAndValidity();
          this.addplan.get('equipo_soporte').updateValueAndValidity();
          this.addplan.get('seriale').updateValueAndValidity();
          this.addplan.get('afectacion_soporte').updateValueAndValidity();
          this.addplan.get('servicio_soporte').updateValueAndValidity();
          this.addplan.get('problems').updateValueAndValidity();

        }

      )

    }

    onNoClick(): void {
      this.dialogRef.close();
    }
    addr(){
      this.requ.push({nombre:this.addplan.value.nombrer, valor:this.addplan.value.valorr})
      this.addplan.patchValue({
        nombrer:'',
        valorr:''
      })
    }
    deleter(req){
      for(var i=0; i < this.requ.length; i++ ){
        if (this.requ[i]["nombre"]==req.nombre && this.requ[i]["valor"]==req.valor){
          this.requ.splice(i,1);
        }
      }
    }
    Enviar(){
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
      if (!this.EN){
        this.requ.push({nombre:'Serial', valor:this.addplan.value.seriale})
      }
      this.addplan.patchValue({
        adicionales: this.requ
      })
      var plan = this.addplan.value;
      var url = "http://186.167.32.27:81/maraveca/public/index.php/api/soporte2";
      this.http.post(url, plan).subscribe((data) => {
        this.row = data.json();
      });
      setTimeout(()=>{
        /*          var body1=
        "user_th="+plan.id_user+
        "&ticket_th="+this.row.id+
        "&comment=Se apertura el ticket"
        var url1 = "http://186.167.32.27:81/maraveca/public/index.php/api/ticketh?"+body1;
        this.http.post(url1,body1).subscribe((data) => {});
        if (plan.tipo == 2){
        this.CC.addPb(this.row.id, plan.problems);
      }
      */
    }, 2000)
    this.dialogRef.close();
    this.snackBar.open("Agregando Ticket: Por favor espere", null, {
      duration: 2000,
    });

    this.CC.refresh();
  }

}
@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./soporte.component.css']
})
export class EditticketComponent{
  edit : any;
  id : any;
  prueba;
  addplan: FormGroup;
  CC:MyService | null;
  row: any;
  currentUser:any;
  problems= [];
  problemas=[];
  history: any;
  status= [];
  stat= [];
  constructor(private http:Http,
    private fb: FormBuilder,
    //public dialogRef: MdDialogRef<AddticketComponent>,
    //@Inject(MD_DIALOG_DATA) public row: any,
    private route: ActivatedRoute,
    public snackBar: MdSnackBar,
    public dialog: MdDialog,
    private router: Router){
      this.edit = true
      this.prueba = this.route.params
      .subscribe(
        params => {
          this.id = params.ticket;
          console.log(this.id)
        }
      );
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      //console.log(this.currentUser)
      this.http.get('http://186.167.32.27:81/maraveca/public/index.php/api/soporte/'+this.id)
      .subscribe((data) => {
        this.row = data.json()[0];
        this.addplan.value.status_soporte=this.row.status_soporte;
        this.addplan.value.tipo=this.row.tipo_soporte;
        console.log(this.addplan.value)
        this.history = this.row.history;
        this.row.problems.forEach(perm => {
          this.problems.push(perm.problem_pb);
          this.problemas = this.problems;

        });
      });
      this.CC = new MyService(http, router);
      this.addplan = this.fb.group({
        servicio: '',
        problema_soporte: '',
        status_soporte: '',
        id: this.currentUser.id_user,
        problems: '',
        historia:'',
        tipo: '',
      });



      if(this.row){
        //this.addplan.value.problems
      }

    }
    onNoClick(): void {
      //this.dialogRef.close();
    }
    private openLINK(id){
      //console.log(url)
      window.open("http://186.167.32.27:81/maraveca/test.php?ip="+id, '_blank');
    }
    Close(){
      window.close();
    }
    addh(){
      //console.log(this.addplan.value.historia)
      var body =
      "ticket_th="+this.id+
      "&user_th="+this.addplan.value.id+
      "&comment="+this.addplan.value.historia
      var url = "http://186.167.32.27:81/maraveca/public/index.php/api/ticketh?"+body;
      this.http.post(url, body).subscribe((data) => {
        this.CC.refresh()
      });
    }
    closeticket(): void {
      let dialogRef = this.dialog.open(DeleteticketDialog, {
        width: '250px',
        data: { nombre: this.row.nombre+" "+this.row.apellido, ap: this.row.nombre_ap, id: this.row.id_soporte }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        //this.animal = result;
      });
    }
    closeinstall(): void {
      let dialogRef = this.dialog.open(DeleteInstallDialog, {
        width: '40%',
        data: { row: this.row }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        //this.animal = result;
      });
    }

    Enviar(){
      var plan = this.addplan.value;
      console.log(JSON.stringify(this.addplan.value));
      var body =
      "nombre_user=" + plan.nombre_user +
      "&apellido_user="+plan.apellido_user+
      "&username="+plan.username+
      "&email_user="+plan.email_user+
      "&phone_user="+plan.phone_user+
      "&password_user="+plan.password_user;
      var url = "http://186.167.32.27:81/maraveca/public/index.php/api/users?"+body;
      /*if (!this.row)
      {this.http.post(url, body).subscribe((data) => {});
      this.dialogRef.close();
      this.snackBar.open("Agregando Usuario: Por favor espere", null, {
      duration: 2000,
    });
  }else{*/
  this.http.put(url, body).subscribe((data) => {});
  //this.dialogRef.close();
  this.snackBar.open("Editando Usuario: Por favor espere", null, {
  duration: 2000,
});
//}
this.CC.refresh();
}
Editar(){
  var plan = this.addplan.value;
  console.log(JSON.stringify(this.addplan.value));
  var body =
  "nombre_user=" + plan.nombre_user +
  "&apellido_user="+plan.apellido_user+
  "&username="+plan.username+
  "&email_user="+plan.email_user+
  "&phone_user="+plan.phone_user+
  "&password_user="+plan.password_user;
  var url = "http://186.167.32.27:81/maraveca/public/index.php/api/users?"+body;
  /*if (!this.row)
  {this.http.post(url, body).subscribe((data) => {});
  this.dialogRef.close();
  this.snackBar.open("Agregando Usuario: Por favor espere", null, {
  duration: 2000,
});
}else{*/
this.http.put(url, body).subscribe((data) => {});
//this.dialogRef.close();
this.snackBar.open("Editando Usuario: Por favor espere", null, {
duration: 2000,
});
//}
this.CC.refresh();
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
    public snackBar:MdSnackBar,
    private router: Router) {
      this.myService = new MyService(http, router);
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      console.log(data)
    }

    delete(): void {
      console.log("cerrando"+this.data.id);
      var body ="status_soporte=2"
      var url = "http://186.167.32.27:81/maraveca/public/index.php/api/soporte/"+this.data.id+"?"+body;
      this.http.put(url, body).subscribe((data) => {
        this.myService.refresh()
        this.myService.Close()
      });
      var body1=
      "user_th="+this.currentUser.id_user+
      "&ticket_th="+this.data.id+
      "&comment=Se Cierra el ticket"
      var url1 = "http://186.167.32.27:81/maraveca/public/index.php/api/ticketh?"+body1;
      this.http.post(url1,body1).subscribe((data) => {});


    }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }



  @Component({
    selector: 'delete-dialog',
    templateUrl: 'confirm-newService.html',
    styleUrls: ['./soporte.component.css']
  })
  export class DeleteInstallDialog {
    myService: MyService | null;
    currentUser: any;
    consumibles: any;
    cable1:any = 0;
    cable2:any = 0;
    conectores:any = 0
    ip:any = "0.0.0.0"
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      public dialogRef: MdDialogRef<DeleteticketDialog>,
      @Inject(MD_DIALOG_DATA) public data: any,
      private http: Http,
      public dialog: MdDialog,
      public snackBar:MdSnackBar,
      private router: Router) {
        this.myService = new MyService(http, router);

        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      }

      service(row): void {
        console.log(this.data.row.id_soporte + " prueba");
        var body ="status_soporte=2"
        var url = "http://186.167.32.27:81/maraveca/public/index.php/api/soporte/"+this.data.row.id_soporte+"?"+body;
        this.http.put(url, body).subscribe((data) => {
          this.myService.refresh()
          this.myService.Close()
        });
        var body1=
        "user_th="+this.currentUser.id_user+
        "&ticket_th="+this.data.row.id_soporte+
        "&comment=Se Cierra el ticket"
        var url1 = "http://186.167.32.27:81/maraveca/public/index.php/api/ticketh?"+body1;
        this.http.post(url1,body1).subscribe((data) => {});
        var cable=this.cable1-this.cable2;
        if (cable < 0){
          cable=cable*(-1);
        }
        var body1=
        "user_th="+this.currentUser.id_user+
        "&ticket_th="+this.data.row.id_soporte+
        "&comment=se usaron: "+(cable)+" metros de cable y "+this.conectores+" conectores"
        var url1 = "http://186.167.32.27:81/maraveca/public/index.php/api/ticketh?"+body1;
        this.http.post(url1,body1).subscribe((data) => {});


      }

      onNoClick(): void {
        this.dialogRef.close();
      }

    }
