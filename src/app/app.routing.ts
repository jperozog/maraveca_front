import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { ClientsComponent, AddclientsComponent, DataTablePipe, CapitalizePipe, ClientesStatus, DeleteCliente, ClientOverview } from './clients/clients.component';
import { PClientsComponent, AddPclientsComponent, AddFactComponent, PClientesStatus, DeletePCliente } from './pclients/clients.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiciosComponent, AddservicesComponent, AddPendingComponent} from './servicios/servicios.component';
import { ServidoresComponent, AddServidoresComponent, DeleteRouterDialog } from './servidores/servidores.component';
import { CeldasComponent, AddceldasComponent } from './celdas/celdas.component';
import { PlanesComponent, AddplanesComponent, DeletePlanDialog, UpdatePlanPricesDialog } from './planes/planes.component';
import { EquiposComponent, AddequipoComponent } from './equipos/equipos.component';
import { LoginComponent } from './login/login.component';
import { ApsComponent, AddapsComponent, DeleteApsDialog } from './aps/aps.component';
import { SoporteComponent, DeleteticketDialog, DeleteInstallDialog, AddticketComponent, EditticketComponent } from './soporte/soporte.component';
import {UsuariosComponent, DetallesUsuarios, AdduserComponent, DeleteuserDialog, ResetCounter} from './usuarios/usuarios.component'
import { NotifyComponent } from './notify/notify.component'
import { AuthGuard } from './_guards/index';
import { PreComponent } from './presupuestos/pre.component';
import { FacturacionComponent, FacturacionPagos } from './facturacion/facturacion.component';
import { FactibilidadesComponent, FactibilidadesDetComponent } from './factibilidades/factibilidades.component';
import { InstalacionesComponent, AddInstallComponent, EditInstallComponent } from './instalaciones/instalaciones.component'
import { StatsComponent, PagarComponent, DetallesInstallerComponent, cargarPagocomponent } from './stats/stats.component'

const appRoutes: Routes = [
  {path: '', component: LayoutComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'clients', component: ClientsComponent, canActivate: [AuthGuard]},
  {path: 'pclients', component: PClientsComponent, canActivate: [AuthGuard]},
  {path: 'router', component: ServidoresComponent, canActivate: [AuthGuard]},
  {path: 'equipos',component: EquiposComponent, canActivate: [AuthGuard]},
  {path: 'celdas',component: CeldasComponent, canActivate: [AuthGuard]},
  {path: 'services', component: ServiciosComponent, canActivate: [AuthGuard]},
  {path: 'aps', component: ApsComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsuariosComponent, canActivate: [AuthGuard]},
  {path: 'addticket', component: AddticketComponent, canActivate: [AuthGuard]},
  {path: 'editticket/:ticket', component: EditticketComponent, canActivate: [AuthGuard]},
  {path: 'detailInst/:inst', component: DetallesInstallerComponent, canActivate: [AuthGuard]},
  {path: 'soporte', component: SoporteComponent, canActivate: [AuthGuard]},
  {path: 'notify', component: NotifyComponent, canActivate: [AuthGuard]},
  {path: 'planes', component: PlanesComponent, canActivate: [AuthGuard]},
  {path: 'facturacion', component: FacturacionComponent, canActivate: [AuthGuard]},
  {path: 'factibilidades', component: FactibilidadesComponent, canActivate: [AuthGuard]},
  {path: 'instalaciones', component: InstalacionesComponent, canActivate: [AuthGuard]},
  {path: 'ClientOverview/:id_user', component: ClientOverview, canActivate: [AuthGuard]},
  {path: 'DetalleUsuario/:id_user', component: DetallesUsuarios, canActivate: [AuthGuard]},
  {path: 'EstadodeCuenta', component: StatsComponent, canActivate: [AuthGuard]},
  {path: 'pagarInstalaciones', component: PagarComponent, canActivate: [AuthGuard]},
  {path: 'PreComponent', component: PreComponent, canActivate: [AuthGuard]},
  {path: 'fac_det', component: FacturacionPagos},
  {path: 'cargarPago', component: cargarPagocomponent},
  {path: 'fact_det', component: FactibilidadesDetComponent},
  {path: 'resetCounter', component: ResetCounter},
  {path: 'addinst', component: AddInstallComponent},
  {path: 'editinst', component: EditInstallComponent},
  {path: 'editprice', component: UpdatePlanPricesDialog},
  {path: 'addusers', component: AdduserComponent},
  {path: 'delusers', component: DeleteuserDialog},
  {path: 'delticket', component: DeleteticketDialog},
  {path: 'delticket', component: DeleteInstallDialog},
  {path: 'addceldas', component: AddceldasComponent},
  {path: 'addaps', component: AddapsComponent},
  {path: 'addfac', component: AddFactComponent},
  {path: 'addclients', component: AddclientsComponent},
  {path: 'addpclients', component: AddPclientsComponent},
  {path: 'castatus', component: ClientesStatus},
  {path: 'pcstatus', component: PClientesStatus},
  {path: 'addrouters', component: AddServidoresComponent},
  {path: 'addplan', component: AddplanesComponent},
  {path: 'addservices',component: AddservicesComponent},
  {path: 'regservices',component: AddPendingComponent},
  {path: 'addequipo', component: AddequipoComponent},
  {path: 'delservices', component: DeleteRouterDialog},
  {path: 'delaps', component: DeleteApsDialog},
  {path: 'dplan', component: DeletePlanDialog},
  {path: 'dclie', component: DeleteCliente},


]


export const routing = RouterModule.forRoot(appRoutes, {useHash: true});
