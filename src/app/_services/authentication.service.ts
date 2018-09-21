import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User, perm } from '../_models/index';
import { AuthGuard } from '../_guards/index';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment'

@Injectable()
export class AuthenticationService {
  public Usuario;
    constructor(private http: Http, private currentUser: User, public auth: AuthGuard) {

     }

    login(username: string, password: string) {
      console.log(JSON.stringify({ username: username, password: password }))
        return this.http.post(environment.apiEndpoint+'users/login/'+username+'/'+password, JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                let user1 = user[0]
                // console.log(user[0]);
                if (user && user1.username) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user1));
                    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                    this.Usuario = this.currentUser;
                    this.http.get(environment.apiEndpoint+'users/'+user1.id_user+'/permission')
                    .subscribe((data) => {
                      data.json().forEach(perm => {
                          this.auth.perm.push(perm.perm);
                          let data2 = data.json();
                          sessionStorage.setItem('permissions', JSON.stringify(data2))
                        });
                        console.log(this.auth.perm);
                    });
                }
            });

    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('permissions');
        this.auth.currentUser=null;
        this.auth.perm=[];
    }
}
