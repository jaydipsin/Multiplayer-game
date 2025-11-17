import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invite-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './invite-modal.html',
  styleUrl: './invite-modal.css',
})
export class InviteModal {
  @Input() mode: 'share' | 'enter' = 'share';

  @Input() title: string = 'GUEST INVITATION';

  @Input() shareCode: string = 'LFG-42';

  @Output() confirm = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();

  public enteredCode: string = '';

  onDialogClick(event: Event): void {
    event.stopPropagation();
  }

  onCloseClick(): void {
    this.close.emit();
  }

  onConfirmClick(): void {
    this.confirm.emit(this.enteredCode);
    this.onCloseClick();
  }
}
