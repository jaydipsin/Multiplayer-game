import { Injectable, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Localstorage } from './localstorage';

@Injectable({ providedIn: 'root' })
export class SocketService {
  socket!: Socket;
  constructor(private localStorageService: Localstorage) {}
  userId: string = '';

  connect() {
    const user = this.localStorageService.getUser();
    this.userId = user?.['user']?._id;

    return (this.socket = io('http://localhost:8000', {
      transports: ['websocket'], // optional but recommended
      auth: {
        userId: this.userId,
      },
    }));
  }

  listen(event: string) {
    this.socket.on(event, (res: any) => res);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
