import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

var url = 'http://localhost:3000/';

@Injectable()
export class UserService {

    updateData = [];

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getUsers(): Observable<User[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get users from api
        return this.http.get(url+'users', options)
            .map((response: Response) => response.json());
    }

    getUsername(){
        return this.authenticationService.getUsername();
    }

    getPets(){
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get pets from api
        return this.http.get(url+'user/pets', options)
            .map((response: Response) => response.json());
    }

    updatePets(updateData){
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(url+'user/pets/update',updateData,options);
    }

    addPets(){
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(url+'user/pets/create',this.updateData,options)
            .map(res=>res.json());
    }

    removePets(id){
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(url+'user/pets/delete',id,options);
    }
}