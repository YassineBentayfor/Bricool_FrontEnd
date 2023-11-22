import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Project } from './project';
import { Tasker } from './tasker';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('OptionsInput') optionsInput: ElementRef<HTMLInputElement>;
  @ViewChild('CitiesInput') citiesInput: ElementRef<HTMLInputElement>;
  myOptionsControl = new FormControl('');
  myCitiesControl = new FormControl('');
  cities: string[] = [
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Fes',
    'Tangier',
    'Agadir',
    'Meknes',
    'Oujda',
    'Kenitra',
    'Tetouan',
    'Safi',
    'Mohammedia',
    'Beni Mellal',
    'Khouribga',
    'Nador',
    // Add more cities as needed
  ];

  options: string[] = [
    'Carpenter',
    'Electrician',
    'Painter',
    'Mechanic',
    'Chef',
    'Developer',
    'Designer',
    'Writer',
    'Doctor',
    'Teacher',
    'Plumber',
    'Engineer',
    'Artist',
    'Photographer',
    'Accountant',
    'Lawyer',
    'Nurse',
    'Architect',
    'Scientist',
    'Librarian',
    'Pilot',
    'Farmer',
    'Police Officer',
    'Firefighter',
    'Salesperson',
    'Barista',
    'Musician',
    'Athlete',
  ];
  projects: Project[] = [
    {
      title: 'Plumbing Upgrade',
      src: 'aouzal.jpeg',
      min: 100,
      max: 200,
    },
    {
      title: 'Electrical Renovation',
      src: 'path/to/image2.jpg',
      min: 150,
      max: 250,
    },
    { title: 'Deep Cleaning', src: 'path/to/image3.jpg', min: 120, max: 180 },
    {
      title: 'New Construction',
      src: 'path/to/image4.jpg',
      min: 200,
      max: 300,
    },
    {
      title: 'Apartment Cleaning',
      src: 'path/to/image5.jpg',
      min: 80,
      max: 150,
    },
    { title: 'Office Upgrade', src: 'path/to/image6.jpg', min: 170, max: 220 },
  ];

  taskers: Tasker[] = [
    {
      name: 'Ali Mohamed',
      slogan: 'Your Trusted Handyman',
      description:
        'Experienced in various home repair tasks. Customer satisfaction is my top priority!',
      rating: 95,
      img: 'ali-mohamed.jpg', // Placeholder image filename
      skills: [
        { description: 'Plumbing', pricePerHour: 70 },
        { description: 'Electrical Repair', pricePerHour: 100 },
        { description: 'Carpentry', pricePerHour: 120 },
      ],
      completedTaskNumber: 120,
    },

    {
      name: 'Mohamed Jamal',
      slogan: 'Your Friendly IT Guy',
      description:
        'Solving tech issues with a smile. From troubleshooting to setting up networks!',
      rating: 78,
      img: 'aouzal.jpeg', // Placeholder image filename
      skills: [
        { description: 'Computer Repair', pricePerHour: 350 },
        { description: 'Network Setup', pricePerHour: 300 },
        { description: 'Software Installation', pricePerHour: 250 },
      ],
      completedTaskNumber: 60,
    },

    {
      name: 'Ahmed Khalid',
      slogan: 'Skilled Carpenter',
      description:
        'Crafting wood into beautiful creations. From furniture to intricate woodwork!',
      rating: 85,
      img: 'ahmed-khalid.jpg', // Placeholder image filename
      skills: [
        { description: 'Custom Furniture', pricePerHour: 60 },
        { description: 'Wood Carving', pricePerHour: 80 },
        { description: 'Cabinet Making', pricePerHour: 60 },
      ],
      completedTaskNumber: 90,
    },
    {
      name: 'Youssef Hassan',
      slogan: 'Professional Electrician',
      description:
        'Ensuring your electrical systems are safe and efficient. Handling installations and repairs!',
      rating: 91,
      img: 'sara-hassan.jpg', // Placeholder image filename
      skills: [
        { description: 'Electrical Wiring', pricePerHour: 80 },
        { description: 'Lighting Installation', pricePerHour: 90 },
        { description: 'Appliance Repair', pricePerHour: 120 },
      ],
      completedTaskNumber: 110,
    },
  ];

  filteredOptions: string[];
  filteredCities: string[];

  constructor() {
    this.filteredOptions = this.options.slice();
    this.filteredCities = this.cities.slice();
  }

  filterOptions(): void {
    const filterValue = this.optionsInput.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter((o) =>
      o.toLowerCase().includes(filterValue)
    );
  }
  filterCities(): void {
    const filterValue = this.citiesInput.nativeElement.value.toLowerCase();
    this.filteredCities = this.cities.filter((o) =>
      o.toLowerCase().includes(filterValue)
    );
  }
}