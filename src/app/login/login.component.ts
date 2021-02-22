import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 // fondos: any = [{id:1,fondo:"../../assets/images/fondo4.jpg"},{id:2,fondo:"../../assets/images/fondo5.jpg"},{id:3,fondo:"../../assets/images/fondo1.jpg"}]
  fondos: any = [{id:1,fondo:"../../assets/images/fondoFinal.jpeg"}]
  numero = Math.round(Math.random() * (3 - 1) + 1);
  fondoSeleccionado: string
  model: any = {};
  loading = false;
  returnUrl: string;
  log : FormGroup;
  error = false
  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService,
    private fb: FormBuilder) {
      this.log = this.fb.group({
        username:['', [Validators.required]],
        password:['',[Validators.required]]

      })

     }

  ngOnInit() {
    this.fondos.forEach(element => {
      if (element.id == 1 ) {
          this.fondoSeleccionado = element.fondo
      }
    });

    console.log(this.fondoSeleccionado)
      // reset login status
      this.authenticationService.logout();

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
      this.loading = true;
      this.error = false;
      var logi = this.log.value;
      if(logi.username != "" && logi.password != ""){
        this.authenticationService.login(logi.username, logi.password)
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
            this.error=true;
            console.log("fallo la autenticacion")
          });

      }
  }
}
