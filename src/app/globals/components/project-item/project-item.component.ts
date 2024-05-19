import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { ProjectDto } from '../../../types/projectDto.types'; 
import { MediaItem } from '../../../types/media.types';
import { NgIf } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HammerModule } from '@angular/platform-browser';
import { BidService } from '../../../servicies/bid.service';
import { BidModalComponent } from '../bid-modal/bid-modal.component';
import { jwtDecode } from 'jwt-decode';
import { Bid } from '../../../types/bid.types';
import { FeedbackModalComponent } from '../feedback-modal/feedback-modal.component';
import { BidHistoryModalComponent } from '../bid-history-modal/bid-history-modal.component';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [NgIf, ImageCropperModule, HammerModule,BidModalComponent,BidHistoryModalComponent],
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent {

  @Input() project!: ProjectDto;
  @Input() mediaList!: MediaItem[];
  @Input() userEmail!:string;

  @Output() bidPlaced: EventEmitter<string> = new EventEmitter<string>();
  @Output() showBidHistory: EventEmitter<void> = new EventEmitter<void>();

  desiredWidth = 300;
  desiredHeight = 200;
  currentImageIndex: number = 0;
  croppedImages: any[] = [];
  isBidModalOpen: boolean = false;
  isBidHistoryModalVisible: boolean = false;
  mail!:string;
  bidDto:any={}

  latestBid!: Bid;
  allBids!:Bid[];

  ngOnInit(): void {
    this.decodeToken();
    this.resizeMediaImages();
    this.bidDto= {
      id:'',
      projectId: this.project.id, // Id-ul proiectului
      creationDate: new Date().toISOString(), // Data curentă
      bidderEmail: this.mail, // Va fi completat mai târziu cu adresa de email a utilizatorului logat
      amount: '', // Va fi completat mai târziu cu suma din modal
      message: '' // Va fi completat mai târziu cu mesajul din modal
    };

    this.fetchLatestBid();

  }

  decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken) {
         this.mail= decodedToken.sub;
        console.log('Email-ul este:', this.mail);
      } else {
        console.error('Token-ul JWT nu poate fi decodat.');
      }
    } else {
      console.error('Token-ul nu a fost găsit în localStorage.');
    }
  }

  bidService=inject(BidService)

  navigateToNextImage(): void {
    if (this.mediaList && this.currentImageIndex < this.mediaList.length - 1) {
      this.currentImageIndex++;
    }
  }

  navigateToPreviousImage(): void {
    if (this.mediaList && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  

  async resizeMediaImages(): Promise<void> {
    for (let i = 0; i < this.mediaList.length; i++) {
      const resizedImage = await this.resizeImage(this.mediaList[i].imageUrl);
      this.mediaList[i].imageUrl = resizedImage;
    }
  }

  resizeImage(imageURL: any): Promise<string> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');

        const aspectRatio = image.width / image.height;

        let newWidth = 300;
        let newHeight = 200;
        if (aspectRatio > 1) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, newWidth, newHeight);
        }
        const data = canvas.toDataURL('image/jpeg', 1);
        resolve(data);
      };
      image.src = imageURL;
    });
  }


  openBidModal(): void {
    this.isBidModalOpen = true;
  }

  closeBidModal(): void {
    this.isBidModalOpen = false;
  }


  submitBid(bidSum: number, messageToUser: string): void {
    this.bidDto.amount = bidSum.toString();
    this.bidDto.message = messageToUser;
    console.log("suntem in project-item", this.mail);

    this.bidService.postBid(this.bidDto).subscribe(response => {
      console.log('Licitația a fost trimisă cu succes!', this.bidDto);
      this.bidPlaced.emit('Bid placed successfully!');
      this.fetchLatestBid(); // Refresh bids after placing a bid
    }, error => {
      console.error('Eroare la trimiterea licitației:', error);
    });

    this.closeBidModal();
  }


  fetchLatestBid(): void {
    this.bidService.getBidsForProject(this.project.id).subscribe(
      (bids: Bid[]) => {
        this.allBids = bids;
        if (bids.length > 0) {
          this.latestBid = bids.sort((a, b) => b.creationDate.localeCompare(a.creationDate))[0];
        }
      },
      (error) => {
        console.error('Error fetching latest bid:', error);
      }
    );
  }
  
  openBidHistoryModal(): void {
    this.isBidHistoryModalVisible = true;
  }
  closeBidHistoryModal(): void {
    this.isBidHistoryModalVisible = false;
  }

  
}
