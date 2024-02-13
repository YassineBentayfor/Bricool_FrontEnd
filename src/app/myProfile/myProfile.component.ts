import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { UserService } from '../Services/user.service';
import { Seller } from '../Interfaces/seller';
import { Client } from '../Interfaces/client';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
@Component({
  selector: 'app-myProfile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myProfile.component.html',
  styleUrls: ['./myProfile.component.css'],
})
export class MyProfileComponent implements OnInit {
  seller: Seller;
  client: Client;
  user: any;
  profileImageUrl: any;

  profileproject:any[];

  constructor(private userService: UserService,
              private router : Router,
              private sanitizer: DomSanitizer,
              private changeDetectorRef: ChangeDetectorRef) {}
  copyPhoneNumber(): void {
    // Create a temporary input element to copy the text
    const tempInput = document.createElement('input');
    tempInput.value = this.user.phoneNumber;
    document.body.appendChild(tempInput);

    // Select and copy the text
    tempInput.select();
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Optionally, provide feedback to the user (e.g., toast notification)
    // You can implement this using a library or your own custom solution
    alert('Phone number copied!'+this.user.phoneNumber);
  }
  copyMail(): void {
    // Create a temporary input element to copy the text
    const tempInput = document.createElement('input');
    tempInput.value = this.user.email;
    document.body.appendChild(tempInput);

    // Select and copy the text
    tempInput.select();
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Optionally, provide feedback to the user (e.g., toast notification)
    // You can implement this using a library or your own custom solution
    alert('Mail copied!'+this.user.email);
  }

  ngOnInit() {


    const isSeller = this.userService.isSeller();
    console.log('isSeller:', isSeller);

    if (isSeller) {
      this.userService.getSeller().subscribe(
        (seller: Seller) => {
          this.user as Seller;
          this.user = seller;
        },
        (error) => {
          console.error('Error fetching seller:', error);
          // Handle error as needed
        }
      );
    } else {
      this.userService.getClient().subscribe(
        (client: Client) => {
          console.log('client:', client);
          this.user as Client;
          this.user = client;

        },
        (error) => {
          console.error('Error fetching client:', error);
          // Handle error as needed
        }
      );
    }
    console.log(this.user)

    this.refreshImage();
  }

  editProfile(){
    this.router.navigate(['editProfile']);
  }

  // ... existing code ...
  addProject() {
    this.router.navigate(['addProject']);
  }


 // onFileSelected($event: Event) {

 // }


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




}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Seller } from '../Interfaces/seller';
// import { Gender } from '../Interfaces/gender';
// import {
//   HttpClient,
//   HttpClientModule,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import { Occupation } from '../Interfaces/occupation';
// import { SellerService } from '../Services/seller.service';
// @Component({
//   selector: 'app-myProfile',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './myProfile.component.html',
//   styleUrls: ['./myProfile.component.css'],
// })
// export class MyProfileComponent implements OnInit {
//   seller: Seller;

//   m() {
//     console.log('rff');
//   }
//   copyPhoneNumber(): void {
//     // Create a temporary input element to copy the text
//     const tempInput = document.createElement('input');
//     tempInput.value = this.seller[0].phoneNumber;
//     document.body.appendChild(tempInput);

//     // Select and copy the text
//     tempInput.select();
//     document.execCommand('copy');

//     // Remove the temporary input element
//     document.body.removeChild(tempInput);

//     // Optionally, provide feedback to the user (e.g., toast notification)
//     // You can implement this using a library or your own custom solution
//     alert('Phone number copied!' + this.seller[0].phoneNumber);
//   }
//   copyMail(): void {
//     // Create a temporary input element to copy the text
//     const tempInput = document.createElement('input');
//     tempInput.value = this.seller[0].email;
//     document.body.appendChild(tempInput);

//     // Select and copy the text
//     tempInput.select();
//     document.execCommand('copy');

//     // Remove the temporary input element
//     document.body.removeChild(tempInput);

//     // Optionally, provide feedback to the user (e.g., toast notification)
//     // You can implement this using a library or your own custom solution
//     alert('Mail copied!' + this.seller[0].email);
//   }

//   //input an image
//   constructor(private http: HttpClient, private sellerService: SellerService) {}

//   ngOnInit() {
//     // Retrieve seller ID from the service or shared state
//     const sellerId = this.sellerService.getSellerId();

//     // Fetch the complete Seller object using the ID
//     this.sellerService.getSeller().subscribe(
//       (seller: Seller) => {
//         this.seller = seller;
//       },
//       (error) => {
//         console.error('Error fetching seller:', error);
//         // Handle error as needed
//       }
//     );
//   }

//   // ... existing code ...

//   onFileSelected(event: any): void {
//     const fileInput = event.target as HTMLInputElement;

//     if (fileInput.files && fileInput.files.length > 0) {
//       const selectedFile = fileInput.files[0];
//       const formData = new FormData();
//       formData.append('image', selectedFile);

//       // Send the form data to the backend using an API endpoint
//       this.uploadImage(formData);
//     }
//   }

//   uploadImage(formData: FormData): void {
//     // Replace 'your-api-endpoint' with the actual URL of your backend API endpoint
//     const apiUrl = 'http://localhost:8080/upload';

//     this.http.post(apiUrl, formData).subscribe(
//       (response) => {
//         // Handle the successful response from the backend
//         console.log('Image uploaded successfully:', response);
//       },
//       (error) => {
//         // Handle errors during the upload
//         console.error('Error uploading image:', error);
//       }
//     );
//   }
//   //@Input() seller: Seller;

//   protected readonly console = console;
// }
