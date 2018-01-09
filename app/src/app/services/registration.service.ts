import { Injectable } from '@angular/core';
import { Http,RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/User';

var url = 'http://localhost:3000/';

@Injectable()
export class RegistrationService {

  constructor(public http:Http) { 
  }

  register(user:User){
    let link = url+"registration";
    let headers      = new Headers({ 'Content-Type': 'application/json' }); 
    let options       = new RequestOptions({ headers: headers });

    console.log(link);
    return this.http.post(link,JSON.stringify(user),options)
    .map(res => res.json());
  }

  checkEmail(_email:string){
    let link = url+"checkEmail";
    let headers      = new Headers({ 'Content-Type': 'application/json' }); 
    let options       = new RequestOptions({ headers: headers });
    let body = { email: _email };

    return this.http.post(link,JSON.stringify(body),options)
    .map(res => res.json());
  }
}
