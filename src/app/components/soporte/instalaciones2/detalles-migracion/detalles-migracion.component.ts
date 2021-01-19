import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InstalacionesService } from '../../../../services/soporte/instalaciones.service';
import { ArticuloService } from '../../../../services/Inventario/articulo.service'
import { ListaTransferenciasService } from '../../../../services/Inventario/lista-transferencias.service';
import { AuthGuard } from '../../../../_guards';

@Component({
  selector: 'app-detalles-migracion',
  templateUrl: './detalles-migracion.component.html',
  styleUrls: ['./detalles-migracion.component.css']
})
export class DetallesMigracionComponent implements OnInit {

  id: number
  migracion: any = []
  historial: any = []
  cierre: boolean = false
  e: number = 1
  p: number = 1
  edit: any;
  prueba;
  row: any;
  listaConsumibles: any = []
  exteriores: any = []
  interiores: any = []
  conectores: any = []
  conector: number = 0
  exteriorSelected: number = 0
  interiorSelected: number = 0
  conectorSelected: number = 0
  exterior: number = 0
  interior: number = 0
  instalador: any = []
  instaladorSelected: number = 0
  currentUser: any;
  zona: number = 0
  history: any;
  status = [];
  stat = [];
  autoupdate: boolean = true;
  update: boolean = true;


  listacliente: any = [];
  listaips: any = [];
  celdas: any = [];
  equipos: any = [];
  disponibles: any = [];
  planes: any = [];
  celdaSeleccionada: number = 0;
  zoneSeleccionada: number;
  equipeSeleccionada: string;
  tipoPlanSeleccionado: number;
  planSeleccionado: number = 0;
  visualizarDisponible: boolean = false;
  visualizarPlan: boolean = false;
  visualizarIp: boolean = false;
  visualizarDivEquipos: boolean = false;
  visualizarDivPlanes: boolean = false;
  visualizarDivGuardar: boolean = false;
  ipSeleccionada: string;
  serialSeleccionado: string = " "
  isChecked: boolean = false;
  isCheckedP: boolean = false;
  isCheckedP2: boolean = false
  isChecked1: boolean = false;
  isChecked2: boolean = false;
  isChecked3: boolean = false;
  isChecked4: boolean = false;
  isChecked5: boolean = false;
  isChecked6: boolean = false;
  check: number;
  promociones: any = []
  promoSeleccionada: number = 0
  equipoSeleccionado: string = ""
  serial2Seleccionado: string = ""
  disponibles2: any = []
  instalacionSelected: number = 0

  cableFibra: number = 0
  fconnector: number = 0
  busqueda: any = []
  DatosSeleccionados: any = []




  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private instalacionesService: InstalacionesService,
    private articuloService: ArticuloService,
    private listaTransferenciaService: ListaTransferenciasService,
    private usuario: AuthGuard) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.params.id
    this.traerDatos()
  }

  traerDatos() {
    this.instalacionesService.traerDatosMigracion(this.id).subscribe(res => { console.log(res), this.migracion = res, this.historial = res["historial"] }, err => console.log(err))
  }

  CerrarMigracion() {
    if (this.migracion["status_migra"] == 1) {
      this.cierre = true
    } else {
      this.cierre = false
    }


    this.traerConsumibles()

    this.traerInstalador()
  }

  atras() {
    this.router.navigate(['/Instalaciones2']);
  }

  traerConsumibles() {
    this.zona = this.migracion["lugar_migra"]
    this.articuloService.traerConsumibles(this.zona)
      .subscribe(
        res => {
          console.log(res)
          this.listaConsumibles = res
          this.listaConsumibles.forEach(element => {
            if (element.nombre_equipo.includes("EXTERIORES")) {
              this.exteriores.push(element)
            }
            if (element.nombre_equipo.includes("INTERIORES")) {
              this.interiores.push(element)
            }
            if (element.nombre_equipo.includes("CONECTORES")) {
              this.conectores.push(element)
            }

          });
        },
        err => console.log(err)
      )

  }


  traerInstalador() {
    this.listaTransferenciaService.obtenerData7()
      .subscribe(
        res => {

          this.instalador = res,
            console.log(this.instalador)
        },
        err => console.log(err)
      );
  }


  onSearchDatos(e: string) {

    this.busqueda = []
    this.instalador.filter(el => {
      if (el.nombre_user.toUpperCase().includes(e.toUpperCase())) {
        this.busqueda.push(el)
      }
    });
    console.log(this.busqueda)

  }

  agregarDatosLista(datos: any) {
    this.DatosSeleccionados.push(datos)
    console.log(this.DatosSeleccionados)
  }

  DeseleccionarCliente(i: number) {
    console.log(i)
    this.DatosSeleccionados.splice(i, 1);
  }


  cerrarMigracionF() {

    this.instalacionesService.cerrarMigracionF(
      this.id,
      this.migracion["id"],
      this.cableFibra,
      this.fconnector,
      this.zona,
      this.DatosSeleccionados,
      this.usuario.currentUser.id_user,
    )
      .subscribe(
        res => {
          console.log(res)
          this.cableFibra = 0
          this.fconnector = 0
          this.zona = 0
          this.isChecked6 = false
          this.instalacionSelected = 0
          this.cierre = false
          this.ngOnInit()

        },
        err => {
          console.log(err)
          this.cableFibra = 0
          this.fconnector = 0
          this.zona = 0
          this.isChecked6 = false
          this.instalacionSelected = 0
          this.cierre = false
          this.ngOnInit()
        }
      )

  }

}
