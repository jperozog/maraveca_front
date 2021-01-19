import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { ExcelService } from '../../../services/excel/excel.service';
import { Cliente } from '../../../models/Cliente'

@Component({
  selector: 'app-zonas-clientes',
  templateUrl: './zonas-clientes.component.html',
  styleUrls: ['./zonas-clientes.component.css']
})
export class ZonasClientesComponent implements OnInit {

  dato: Cliente
  datos: any = []
  estados: any = []
  municipios: any = []
  estadoSeleccionado: number = 0
  municipioSeleccinado: number = 0
  clientes: any = []
  listaClientes: any = []
  listaClientes2: any = []
  listaFiltro: any = []
  municipioActual: string = ""
  m: number = 1
  c: number = 1
  FiltroActivo: number = 0

  constructor(private router: Router, private clienteService: ClienteService, private excelService: ExcelService) { }

  ngOnInit() {
    this.traerEstados()
  }

  traerEstados() {
    this.clienteService.traerEstados().subscribe(res => this.estados = res, err => console.log(err))
  }

  traerMunicipios() {
    this.clienteService.traerMunicipios(this.estadoSeleccionado).subscribe(res => { this.municipios = res, console.log(res) }, err => console.log(err))
  }

  traerDatosEstado() {
    this.clienteService.traerDatosEstado(this.estadoSeleccionado).subscribe(res => this.clientes = res, err => console.log(err))
    this.traerMunicipios()
  }

  mostrarDatosMunicipio(id: number) {
    this.FiltroActivo = 0
    console.log(id)
    this.municipioSeleccinado = id

    this.clienteService.traerClientesPorMunicipio(this.estadoSeleccionado, this.municipioSeleccinado)
      .subscribe(
        res => {
          console.log(res),
            this.listaClientes = res,
            this.listaClientes2 = res,
            this.municipioActual = res[0].municipio
        },
        err => console.log(err)
      )
  }

  buscarCliente(e) {
    if (e == "") {
      this.clienteService.traerClientesPorMunicipio(this.estadoSeleccionado, this.municipioSeleccinado)
        .subscribe(
          res => {
            console.log(res),
              this.listaClientes = res,
              this.listaClientes2 = res,
              this.municipioActual = res[0].municipio
          },
          err => console.log(err)
        )
    } else {
      const result = this.listaClientes.filter((el) =>
        el.nombre.toUpperCase().includes(e.toUpperCase())
      );

      const result2 = this.listaClientes.forEach(el => {
        if (el.social === null || el.social === "null") {

        } else {
          if (el.social.toUpperCase().includes(e.toUpperCase())) {
            result.push(el)
          }
        }
      });

      this.listaClientes = result;
    }
  }

  BuscarClienteBackSpace(e) {
    const algo = this.listaClientes2
    const result = algo.filter((el) =>
      el.nombre.toUpperCase().includes(e.toUpperCase())
    );

    const result2 = this.listaClientes2.forEach(el => {
      if (el.social === null || el.social === "null") {

      } else {
        if (el.social.toUpperCase().includes(e.toUpperCase())) {
          result.push(el)
        }
      }
    });

    this.listaClientes = result;
  }

  exportAsXLSX(): void {
    this.listaClientes.forEach(e => {

      this.dato = {
        kind: e.kind,
        dni: e.dni,
        nombre: e.nombre,
        apellido: e.apellido,
        social: e.social,
        numero: e.phone1,
        direccion: e.direccion
      };
      this.datos.push(this.dato)
    });
    this.excelService.exportAsExcelFile(this.datos, this.municipioActual);
    this.datos = []
  }

  FiltroClientes() {
    if (this.FiltroActivo == 0) {
      this.clienteService.traerClientesPorMunicipio(this.estadoSeleccionado, this.municipioSeleccinado)
        .subscribe(
          res => {
            console.log(res),
              this.listaClientes = res,
              this.listaClientes2 = res,
              this.municipioActual = res[0].municipio
          },
          err => console.log(err)
        )
    }
    if (this.FiltroActivo == 1) {
      this.listaFiltro = []
      this.listaClientes2.forEach(element => {
        if (element.kind == "V" || element.kind == "E" || element.kind == "V-") {
          this.listaFiltro.push(element)
        }
      });
      console.log(this.listaFiltro)
      this.listaClientes = this.listaFiltro
    }
    if (this.FiltroActivo == 2) {
      this.listaFiltro = []
      this.listaClientes2.forEach(element => {
        if (element.kind == "G" || element.kind == "J") {
          this.listaFiltro.push(element)
        }
      });
      console.log(this.listaFiltro)
      this.listaClientes = this.listaFiltro
    }
  }


  atras() {
    this.router.navigate(['/clients'])
  }
}
