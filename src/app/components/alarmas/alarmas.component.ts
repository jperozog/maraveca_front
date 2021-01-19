import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../../_guards/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AlarmasService} from '../../services/alarmas/alarmas.service'

@Component({
  selector: 'app-alarmas',
  templateUrl: './alarmas.component.html',
  styleUrls: ['./alarmas.component.css']
})
export class AlarmasComponent implements OnInit {
  e:number = 1
  mks: any = []
  tipoSeleccionado:  number = 0
  equipoSeleccionado: string = ''
  Comentario:string
  alarmas:any = []
  constructor(private usuario:AuthGuard,private alarmaService:AlarmasService) { }

  ngOnInit() {
    this.traerDataAlarmas();
  }

  traerDataAlarmas(){
    this.alarmaService.traerAlarmas().subscribe(res=>this.alarmas = res,err=>console.log(err))
  }

  traerData(e){
    console.log(e)
    if(e == 1){
      this.equipoSeleccionado = ''
      this.alarmaService.taerDatosMk()
      .subscribe(
        res=>this.mks = res,
        err=>console.log(err))
    }
    if(e == 2){
      this.equipoSeleccionado = ''
      this.alarmaService.taerDatosCelda()
      .subscribe(
        res=>this.mks = res,
        err=>console.log(err)
      )
    }
    if(e == 3){
      this.equipoSeleccionado = ''
      this.alarmaService.taerDatosAp()
      .subscribe(
        res=>this.mks = res,
        err=>console.log(err)
      )
    }
  }

  guardarData(){
    this.alarmaService.guardarData(this.tipoSeleccionado,this.equipoSeleccionado,this.Comentario,this.usuario.currentUser.id_user)
    .subscribe(
      res=>
      {
        console.log(res),
        this.traerDataAlarmas(),
        this.tipoSeleccionado = 0,
        this.equipoSeleccionado = '',
        this.Comentario = ''
      },
      err=>console.log(err)    
      ) 
  }
  cambiarStatusP(id){
   this.alarmaService.cambiarStatusP(id).subscribe(res=>{console.log(res), this.traerDataAlarmas()},err=>console.log(err))
  }

  cambiarStatusN(id){
    this.alarmaService.cambiarStatusN(id).subscribe(res=>{console.log(res),this.traerDataAlarmas()},err=>console.log(err))
   }



}
