import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './model/state.interface';
import { autoLogin } from './store/app.action';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  constructor(private store: Store<AppState>, private socketService: SocketService) {}

  ngOnInit(): void {
    this.autoLogin();
    this.socketService.connect();
  }

  autoLogin() {
    this.store.dispatch(autoLogin());
  }

  protected readonly title = signal('frontend');
}
