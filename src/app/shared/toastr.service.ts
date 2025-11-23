import { Injectable, signal } from '@angular/core';
export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastrService {
  toasts = signal<Toast[]>([]);

  show(type: Toast['type'], title: string, message: string) {
    const toast = {
      id: Date.now(),
      type,
      title,
      message,
    };
    this.toasts.update((curr) => [...curr, toast]);
  }

  remove(id: number) {
    this.toasts.update((curr) => curr.filter((val) => val.id !== id));
  }
}
