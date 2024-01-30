import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, from, Observable, of, tap} from 'rxjs';
import {ClientSignup, SellerSignup, SigninCredentials} from "../Interfaces/auth.model";
import { environment } from "../../environments/environment.development";
import {UserDetails} from "../Interfaces/UserDetails";
import {SignInResponse} from "../Interfaces/SignInResponse";



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState = new BehaviorSubject<Object | null>(null);

  private loggedIn = new BehaviorSubject<boolean>(this.checkLoggedIn());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { }



  signIn(credentials: SigninCredentials): Observable<SignInResponse>{
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    let user ;
    return this.http.post(`${environment.apiUrl}/login`, credentials, options)
      .pipe(tap((response: any) => {
        localStorage.setItem('token', response.token);
        user=response.user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role);
        this.loggedIn.next(true);
      }));
  }

  sellerSignUp(credentials: SellerSignup) {
    let user;
    return this.http.post(`${environment.apiUrl}/seller-register`, credentials)
      .pipe(tap((response: any) => {
        console.log("used credentionals when sign up:", credentials);
        console.log("response frome backend when signup :",response);
        localStorage.setItem('token', response.accessToken);
        user=response.user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role);
        this.loggedIn.next(true);
      }));
  }

  clientSignUp(credentials: ClientSignup) {
    return this.http.post(`${environment.apiUrl}/client-register`, credentials)
      .pipe(tap((response: any) => {
        console.log("used credentionals when sign up:", credentials);
        console.log("response frome backend when signup :",response);
        localStorage.setItem('token', response.accessToken);
       let user=response.user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role);
        this.loggedIn.next(true);
      }));
  }

 /* signOut() {
    localStorage.removeItem('token');
    this.authState.next(null);
    // Optionnel : Informer le backend de la déconnexion
  }*/

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

/*  // Ajoutez cette méthode pour accéder à l'état actuel de connexion
  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }*/

// Ajoutez cette méthode pour mettre à jour l'état de connexion
  setLoggedIn(loggedIn: boolean): void {
    this.loggedIn.next(loggedIn);
  }




 checkLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

 /* login(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
  }*/

  signOut(): Observable<any>{
    localStorage.clear();
    this.loggedIn.next(false);
    return of(null);
  }
}
