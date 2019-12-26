import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxMaskModule } from 'ngx-mask';
import { IConfig } from 'ngx-mask';
// Importing Forms and HTTP Module
import { FormsModule,
FormControl,
ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing }        from './app.routing';
import 'rxjs/add/operator/map';
//import 'rxjs';
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
  MatToolbarModule,  
  MatTabsModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MdRadioModule, MdListModule,


} from '@angular/material';
//import { MatBadgeModule } from '@angular/material/badge';
import { NgMasonryGridModule } from 'ng-masonry-grid';
//import { MyDatePickerModule } from 'mydatepicker';
import { DatepickerModule } from '@novalinc/datepicker';
import { ChartsModule } from 'ng2-charts'
import { CapitalizePipe2, StringToDatePipe } from './capitalize.pipe';
import { HttpClientModule } from '@angular/common/http';
import { Md2Module} from 'md2';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { APP_CONFIG } from './app.config';
import { AppConfig } from './app.interface';

import {
  StatsComponent, StatsdlComponent, PagarComponent, DetallesInstallerComponent, DetallesotherInstallerComponent, cargarPagocomponent, OtrosPagosComponent, cargarOpagocomponent,Pagar_comisones_Component, factura_comision, pagar_comisionescomponent } from './stats/stats.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import {
  ClientsComponent,
  AddclientsComponent,
  DataTablePipe,
  CapitalizePipe,
  ClientesStatus,
  DeleteCliente,
  ClientOverview,
  AddAdic,
  AddPagoBalance,
  AddPagoBalanceDl,
  GenFactura,
  AnularFactura,
  GenFactura_blanco,
  fac_programadas,
  Anularprog_fac,
  Anularprog_cort,
  program_corte,
  cortes_programados,
} from './clients/clients.component';
import { PClientsComponent, AddPclientsComponent, AddFactComponent, PClientesStatus, DeletePCliente, ShowPreComponent, ConfirmCliente, ConfirmCliente2 } from './pclients/clients.component';
import { ServiciosComponent, AddservicesComponent, DeleteserviceDialog, AddPendingComponent, UpdateserviceComponent } from './servicios/servicios.component';
import { ServidoresComponent, AddServidoresComponent, DeleteRouterDialog } from './servidores/servidores.component';
import { CeldasComponent, AddceldasComponent } from './celdas/celdas.component';
import { PlanesComponent, AddplanesComponent, DeletePlanDialog, UpdatePlanPricesDialog } from './planes/planes.component';
import { EquiposComponent, AddequipoComponent } from './equipos/equipos.component';
import { LoginComponent } from './login/login.component';
import { ApsComponent, AddapsComponent, DeleteApsDialog } from './aps/aps.component';
import {
  SoporteComponent,
  DeleteticketDialog,
  Deleteotherinstall,
  DeleteInstallDialog,
  AddticketComponent,
  EditticketComponent,
  Ipasignadascomponent,
  tickets_cerrados_user,
  tickets_cerrados_por_usuarios
} from './soporte/soporte.component';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService, PingService, VersionCheckService } from './_services/index';
import { User } from './_models/index';
import { UsuariosComponent, DetallesUsuarios, AdduserComponent, DeleteuserDialog, ResetCounter } from './usuarios/usuarios.component';
import { PotencialesComponent } from './potenciales/potenciales.component';
import { MyDatePickerModule } from 'mydatepicker';
import { NotifyComponent, sms_morosoComponent } from './notify/notify.component';
import { PreComponent, DialogOverviewExampleDialog } from './presupuestos/pre.component';
import { FacturacionComponent, FacturacionPagos, deletepagoDialog, deleteProductDialog, AprovPagos, AprovPagosin, DeclinePagoDialog, DeclinePagoDialog2, ConfirmPagoDialog , ConfirmPagoDialog2, UpdatePlanPricesFacDialog, balance_bs, balance_dl, Editar_ref_bs, Editar_ref_dl} from './facturacion/facturacion.component';
import { FactibilidadesComponent, FactibilidadesDetComponent } from './factibilidades/factibilidades.component';
import { InstalacionesComponent, AddInstallComponent, EditInstallComponent } from './instalaciones/instalaciones.component';
import { ZonaComponent, AddZonaComponent } from './zona/zona.component';
import { InventariosComponent, AddEquipoComponent, SelectEquipoComponent, EditEquipoComponent, TransfEquiposComponent, ShowEquipoComponent, SelectTipoComponent,EquiposasigndosComponent } from './inventarios/inventarios.component';
import { CustomFormsModule } from 'ngx-custom-validators';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};


@NgModule({
  declarations: [

    AppComponent,
    SidenavComponent,
    UpdatePlanPricesFacDialog,
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
    Deleteotherinstall,
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
    StatsdlComponent,
    PagarComponent,
    ResetCounter,
    DetallesInstallerComponent,
    cargarPagocomponent,
    PreComponent,
    DialogOverviewExampleDialog,
    AddPagoBalance,
    AddPagoBalanceDl,
    ZonaComponent,
    InventariosComponent,
    AddZonaComponent,
    AddEquipoComponent,
    ShowPreComponent,
    SelectEquipoComponent,
    ConfirmCliente,
    ConfirmCliente2,
    EditEquipoComponent,
    TransfEquiposComponent,
    ShowEquipoComponent,
    GenFactura,
    SelectTipoComponent,
    AnularFactura,
    AddAdic,
    deletepagoDialog,
    deleteProductDialog,
    AprovPagos,
    AprovPagosin,
    DeclinePagoDialog,
    DeclinePagoDialog2,
    ConfirmPagoDialog,
    ConfirmPagoDialog2,
    OtrosPagosComponent,
    DetallesotherInstallerComponent,
    cargarOpagocomponent,
    DeleteserviceDialog,
    EquiposasigndosComponent,
    Ipasignadascomponent,
    UpdateserviceComponent,
    tickets_cerrados_user,
    tickets_cerrados_por_usuarios,
    Pagar_comisones_Component,
    factura_comision,
    pagar_comisionescomponent,
    balance_bs,
    balance_dl,
    Editar_ref_bs,
    Editar_ref_dl,
    GenFactura_blanco,
    sms_morosoComponent,
    fac_programadas,
    Anularprog_fac,
    Anularprog_cort,
    program_corte,
    cortes_programados
    //CeldasPipe,
    //MyFilterPipe,
    //DatePipe,


  ],
  imports: [
    CustomFormsModule,
    FormsModule,
  MatToolbarModule,
    NgxMaskModule.forRoot(options),
  MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
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
    MdRadioModule,
    DatepickerModule,
    MyDatePickerModule,
    MdListModule,


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
