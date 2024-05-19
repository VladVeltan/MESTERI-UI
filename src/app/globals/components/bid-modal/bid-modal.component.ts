import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bid } from '../../../types/bid.types';

@Component({
  selector: 'app-bid-modal',
  standalone: true,
  imports: [FormsModule,NgFor,NgIf],
  templateUrl: './bid-modal.component.html',
  styleUrl: './bid-modal.component.scss'
})
export class BidModalComponent {
  @Input() bids: Bid[] = [];
  bidSum: number = 0;
  messageToUser: string = '';

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitBid: EventEmitter<{ bidSum: number, messageToUser: string }> = new EventEmitter<{ bidSum: number, messageToUser: string }>();

  submitBidForm(): void {
    if (this.bids.length > 0 && this.bidSum >= Math.min(...this.bids.map(bid => Number(bid.amount)))) {
      alert('The bid amount must be lower than the current lowest bid.');
      return;
    }
    this.submitBid.emit({ bidSum: this.bidSum, messageToUser: this.messageToUser });
    this.closeModal.emit();
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }
}
