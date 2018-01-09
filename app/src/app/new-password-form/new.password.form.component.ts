import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Component({
  moduleId: module.id,
  selector: 'app-new-password-form',
  templateUrl: './new.password.form.component.html',
  styleUrls: ['./new.password.form.component.css']
})
export class NewPasswordFormComponent implements OnInit {

  mail: string = "";
  pass: string = "";
  pass2: string = "";
  load:boolean=false;
  id:string;

  error = '';
  path:any ="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==";

  constructor(private router: Router,
     private activatedRoute: ActivatedRoute,
     private authenticationService: AuthenticationService) { }

    ngOnInit() {
      this.authenticationService.logout();
      this.activatedRoute.queryParams.subscribe((params: Params) => {
          this.id = params['id'];
          console.log(this.id);
      });
    }

  loading(){
    return this.load;
  }

  passwordValidator(password:string):boolean{
    var PASS_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
    
    if( !PASS_REGEXP.test(password))
    {
      return false;
    }
    return true;
  }

  changePass(){
      if(this.pass === this.pass2){
          if(this.passwordValidator(this.pass) && this.pass!='' && this.pass === this.pass2){
              this.authenticationService.changePass(this.pass,this.id)
                .subscribe(result=>{
                    this.router.navigate(['']);
                })
          }
      }
      else{
          this.error="The confirmation password does not match"
      }
  }

  login() {
    this.error = null;
    this.authenticationService.login(this.mail, this.pass)
        .subscribe(result => {
          this.load=true;
          console.log(result);
            if (result === true) {
                // login successful
                this.router.navigate(['/']);
            } else {
              if(this.authenticationService.EmailConfirmation){
                this.error = this.authenticationService.EmailConfirmation;
              }
              else{
                this.error = 'Username or password is incorrect';
              }
            }
        });
}

}
