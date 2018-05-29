import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../_models/index';


@Injectable()
export class AuthGuard implements CanActivate {
public currentUser: any;
public perm: string[] = [];
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (sessionStorage.getItem('currentUser')) {
            // logged in so return true
            this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if(sessionStorage.getItem('permissions')){
              this.perm = [];
              JSON.parse(sessionStorage.getItem('permissions')).forEach(perm => {
                this.perm.push(perm.perm);
                //console.log("permisos: "+this.perm);
              });
            }
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
