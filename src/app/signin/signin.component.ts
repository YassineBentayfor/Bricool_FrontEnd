import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormContainerComponent } from './form-container/form-container.component';
import { UserService } from '../Services/user.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule,
    MatSnackBarModule,
    FormContainerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent implements OnInit {
  form!: FormGroup;
  email: string = '';
  constructor(
    private auth: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.minLength(6)]),
    });
  }


  signIn() {
    if (this.form.valid) {

      this.auth.signIn(this.form.value).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.accessToken); // Stockez le token dans le localStorage
          this.auth.setLoggedIn(true); // Mettez à jour le statut de connexion
          this.router.navigate(['home']); // Naviguez vers la page d'accueil
        },
        error: (error) => {
          this.snackbar.open(error.message, 'OK', {
            duration: 3000,
          });
          this.auth.setLoggedIn(false); // Réinitialisez le statut de connexion
        }
      });
    }
  }



}
