import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
// Importing Forms and HTTP Module
import { FormsModule,
FormControl,
ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing }        from './app.routing';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
// importing @angular/material and @angular/animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdCardModule,
  MdMenuModule,
  MdToolbarModule,
  MdIconModule,
  MdSidenavModule,
  MdTableModule,
  MdInputModule,
  MdSelectModule,
  MdAutocompleteModule,
  MdDialog,
  MatTableModule,
  MdDialogModule,
  MdSnackBarModule,
  MdDatepickerModule,
  MdNativeDateModule,
} from '@angular/material';



import { SidenavComponent } from './sidenav/sidenav.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { ClientsComponent, AddclientsComponent, DataTablePipe, CapitalizePipe } from './clients/clients.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiciosComponent, AddservicesComponent} from './servicios/servicios.component';
import { ServidoresComponent, AddServidoresComponent, DeleteRouterDialog } from './servidores/servidores.component';
import { CeldasComponent, AddceldasComponent } from './celdas/celdas.component';
import { PlanesComponent, AddplanesComponent } from './planes/planes.component';
import { EquiposComponent, AddequipoComponent } from './equipos/equipos.component';
import { LoginComponent } from './login/login.component';
import { ApsComponent, AddapsComponent, DeleteApsDialog } from './aps/aps.component';
import {Md2Module} from 'md2';
import { DatePipe } from '@angular/common';
import { SoporteComponent } from './soporte/soporte.component';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService } from './_services/index';
import { User } from './_models/index';
import { UsuariosComponent, AdduserComponent, DeleteuserDialog, PrivuserDialog, ZoneuserDialog } from './usuarios/usuarios.component';





@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    LayoutComponent,
    HeaderComponent,
    AddclientsComponent,
    ClientsComponent,
    AddservicesComponent,
    ServiciosComponent,
    AddServidoresComponent,
    ServidoresComponent,
    DeleteRouterDialog,
    AddceldasComponent,
    CeldasComponent,
    AddplanesComponent,
    PlanesComponent,
    AddequipoComponent,
    EquiposComponent,
    LoginComponent,
    AddapsComponent,
    ApsComponent,
    DeleteApsDialog,
    DataTablePipe,
    CapitalizePipe,
    SoporteComponent,
    AdduserComponent,
    UsuariosComponent,
    DeleteuserDialog,
    PrivuserDialog,
    ZoneuserDialog,
    //CeldasPipe,
    //MyFilterPipe,
    //DatePipe,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdMenuModule,
    MdToolbarModule,
    MdIconModule,
    MdSidenavModule,
    MdTableModule,
    MdInputModule,
    MdSelectModule,
    MdAutocompleteModule,
    ReactiveFormsModule,
    MatTableModule,
    MdDialogModule,
    MdSnackBarModule,
    Md2Module,
    MdDatepickerModule,
    MdNativeDateModule,

  ],
  providers: [
    DatePipe,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    User
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
