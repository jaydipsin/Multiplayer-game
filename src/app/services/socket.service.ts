// services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { URL } from '../enviroment';

export interface User {
  _id: string;
  username: string;
  email: string;
  code: string;
  isOnline: boolean;
}

export interface Invite {
  fromName: string;
  fromCode: string;
  fromSocketId: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  // Game events
  public onReceiveInvite = new BehaviorSubject<Invite | null>(null);
  public onInviteSent = new BehaviorSubject<string | null>(null);
  public onInviteError = new BehaviorSubject<string | null>(null);
  public onInviteRejected = new BehaviorSubject<string | null>(null);
  public onGameStart = new BehaviorSubject<any>(null);
  public onGameRestarted = new BehaviorSubject<any>(null);
  public onOpponentMove = new BehaviorSubject<any>(null);
  public onGameOver = new BehaviorSubject<any>(null);
  public onGameClosed = new BehaviorSubject<any>(null);

  connect(userId: string) {
    console.log(userId);

    this.socket = io(URL, {
      transports: ['websocket'],
      auth: { userId },
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id);
    });

    this.socket.on('joined', (data: User) => {
      console.log('You are online:', data);
      this.userSubject.next(data);
    });

    this.socket.on('receive-invite', (invite: Invite) => {
      this.onReceiveInvite.next(invite);
    });

    this.socket.on('invite-sent', ({ toCode }: { toCode: string }) => {
      this.onInviteSent.next(toCode);
      console.log('Invitation sent : ', toCode);
    });

    this.socket.on('invite-error', ({ message }: { message: string }) => {
      this.onInviteError.next(message);
    });

    this.socket.on('invite-rejected', ({ message }: { message: string }) => {
      this.onInviteRejected.next(message);
    });

    this.socket.on('game-start', (gameData) => {
      this.onGameStart.next(gameData);
    });

    this.socket.on('opponent-move', (move) => {
      this.onOpponentMove.next(move);
    });

    this.socket.on('game-restarted', (data) => {
      this.onGameRestarted.next(data);
    });

    this.socket.on('game-over', (result) => {
      this.onGameOver.next(result);
    });
    this.socket.on('game-closed', (result) => {
      this.onGameClosed.next(result);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  // Your perfect method
  sendInvite(code: string) {
    this.socket.emit('send-invite', { toCode: code.toUpperCase().trim() });
  }

  acceptInvite(fromSocketId: string) {
    this.socket.emit('accept-invite', { fromSocketId });
  }

  rejectInvite(fromSocketId: string) {
    this.socket.emit('reject-invite', { fromSocketId });
  }

  makeMove(roomId: string, index: number) {
    console.log('Moved ');

    this.socket.emit('make-move', { roomId, index });
  }

  // Update the method to accept roomId
  restartGame(roomId: string) {
    // MATCH THE BACKEND EVENT NAME: 'restart-game'
    // AND PASS THE ROOMID OBJECT
    this.socket.emit('restart-game', { roomId });
  }
  exitGame(roomId: string) {
    this.socket.emit('exit-game', { roomId });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
