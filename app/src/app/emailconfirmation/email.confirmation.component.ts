import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service'

@Component({
  moduleId: module.id,
  selector: 'email-confirmation',
  templateUrl: './email.confirmation.component.html',
  styleUrls: ['./email.confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {
    message:string;

  constructor(private activatedRoute: ActivatedRoute,
                private authenticationService:AuthenticationService) {
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        let id = params['id'];
        console.log(id);
        this.authenticationService.emailConfirmation(id).subscribe((result)=>{
            this.message = result['_body'];
        })
      });
  }

}
