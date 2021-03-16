import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthGuard } from '../../_guards/index';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../services/cliente/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: any = []
  pendientes: any = []
  clientes2: any = []
  pendientes2: any = []
  FiltroActivo: number = 1
  p: number = 1
  e:number = 1
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };


  nombres: string = ""
  apellidos: string = ""
  kni: string = ""
  dni: string = ""
  social: string = null
  fecha: any
  numero: string = ""
  numero2: string = ""
  email: string = ""
  estados: any = []
  estado: number = 0
  municipios: any = []
  municipio: number = 0
  parroquias: any = []
  parroquia: number = 0
  direccion: string = ""
  isChecked: boolean = false
  constructor(
    private modalService: BsModalService,
    //public snackBar: MdSnackBar,
    private router: Router,
    public usuario: AuthGuard,
    public cliente: ClienteService) { }

  ngOnInit() {
    this.traerClientes();
    this.traerEstados();
  }

  traerClientes() {
    const id = this.usuario.currentUser.id_user;

    this.cliente.traerClientes(id)
      .subscribe(
        res => {
          console.log(res),
            this.clientes = res["clientes"],
            this.pendientes = res["pendientes"]
            this.clientes2 = res["clientes"],
            this.pendientes2 = res["pendientes"]

            this.clientes.forEach(e => {
                e.direccion = e.direccion.substring(0, 50)+"...";
            });
            this.pendientes.forEach(e => {
              e.direccion = e.direccion.substring(0, 50)+"...";
          });
        }
        ,
        err => console.log(err))
  }

  irZonas() {
    this.router.navigate(['/zonasClientes'])
  }

  actualizarLista(){
    this.ngOnInit()
  }

  aggCliente(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  traerEstados() {
    this.cliente.traerEstados().subscribe(res => this.estados = res, err => console.log(err))
  }

  Municipios() {
    this.cliente.traerMunicipios(this.estado).subscribe(res => this.municipios = res, err => console.log(err))
  }
  Parroquias() {
    this.cliente.traerParroquias(this.municipio).subscribe(res => this.parroquias = res, err => console.log(err))
  }

  verdatos() {

    this.cliente.guardarCliente(this.nombres, this.apellidos, this.kni, this.dni, this.fecha.epoc, this.numero, this.email, this.estado, this.municipio, this.parroquia, this.social, this.direccion, this.isChecked, this.usuario.currentUser.id_user)
      .subscribe(
        res => this.ocultarModal(),
        err => console.log(err)
      )
  }

  ocultarModal() {
    this.modalRef.hide()
    this.nombres = ""
    this.apellidos = ""
    this.kni = ""
    this.dni = ""
    this.fecha = " "
    this.numero = ""
    this.email = ""
    this.estado = 0
    this.municipio = 0
    this.parroquia = 0
    this.social = null
    this.direccion = ""
    this.isChecked = false
  }

  
  buscarClientes(e) {
    const clientesNuevos = []
    if (e == "") {
      this.traerClientes()
    } else {
      this.clientes.filter((el) => {
        if (el.social === null || el.social === "null") {
          if (el["nombre"].toUpperCase().includes(e.toUpperCase()) || el["apellido"].toUpperCase().includes(e.toUpperCase()) || el["dni"].toUpperCase().includes(e)) {
            clientesNuevos.push(el)
          }
        } else {
          if (el["social"].toUpperCase().includes(e.toUpperCase())) {
            clientesNuevos.push(el)
          }
        }
      });
      this.clientes = clientesNuevos;
    }

    const pendientesNuevos = []
    if (e == "") {
      this.traerClientes()
    } else {
      const result = this.pendientes.filter((el) => {
        if (el.social === null || el.social === "null") {
          if (el["nombre"].toUpperCase().includes(e.toUpperCase()) || el["apellido"].toUpperCase().includes(e.toUpperCase())) {
            pendientesNuevos.push(el)
          }
        } else {
          if (el["social"].toUpperCase().includes(e.toUpperCase()) ) {
            pendientesNuevos.push(el)
          }
        }
      });
      this.pendientes = pendientesNuevos;
    }

  }




  buscarServicioBackSpace(e) {
    const algo = this.clientes2
    const clientesNuevos = []
    const result = algo.filter((el) => {
      if (el.social === null || el.social === "null") {
        if (el["nombre"].toUpperCase().includes(e.toUpperCase()) || el["apellido"].toUpperCase().includes(e.toUpperCase()) ) {
          clientesNuevos.push(el)
        }
      } else {
        if (el["social"].toUpperCase().includes(e.toUpperCase())) {
          clientesNuevos.push(el)
        }
      }
    });
    this.clientes = clientesNuevos;


    const algo2 = this.pendientes2
    const pendientesNuevos = []
    const result2 = algo2.filter((el) => {
      if (el.social === null || el.social === "null") {
        if (el["nombre"].toUpperCase().includes(e.toUpperCase()) || el["apellido"].toUpperCase().includes(e.toUpperCase())) {
          pendientesNuevos.push(el)
        }
      } else {
        if (el.social.toUpperCase().includes(e.toUpperCase())) {
          pendientesNuevos.push(el)
        }
      }
    });
    this.pendientes2 = pendientesNuevos;


  }


}
