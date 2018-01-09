import { Injectable } from '@angular/core';
import { Router, CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service'
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router,
         private authenticationService: AuthenticationService) { }

    canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot): Observable<boolean> {
        return this.authenticationService.isLoggedIn().map((e) => {
            if (JSON.parse(e["_body"]).result === "fine") {
                if(this.authenticationService.isAuthenticated()){
                    return true;
                }
            }
            else{
                this.router.navigate(['/login']);
                return false;
            }
        }).catch((err) => {
            this.router.navigate(['/login']);
            return Observable.of(false);
        });
    }   
}