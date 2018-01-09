import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../models/User';
import { RegistrationService } from '../services/registration.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user:User = {email:"",password:"",firstname:"",surname:"",date:""};
  temp:boolean;
  load:boolean = false;
  error:string="";

  path:any ="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==";

  constructor(private regService: RegistrationService,private router: Router) { }

  ngOnInit() {
  }

  emailValidator(email:string): boolean {
    var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!EMAIL_REGEXP.test(email)) {
      return false;
    }
    return true; 
  }

  passwordValidator(password:string):boolean{
    var PASS_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
    
    if( !PASS_REGEXP.test(password))
    {
      return false;
    }
    return true;
  }

  loading(){
    return this.load;
  }

  submit(){
    this.load = true;
    this.submitForm();
  }

  submitForm(){
    if(this.emailValidator(this.user.email) && this.user.email!="" && this.passwordValidator(this.user.password) 
    && this.user.password!="" && this.user.date!="" && this.user.firstname!="" && this.user.surname!=""){
      this.regService.checkEmail(this.user.email)
        .subscribe((res)=>{
          if(res.checked == "true"){
            this.regService.register(this.user)
              .subscribe((res)=>{
                this.load = false;
                if(res.email)
                {
                  if(res.email === this.user.email)
                  {
                    this.router.navigate(['/login']);
                  }
                }
                else{this.load = false;this.temp = false;}
              });
          }
          else{this.load = false;this.temp = false;}});
    }
    else if(!this.emailValidator(this.user.email) || !this.passwordValidator(this.user.password)){
      this.load = false;
    }
    else{
      this.load = false;
      this.error = "fill in all the fields of the form";
    }
  }

  checkEmail(email:string){
    if(this.emailValidator(email) && email!=""){
      this.regService.checkEmail(email)
      .subscribe((res)=>{
        if(res.checked == "true"){
          this.temp = true;
        }
        else{
          this.temp = false; 
        }
      });
    }
    else{this.temp = true}
    return this.temp;
  } 
}