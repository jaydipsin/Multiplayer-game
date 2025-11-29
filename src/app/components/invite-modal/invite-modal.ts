import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invite-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './invite-modal.html',
  styleUrl: './invite-modal.css',
})
export class InviteModal {
  @Input() modalType: 'input' | 'receive' = 'input';

  @Input() title: string = 'GAME INVITATION';

  @Input() shareCode: string = '';

  @Input() inviterName: string = '';

  @Output() confirm = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();

  @Output() rejectInvite = new EventEmitter<void>();

  @Output() acceptInvite = new EventEmitter<void>();

  public enteredCode: string = '';

  onDialogClick(event: Event): void {
    event.stopPropagation();
  }

  onCloseClick(): void {
    this.close.emit();
  }

  onConfirmClick(): void {
    if (this.enteredCode.length === 6) {
      this.confirm.emit(this.enteredCode);
    }
  }

  onRejectClick() {
    this.rejectInvite.emit();
  }
  onAcceptClick() {
    this.acceptInvite.emit();
  }
}
