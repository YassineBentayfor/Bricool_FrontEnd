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
import {Project} from "../../Interfaces/Project";

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
    const newProject: Project = {
      seller_id: null,// Replace 1 with the actual seller_id value
      projectName: this.personForm.value.projectname,
      description: this.personForm.value.descriptionproject,
      startDate: '',  // Add actual values or adjust as needed
      endDate: '',    // Add actual values or adjust as needed
      budget: 0,      // Add actual values or adjust as needed
      status: '',
      serviceType: '',
      location: '',
      bookingAvailability: '',
    };
    console.log(newProject)
    this.userService.postProject(newProject)
      .subscribe(
        (response) => {
          // Handle successful response here
          console.log('Project created successfully:', response);
        },
        (error) => {
          // Handle error here
          console.error('Error creating project:', error);
        })


    this.sellerSubscription = this.userService
      .getSeller()
      .subscribe((userData) => {
        this.user = userData;
        const yearsOfBirthDate = userData.yearsOfBirth
          ? new Date(userData.yearsOfBirth)
          : null;
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
    console.log('Form initialized:', this.personForm.value);
    console.log(JSON.parse(localStorage.getItem('user') || '{}').id)
    const newProject: Project = {
      seller_id: null,// Replace 1 with the actual seller_id value
      projectName: this.personForm.value.projectname,
      description: this.personForm.value.descriptionproject,
      startDate: '',  // Add actual values or adjust as needed
      endDate: '',    // Add actual values or adjust as needed
      budget: 0,      // Add actual values or adjust as needed
      status: '',
      serviceType: '',
      location: '',
      bookingAvailability: '',
    };
    console.log(newProject)
    this.userService.postProject(newProject)
      .subscribe(
        (response) => {
          // Handle successful response here
          console.log('Project created successfully:', response);
        },
        (error) => {
          // Handle error here
          console.error('Error creating project:', error);
        })

    this.router.navigate(['/myProfile']);

  }
}
