import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Subscription} from "rxjs";
import {SignupCredentials} from "../../Interfaces/auth.model";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup, FormsModule, ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../Services/user.service";
import {AuthService} from "../../Services/auth.service";
import {City} from "../../Interfaces/city";
import {Occupation} from "../../Interfaces/occupation";
import {MatAutocomplete, MatAutocompleteModule} from "@angular/material/autocomplete";
import {Seller} from "../../Interfaces/seller";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
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
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {
  sellerSubscription: Subscription;
  personForm: FormGroup;
  count: number = 1;
  user: any;
  profileImageUrl: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private auth: AuthService,
  private sanitizer: DomSanitizer,
  private changeDetectorRef: ChangeDetectorRef
  ) {
    this.personForm = this.fb.group({
      projectname: ['', Validators.required],
      descriptionproject: ['', Validators.required],
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

        });
        const existingOccupations = userData.occupations || [];
        const occupationControls = existingOccupations.map((occupation) => {
          return this.fb.control(
            occupation,
          );
        });

        const occupationArray = this.personForm.get('Occupation') as FormArray;
        occupationArray.clear(); // Clear any default empty controls
        occupationControls.forEach((control) => occupationArray.push(control));

        // Assuming you want to store the occupations in the 'addedOccupations' property
      });
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



  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log("FileUpload -> files", fileList);
      this.uploadFile(fileList[0]);
    }
  }

  uploadFile(file: File) {
    let user = JSON.parse(localStorage.getItem('user') || '{}'); // Ajouté || '{}' pour éviter les erreurs si 'user' est null
    const sellerId = user.id;
    this.userService.createSynthImage(sellerId, file).subscribe(
      (response) => {
        console.log("Image uploaded successfully");
        // Rafraîchir l'image affichée après le téléchargement réussi
        this.refreshImage();
      },
      (error) => {
        console.error("Error uploading image", error);
        // Gérer l'erreur ici
      }
    );
  }

  refreshImage() {
    let user = JSON.parse(localStorage.getItem('user') || '{}'); // Ajouté || '{}' pour éviter les erreurs si 'user' est null
    const id = user.id;
    // Appelez cette méthode après le téléchargement réussi pour rafraîchir l'image affichée
    this.userService.getSynthImage(id).subscribe(imageData => {
      let objectURL = URL.createObjectURL(imageData);
      this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      // Forcer la mise à jour de la vue si nécessaire
      this.changeDetectorRef.detectChanges(); // Ajoutez cette ligne si la mise à jour ne se fait pas automatiquement
    });
  }



  onSubmit() {

  }
}
