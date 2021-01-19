import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { ClientsComponent, AddclientsComponent, DataTablePipe, CapitalizePipe, ClientesStatus, AnularFactura, DeleteCliente, ClientOverview, AddAdic, AddPagoBalance, AddPagoBalanceDl, GenFactura, GenFactura_blanco, fac_programadas,  Anularprog_fac, Anularprog_cort, program_corte,cortes_programados } from './clients/clients.component';
import { PClientsComponent, AddPclientsComponent, AddFactComponent, PClientesStatus, DeletePCliente, ShowPreComponent, ConfirmCliente, ConfirmCliente2 } from './pclients/clients.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiciosComponent, AddservicesComponent, DeleteserviceDialog, AddPendingComponent, UpdateserviceComponent } from './servicios/servicios.component';
import { ServidoresComponent, AddServidoresComponent, DeleteRouterDialog } from './servidores/servidores.component';
import { CeldasComponent, AddceldasComponent } from './celdas/celdas.component';
import { PlanesComponent, AddplanesComponent, DeletePlanDialog, UpdatePlanPricesDialog } from './planes/planes.component';
import { EquiposComponent, AddequipoComponent } from './equipos/equipos.component';
import { LoginComponent } from './login/login.component';
import { ApsComponent, AddapsComponent, DeleteApsDialog } from './aps/aps.component';
import { SoporteComponent, DeleteticketDialog, Deleteotherinstall,DeleteInstallDialog, AddticketComponent, EditticketComponent, Ipasignadascomponent, tickets_cerrados_user, tickets_cerrados_por_usuarios, Edit_InstallComponent, confirm_anular_install } from './soporte/soporte.component';
import {UsuariosComponent, DetallesUsuarios, AdduserComponent, DeleteuserDialog, ResetCounter} from './usuarios/usuarios.component';
import { NotifyComponent, sms_morosoComponent } from './notify/notify.component';
import { AuthGuard } from './_guards/index';
import { PreComponent, DialogOverviewExampleDialog } from './presupuestos/pre.component';
import { FacturacionComponent, FacturacionPagos, deletepagoDialog, deleteProductDialog, AprovPagos, AprovPagosin, DeclinePagoDialog, DeclinePagoDialog2, ConfirmPagoDialog, ConfirmPagoDialog2, UpdatePlanPricesFacDialog, balance_bs, balance_dl, Editar_ref_dl, Editar_ref_bs } from './facturacion/facturacion.component';
import { FactibilidadesComponent, FactibilidadesDetComponent } from './factibilidades/factibilidades.component';
import { InstalacionesComponent, AddInstallComponent, EditInstallComponent } from './instalaciones/instalaciones.component';
import { StatsComponent, StatsdlComponent, PagarComponent, DetallesInstallerComponent,DetallesotherInstallerComponent , cargarPagocomponent , OtrosPagosComponent, cargarOpagocomponent, Pagar_comisones_Component, factura_comision, pagar_comisionescomponent } from './stats/stats.component';
import { ZonaComponent, AddZonaComponent } from './zona/zona.component';
import { InventariosComponent, AddEquipoComponent, SelectEquipoComponent, EditEquipoComponent, TransfEquiposComponent, ShowEquipoComponent, SelectTipoComponent, EquiposasigndosComponent } from './inventarios/inventarios.component';
import { ConfigAdminComponent, Facturacionconfig, prod_pagos_fac_component, EditFacProdComponent, EditFacPagComponent, eliminar_prod_pag, edit_conf_adm, edit_balances, EditPagoBs, confirm_edit_bal_pagos, confirm_anular_bal_pagos, EditPagoDl } from './config-admin/config-admin.component';
import { ArticulosComponent } from './components/Inventario/articulos/articulos.component';
import {Zonas2Component} from './components/Inventario/zonas2/zonas2.component';
import {DetallesArticulosComponent} from './components/Inventario/detalles-articulos/detalles-articulos.component';
import {TransferenciaEquiposComponent} from './components/Inventario/transferencia-equipos/transferencia-equipos.component';
import {ListaTransferenciasComponent} from './components/Inventario/lista-transferencias/lista-transferencias.component';
import {OrdenTrasladoComponent} from './components/Inventario/orden-traslado/orden-traslado.component';
import {VentaEquiposComponent} from './components/Inventario/venta-equipos/venta-equipos.component';
import {ZonasComponent} from './components/administracion/zonas/zonas.component';
import {PagosComponent} from './components/administracion/pagos/pagos.component';
import {TicketsComponent} from './components/soporte/tickets/tickets.component';
import {Instalaciones2Component} from './components/soporte/instalaciones2/instalaciones2.component';
import {ProcesoComponent} from './components/procesos/proceso/proceso.component'
import {InfraestructuraComponent} from './components/Inventario/infraestructura/infraestructura.component';
import {AlarmasComponent} from './components/alarmas/alarmas.component';
import {PdfComisionesComponent} from './components/comisiones/pdf-comisiones/pdf-comisiones.component';
import {FactibilidadComponent} from './components/factibilidades/factibilidad/factibilidad.component';
import {ZonasClientesComponent} from './components/clientes/zonas-clientes/zonas-clientes.component';
import {SoporteTrasladoComponent} from './components/Inventario/soporte-traslado/soporte-traslado.component';
import {PdfTrasladoComponent} from './components/Inventario/pdf-traslado/pdf-traslado.component';
import {Equipos2Component} from './components/equipos/equipos2/equipos2.component';
import {Celdas2Component} from './components/celdas/celdas/celdas.component';
import {Aps2Component} from './components/aps/aps2/aps2.component';
import {Servidores2Component} from './components/servidores/servidores2/servidores2.component';
import {PromocionesComponent} from './components/promociones/promociones/promociones.component';
import {DetallesInstalacionComponent} from './components/soporte/instalaciones2/detalles-instalacion/detalles-instalacion.component';
import {Servicios2Component} from './components/servicios/servicios/servicios.component';
import {ComisionesVendedoresComponent} from './components/comisiones-vendedores/comisiones-vendedores.component';
import {ComisionesInstaladoresComponent} from './components/comisiones-instaladores/comisiones-instaladores.component';
import {HistorialUsuariosComponent} from './components/usuarios/historial-usuarios/historial-usuarios.component';
import {OltComponent} from './components/olts/olt.component'
import {MangaEmpalmeComponent} from './components/manga-empalme/manga-empalme.component'
import {CajaDistribucionComponent} from './components/caja-distribucion/caja-distribucion.component'
import {Articulos2Component} from './components/inventario/articulos2/articulos2.component';
import {VehiculosComponent} from './components/Inventario/vehiculos/vehiculos.component';
import {EquiposGrupalesComponent} from './components/Inventario/equipos-grupales/equipos-grupales.component';
import { CuentasIncombrablesComponent } from './components/cuentas-incombrables/cuentas-incombrables.component';
import {DetallesTicketComponent} from './components/soporte/tickets/detalles-ticket/detalles-ticket.component';
import {DetallesMigracionComponent} from './components/soporte/instalaciones2/detalles-migracion/detalles-migracion.component';
import {DetallesMudanzaComponent} from './components/soporte/instalaciones2/detalles-mudanza/detalles-mudanza.component';


const appRoutes: Routes = [
  {path: '', component: LayoutComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'clients', component: ClientsComponent, canActivate: [AuthGuard]},
  {path: 'zonas', component: ZonaComponent, canActivate: [AuthGuard]},
  {path: 'inventarios', component: InventariosComponent, canActivate: [AuthGuard]},
  {path: 'pclients', component: PClientsComponent, canActivate: [AuthGuard]},
  {path: 'router', component: ServidoresComponent, canActivate: [AuthGuard]},
  {path: 'equipos',component: Equipos2Component, canActivate: [AuthGuard]},
  {path: 'celdas',component: Celdas2Component, canActivate: [AuthGuard]},
  {path: 'services', component: ServiciosComponent, canActivate: [AuthGuard]},
  {path: 'aps', component: Aps2Component, canActivate: [AuthGuard]},
  {path: 'users', component: UsuariosComponent, canActivate: [AuthGuard]},
  {path: 'addticket', component: AddticketComponent, canActivate: [AuthGuard]},
  {path: 'editticket/:ticket', component: EditticketComponent, canActivate: [AuthGuard]},
  {path: 'detailInst/:inst', component: DetallesInstallerComponent, canActivate: [AuthGuard]},
  {path: 'detailworks/:inst', component: DetallesotherInstallerComponent, canActivate: [AuthGuard]},
  {path: 'soporte', component: SoporteComponent, canActivate: [AuthGuard]},
  {path: 'notify', component: NotifyComponent, canActivate: [AuthGuard]},
  {path: 'planes', component: PlanesComponent, canActivate: [AuthGuard]},
  {path: 'facturacion', component: FacturacionComponent, canActivate: [AuthGuard]},
  {path: 'factibilidades', component: FactibilidadesComponent, canActivate: [AuthGuard]},
  {path: 'instalaciones', component: InstalacionesComponent, canActivate: [AuthGuard]},
  {path: 'ClientOverview/:id_user', component: ClientOverview, canActivate: [AuthGuard]},
  {path: 'DetalleUsuario/:id_user', component: DetallesUsuarios, canActivate: [AuthGuard]},
  {path: 'EstadodeCuenta', component: StatsComponent, canActivate: [AuthGuard]},
  {path: 'EstadodeCuenta_in', component: StatsdlComponent, canActivate: [AuthGuard]},
  {path: 'pagarInstalaciones', component: PagarComponent, canActivate: [AuthGuard]},
  {path: 'pagarOtrasInstalaciones', component: OtrosPagosComponent, canActivate: [AuthGuard]}, // 18-06-19
  {path: 'PreComponent', component: PreComponent, canActivate: [AuthGuard]},
  {path: 'TransfEquipo', component: TransfEquiposComponent, canActivate: [AuthGuard]},
  {path: 'Pagos_in', component: AprovPagosin, canActivate: [AuthGuard]},
  {path: 'Pagos', component: AprovPagos, canActivate: [AuthGuard]},
  {path: 'DPagos', component: DeclinePagoDialog, canActivate: [AuthGuard]},
  {path: 'DPagos', component: DeclinePagoDialog2, canActivate: [AuthGuard]},
  {path: 'CPagos', component: ConfirmPagoDialog, canActivate: [AuthGuard]},
  {path: 'CPagos', component: ConfirmPagoDialog2, canActivate: [AuthGuard]},
  {path: 'fac_det', component: FacturacionPagos},
  {path: 'fac_anu', component: AnularFactura},
  {path: 'cargarPago', component: cargarPagocomponent},
  {path: 'cargarOpago', component: cargarOpagocomponent},
  {path: 'confirmSend', component: DialogOverviewExampleDialog},
  {path: 'deletepagoDialog', component: deletepagoDialog},
  {path: 'deleteProductDialog', component: deleteProductDialog},
  {path: 'AddPagoBalance', component: AddPagoBalance},
  {path: 'AddPgo_in', component: AddPagoBalanceDl},
  {path: 'SelectTipo', component: SelectTipoComponent},
  {path: 'AddZona', component: AddZonaComponent},
  {path: 'AddAdic', component: AddAdic},
  {path: 'fact_det', component: FactibilidadesDetComponent},
  {path: 'showEquipo', component: ShowEquipoComponent},
  {path: 'confirmclient', component: ConfirmCliente},
  {path: 'confirmclient2', component: ConfirmCliente2},
  {path: 'resetCounter', component: ResetCounter},
  {path: 'addinst', component: AddInstallComponent},
  {path: 'editinst', component: EditInstallComponent},
  {path: 'editprice', component: UpdatePlanPricesDialog},
  {path: 'update_price_fac', component: UpdatePlanPricesFacDialog},
  {path: 'addusers', component: AdduserComponent},
  {path: 'addinventario', component: AddEquipoComponent},
  {path: 'delusers', component: DeleteuserDialog},
  {path: 'delticket', component: DeleteticketDialog},
  {path: 'delticket', component: DeleteInstallDialog},
  {path: 'delticket', component: Deleteotherinstall},
  {path: 'show_ip', component: Ipasignadascomponent},
  //{path: 'addceldas', component: AddceldasComponent},
  {path: 'addaps', component: AddapsComponent},
  {path: 'addfac', component: AddFactComponent},
  {path: 'addclients', component: AddclientsComponent},
  {path: 'addpclients', component: AddPclientsComponent},
  {path: 'castatus', component: ClientesStatus},
  {path: 'pcstatus', component: PClientesStatus},
  {path: 'addrouters', component: AddServidoresComponent},
  {path: 'addplan', component: AddplanesComponent},
  {path: 'addservices', component : AddservicesComponent},
  {path: 'regservices', component : AddPendingComponent},
  {path: 'updateservice', component : UpdateserviceComponent },
  {path: 'addequipo', component: AddequipoComponent},
  {path: 'editequipo', component: EditEquipoComponent},
  {path: 'delservices', component: DeleteRouterDialog},
  {path: 'delaps', component: DeleteApsDialog},
  {path: 'dplan', component: DeletePlanDialog},
  {path: 'dclie', component: DeleteCliente},
  {path: 'ShowPre', component: ShowPreComponent},
  {path: 'selectEquipo', component: SelectEquipoComponent},
  {path: 'GenFAC', component: GenFactura},
  {path: 'delservice', component: DeleteserviceDialog},
  {path: 'EquiposAsignados', component: EquiposasigndosComponent},
  {path: 'ticket_cerrado_user', component: tickets_cerrados_user},
  {path: 'ticket_user/:ticket', component: tickets_cerrados_por_usuarios, canActivate: [AuthGuard]},
  {path: 'pagar_comisiones', component: Pagar_comisones_Component, canActivate: [AuthGuard]},
  {path: 'factura_comision/:id_user', component: factura_comision, canActivate: [AuthGuard]},
  {path: 'pagar_comision', component: pagar_comisionescomponent},
  {path: 'balance_mod_nacional', component: balance_bs, canActivate: [AuthGuard]},
  {path: 'balance_mod_inter', component: balance_dl, canActivate: [AuthGuard]},
  {path: 'Edit_bal_bs', component: Editar_ref_dl},
  {path: 'Edit_bal_dl', component: Editar_ref_bs},
  {path: 'Gen_Fac_blanco', component: GenFactura_blanco},
  {path: 'sms_morosos', component: sms_morosoComponent, canActivate: [AuthGuard]},
  {path: 'fac_prog', component: fac_programadas},
  {path: 'Anular_fac_prog', component: Anularprog_fac},
  {path: 'Anular_cort_prog', component: Anularprog_cort},
  {path: 'program_corte', component: program_corte},
  {path: 'cortes_programados', component: cortes_programados},
  {path: 'config_admin', component: ConfigAdminComponent, canActivate: [AuthGuard]},
  {path: 'config_fac', component: Facturacionconfig, canActivate: [AuthGuard] },
  {path: 'prod_pagos_fac', component: prod_pagos_fac_component },
  {path: 'edit_prod_fac', component: EditFacProdComponent  },
  {path: 'edit_pag_fac', component: EditFacPagComponent },
  {path: 'delete_fac_prog', component: eliminar_prod_pag },
  {path: 'edit_config_adm', component: edit_conf_adm },
  {path: 'edit_install', component: Edit_InstallComponent},
  {path: 'config_balances', component: edit_balances, canActivate: [AuthGuard]},
  {path: 'Edit_pago_bs', component: EditPagoBs},
  {path: 'Edit_pago_dl', component: EditPagoDl},
  {path: 'confirm_edit_pagos', component: confirm_edit_bal_pagos},
  {path: 'confirm_anular_pagos', component: confirm_anular_bal_pagos},
  {path: 'confirm_anular_install', component: confirm_anular_install},
  {path: 'zonas2/:id', component: ArticulosComponent, canActivate: [AuthGuard]},
  {path: 'zonas2', component: Zonas2Component, canActivate: [AuthGuard]},
  {path: 'equipo/:idzona/:id', component: DetallesArticulosComponent, canActivate: [AuthGuard]},
  {path: 'transferenciaEquipos', component: TransferenciaEquiposComponent, canActivate: [AuthGuard]},
  {path: 'listaTransferencias', component: ListaTransferenciasComponent, canActivate: [AuthGuard]},
  {path: 'ordenTraslado/:id_transferencia/:filtro', component: OrdenTrasladoComponent, canActivate: [AuthGuard]},
  {path: 'ventaEquipos', component: VentaEquiposComponent, canActivate: [AuthGuard]},
  {path: 'administrativo', component: ZonasComponent, canActivate: [AuthGuard]},
  {path: 'CierresPendientes', component: PagosComponent, canActivate: [AuthGuard]},
  {path: 'Tickets', component: TicketsComponent, canActivate: [AuthGuard]},
  {path: 'Instalaciones2', component: Instalaciones2Component, canActivate: [AuthGuard]},
  {path: 'detallesInstalacion/:id', component: DetallesInstalacionComponent, canActivate: [AuthGuard]},
  {path: 'detallesMigracion/:id', component: DetallesMigracionComponent, canActivate: [AuthGuard]},
  {path: 'detallesMudanza/:id', component: DetallesMudanzaComponent, canActivate: [AuthGuard]},
  {path: 'procesos', component: ProcesoComponent, canActivate: [AuthGuard]},
  {path: 'infraestructura', component: InfraestructuraComponent, canActivate: [AuthGuard]},
  {path: 'alarmas', component: AlarmasComponent, canActivate: [AuthGuard]},
  {path: 'pdfComisiones/:userSeleccionado/:mesSeleccionado/:anioSeleccionado', component: PdfComisionesComponent, canActivate: [AuthGuard]},
  {path: 'Factibilidades', component: FactibilidadComponent, canActivate: [AuthGuard]},
  {path: 'zonasClientes', component: ZonasClientesComponent, canActivate: [AuthGuard]},
  {path: 'soporteTraslado', component: SoporteTrasladoComponent, canActivate: [AuthGuard]},
  {path: 'pdfTraslado/:id_traslado', component: PdfTrasladoComponent, canActivate: [AuthGuard]},
  {path: 'Promociones', component: PromocionesComponent, canActivate: [AuthGuard]},
  {path: 'Servicios', component: Servicios2Component, canActivate: [AuthGuard]},
  {path: 'ComisionesVendedores', component: ComisionesVendedoresComponent, canActivate: [AuthGuard]},
  {path: 'ComisionesInstaladores', component: ComisionesInstaladoresComponent, canActivate: [AuthGuard]},
  {path: 'HistorialUsuarios', component: HistorialUsuariosComponent, canActivate: [AuthGuard]},
  {path: 'Olts',component: OltComponent, canActivate: [AuthGuard]},
  {path: 'MangasEmpalme',component: MangaEmpalmeComponent, canActivate: [AuthGuard]},
  {path: 'CajasDistribucion',component: CajaDistribucionComponent, canActivate: [AuthGuard]},
  {path: 'Consumibles/:id',component: Articulos2Component, canActivate: [AuthGuard]},
  {path: 'Vehiculos',component: VehiculosComponent, canActivate: [AuthGuard]},
  {path: 'EquiposGrupales',component: EquiposGrupalesComponent, canActivate: [AuthGuard]},
  {path: 'CuentasIncobrables',component: CuentasIncombrablesComponent, canActivate: [AuthGuard]},
  {path: 'detallesTicket/:id/:tipo', component: DetallesTicketComponent, canActivate: [AuthGuard]},
  
]


export const routing = RouterModule.forRoot(appRoutes, {useHash: true});
