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
  MdSidenavContainer,
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
  MdChipsModule,
  MdTooltipModule,
  MdTabsModule,
  MdCheckboxModule,
  MdExpansionModule,
  MdRadioModule,
} from '@angular/material';
import { NgMasonryGridModule } from 'ng-masonry-grid';
import { MyDatePickerModule } from 'mydatepicker';

import { StatsComponent, PagarComponent, DetallesInstallerComponent, cargarPagocomponent } from './stats/stats.component';

import { ChartsModule } from 'ng2-charts'
import { SidenavComponent } from './sidenav/sidenav.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { ClientsComponent, AddclientsComponent, DataTablePipe, CapitalizePipe, ClientesStatus, DeleteCliente, ClientOverview, AddPagoBalance, GenFactura, AnularFactura } from './clients/clients.component';
import { PClientsComponent, AddPclientsComponent, AddFactComponent, PClientesStatus, DeletePCliente, ShowPreComponent, ConfirmCliente } from './pclients/clients.component';
import { CapitalizePipe2, StringToDatePipe } from './capitalize.pipe';
import { HttpClientModule } from '@angular/common/http';
import { ServiciosComponent, AddservicesComponent, AddPendingComponent} from './servicios/servicios.component';
import { ServidoresComponent, AddServidoresComponent, DeleteRouterDialog } from './servidores/servidores.component';
import { CeldasComponent, AddceldasComponent } from './celdas/celdas.component';
import { PlanesComponent, AddplanesComponent, DeletePlanDialog, UpdatePlanPricesDialog } from './planes/planes.component';
import { EquiposComponent, AddequipoComponent } from './equipos/equipos.component';
import { LoginComponent } from './login/login.component';
import { ApsComponent, AddapsComponent, DeleteApsDialog } from './aps/aps.component';
import { Md2Module} from 'md2';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { SoporteComponent, DeleteticketDialog, DeleteInstallDialog, AddticketComponent, EditticketComponent } from './soporte/soporte.component';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService, PingService, VersionCheckService } from './_services/index';
import { User } from './_models/index';
import { UsuariosComponent, DetallesUsuarios, AdduserComponent, DeleteuserDialog, ResetCounter } from './usuarios/usuarios.component';
import { PotencialesComponent } from './potenciales/potenciales.component';
//import { MyDatePickerModule } from 'mydatepicker';
import { NotifyComponent } from './notify/notify.component';
import { PreComponent, DialogOverviewExampleDialog } from './presupuestos/pre.component';
import { FacturacionComponent, FacturacionPagos, deletepagoDialog, deleteProductDialog } from './facturacion/facturacion.component';
import { FactibilidadesComponent, FactibilidadesDetComponent } from './factibilidades/factibilidades.component';
import { APP_CONFIG } from './app.config';
import { AppConfig } from './app.interface';
import { InstalacionesComponent, AddInstallComponent, EditInstallComponent } from './instalaciones/instalaciones.component';
import { ZonaComponent, AddZonaComponent } from './zona/zona.component';
import { InventariosComponent, AddEquipoComponent, SelectEquipoComponent, EditEquipoComponent, TransfEquiposComponent, ShowEquipoComponent, SelectTipoComponent } from './inventarios/inventarios.component';




@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    LayoutComponent,
    HeaderComponent,
    AddclientsComponent,
    ClientsComponent,
    ClientOverview,
    ClientesStatus,
    DeleteCliente,
    AddPclientsComponent,
    PClientsComponent,
    PClientesStatus,
    DeletePCliente,
    AddservicesComponent,
    AddPendingComponent,
    ServiciosComponent,
    AddServidoresComponent,
    ServidoresComponent,
    DeleteRouterDialog,
    AddceldasComponent,
    CeldasComponent,
    AddFactComponent,
    AddplanesComponent,
    PlanesComponent,
    DeletePlanDialog,
    AddequipoComponent,
    EquiposComponent,
    LoginComponent,
    AddapsComponent,
    ApsComponent,
    DeleteApsDialog,
    DataTablePipe,
    CapitalizePipe,
    CapitalizePipe2,
    StringToDatePipe,
    SoporteComponent,
    AdduserComponent,
    UsuariosComponent,
    DeleteuserDialog,
    AddticketComponent,
    DeleteticketDialog,
    DeleteInstallDialog,
    EditticketComponent,
    PotencialesComponent,
    NotifyComponent,
    FacturacionComponent,
    FacturacionPagos,
    FactibilidadesComponent,
    FactibilidadesDetComponent,
    InstalacionesComponent,
    AddInstallComponent,
    EditInstallComponent,
    UpdatePlanPricesDialog,
    DetallesUsuarios,
    StatsComponent,
    PagarComponent,
    ResetCounter,
    DetallesInstallerComponent,
    cargarPagocomponent,
    PreComponent,
    DialogOverviewExampleDialog,
    AddPagoBalance,
    ZonaComponent,
    InventariosComponent,
    AddZonaComponent,
    AddEquipoComponent,
    ShowPreComponent,
    SelectEquipoComponent,
    ConfirmCliente,
    EditEquipoComponent,
    TransfEquiposComponent,
    ShowEquipoComponent,
    GenFactura,
    SelectTipoComponent,
    AnularFactura,
    deletepagoDialog,
    deleteProductDialog
    //CeldasPipe,
    //MyFilterPipe,
    //DatePipe,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    routing,
    ChartsModule,
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
    MdChipsModule,
    MdTooltipModule,
    MdTabsModule,
    MdCheckboxModule,
    MdExpansionModule,
    NgMasonryGridModule,
    MyDatePickerModule,
    MdRadioModule,
    //MyDatePickerModule,

  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    User,
    PingService,
    VersionCheckService,
    { provide: APP_CONFIG, useValue: AppConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
