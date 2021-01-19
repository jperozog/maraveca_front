import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VentasEquiposService } from '../../../services/Inventario/ventas-equipos.service';
import { AuthGuard } from '../../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-venta-equipos',
  templateUrl: './venta-equipos.component.html',
  styleUrls: ['./venta-equipos.component.css']
})
export class VentaEquiposComponent implements OnInit {
  e: number = 1
  modalRef: BsModalRef;
  isChecked: boolean = false;
  isChecked2:boolean = false;
  listacliente: any = [];
  idSeleccionada: number
  clienteSeleccionado: boolean = false
  cliente: string = ""
  cedulaSeleccionado: string
  nombreSeleccionado: string
  socialSeleccionado:string
  apellidoSeleccionado: string
  sedeSeleccionada: string
  equipoSeleccionado: string
  serialSeleccionado: number = 0
  montoSeleccionado: number = 0
  tipoSeleccionado: string = " "
  sedes: any = []
  equipos: any = []
  disponibles: any = []
  ventas: any = []
  ventas2: any = []
  detalles: any = []
  visualizar: boolean = false;
  visualizar1: boolean = false;
  fecha: any = 0
  ComentarioVenta:string = "Proceso Satisfactorio"


  constructor(
    private router: Router,
    private ventasEquiposService: VentasEquiposService,
    private modalService: BsModalService,
    private autoGuard: AuthGuard) { }

  ngOnInit() {
    this.traerData();
    this.traerSede();
    this.traerEquipo();
  }

  traerData() {
    this.ventasEquiposService.traerData()
      .subscribe(
        res => {
          this.ventas = res,
            this.ventas2 = res,
            console.log(this.ventas)
        },
        err => console.log(err)
      )
  }


  atras() {
    this.router.navigate(['/zonas2']);
  }

  onSearchCliente(searchValue: string): void {
    console.log(searchValue);
    this.ventasEquiposService.traerClientes(searchValue)
      .subscribe(
        res => {
          this.listacliente = res,
            console.log(res)
        }
        ,
        err => console.log(err))

  }

  traerSede() {
    this.ventasEquiposService.traerSede().subscribe(res => this.sedes = res, err => console.log(err))
  }

  traerEquipo() {
    this.ventasEquiposService.traerEquipo().subscribe(res => this.equipos = res, err => console.log(err))
  }

  buscarArticulos() {
    console.log(this.equipoSeleccionado)
    console.log(this.sedeSeleccionada)

    this.ventasEquiposService.traerArticulos(this.sedeSeleccionada, this.equipoSeleccionado)
      .subscribe(
        res => {
          this.disponibles = res,
            console.log(this.disponibles)
          this.visualizar = true
        },
        err => console.log(err))

  }

  GuardarData() {
  
    this.ventasEquiposService.guardarData(this.cliente, this.serialSeleccionado, this.tipoSeleccionado, this.montoSeleccionado, this.autoGuard.currentUser.id_user, this.fecha.epoc,this.ComentarioVenta)
      .subscribe(
        res => {
          this.traerData();
          this.clienteSeleccionado = false;
          this.cedulaSeleccionado = "";
          this.nombreSeleccionado = "";
          this.apellidoSeleccionado = "";
          this.sedeSeleccionada = ""
          this.equipoSeleccionado = ""
          this.tipoSeleccionado = ""
          this.fecha = []
          this.listacliente = [];
          this.disponibles = [];
          this.serialSeleccionado = 0
          this.montoSeleccionado = 0
          this.visualizar1 = false;
          this.visualizar = false;
          this.isChecked2 = false;
          this.ComentarioVenta = "Proceso Satisfactorio"
        },
        err => console.log(err)
      )

  }

  cambiarEstatus() {
    this.visualizar = false;
  }

  detallesVenta(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template);
    this.ventasEquiposService.traerDetallesData(id).subscribe(res => { this.detalles = res, console.log(res) }, err => console.log(err))
  }

  SeleccionCliente(id: number, dni: string, nombre: string, apellido: string,social:string) {
    this.idSeleccionada = id;
    this.clienteSeleccionado = true;
    this.cedulaSeleccionado = dni;
    this.nombreSeleccionado = nombre;
    this.apellidoSeleccionado = apellido;
    this.socialSeleccionado = social
    this.visualizar1 = true;

    if(this.socialSeleccionado == null || this.socialSeleccionado == "null"){
      this.cliente = this.nombreSeleccionado + " " + this.apellidoSeleccionado;
    }else{
      this.cliente = this.socialSeleccionado
    }
    console.log(this.cliente)
  }

  deseleccionarCliente() {
    this.clienteSeleccionado = false;
    this.cedulaSeleccionado = "";
    this.nombreSeleccionado = "";
    this.apellidoSeleccionado = "";
    this.socialSeleccionado = "";
    this.sedeSeleccionada = ""
    this.equipoSeleccionado = ""
    this.listacliente = [];
    this.disponibles = [];
    this.serialSeleccionado = 0
    this.montoSeleccionado = 0
    this.visualizar1 = false;
    this.visualizar = false;
  }



  BuscarVenta(e) {


    if (e == "") {
      this.traerData()
    } else {

      const result = this.ventas.filter((el) =>
        el.cliente.toUpperCase().includes(e.toUpperCase())
      );

      const result2 = this.ventas.filter((el) =>
        el.serial_articulo.toUpperCase().includes(e.toUpperCase())
      );
      const result3 = result.concat(result2)
      this.ventas = result3;
    }

  }

  BuscarVentaBackSpace(e) {
    const algo = this.ventas2
    const result = algo.filter((el) =>
        el.cliente.toUpperCase().includes(e.toUpperCase())
      );
          
      const result2 = algo.filter((el) =>
        el.serial_articulo.toUpperCase().includes(e.toUpperCase())
      );
      const result3 = result.concat(result2)
      this.ventas = result3;
  }



}
