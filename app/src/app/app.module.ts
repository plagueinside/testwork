import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule , MatMenuModule, MatToolbarModule, MatIconModule, 
  MatTableModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatCheckboxModule, 
  MatPaginatorModule, MatDialogModule  } from '@angular/material';
  
import { MatDatepickerModule } from '@angular/material/datepicker';

import{ AuthenticationService } from './services/authentication.service';
import{ UserService } from './services/user.service';
import{ RegistrationService } from './services/registration.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from './_guards/auth.guard';
import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { EmailConfirmationComponent } from './emailconfirmation/email.confirmation.component';
import { NewPasswordComponent } from './new-password/new.password.component';
import { NewPasswordFormComponent } from './new-password-form/new.password.form.component';

const appRoutes: Routes =[
  {path:'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'verify', component: EmailConfirmationComponent},
  { path: 'change-password-form', component:NewPasswordFormComponent},
  {path:'change-password',component: NewPasswordComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    AddNewItemComponent,
    EditItemComponent,
    EmailConfirmationComponent,
    NewPasswordComponent,
    NewPasswordFormComponent
  ],
  entryComponents:[AddNewItemComponent,EditItemComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule, 
    RouterModule.forRoot(appRoutes)
  ],
  providers: [RegistrationService,AuthenticationService,UserService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
