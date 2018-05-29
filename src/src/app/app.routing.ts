import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
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
import { SoporteComponent } from './soporte/soporte.component';
import {UsuariosComponent, AdduserComponent, DeleteuserDialog, PrivuserDialog, ZoneuserDialog} from './usuarios/usuarios.component'
import { AuthGuard } from './_guards/index';


const appRoutes: Routes = [
  {path: '', component: LayoutComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'clients', component: ClientsComponent, canActivate: [AuthGuard]},
  {path: 'router', component: ServidoresComponent, canActivate: [AuthGuard]},
  {path: 'equipos',component: EquiposComponent, canActivate: [AuthGuard]},
  {path: 'celdas',component: CeldasComponent, canActivate: [AuthGuard]},
  {path: 'services', component: ServiciosComponent, canActivate: [AuthGuard]},
  {path: 'aps', component: ApsComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsuariosComponent, canActivate: [AuthGuard]},
  {path: 'addusers', component: AdduserComponent},
  {path: 'delusers', component: DeleteuserDialog},
  {path: 'privusers', component: PrivuserDialog},
  {path: 'zoneusers', component: ZoneuserDialog},
  {path: 'addceldas', component: AddceldasComponent},
  {path: 'addaps', component: AddapsComponent},
  {path: 'addclients', component: AddclientsComponent},
  {path: 'addrouters', component: AddServidoresComponent},
  {path: 'planes', component: PlanesComponent, canActivate: [AuthGuard]},
  {path: 'addplan', component: AddplanesComponent},
  {path: 'addservices',component: AddservicesComponent},
  {path: 'addequipo', component: AddequipoComponent},
  {path: 'delservices', component: DeleteRouterDialog},
  {path: 'soporte', component: SoporteComponent},
  {path: 'delaps', component: DeleteApsDialog}
]


export const routing = RouterModule.forRoot(appRoutes, {useHash: true});
