import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Toast } from '../../shared/toastr.service';

@Component({
  selector: 'app-toastr',
  imports: [CommonModule],
  templateUrl: './toastr.html',
  styleUrl: './toastr.css',
})
export class Toastr {
  @Input({ required: true }) toast!: Toast;
  @Output() closed = new EventEmitter<number>();

  // Helpers for template access
  get type() {
    return this.toast.type;
  }
  get title() {
    return this.toast.title;
  }
  get message() {
    return this.toast.message;
  }

  // This function is called by (click) AND (animationend)
  close() {
    this.closed.emit(this.toast.id);
  }
}
