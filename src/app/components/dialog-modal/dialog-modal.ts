import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-modal',
  imports: [],
  templateUrl: './dialog-modal.html',
  styleUrl: './dialog-modal.css',
})
export class DialogModal {
  @Input() title: string = 'Title';
  @Input() description: string = 'Description';

  @Output() closeButtonClick = new EventEmitter();

  onClose() {
    this.closeButtonClick.emit();
  }
}
