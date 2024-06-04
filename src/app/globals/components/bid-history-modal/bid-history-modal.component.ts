import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bid } from '../../../types/bid.types';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-bid-history-modal',
  standalone: true,
  imports: [NgFor,NgIf,NgClass],
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
  
}
