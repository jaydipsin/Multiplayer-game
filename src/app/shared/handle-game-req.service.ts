import { Injectable } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Injectable({ providedIn: 'root' })
export class HandleGameRequest {
  constructor(private socketService: SocketService) {}

  onReqRecive() {
    this.socketService.onReceiveInvite.subscribe((invite) => {
      if (invite) {
        const accept = confirm(`${invite.fromName} (${invite.fromCode}) wants to play! Accept?`);
        if (accept) {
          this.socketService.acceptInvite(invite.fromSocketId);
        } else {
          this.socketService.rejectInvite(invite.fromSocketId);
        }
      }
    });
  }
  onRejectReq() {
    this.socketService.onInviteRejected.subscribe((invite) => {
      console.log(invite);
    });
  }
}
