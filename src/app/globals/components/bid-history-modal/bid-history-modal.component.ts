import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bid } from '../../../types/bid.types';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-bid-history-modal',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './bid-history-modal.component.html',
  styleUrl: './bid-history-modal.component.scss'
})
export class BidHistoryModalComponent {
  @Input() bids: Bid[] = [];
  @Input() isVisible: boolean = false;
  @Output() closeModalEvent: EventEmitter<void> = new EventEmitter<void>();

  closeModal(): void {
    this.isVisible = false;
    this.closeModalEvent.emit();
  }
}
