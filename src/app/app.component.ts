import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './Services/auth.service';
import { UserService } from './Services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    HomeComponent,
    FlexLayoutModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  pageNotFound: boolean = false;
  pageSignUp: boolean = false;
  constructor(
    private router: Router,
    private auth: AuthService,
    private userService: UserService
  ) {}
  isLoggedIn$ = this.auth.isLoggedIn$;
  isSeller: boolean;
  ngOnInit() {
    this.isSeller = this.userService.isSeller();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.pageNotFound = event.urlAfterRedirects.includes('404');
        this.pageSignUp =
          event.urlAfterRedirects.includes('signUp') ||
          event.urlAfterRedirects.includes('joinUs');
      });
  }
  navigateToSignupSeller() {
    this.router.navigate(['/signUp/seller']);
  }
  navigateToHomePage() {
    this.router.navigate(['/home']);
  }
  goToJoinUs() {
    this.router.navigate(['/joinUs']);
  }
  signOut() {
    this.auth.signOut().subscribe({
      next: () => this.router.navigate(['login']),
    });
  }
  goToMyProfile() {
    this.router.navigate(['/myProfile']);
  }

  navigateToServicePage() {
    this.router.navigate(['/service']);
  }

  navigateToaboutusPage() {
    this.router.navigate(['/aboutus']);
  }
}
