import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthGuard } from '../../_guards/index';
import { AuthenticationService } from '../../_services/index';
import { VentasService } from '../../services/ventas/ventas.service'
import { PromocionesService } from '../../services/promociones/promociones.service'
import { InstalacionesService } from '../../services/soporte/instalaciones.service'
import { CajaDistribucionService } from '../../services/caja-distribucion/caja-distribucion.service'
import { ArticuloService } from '../../services/Inventario/articulo.service'
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CargarPagosService } from '../../services/administrativo/cargar-pagos.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  /* ventas */
  ventas: any = []
  ventas2: any = []
  ventaSeleccionada: number = 0
  ventasTotales: number = 0
  ventasAgendadas: number = 0
  ventasEnEspera: number = 0
  form_promo: boolean = false
  form_tipo: boolean = false
  p: number = 1
  promociones: any = []
  promoSeleccionada: number = 0
  tipoSeleccionado: number = 0
  tasaSeleccionada: number = 0
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  celdas: any = []
  cajas: any = []
  equipos: any = []
  planes: any = []
  disponibles: any = []
  clienteSeleccionado: number = 0
  instalacionSelected: number = 0
  celdaSeleccionada: number = 0
  equipoSeleccionado: string = ""
  serialSeleccionado: string = " "
  zonaSeleccionada: number = 0
  ipSeleccionada: string = ""
  planSeleccionado: number = 0
  tipoPlanSeleccionado: number = 0
  isChecked: boolean = false
  isCheckedE: boolean = false
  visualizarDisponible: boolean = false
  visualizarPlan: boolean = false
  listaips: any = []
  visualizarIp: boolean = false
  visualizarDivGuardar: boolean = false
  check: number = 0
  listacliente:any = []
  idSelecccionado:number = 0
  clienteSeleccionadoVenta: boolean = false
  cedulaSeleccionado: string = ""
  nombreSeleccionado:string = ""
  apellidoSeleccionado:string = ""

  /* ventas*/
  
  /* pagos */
  pagos:any = []
  balance_in: any;
  balance_in2: any;
  busqueda:any
  busquedaCliente:string = ""
  r: number = 1;
  e: number = 1;
  bodyRegistroPagos: boolean = true
  
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
  clientePago:number
  /* pagos */

   constructor(private usuario: AuthGuard,
    private ventasService: VentasService,
    private promocionService: PromocionesService,
    private modalService: BsModalService,
    private instalacionesService: InstalacionesService,
    private articuloService: ArticuloService,
    private cargarPagos: CargarPagosService,
    private cajaServices: CajaDistribucionService) { }

  ngOnInit() {
    this.traerVentas()
    this.procesosPagos()
    this.form_promo = false
    this.form_tipo = false
  }

  aggVenta(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.config);
  }

  onSearchCliente(searchValue: string): void {
    console.log(searchValue);
    this.instalacionesService.practica(searchValue)
      .subscribe(
        res => {
          this.listacliente = res
        }
        ,
        err => console.log(err))

  }

  SeleccionCliente(id: number, dni: string, nombre: string, apellido: string) {
  
      this.idSelecccionado = id;
      this.clienteSeleccionadoVenta = true;
      this.cedulaSeleccionado = dni;
      this.nombreSeleccionado = nombre;
      this.apellidoSeleccionado = apellido;
    
  }

  deseleccionarCliente() {
    this.clienteSeleccionadoVenta = false;
    this.cedulaSeleccionado = "";
    this.nombreSeleccionado = "";
    this.apellidoSeleccionado = "";
    this.listacliente = [];
    this.celdaSeleccionada = 0;
  }

  GuardarVentaNueva(){
    this.ventasService.guardarVenta(this.idSelecccionado,this.usuario.currentUser.id_user,2)
    .subscribe(
      res=>{
        console.log(res)
        this.closeModal2()
        this.ngOnInit()
      },
        err=>console.log(err))
  }

  traerVentas() {
    this.ventasTotales = 0
    this.ventasAgendadas = 0
    this.ventasEnEspera = 0
    if (this.usuario.perm.includes("ventas_Esp")) {
      this.ventasService.traerVentas(1)
        .subscribe(
          res => {
            console.log(res),
              this.ventas = res
            this.ventas2 = res
            this.ventas.forEach(element => {
              this.ventasTotales = this.ventasTotales + 1
              if (element.status_venta == 2) {
                this.ventasAgendadas = this.ventasAgendadas + 1
              } else {
                this.ventasEnEspera = this.ventasEnEspera + 1
              }
            });
          }, err => console.log(err))
    } else {
      this.ventasService.traerVentas(this.usuario.currentUser.id_user)
        .subscribe(
          res => {
            console.log(res),
              this.ventas = res
            this.ventas2 = res

            this.ventas.forEach(element => {
              this.ventasTotales = this.ventasTotales + 1
              if (element.status_venta == 2) {
                this.ventasAgendadas = this.ventasAgendadas + 1
              } else {
                this.ventasEnEspera = this.ventasEnEspera + 1
              }
            });
            console.log(this.ventasTotales)
          }, err => console.log(err))
    }


  }

  agregarPromocion(venta: number) {
    this.ventaSeleccionada = venta
    this.form_promo = true
    this.traerPromociones()
    this.promoSeleccionada = 0
  }


  traerPromociones() {
    this.promocionService.promociones().subscribe(res => this.promociones = res, err => console.log(err))
  }

  GuardarPromo() {
    this.ventasService.guardarPromo(this.ventaSeleccionada, this.promoSeleccionada).subscribe(res => console.log(res), err => console.log(err))
    this.form_promo = false
    this.form_tipo = false
    this.promoSeleccionada = 0
    this.ngOnInit()
  }

  agregartipo(venta: number,cliente:number) {
    this.ventaSeleccionada = venta
    this.clientePago = cliente
    this.form_tipo = true
    this.tipoSeleccionado = 0
    this.tasaSeleccionada = 0
  }

  GuardarTipo() {
    this.ventasService.guardarTipo(this.ventaSeleccionada, this.tipoSeleccionado, this.tasaSeleccionada).subscribe(res => console.log(res), err => console.log(err))
    this.form_promo = false
    this.form_tipo = false
    this.tasaSeleccionada = 0
    this.tipoSeleccionado = 0
    this.ngOnInit()
  }

  openModal(cliente: number, template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.clienteSeleccionado = cliente
  }

  cambioInstalacion() {

    this.traerCeldas()
    this.traerCajasDistribucion()
    this.traerEquipos()

    if (this.instalacionSelected == 2) {
      this.instalacionesService.traerPlanesPractica(7)
        .subscribe(
          res => {
            this.planes = res;
          },

          err => console.log(err))
    } else {
      this.instalacionesService.traerPlanesPractica(this.tipoPlanSeleccionado)
        .subscribe(
          res => {
            this.planes = res;
          },

          err => console.log(err))
    }
  }

  traerCeldas() {
    this.instalacionesService.traerCeldaPractica()
      .subscribe(res => { console.log(res), this.celdas = res }, err => console.log(err))
  }

  traerCajasDistribucion() {
    this.cajaServices.traerCajaDistribucion().subscribe(res => { console.log(res), this.cajas = res }, err => console.log(err))
  }

  traerEquipos() {
    this.instalacionesService.traerEquiposPractica(this.instalacionSelected)
      .subscribe(res => { this.equipos = res, console.log(res) }, err => console.log(err))
  }

  buscarEquipos() {
    if (this.instalacionSelected == 1) {
      this.celdas.forEach(element => {
        if (element.id_celda == this.celdaSeleccionada) {
          this.zonaSeleccionada = element.zona_celda
        }
      });
    } else {
      this.cajas.forEach(element => {
        if (element.id_caja == this.celdaSeleccionada) {
          this.zonaSeleccionada = element.zona_caja
        }
      });

    }

    console.log(this.zonaSeleccionada)


    if (this.isCheckedE) {
      this.articuloService.obtenerDataEquiposPorModelo3(this.zonaSeleccionada, this.equipoSeleccionado)
        .subscribe(
          res => {
            this.disponibles = res
            console.log(res)
            this.visualizarDisponible = true
          },
          err => console.log(err))


    } else {
      this.articuloService.obtenerDataEquiposPorModelo2(this.zonaSeleccionada, this.equipoSeleccionado)
        .subscribe(
          res => {
            this.disponibles = res
            console.log(res)
            this.visualizarDisponible = true
          },
          err => console.log(err))


    }

  }

  onChange() {
    this.instalacionesService.traerPlanesPractica(this.tipoPlanSeleccionado)
      .subscribe(
        res => {
          this.planes = res;
          this.visualizarPlan = true
        },

        err => console.log(err))
  }

  onSearchIp(searchValue: string): void {
    console.log(searchValue);
    this.instalacionesService.listaip(searchValue)
      .subscribe(
        res => {
          this.listaips = res,
            console.log(res)
          if (this.listaips.length > 0) {
            this.visualizarIp = true;
          } else {
            this.visualizarIp = false;
            this.visualizarDivGuardar = true;
          }
          console.log(this.listaips.length)
          console.log(this.visualizarIp)
        }
        ,
        err => console.log(err))
  }

  GuardarData() {

    let desde = 2

    if (this.instalacionSelected == 2) {
      this.tipoPlanSeleccionado = 7
    }

    if (this.isChecked == false) {
      this.check = 0;
    } else {
      this.check = 1;
    }

    this.ventasService.ventaInstalacion(
      this.usuario.currentUser.id_user,
      this.clienteSeleccionado,
      this.celdaSeleccionada,
      this.ipSeleccionada,
      this.planSeleccionado,
      this.tipoPlanSeleccionado,
      this.serialSeleccionado,
      this.equipoSeleccionado,
      this.check,
      this.instalacionSelected).subscribe(
        res => {
          console.log(res)
          this.celdaSeleccionada = 0;
          this.tipoPlanSeleccionado = 0;
          this.visualizarPlan = false;
          this.visualizarDisponible = false;
          this.equipoSeleccionado = "",
            this.serialSeleccionado = " ";
          this.planSeleccionado = 0;
          this.visualizarDivGuardar = false;
          this.isChecked = false;
          this.instalacionSelected = 0
          this.equipoSeleccionado = ""
          this.promoSeleccionada = 0
          this.modalRef.hide()
          this.ngOnInit()
        }
        , err => console.log(err))


  }

  buscarVentas(e) {
    const clientesNuevos = []
    if (e == "") {
      this.traerVentas()
    } else {
      const result = this.ventas.filter((el) => {
        if (el.kind == "V" || el.kind == "E") {
          if (el["nombre"].toUpperCase().includes(e.toUpperCase()) || el["apellido"].toUpperCase().includes(e.toUpperCase()) || el["dni"].toUpperCase().includes(e)) {
            clientesNuevos.push(el)
          }
        } else {
          if (el["social"].toUpperCase().includes(e.toUpperCase())) {
            clientesNuevos.push(el)
          }
        }
      });
      this.ventas = clientesNuevos;
    }
  }




  buscarVentasBackSpace(e) {
    const algo = this.ventas2
    const clientesNuevos = []
    const result = algo.filter((el) => {
      if (el.social === null || el.social === "null") {
        if (el["nombre"].toUpperCase().includes(e.toUpperCase()) || el["apellido"].toUpperCase().includes(e.toUpperCase())) {
          clientesNuevos.push(el)
        }
      } else {
        if (el["social"].toUpperCase().includes(e.toUpperCase())) {
          clientesNuevos.push(el)
        }
      }
    });
    this.ventas = clientesNuevos;
  }

  closeModal() {
    this.celdaSeleccionada = 0;
    this.tipoPlanSeleccionado = 0;
    this.visualizarPlan = false;
    this.visualizarDisponible = false;
    this.equipoSeleccionado = "",
      this.serialSeleccionado = " ";
    this.planSeleccionado = 0;
    this.visualizarDivGuardar = false;
    this.isChecked = false;
    this.instalacionSelected = 0
    this.equipoSeleccionado = ""
    this.promoSeleccionada = 0
    this.modalRef.hide()
    this.ngOnInit()
  }

  closeModal2() {
    this.deseleccionarCliente()
    this.modalRef.hide()
  }

  procesosPagos(){
    this.cargarPagos.traerPagosPendientes().subscribe(
      res => 
      {
        console.log(res),
        this.pagos = res
      },
       err => console.log(err))
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
        this.clientePago)
        .subscribe(
          res =>  {console.log(res),this.ocultar()},
          err => console.log(err)
        )

    }

  }

  ocultar() {
    this.Referencia = " ";
    this.fecha = 0;
    this.MetodoSelected = 0;
    this.Monto = 0
    this.pagoCargado= false
    this.ngOnInit()
  }


}
