import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../../_guards/index';
import { HistorialUsuariosService } from '../../../services/usuarios/historial-usuarios.service';

@Component({
  selector: 'app-historial-usuarios',
  templateUrl: './historial-usuarios.component.html',
  styleUrls: ['./historial-usuarios.component.css']
})
export class HistorialUsuariosComponent implements OnInit {

  usuarios: any = []
  usuarioSeleccionado: any = []
  historico: any = []
  historicoCliente: any = []
  visualizar:boolean = false
  e:number = 1
  p:number = 1
  constructor(private historialService: HistorialUsuariosService) { }

  ngOnInit() {
    this.traerUsuario()
  }

  traerUsuario() {
    this.historialService.traerUsuarios().subscribe(res => this.usuarios = res, err => console.log(err))
  }

  traerHistorial() {
    this.historialService.traerHistorialUsuario(this.usuarioSeleccionado)
      .subscribe(
        res => {
          console.log(res),
            this.historico = res["historico"],
            this.historicoCliente = res["historicoCliente"]
            this.visualizar = true
        },
        err => console.log(err))
  }

}
