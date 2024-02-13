import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SellerSignUpComponent } from './sign-up/seller-sign-up/seller-sign-up.component';
import { ClientSignUpComponent } from './sign-up/client-sign-up/client-sign-up.component';
import { MyProfileComponent } from './myProfile/myProfile.component';
import { SignUpLoginComponent } from './sign-up/signup/signuplogin.component';
import { JoinusComponent } from './joinus/joinus.component';
import { SigninComponent } from './signin/signin.component';
/*import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';*/
import { EditComponent } from './myProfile/edit/edit.component';
import {AuthGuard} from "./Services/AuthGuard";
import {ServiceComponent} from "./service/service.component";
import {AboutusComponent} from "./aboutus/aboutus.component";
import {AddProjectComponent} from "./myProfile/add-project/add-project.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'service', component: ServiceComponent},
  { path: 'aboutus', component: AboutusComponent},
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '404', component: PageNotFoundComponent },
  {
    path: 'myProfile',
    component: MyProfileComponent,
    canActivate: [AuthGuard], // Utilisez votre AuthGuard ici
  },
  {
    path: 'editProfile',
    component: EditComponent,
    canActivate: [AuthGuard], // Utilisez votre AuthGuard ici
  },
  {
    path: 'addProject',
    component: AddProjectComponent,
    canActivate: [AuthGuard], // Utilisez votre AuthGuard ici
  },
  { path: 'signUpLogin', component: SignUpLoginComponent },
  { path: 'joinUs', component: JoinusComponent },

  //using interface seller person create myProfile component using boostrap 5 using static data
  {
    path: 'login',
    component: SigninComponent,
    // Retirez la directive Firebase
  },
  {
    path: 'signUp',
    component: SignUpComponent,
   // ...canActivate(() => redirectLoggedInTo(['home'])),
    children: [
      { path: '', component: SignUpLoginComponent, pathMatch: 'full' },
      { path: 'seller', component: SellerSignUpComponent },
      { path: 'client', component: ClientSignUpComponent },
    ],
  },
  { path: '**', redirectTo: '404' },
];
