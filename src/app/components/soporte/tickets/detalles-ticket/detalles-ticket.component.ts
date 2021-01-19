import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { AuthGuard } from '../../../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TicketsService } from '../../../../services/soporte/tickets.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';
import { tick } from '@angular/core/testing';
import { arrayLength } from 'ngx-custom-validators/src/app/array-length/validator';
import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { CeldasService } from '../../../../services/celdas/celdas.service';
import { MangaEmpalmeService } from '../../../../services/manga-empalme/manga-empalme.service';

@Component({
  selector: 'app-detalles-ticket',
  templateUrl: './detalles-ticket.component.html',
  styleUrls: ['./detalles-ticket.component.css']
})
export class DetallesTicketComponent implements OnInit {
  id: number = 0
  ticket: any = []
  averia: any = []
  historial: any = []
  comentarioAgg: string = ""
  tipoComentario: number = 0
  tipoActivo: number = 0

  constructor(private router: Router,
    private activateRoute: ActivatedRoute,
    private ticketService: TicketsService,
    private usuario: AuthGuard) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.params.id
    this.tipoActivo = this.activateRoute.snapshot.params.tipo
    this.traerDatos()
  }

  traerDatos() {

    if (this.tipoActivo == 1) {
      this.ticketService.traerDetallesTicket(this.id).subscribe(res => { console.log(res), this.ticket = res, this.historial = res["historial"] }, err => console.log(err))
    }
    if (this.tipoActivo == 2) {
      this.ticketService.traerDetallesAveria(this.id).subscribe(res => { console.log(res), this.averia = res, this.historial = res["historial"] }, err => console.log(err))
    }
    if (this.tipoActivo == 3) {
      this.ticketService.traerDetallesReposicion(this.id).subscribe(res => { console.log(res), this.averia = res, this.historial = res["historial"] }, err => console.log(err))
    }

  }

  agregarComentario() {
    if (this.tipoActivo == 1) {
      this.ticketService.agregarComentarioTicket(this.id, this.tipoComentario, this.comentarioAgg, this.usuario.currentUser.id_user)
        .subscribe(
          res => this.ngOnInit(),
          err => console.log(err)
        )
      this.comentarioAgg = ""
      this.tipoComentario = 0
    } else {
      this.ticketService.agregarComentarioAveria(this.id, this.tipoComentario, this.comentarioAgg, this.usuario.currentUser.id_user)
        .subscribe(
          res => this.ngOnInit(),
          err => console.log(err)
        )
      this.comentarioAgg = ""
      this.tipoComentario = 0
    }

  }

  CerrarAveria() {
    this.tipoComentario = 1
  }

  cerrarReposicion(tipo: number) {
    this.ticketService.cerrarReposicion(this.averia, tipo, this.usuario.currentUser.id_user).subscribe(res => { console.log(res), this.ngOnInit() }, err => console.log(err))
  }

  atras() {
    this.router.navigate(['/Tickets']);
  }

}
