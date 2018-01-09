import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map'

var url = 'http://localhost:3000/';

@Injectable()
export class AuthenticationService {
    public token: string;
    public EmailConfirmation: string;
 
    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }
 
    login(email: string, password: string): Observable<boolean> {
        let headers      = new Headers({ 'Content-Type': 'application/json' }); 
        let options       = new RequestOptions({ headers: headers });
        this.EmailConfirmation = '';
        return this.http.post(url+'authenticate', JSON.stringify({ email: email, password: password }),options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().body.token;
                if(response.json().body.result){this.EmailConfirmation = response.json().body.result;}
                if (token) {
                    // set token property
                    this.token = token;
 
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ email: email, token: token }));
 
                    // return true to indicate successful login
                    return true;
                } else {
                    return false;
                }
            });
    }

    emailConfirmation(id:string){
        let headers      = new Headers({ 'Content-Type': 'application/json' }); 
        let options       = new RequestOptions({ headers: headers });
        return this.http.get(url+'verify?id='+id,options);
    }

    sendMsg(email:string){
        let headers      = new Headers({ 'Content-Type': 'application/json' }); 
        let options       = new RequestOptions({ headers: headers });
        let body = {email:email};
        return this.http.post(url+'msg-for-change',JSON.stringify(body),options);
    }

    changePass(password:string,id:string){
        let headers      = new Headers({ 'Content-Type': 'application/json' }); 
        let options       = new RequestOptions({ headers: headers });
        let body = {
            password:password,
            id:id
        };
        return this.http.put(url+'change-password',JSON.stringify(body),options);
    }

    getUsername(){
        let localData = localStorage.getItem('currentUser');
        let temp = JSON.parse(localData);
        const token = temp.token;
        let jwtHelper: JwtHelper = new JwtHelper();

        return jwtHelper.decodeToken(token).username;
    }

    isLoggedIn(): Observable<Response>{
        let headers      = new Headers({ 'Content-Type': 'application/json' });
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let token = user && user.token;
        headers.append('Authorization', 'Bearer ' + this.token );        
        let options       = new RequestOptions({ headers: headers });
        return this.http.post(url+'checkJWT', {},options);
    }

    public isAuthenticated(): boolean {
        let localData = localStorage.getItem('currentUser');
        if(!localData){
            return false;
        }
        else{
            let temp = JSON.parse(localData);
            const token = temp.token;
            let jwtHelper: JwtHelper = new JwtHelper();

            jwtHelper.decodeToken(token);
            jwtHelper.getTokenExpirationDate(token);
            return !jwtHelper.isTokenExpired(token);
        }
    }
    
    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}