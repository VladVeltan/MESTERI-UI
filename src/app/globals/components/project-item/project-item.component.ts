import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ProjectDto } from '../../../types/projectDto.types'; 
import { MediaItem } from '../../../types/media.types';
import { NgIf } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HammerModule } from '@angular/platform-browser';
import { BidService } from '../../../servicies/bid.service';
import { BidModalComponent } from '../bid-modal/bid-modal.component';
import {jwtDecode} from 'jwt-decode';
import { Bid } from '../../../types/bid.types';
import { BidHistoryModalComponent } from '../bid-history-modal/bid-history-modal.component';
import { MaterialModule } from '../../modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, ImageDialogComponent } from '../image-dialog/image-dialog.component';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [NgIf, ImageCropperModule, HammerModule, BidModalComponent, BidHistoryModalComponent, MaterialModule],
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {
  @Input() project!: ProjectDto;
  @Input() mediaList!: MediaItem[];
  @Input() userEmail!: string;

  @Output() bidPlaced: EventEmitter<string> = new EventEmitter<string>();
  @Output() showBidHistory: EventEmitter<void> = new EventEmitter<void>();

  desiredWidth = 300;
  desiredHeight = 200;
  currentImageIndex: number = 0;
  croppedImages: any[] = [];
  isBidModalOpen: boolean = false;
  isBidHistoryModalVisible: boolean = false;
  mail!: string;
  bidDto: any = {};

  latestBid!: Bid;
  allBids!: Bid[];

  remainingTime: string = '';
  dialog = inject(MatDialog);
  bidService = inject(BidService);
  actionDuration: number = 3; // Example duration in days

  ngOnInit(): void {
    this.decodeToken();
    this.resizeMediaImages();
    this.bidDto = {
      id: '',
      projectId: this.project.id,
      creationDate: new Date().toISOString(),
      bidderEmail: this.mail,
      amount: '',
      message: ''
    };
    this.fetchLatestBid();
    this.updateRemainingTime();
    setInterval(() => this.updateRemainingTime(), 1000);
  }

  decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken) {
        this.mail = decodedToken.sub;
        console.log('Email-ul este:', this.mail);
      } else {
        console.error('Token-ul JWT nu poate fi decodat.');
      }
    } else {
      console.error('Token-ul nu a fost găsit în localStorage.');
    }
  }

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

  openImageDialog(index: number): void {
    const imageUrls = this.mediaList.map(media => media.imageUrl);
    const dialogData: DialogData = { images: imageUrls, currentIndex: index };
    this.dialog.open(ImageDialogComponent, { data: dialogData });
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

  getFormattedDate(date: string): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  getFormattedTime(date: string): string {
    const d = new Date(date);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

  getRemainingBiddingTime(creationDate: string, actionDuration: number): string {
    const creation = new Date(creationDate);
    const now = new Date();
    const end = new Date(creation.getTime() + actionDuration * 24 * 60 * 60 * 1000); // assuming actionDuration is in days

    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return "Bidding closed";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return diffDays > 2 ? `${diffDays} days` : `${diffHrs} hours`;
  }

  updateRemainingTime(): void {
    this.remainingTime = this.getRemainingBiddingTime(this.project.creationDate, this.actionDuration);
  }
}
