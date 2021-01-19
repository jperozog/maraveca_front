import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Articulo } from '../../models/Articulo'
import { environment } from '../../../environments/environment'

@Injectable()
export class ArticuloService {

  constructor(private http: HttpClient) { }

  getData() {
    /*
    return this.http.get<Articulo[]>("http://127.0.0.1:8000/api/articulos");
    */
  }

  guardarData(cola: any) {
    let cajaSerial = cola.id_caja_articulo
    let modelo = cola.modelo_articulo
    let serial = cola.serial_articulo
    let estatus = cola.status
    let tipo_articulo = cola.id_tipo_articulo
    let tipo_zona = cola.id_tipo_zona
    let proveedor = cola.proveedor
    let notaEntrega = cola.notaEntrega
    return this.http.post(environment.apiEndpoint + "articulos", { cajaSerial, modelo, serial, estatus, tipo_articulo, tipo_zona,proveedor,notaEntrega });
  }

  busqueda(id: Number, modelo_articulo: string, data: string) {
    return this.http.get(environment.apiEndpoint + "busquedaEquipo/" + id + "/" + modelo_articulo + "/" + data);
  }

  obtenerDataEquiposPorModelo(id_zona: Number, modelo: string) {
    return this.http.post(environment.apiEndpoint + "articulosCategorias/", { id_zona, modelo });
  }

  obtenerDataEquiposPorModelo2(id_zona: Number, modelo: string) {
    return this.http.post(environment.apiEndpoint + "articulosCategorias2/", { id_zona, modelo });
  }

  obtenerDataEquiposPorModelo3(id_zona: Number, modelo: string) {
    return this.http.post(environment.apiEndpoint + "articulosCategorias3/", { id_zona, modelo });
  }

  guardarCola(equiposCola: any = []) {
    return this.http.post(environment.apiEndpoint + "articulosCola", { equiposCola })
  }

  obtenerData() {
    return this.http.get(environment.apiEndpoint + "equipos2")
  }

  obtenerDataEquipo(nombre: string) {
    return this.http.get(environment.apiEndpoint + "equipos2/" + nombre)
  }

  obtenerNumeroDisponibles(id: Number) {
    return this.http.get(environment.apiEndpoint + "articulos/disponibles/" + id);
  }
  obtenerNumeroEnProceso(id: Number) {
    return this.http.get(environment.apiEndpoint + "articulos/enProceso/" + id);
  }
  obtenerNumeroNoDisponibles(id: Number) {
    return this.http.get(environment.apiEndpoint + "articulos/noDisponibles/" + id);
  }

  traspasoDeEquipos(sede: number, id: number) {
    return this.http.post(environment.apiEndpoint + "traspasoEquipo", { sede, id });
  }

  traerConsumibles(id: Number) {
    return this.http.get(environment.apiEndpoint + "consumibles/" + id)
  }

  traerEquiposConsumbles() {
    return this.http.get(environment.apiEndpoint + "equiposConsumibles")
  }

  agregarConsumible(equipo: number, cantidad: number, unidad: string, id: Number) {
    return this.http.post(environment.apiEndpoint + "agregarConsumible", { equipo, cantidad, unidad, id })
  }

  modificarConsumible(cantidad: number, id: number) {
    return this.http.put(environment.apiEndpoint + "modificarConsumible", { cantidad, id })
  }

  eliminarConsumible(idE: number) {
    return this.http.post(environment.apiEndpoint + "eliminarConsumible", { idE })
  }

  traerGrupal(){
    return this.http.get(environment.apiEndpoint+"traerGrupal")
  }

  agregarGrupal(equipo:number, comentario:string, id_user:number){
    return this.http.post(environment.apiEndpoint+"agregarGrupal",{equipo,comentario,id_user})
  }
}
