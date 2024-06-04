import { Component, ViewChild, inject } from '@angular/core';
import { PostFormComponent } from '../../globals/components/post-form/post-form.component';
import { NgIf } from '@angular/common';

import { FeedbackModalComponent } from '../../globals/components/feedback-modal/feedback-modal.component';
import { jwtDecode } from 'jwt-decode';
import { ListingService } from '../../servicies/listing.service';
import { ProjectService } from '../../servicies/project.service';
import { MediaService } from '../../servicies/media.service';

@Component({
  selector: 'app-create-post-page',
  standalone: true,
  imports: [PostFormComponent, NgIf, FeedbackModalComponent],
  templateUrl: './create-post-page.component.html',
  styleUrls: ['./create-post-page.component.scss']
})
export class CreatePostPageComponent {
  @ViewChild(FeedbackModalComponent) feedbackModal!: FeedbackModalComponent;
  showForm: boolean = false; // Variabila pentru controlul afișării formularului
  formData: any = {};
  userEmail: string = "";
  listingService = inject(ListingService);
  projectService = inject(ProjectService);
  mediaService = inject(MediaService);
  isProject: boolean = false;
  hasClicked: boolean = false; // Variable to track button click

  ngOnInit() {
    // Apelează funcția decodeToken() la inițializarea paginii
    this.decodeToken();
  }

  // Metoda pentru afișarea formularului de creare a listării
  showListingForm() {
    this.showForm = true;
    this.isProject = false;
    this.hasClicked = true; // Set to true when a button is clicked
  }

  showProjectForm() {
    this.showForm = true;
    this.isProject = true;
    this.hasClicked = true; // Set to true when a button is clicked
  }


  onFormSubmitted(formData: any) {
    this.formData = formData;
    this.formData.userEmail = this.userEmail!;
    console.log(formData);

    if (this.isProject) {
      this.projectService.postProject(this.formData).subscribe(
        (response) => {
          const projectId = response.id; // Adaptează în funcție de răspunsul API-ului
          this.uploadFiles('project_id', projectId, formData.images);
        },
        (error) => {
          console.error('Error creating project:', error);
        }
      );
    } else {
      this.listingService.postListing(this.formData).subscribe(
        (response) => {
          const listingId = response.id; // Adaptează în funcție de răspunsul API-ului
          this.uploadFiles('listing_id', listingId, formData.images);
        },
        (error) => {
          console.error('Error creating listing:', error);
        }
      );
    }
  }

  uploadFiles(whichEntity: string, entityId: string, files: File[]): void {
    console.log("in update files",files)
    this.mediaService.uploadMedia(whichEntity, entityId, files).subscribe(
      (response) => {
        this.showCompletionMessage(`${whichEntity} created and files uploaded successfully!`);
        console.log(`${whichEntity} created and files uploaded successfully!`, response);
      },
      (error) => {
        console.error(`Error uploading files for ${whichEntity}:`, error);
      }
    );
  }

  decodeToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken) {
        this.userEmail = decodedToken.sub!;
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
