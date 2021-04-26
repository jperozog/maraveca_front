import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CargarPagosService } from '../../services/administrativo/cargar-pagos.service';
import { AuthGuard } from '../../_guards/index';
import { ClienteService } from '../../services/cliente/cliente.service';

@Component({
  selector: 'app-carga-pagos-masiva',
  templateUrl: './carga-pagos-masiva.component.html',
  styleUrls: ['./carga-pagos-masiva.component.css']
})
export class CargaPagosMasivaComponent implements OnInit {
  pagos:any = []
  balance_in: any;
  balance_in2: any;
  clientes:any
  clientes2:any
  busqueda:any
  busquedaCliente:string = ""
  r: number = 1;
  e: number = 1;
  bodyRegistroPagos: boolean = true
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  config2 = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'gray modal-lg'
  };
  metodos: any = [];
  Referencia: string = " ";
  fechaDesde: any = 0;
  fecha: any = 0;
  MetodoSelected: number = 0;
  Monto: number = 0
  taza: number = 0
  conversion: number = 0
  pagoCargado: boolean = false
  pagosExoneraciones:boolean = true
  DatosSeleccionados: any = []
  cargado:boolean = false
  referenciaCliente:string = " "
  constructor(
      private modalService: BsModalService,
      private cargarPagos: CargarPagosService,
      public usuario: AuthGuard,
      public cliente: ClienteService
    ) { }

  ngOnInit() {
    this.traerClientes()
    this.traerPagos()
    this.cargarPagos.traerMetodos().subscribe(res => this.metodos = res, err => console.log(err))
    this.cargarPagos.traerTaza().subscribe(res => { this.taza = res[0].valor, console.log(res) }, err => console.log(err))
    this.cargarPagos.traerRegistroDePagos()
      .subscribe(
        res => {
          console.log(res),
         
          this.balance_in = res["balanced"];
          this.balance_in2 = res["balanced"];
        },
        err => console.log(err)
      )
  }

  traerPagos(){
    this.cargarPagos.traerPagosPendientes().subscribe(
      res => 
      {
        console.log(res),
        this.pagos = res
      },
       err => console.log(err))
  }

  agregarDatosLista(datos: any) {
    this.DatosSeleccionados.push(datos)
    console.log(this.DatosSeleccionados)
  }

  DeseleccionarCliente(i: number) {
    this.DatosSeleccionados.splice(i, 1);
  }

  traerClientes() {
    const id = this.usuario.currentUser.id_user;

    this.cliente.traerClientes(id)
      .subscribe(
        res => {
          console.log(res),
            this.clientes = res["clientes"],
            this.clientes2 = res["clientes"],
            this.cargado = true
        }
        ,
        err => console.log(err))
  }

  onSearchDatos(e: string) {
   
      this.busqueda = []
      if(e == " "){
        this.busqueda = []
      }else{
        this.clientes.filter(el => {
          if (el["nombre"].toUpperCase().includes(e.toUpperCase()) || el["apellido"].toUpperCase().includes(e.toUpperCase()) || el["dni"].includes(e)) {
            this.busqueda.push(el)
          }
        });
      }
     
  }


  mostrarCuerpoRegistroPago() {
    this.bodyRegistroPagos = !this.bodyRegistroPagos
  }



  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);

  }

  hacerConversion(e) {
    this.conversion = this.Monto / this.taza
  }
  
  registrarPago() {
    this.pagoCargado = false
    if(this.Referencia.charAt(0) == " "){
      this.Referencia = this.Referencia.substring(1)
    }

    this.balance_in.forEach(e => {
      if ((e.bal_comment_in == this.Referencia || e.bal_comment_mod_in_ == this.Referencia) ) {
        this.pagoCargado = true
        this.referenciaCliente = e.nombre +" "+e.apellido;
      }
    });

    if (this.pagoCargado) {   
    
    }else{
      this.cargarPagos.registrarPagoMasivo(
        this.MetodoSelected,
        this.Referencia,
        this.fecha.epoc,
        this.conversion,
        this.Monto,
        this.usuario.currentUser.id_user,
        this.DatosSeleccionados[0].id)
        .subscribe(
          res =>   this.ocultarModal(),
          err => console.log(err)
        )

    }

  }
  

  ocultarModal() {
    this.Referencia = " ";
    this.fecha = 0;
    this.MetodoSelected = 0;
    this.Monto = 0
    this.pagoCargado= false
    this.busquedaCliente = " "
    this.DeseleccionarCliente(0)
    this.ngOnInit()
    this.busqueda = []
  }

  cambiarPagosExoneraciones() {
    this.pagosExoneraciones = !this.pagosExoneraciones
  }
  


  cargaMasivaPagos(){
    this.cargarPagos.cargaPagosMasivos().subscribe(res=> this.ngOnInit(), err=> this.ngOnInit())
  }

}
