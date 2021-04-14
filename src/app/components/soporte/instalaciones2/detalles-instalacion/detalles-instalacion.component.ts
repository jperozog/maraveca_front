import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InstalacionesService } from '../../../../services/soporte/instalaciones.service';
import { ArticuloService } from '../../../../services/Inventario/articulo.service'
import { ListaTransferenciasService } from '../../../../services/Inventario/lista-transferencias.service';
import { AuthGuard } from '../../../../_guards';


@Component({
  selector: 'app-detalles-instalacion',
  templateUrl: './detalles-instalacion.component.html',
  styleUrls: ['./detalles-instalacion.component.css']
})
export class DetallesInstalacionComponent implements OnInit {
  id: number
  instalacion: any = []
  user: any = []
  historial: any = []
  cierreI: boolean = false
  cierreF: boolean = false
  e:number= 1
  p:number= 1
  edit: any;
  prueba;
  row: any;
  aps: any = []
  apSelected: number = 0
  celda: number
  plan: number
  zona: number
  listaConsumibles: any = []
  exteriores: any = []
  interiores: any = []
  conectores: any = []
  conector: number = 0
  exteriorSelected: number = 0
  interiorSelected: number = 0
  conectorSelected: number = 0
  baseAntena: number = 0
  grapas: number = 0
  alambre: number = 0
  exterior: number = 0
  interior: number = 0
  instalador: any = []
  instaladorSelected: number = 0
  currentUser: any;
  problems = [];
  problemas = [];
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
  busqueda:any = []
  DatosSeleccionados:any = []
  instaladoresEncargados: any = []




  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private instalacionesService: InstalacionesService,
    private articuloService: ArticuloService,
    private listaTransferenciaService: ListaTransferenciasService,
    private usuario: AuthGuard) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.params.id
    this.cierreF = false
    this.cierreI = false
    this.traerDatos()
    this.traerDatosHistorial()
    this.traerInstaladoresEncargados()
  }

  traerDatos() {
    this.instalacionesService.traerDatosInstalacion(this.id).subscribe(res => { console.log(res), this.instalacion = res}, (err: any) => console.log(err))
  }

  traerDatosHistorial(){
    this.instalacionesService.traerHistorial(this.id).subscribe(res => { console.log(res), this.historial = res}, err => console.log(err))
  }
  traerInstaladoresEncargados(){
    this.instalacionesService.traerInstaladoresEncargados(this.id).subscribe(res =>  {console.log(res), this.instaladoresEncargados = res}, err => console.log(err))
  }

  

  CerrarInstalacion() {
    if (this.instalacion["tipo_insta"] == 1) {
      this.cierreI = true
      this.celda = this.instalacion["celda_det"];
    } else {
      this.cierreF = true
      this.celda = this.instalacion["id_caja"];
    }

    this.plan = this.instalacion["plan_det"];
    this.traerConsumibles()
    this.traerAps()
    this.traerInstalador()
  }

  atras() {
    this.router.navigate(['/Instalaciones2']);
  }

  traerConsumibles() {
    if (this.instalacion["tipo_insta"] == 1) {
      console.log(this.celda)
      if (this.celda == 16 ||
        this.celda == 17 ||
        this.celda == 30 ||
        this.celda == 19 ||
        this.celda == 20 ||
        this.celda == 37 ||
        this.celda == 18 ||
        this.celda == 22 ||
        this.celda == 34 ||
        this.celda == 21 ||
        this.celda == 32) {

        this.zona = 1;
        console.log(this.zona)
      }

      if (this.celda == 9 ||
        this.celda == 12 ||
        this.celda == 3 ||
        this.celda == 6 ||
        this.celda == 7 ||
        this.celda == 8 ||
        this.celda == 28 ||
        this.celda == 10 ||
        this.celda == 11 ||
        this.celda == 15) {

        this.zona = 3;
        console.log(this.zona)
      }

      if (
        this.celda == 14 ||
        this.celda == 24 ||
        this.celda == 25 ||
        this.celda == 29) {

        this.zona = 2;
        console.log(this.zona)
      }

      if (this.celda == 2 ||
        this.celda == 4 ||
        this.celda == 5 ||
        this.celda == 13 ||
        this.celda == 31 ||
        this.celda == 40 ||
        this.celda == 41) {

        this.zona = 4;
        console.log(this.zona)
      }

      if (this.celda == 35 ||
        this.celda == 36 ||
        this.celda == 41 ||
        this.celda == 42 ||
        this.celda == 43 ||
        this.celda == 44 ||
        this.celda == 39) {
        this.zona = 5;
        console.log(this.zona)
      }

      if (this.celda == 38) {
        this.zona = 6;
        console.log(this.zona)
      }
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
    } else {
      this.zona = this.instalacion["zona_caja"]
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
  }

  traerAps() {
    this.instalacionesService.traerApsPractica()
      .subscribe(res => { this.aps = res }, err => console.log(err))
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


  cerrarInstalacion() {

    this.instalacionesService.cerrarInstalacion(this.id,
      this.DatosSeleccionados,
      this.apSelected,
      this.celda,
      this.plan,
      this.exteriorSelected,
      this.exterior,
      this.interiorSelected,
      this.interior,
      this.conectorSelected,
      this.conector,
      this.zona,
      this.baseAntena,
      this.grapas,
      this.alambre,
      this.instalacion["tipo_insta"],
      this.usuario.currentUser.id_user)
      .subscribe(
        res => {
          console.log(res)
          
          this.exteriorSelected = 0,
            this.exterior = 0
          this.interior = 0
          this.interiorSelected = 0
          this.DatosSeleccionados = []
          this.conector = 0
          this.conectorSelected = 0
          this.apSelected = 0
          this.instaladorSelected = 0
          this.isChecked = false
          this.isChecked2 = false
          this.isChecked3 = false
          this.isChecked4 = false
          this.isChecked5 = false
          this.grapas = 0,
            this.baseAntena = 0,
            this.alambre = 0
          this.ngOnInit()
          
        },
        err => console.log(err)
      )

  }

  cerrarInstalacionF() {

    this.instalacionesService.cerrarInstalacionF(this.id,
      this.celda,
      this.plan,
      this.cableFibra,
      this.fconnector,
      this.zona,
      this.instalacion["tipo_insta"],
      this.DatosSeleccionados,
      this.usuario.currentUser.id_user,
      )
      .subscribe(
        res => {
          console.log(res)

          this.celda = 0
          this.plan = 0
          this.cableFibra = 0
          this.fconnector = 0
          this.zona = 0
          this.isChecked6 = false
          this.instalacionSelected = 0
          this.ngOnInit()

        },
        err => console.log(err)
      )

  }

  alambref() {
    if (this.isChecked5) {
      this.alambre = 0.5
    } else {
      this.alambre = 0
    }
    console.log(this.alambre)
  }

}
