import { Component, ViewChild, inject } from '@angular/core';
import { PostFormComponent } from '../../globals/components/post-form/post-form.component';
import { NgIf } from '@angular/common';
import { ListingService } from '../../servicies/listing.service';
import { ListingDto } from '../../types/listingDto.types';
import { ProjectDto } from '../../types/projectDto.types';
import { jwtDecode } from 'jwt-decode';
import { ProjectService } from '../../servicies/project.service';
import { FeedbackModalComponent } from '../../globals/components/feedback-modal/feedback-modal.component';

@Component({
  selector: 'app-create-post-page',
  standalone: true,
  imports: [PostFormComponent,NgIf,FeedbackModalComponent],
  templateUrl: './create-post-page.component.html',
  styleUrl: './create-post-page.component.scss'
})
export class CreatePostPageComponent {
  @ViewChild(FeedbackModalComponent) feedbackModal!: FeedbackModalComponent;
  showForm: boolean = false; // Variabila pentru controlul afișării formularului
  formData:any={};
  userEmail:string=""
  listingService=inject(ListingService);
  projectSerivce=inject(ProjectService)
  isProject: boolean = false;


  ngOnInit() {
    // Apelează funcția decodeToken() la inițializarea paginii
    this.decodeToken();
  }

  // Metoda pentru afișarea formularului de creare a listării
  showListingForm() {
    this.showForm = true;
  }

  showProjectForm() {
    this.showForm = true;
    this.isProject = true; 
  }


  onFormSubmitted(formData:any) {
    this.formData = formData;
    this.formData.userEmail=this.userEmail!
    console.log(formData)

    if (this.isProject){
      this.projectSerivce.postProject(this.formData).subscribe(
        (response) => {
          this.showCompletionMessage('Project created successfully!');
          console.log('Project created successfully!', response);
        },
        (error) => {
          console.error('Error creating project:', error);
        }
      );
    }
    else{
      this.listingService.postListing(this.formData).subscribe(
        (response) => {
          this.showCompletionMessage('Listing created successfully!');
          console.log('Listing created successfully!', response);
        },
        (error) => {
          console.error('Error creating listing:', error);
        }
      );
    }
    
  }

  
  decodeToken() {
    var token = localStorage.getItem('token');
    if (token) {
      var decodedToken = jwtDecode(token);
      if (decodedToken) {
        this.userEmail= decodedToken.sub!;
        console.log('Email-ul este:', this.userEmail);
      } else {
        console.error('Token-ul JWT nu poate fi decodat.');
      }
    } else {
      console.error('Token-ul nu a fost găsit în localStorage.');
    }
  }


  showCompletionMessage(message: string): void {
    this.feedbackModal.showMessage(message);
    setTimeout(() => {
      this.feedbackModal.hideModal();
    }, 3000); // Adjust duration as needed
  }
  
}

