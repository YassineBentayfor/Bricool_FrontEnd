import {HTTP_INTERCEPTORS, HttpClientModule, withInterceptorsFromDi} from '@angular/common/http';
import {AppComponent} from './app/app.component';
import {routes} from './app/app-routing';
import {provideRouter} from '@angular/router';
import {BrowserModule, bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';

import {importProvidersFrom} from '@angular/core';

//import {getAuth, provideAuth} from '@angular/fire/auth';

import {environment} from './environments/environment.development';
import {JwtInterceptor} from "./app/Services/JwtInterceptor";


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    BrowserModule,
    HttpClientModule,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),

   // importProvidersFrom(provideAuth(() => getAuth())),

  ],
}).catch((err) => console.error(err));
