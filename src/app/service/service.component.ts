import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {UserService} from "../Services/user.service";
import {Project} from "../home/project";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit{
    projectlist:any[]=[];
    constructor(private userService: UserService) {

    }
    ngOnInit(): void {
        this.userService.getproject().subscribe(
          (project:any)=>{
            console.log("projects",project)
            this.projectlist=project
            console.log("da",this.projectlist[0])

          },
        (error) => {
        console.error('Error fetching client:', error);
        // Handle error as needed
      }
        )
    }

}
