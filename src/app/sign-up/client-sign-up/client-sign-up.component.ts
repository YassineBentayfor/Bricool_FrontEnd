import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { City } from 'src/app/Interfaces/city';
import { Occupation } from 'src/app/Interfaces/occupation';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { Client } from 'src/app/Interfaces/client';
import { UserService } from 'src/app/Services/user.service';
import {ClientSignup} from 'src/app/Interfaces/auth.model';
import { AuthService } from 'src/app/Services/auth.service';
@Component({
  selector: 'app-client-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './client-sign-up.component.html',
  styleUrls: ['./client-sign-up.component.css'],
})
export class ClientSignUpComponent {
  personForm: FormGroup;
  count: number = 1;
  filteredOptions: string[];
  filteredCities: string[];
  data: ClientSignup = {} as ClientSignup ;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private auth: AuthService
  ) {
    this.personForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],

      gender: ['', [Validators.required]],

      YearsOfBirth: ['', [Validators.required, this.ageValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordVerification: [
        '',
        Validators.required,
        this.matchPasswordValidator('password'),
      ],
    });
  }

  onSubmit() {
    this.data.firstName = this.personForm.value.firstName;
    this.data.email = this.personForm.value.email;
    this.data.password = this.personForm.value.password;
    this.data.lastName = this.personForm.value.lastName;
    this.data.phoneNumber = this.personForm.value.phoneNumber;
    this.data.gender=this.personForm.value.gender;
    this.data.yearsOfBirth=this.personForm.value.YearsOfBirth;

    localStorage.clear();
    console.log(this.personForm.value);
    if (this.personForm.valid) {
      const clientData: Client = {
        firstName: this.personForm.value.firstName,
        lastName: this.personForm.value.lastName,
        email: this.personForm.value.email,
        phoneNumber: this.personForm.value.phoneNumber,
        yearsOfBirth: this.personForm.value.YearsOfBirth,
        password: this.personForm.value.password,
        gender: this.personForm.value.gender,
      };
      console.log("client data when signup:",clientData);


      this.auth.clientSignUp(this.data).subscribe({
        next: () => {
          console.log('Signed up successfully');
          // Navigate to the myProfile page
          this.router.navigate(['/myProfile']);
        },
        error: (error) => console.log('Error saving client:', error.message),

      });


     /* // Call the postClient method from the service
      this.userService.postClient(clientData).subscribe(
        (client: Client) => {
          // Store the user ID and set user type in local storage
          this.userService.setUserId(client.clientId);
          this.userService.setUserType('client');
          this.auth.clientSignUp(this.data).subscribe({
            next: () => console.log('Signed up successfully'),
            error: (error) => console.log(error.message),
          });
          // Navigate to the myProfile page
          this.router.navigate(['/myProfile']);
        },
        (error) => {
          console.error('Error saving client:', error);
          // Handle error as needed
        }
      );
      */

    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }

  onContinue() {
    this.count++;
  }
  onReturn() {
    this.count--;
  }

  navigateToHomePage() {
    this.router.navigate(['/home']);
  }

  ageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate: Date = control.value;

      // Check if a date is selected
      if (!selectedDate) {
        return { required: true };
      }

      // Calculate the age based on the current date
      const currentDate = new Date();
      const age = currentDate.getFullYear() - selectedDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const birthMonth = selectedDate.getMonth();
      const currentDay = currentDate.getDate();
      const birthDay = selectedDate.getDate();

      // Compare the age, taking into account months and days
      if (
        age > 18 ||
        (age === 18 &&
          (currentMonth > birthMonth ||
            (currentMonth === birthMonth && currentDay >= birthDay)))
      ) {
        return null; // No error, the user is 18 years or older
      } else {
        return { underage: true }; // Validation error, the user is younger than 18 years
      }
    };
  }

  matchPasswordValidator(controlName: string): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      const passwordControl = control.root.get(controlName);
      const password = passwordControl ? passwordControl.value : '';
      const confirmPassword = control.value;

      if (!password || !confirmPassword || password !== confirmPassword) {
        return Promise.resolve({ passwordMismatch: true });
      }

      return Promise.resolve(null);
    };
  }
}
