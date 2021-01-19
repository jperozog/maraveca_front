import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'



@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  datosGraficaClientesActivos() {
    return this.http.get(environment.apiEndpoint + "datosGraficaClientesActivos/")
  }

  datosGraficaClientesInactivos() {
    return this.http.get(environment.apiEndpoint + "datosGraficaClientesInactivos/")
  }

  datosGraficaClientesZonas() {
    return this.http.get(environment.apiEndpoint + "datosGraficaClientesZonas/")
  }

  datosGraficaCuentasDl() {
    return this.http.get(environment.apiEndpoint + "datosGraficaCuentasDl/")
  }

  datosGraficaCuentasBs() {
    return this.http.get(environment.apiEndpoint + "datosGraficaCuentasBs/")
  }

  traerDatosGraficaServicio() {
    return this.http.get(environment.apiEndpoint + "traerDatosGraficaServicio/")
  }

  datosGraficosTickets() {
    return this.http.get(environment.apiEndpoint + 'datosGraficaTickets/')
  }

  datosGraficosInstalaciones() {
    return this.http.get(environment.apiEndpoint + 'datosGraficaInstalaciones/')
  }

  datosGraficosFactibilidades() {
    return this.http.get(environment.apiEndpoint + 'datosGraficaFactibilidades/')
  }

  datosGraficosOperaciones() {
    return this.http.get(environment.apiEndpoint + 'datosGraficaOperaciones/')
  }


}
