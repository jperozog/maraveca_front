import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from '../../../_guards/index';
import { ZonasAdministrativasService } from '../../../services/administrativo/zonas-administrativas.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.css']
})
export class ZonasComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  p: number = 1;
  e: number = 1;
  zona: number
  zonas: any = [];
  visualizar: boolean = false
  sedeSeleccionada: number = 0
  movimientos: any = []
  movimientosUser: any = []
  cantidadEfectivo: number
  cantidadTransferencia: number
  cantidadZelle: number
  cantidadEfectivoUser: number = 0
  cantidadTransferenciaUser: number
  cantidadZelleUser: number = 0
  users: any = []
  user: string;
  id_user: number
  id_user_actual: number
  ultimoCierre: string
  responsable: string

  constructor(private zonasAdminstrativa: ZonasAdministrativasService, private router: Router, private modalService: BsModalService, private usuario: AuthGuard) { }

  ngOnInit() {
    this.id_user_actual = this.usuario.currentUser.id_user
    this.zonasAdminstrativa.traerZonas().subscribe(res => this.zonas = res, err => console.log(err))
    this.zonasAdminstrativa.traerUltimoCierre()
      .subscribe(
        res =>
        {
         console.log(res)
         this.ultimoCierre = res[0].cierre_fecha
         this.responsable = res[0].nombre_user+" "+res[0].apellido_user
        },
        err => console.log(err))
  }

  zonaSeleccionada(id: number) {
    console.log(id);
    this.visualizar = true
  }

  verDetalles(e) {
    this.zona = e
    this.zonasAdminstrativa.traerDatosZona(e)
      .subscribe(
        res => {
          console.log(res),
            this.movimientos = res
        },
        err => console.log(err)
      )

    this.zonasAdminstrativa.traerCantidadEfectivo(e)
      .subscribe(
        res => {
          this.cantidadEfectivo = res[0].suma
        },
        err => console.log(err)
      )
    this.zonasAdminstrativa.traerCantidadTransferencias(e)
      .subscribe(
        res => {
          this.cantidadTransferencia = res[0].suma
        },
        err => console.log(err)
      )

    this.zonasAdminstrativa.traerCantidadZelle(e)
      .subscribe(
        res => {
          if (res[0].suma == null) {
            this.cantidadZelle = 0
          } else {
            this.cantidadZelle = res[0].suma
          }
        },
        err => console.log(err)
      )

    this.zonasAdminstrativa.traerUsers(e)
      .subscribe(
        res => {
          console.log(res),
            this.users = res
        },
        err => console.log(err)
      )
  }

  onSearchMovimiento(e: string): void {
    console.log(e)
    this.zonasAdminstrativa.busqueda(e, this.zona).subscribe(res => this.movimientos = res, err => console.log(err))
  }

  userSeleccionado(template: TemplateRef<any>, id: number) {
    this.id_user = id
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg' }));


    this.zonasAdminstrativa.traerDatosUser(id)
      .subscribe(
        res => {
          console.log(res),
            this.movimientosUser = res
          this.user = res[0].nombre_user + " " + res[0].apellido_user
        },
        err => console.log(err)
      )

    this.zonasAdminstrativa.traerCantidadEfectivoUser(id)
      .subscribe(
        res => {
          this.cantidadEfectivoUser = res[0].suma
        },
        err => console.log(err)
      )
    this.zonasAdminstrativa.traerCantidadTransferenciasUser(id)
      .subscribe(
        res => {
          this.cantidadTransferenciaUser = res[0].suma
        },
        err => console.log(err)
      )

    this.zonasAdminstrativa.traerCantidadZelleUser(id)
      .subscribe(
        res => {
          if (res[0].suma == null) {
            this.cantidadZelleUser = 0
          } else {
            this.cantidadZelleUser = res[0].suma
          }
        },
        err => console.log(err)
      )
  }

  openModal2(template2: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template2);
    this.modalRef.hide()
  }

  confirmar() {

    this.zonasAdminstrativa.hacerCierreCaja(this.movimientosUser).subscribe(res => this.verDetalles(this.zona), err => console.log(err))
    this.modalRef2.hide()
    this, this.verDetalles(this.zona);
  }

  irA() {
    this.router.navigate(['/CierresPendientes'])
  }

}
