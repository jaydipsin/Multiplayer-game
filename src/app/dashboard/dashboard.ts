import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { SocketService } from '../services/socket.service';
import { HandleGameRequest } from '../shared/handle-game-req.service';
import { Toastr } from '../components/toastr/toastr';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Toastr],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  isToastrVisible: boolean = false;

  constructor(private handleReciveReq: HandleGameRequest) {}

  ngOnInit(): void {
  }

}
