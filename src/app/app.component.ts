import { Component, OnInit } from '@angular/core';
import { VersionCheckService } from './_services/index';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(public  versionCheckService: VersionCheckService, public http: HttpClient){

}

ngOnInit(){
  this.versionCheckService.initVersionCheck(this.http, '/version.json');
}

}
