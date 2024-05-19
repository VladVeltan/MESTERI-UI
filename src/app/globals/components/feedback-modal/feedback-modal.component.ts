import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.scss'
})
export class FeedbackModalComponent {
  
  @Input() message: string = '';
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  isVisible: boolean = false;

  showMessage(message: string): void {
    this.message = message;
    this.isVisible = true;
  }

  hideModal(): void {
    this.isVisible = false;
    this.message = '';
    this.closeModal.emit();
  }
}