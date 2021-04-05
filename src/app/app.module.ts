import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import localeEs from '@angular/common/locales/es';
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
  MatDialogModule,
  MatTabsModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MdRadioModule, MdListModule,


} from '@angular/material';
//import { MatBadgeModule } from '@angular/material/badge';
//import { NgMasonryGridModule } from 'ng-masonry-grid';
//import { MyDatePickerModule } from 'mydatepicker';
import { DatepickerModule } from '@novalinc/datepicker';
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
  tickets_cerrados_por_usuarios,
  Edit_InstallComponent,
  confirm_anular_install,
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
import { ConfigAdminComponent, Facturacionconfig, prod_pagos_fac_component, EditFacProdComponent, EditFacPagComponent, eliminar_prod_pag, edit_conf_adm, edit_balances, EditPagoBs, EditPagoDl,confirm_edit_bal_pagos, confirm_anular_bal_pagos } from './config-admin/config-admin.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
import { ChartsModule } from 'ng2-charts';
import {ModalModule} from '../../node_modules/ngx-bootstrap/modal'
import {BsDatepickerModule } from '../../node_modules/ngx-bootstrap/datepicker'


import { ArticulosComponent } from './components/Inventario/articulos/articulos.component';
import { Zonas2Component } from './components/Inventario/zonas2/zonas2.component';
import { DetallesArticulosComponent } from './components/Inventario/detalles-articulos/detalles-articulos.component';
import {Zonas2Service} from './services/Inventario/zonas2.service';
import {ArticuloService} from './services/Inventario/articulo.service';
import {DetallesArticulosService} from './services/Inventario/detalles-articulos.service';
import {ListaTransferenciasService} from './services/Inventario/lista-transferencias.service'
import { FiltradoInvetnarioPipe } from './pipes/filtrado-invetnario.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { TransferenciaEquiposComponent } from './components/Inventario/transferencia-equipos/transferencia-equipos.component';
import { ListaTransferenciasComponent } from './components/Inventario/lista-transferencias/lista-transferencias.component';
import { OrdenTrasladoComponent } from './components/Inventario/orden-traslado/orden-traslado.component';
import {OrdenTrasladoService} from './services/Inventario/orden-traslado.service';
import {IntalacionesService} from './services/Inventario/intalaciones.service';
import { VentaEquiposComponent } from './components/Inventario/venta-equipos/venta-equipos.component';
import {VentasEquiposService} from './services/Inventario/ventas-equipos.service';
import { PagosComponent } from './components/administracion/pagos/pagos.component';
import { ZonasComponent } from './components/administracion/zonas/zonas.component';
import {CargarPagosService} from './services/administrativo/cargar-pagos.service';
import {ZonasAdministrativasService} from './services/administrativo/zonas-administrativas.service';
import {PagoComisionesService} from './services/pago-comisiones/pago-comisiones.service';
import { TicketsComponent } from './components/soporte/tickets/tickets.component';
import { Instalaciones2Component } from './components/soporte/instalaciones2/instalaciones2.component';
import {TicketsService} from './services/soporte/tickets.service'
import {InstalacionesService} from './services/soporte/instalaciones.service';
import { ProcesoComponent } from './components/procesos/proceso/proceso.component'
import {ProcesosService} from './services/procesos/procesos.service';
import {InfraestructuraComponent} from './components/Inventario/infraestructura/infraestructura.component'
import {InfraestructuraService} from './services/Inventario/infraestructura.service'
import {FacPromoService} from './services/facturacion/fac-promo.service';
import { AlarmasComponent } from './components/alarmas/alarmas.component';
import {AlarmasService} from './services/alarmas/alarmas.service';
import {DashboardService} from './services/dashboard/dashboard.service';
import {FactibilidadesService} from './services/factibilidades/factibilidades.service';
import {ClienteService} from './services/cliente/cliente.service';
import { ExcelService } from './services/excel/excel.service';
import { PdfComisionesComponent } from './components/comisiones/pdf-comisiones/pdf-comisiones.component';
import { FactibilidadComponent } from './components/factibilidades/factibilidad/factibilidad.component';
import { ZonasClientesComponent } from './components/clientes/zonas-clientes/zonas-clientes.component';
import {PclienteService} from './services/pcliente/pcliente.service';
import {ServiciosService} from './services/servicios/servicios.service';
import {FacturacionService} from './services/facturacion/facturacion.service';
import {SoporteTrasladoComponent} from './components/Inventario/soporte-traslado/soporte-traslado.component';
import { PdfTrasladoComponent } from './components/Inventario/pdf-traslado/pdf-traslado.component';
import {EquiposService} from './services/equipos/equipos.service';
import { Equipos2Component } from './components/equipos/equipos2/equipos2.component'
import {Celdas2Component} from './components/celdas/celdas/celdas.component';
import {CeldasService} from './services/celdas/celdas.service';
import {Aps2Component} from './components/aps/aps2/aps2.component';
import {Servidores2Component} from './components/servidores/servidores2/servidores2.component';
import {ApsService} from './services/aps/aps.service';
import {ServidoresService} from './services/servidores/servidores.service';
import {BuscadorService} from './services/Inventario/buscador.service';
import {NotaCreditoService} from './services/facturacion/nota-credito.service';
import { PromocionesComponent } from './components/promociones/promociones/promociones.component';
import {PromocionesService} from './services/promociones/promociones.service';
import { DetallesInstalacionComponent } from './components/soporte/instalaciones2/detalles-instalacion/detalles-instalacion.component';
import {Servicios2Component} from './components/servicios/servicios/servicios.component';
import { ComisionesVendedoresComponent } from './components/comisiones-vendedores/comisiones-vendedores.component';
import { ComisionesInstaladoresComponent } from './components/comisiones-instaladores/comisiones-instaladores.component';
import {ComisionesInstaladoresService} from './services/comisiones-instaladores/comisiones-instaladores.service';
import {ComisionesVendedoresService} from './services/comisiones-vendedores/comisiones-vendedores.service';
import { HistorialUsuariosComponent } from './components/usuarios/historial-usuarios/historial-usuarios.component';
import {HistorialUsuariosService} from './services/usuarios/historial-usuarios.service';
import { ListaIpsComponent } from './components/soporte/tickets/lista-ips/lista-ips.component';
import { OltComponent } from './components/olts/olt.component';
import {OltService} from './services/olt/olt.service';
import { MangaEmpalmeComponent } from './components/manga-empalme/manga-empalme.component';
import {MangaEmpalmeService} from './services/manga-empalme/manga-empalme.service';
import { CajaDistribucionComponent } from './components/caja-distribucion/caja-distribucion.component';
import {CajaDistribucionService} from './services/caja-distribucion/caja-distribucion.service';
import { Articulos2Component } from './components/inventario/articulos2/articulos2.component';
import { VehiculosComponent } from './components/Inventario/vehiculos/vehiculos.component';
import { EquiposGrupalesComponent } from './components/Inventario/equipos-grupales/equipos-grupales.component';
import { CuentasIncombrablesComponent } from './components/cuentas-incombrables/cuentas-incombrables.component';
import {CuentasIncobrablesService} from './services/cuentas-incobrables/cuentas-incobrables.service';
import {DescuentosService} from './services/descuentos/descuentos.service';
import {NotificacionesService} from './services/notificaciones/notificaciones.service';
import { DetallesTicketComponent } from './components/soporte/tickets/detalles-ticket/detalles-ticket.component';
import {ConfigAdminService} from './services/config-admin/config-admin.service';
import { DetallesMigracionComponent } from './components/soporte/instalaciones2/detalles-migracion/detalles-migracion.component';
import { DetallesMudanzaComponent } from './components/soporte/instalaciones2/detalles-mudanza/detalles-mudanza.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { VentasComponent } from './components/ventas/ventas.component';
import {VentasService} from './services/ventas/ventas.service'
import { FacturacionNComponent } from './facturacion-n/facturacion-n.component';
import {PresupuestosService} from './services/presupuestos/presupuestos.service'

//registerLocaleData(localeEs);


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
    cortes_programados,
    ConfigAdminComponent,
    Facturacionconfig,
    prod_pagos_fac_component,
    EditFacProdComponent,
    EditFacPagComponent,
    eliminar_prod_pag,
    edit_conf_adm,
    Edit_InstallComponent,
    edit_balances,
    EditPagoBs,
    confirm_edit_bal_pagos,
    confirm_anular_bal_pagos,
    EditPagoDl,
    confirm_anular_install,
    confirm_edit_bal_pagos,
    //CeldasPipe,
    //MyFilterPipe,
    //DatePipe,

    ArticulosComponent,
    Zonas2Component,
    DetallesArticulosComponent,
    FiltradoInvetnarioPipe,
    TransferenciaEquiposComponent,
    ListaTransferenciasComponent,
    OrdenTrasladoComponent,
    VentaEquiposComponent,
    PagosComponent,
    ZonasComponent,
    TicketsComponent,
    InstalacionesComponent,
    Instalaciones2Component,
    ProcesoComponent,
    InfraestructuraComponent,
    AlarmasComponent,
    PdfComisionesComponent,
    FactibilidadComponent,
    ZonasClientesComponent,
    SoporteTrasladoComponent,
    PdfTrasladoComponent,
    Equipos2Component,
    Celdas2Component,
    Aps2Component,
    Servidores2Component,
    PromocionesComponent,
    DetallesInstalacionComponent,
    Servicios2Component,
    ComisionesVendedoresComponent,
    ComisionesInstaladoresComponent,
    HistorialUsuariosComponent,
    ListaIpsComponent,
    OltComponent,
    MangaEmpalmeComponent,
    CajaDistribucionComponent,
    Articulos2Component,
    VehiculosComponent,
    EquiposGrupalesComponent,
    CuentasIncombrablesComponent,
    DetallesTicketComponent,
    DetallesMigracionComponent,
    DetallesMudanzaComponent,
    ClientesComponent,
    VentasComponent,
    FacturacionNComponent,
  ],
  imports: [
    CustomFormsModule,
    FormsModule,
  MatToolbarModule,
    NgxMaskModule.forRoot(options),
    MatDialogModule,
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
    //NgMasonryGridModule,
    MdRadioModule,
    DatepickerModule,
    MyDatePickerModule,
    MdListModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot()

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
    Zonas2Service,
    DetallesArticulosService,
    ArticuloService,
    ListaTransferenciasService,
    OrdenTrasladoService,
    IntalacionesService,
    VentasEquiposService,
    CargarPagosService,
    ZonasAdministrativasService,
    PagoComisionesService,
    TicketsService,
    InstalacionesService,
    ProcesosService,
    InfraestructuraService,
    FacPromoService,
    AlarmasService,
    DashboardService,
    FactibilidadesService,
    ClienteService,
    ExcelService,
    PclienteService,
    ServiciosService,
    FacturacionService,
    EquiposService,
    CeldasService,
    ApsService,
    ServidoresService,
    BuscadorService,
    NotaCreditoService,
    PromocionesService,
    ComisionesInstaladoresService,
    ComisionesVendedoresService,
    HistorialUsuariosService,
    OltService,
    MangaEmpalmeService,
    CajaDistribucionService,
    CuentasIncobrablesService,
    DescuentosService,
    NotificacionesService,
    ConfigAdminService,
    VentasService,
    PresupuestosService,
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
