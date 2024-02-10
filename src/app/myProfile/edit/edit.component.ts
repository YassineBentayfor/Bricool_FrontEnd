import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { Seller } from 'src/app/Interfaces/seller';
import { UserService } from 'src/app/Services/user.service';
import { AuthService } from 'src/app/Services/auth.service';
import { SignupCredentials } from 'src/app/Interfaces/auth.model';
import { City } from 'src/app/Interfaces/city';
import { Occupation } from 'src/app/Interfaces/occupation';
@Component({
  selector: 'app-seller-sign-up',
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent {
  cities: string[] = [];
  sellerSubscription: Subscription;
  @ViewChild('CitiesInput') citiesInput: ElementRef<HTMLInputElement>;
  @ViewChild('OptionsInput') optionsInput: ElementRef<HTMLInputElement>;
  options: string[] = [];
  data: SignupCredentials = { displayName: '', email: '', password: '' };
  personForm: FormGroup;
  count: number = 1;
  filteredOptions: string[];
  filteredCities: string[];
  user: any;
  addedOccupations: string[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private auth: AuthService
  ) {
    this.cities = Object.values(City);
    this.options = Object.values(Occupation);
    this.filteredOptions = this.options.slice();
    this.filteredCities = this.cities.slice();

    this.personForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      city: [
        '',
        [Validators.required, this.isInCityListValidator(this.cities)],
      ],
      gender: ['', [Validators.required]],
      Occupation: this.fb.array(
        [],
        [Validators.required, this.validateOccupations()]
      ),

      YearsOfBirth: ['', [Validators.required, this.ageValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.sellerSubscription = this.userService
      .getSeller()
      .subscribe((userData) => {
        this.user = userData;
        const yearsOfBirthDate = userData.yearsOfBirth
          ? new Date(userData.yearsOfBirth)
          : null;
        this.personForm = this.fb.group({
          firstName: [userData.firstName || '', Validators.required],
          lastName: [userData.lastName || '', Validators.required],
          email: [
            userData.email || '',
            [Validators.required, Validators.email],
          ],
          password: [userData.password || '', Validators.required],
          phoneNumber: [
            userData.phoneNumber || '',
            [Validators.required, Validators.pattern(/^\d+$/)],
          ],
          YearsOfBirth: [yearsOfBirthDate || null, Validators.required],
          gender: [userData.gender || null, Validators.required],
          cin: [userData.cin || ''],
          businessHours: [userData.businessHours || ''],
          Operationalregion: [userData.Operationalregion || ''],
          city: [userData.city || '', Validators.required],
          slogan: [userData.slogan || ''],
          description: [userData.description || ''],
          completedTaskNumber: [userData.completedTaskNumber || null],
          Occupation: this.fb.array(
            [],
            [Validators.required, this.validateOccupations()]
          ),
        });
        const existingOccupations = userData.occupations || [];
        const occupationControls = existingOccupations.map((occupation) => {
          return this.fb.control(
            occupation,
            this.isInOccupationListValidator(this.options)
          );
        });

        const occupationArray = this.personForm.get('Occupation') as FormArray;
        occupationArray.clear(); // Clear any default empty controls
        occupationControls.forEach((control) => occupationArray.push(control));

        // Assuming you want to store the occupations in the 'addedOccupations' property
        this.addedOccupations = existingOccupations.slice();
      });
  }
  validateOccupations(): ValidatorFn {
    return (
      control: AbstractControl
    ): {
      notInOccupationList: {
        invalidOccupationIndices: number[];
        invalidOccupations: string[];
      };
    } | null => {
      const occupations: string[] = control.value;

      const invalidOccupations = occupations.filter(
        (occupation) => !this.options.includes(occupation)
      );

      if (invalidOccupations.length > 0) {
        const invalidOccupationIndices = invalidOccupations.map(
          (invalidOccupation) => occupations.indexOf(invalidOccupation)
        );

        return {
          notInOccupationList: { invalidOccupationIndices, invalidOccupations },
        };
      }

      return null;
    };
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.sellerSubscription.unsubscribe();
  }
  onOptionSelected(
    event: any,
    input: ElementRef<HTMLInputElement>,
    matAutocomplete: MatAutocomplete
  ) {
    if (input && input.nativeElement) {
      const value = (event.option as any).value;
      const control = this.personForm.get('Occupation') as FormArray;
      control.push(this.fb.control(value));
      input.nativeElement.value = '';
      matAutocomplete.options.forEach((option) => option.deselect());
    }
  }

  addOccupation() {
    const occupationArray = this.personForm.get('Occupation') as FormArray;
    occupationArray.push(this.fb.control(''));
  }

  removeOccupation(index: number) {
    const occupationArray = this.personForm.get('Occupation') as FormArray;
    occupationArray.removeAt(index);
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

  filterCities(): void {
    const filterValue = this.citiesInput.nativeElement.value.toLowerCase();
    this.filteredCities = this.cities.filter((o) =>
      o.toLowerCase().includes(filterValue)
    );
  }
  filterOptions(): void {
    const input = this.optionsInput;
    if (input && input.nativeElement) {
      const filterValue = input.nativeElement.value.toLowerCase();
      this.filteredOptions = this.options.filter((o) =>
        o.toLowerCase().includes(filterValue)
      );
    }
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

  isInCityListValidator(cities: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const city: string = control.value;

      if (!cities.includes(city)) {
        return { notInCityList: true };
      }

      return null;
    };
  }

  isInOccupationListValidator(options: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const occupation: string = control.value;

      if (!options.includes(occupation)) {
        return { notInOccupationList: true };
      }

      return null;
    };
  }

  onSubmit() {
    console.log('Form validity:', this.personForm.valid);

    if (!this.personForm.valid) {
      // Log detailed information about invalid controls
      Object.keys(this.personForm.controls).forEach((controlName) => {
        const control = this.personForm.get(controlName);
        console.log(`Control: ${controlName}, Valid: ${control.valid}`);
        if (!control.valid) {
          console.log(`Errors: ${JSON.stringify(control.errors)}`);
        }
      });
    }

    if (this.personForm.valid) {
      console.log('Form value:', this.personForm.value);

      // Remove duplicate occupations
      const uniqueOccupations = [
        ...new Set<string>(this.personForm.value.Occupation),
      ];

      const sellerData: Seller = {
        firstName: this.personForm.value.firstName,
        lastName: this.personForm.value.lastName,
        email: this.personForm.value.email,
        phoneNumber: this.personForm.value.phoneNumber,
        city: this.personForm.value.city,
        occupations: uniqueOccupations,
        yearsOfBirth: this.personForm.value.YearsOfBirth,
        password: this.personForm.value.password,
        gender: this.personForm.value.gender,
      };


      // Assuming you have the seller's ID available in userData
      let user = JSON.parse(localStorage.getItem('user'));
      const sellerId = user.id;
      sellerData.id = sellerId;
      console.log("debuging",sellerId)
      console.log('this is the seller data before the put request', sellerData);

      this.userService.putSeller(sellerId, sellerData).subscribe(
        (seller: any) => {

          console.log('Response from putSeller:', seller);
          // No need to set user ID and type again, assuming it's already set during login
          this.router.navigate(['/myProfile']);
        },
        (error) => {
          console.log("rror !!!")
          console.log("rror !!!")
          console.error('Error updating seller profile:', error);
          // Handle error as needed
        }
      );
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }
}
