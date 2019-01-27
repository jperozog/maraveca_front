import { ChangeDetectionStrategy,
Component,
EventEmitter,
Output,
OnInit } from '@angular/core';
import { User } from '../_models/index';
import { AuthGuard } from '../_guards/index';
import { AuthenticationService } from '../_services/index';
import {Http, Response} from '@angular/http';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public usuario: AuthGuard, public test: AuthenticationService, public http:Http) {
    
    //console.log("hola");
   }

  ngOnInit() {
  }

}
