import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { DialogModal } from '../../../components/dialog-modal/dialog-modal';
import { InviteModal } from '../../../components/invite-modal/invite-modal';
import { SocketService, Invite } from '../../../services/socket.service';
import { Router } from '@angular/router';
import { Toastr } from '../../../components/toastr/toastr';
import { ToastrService } from '../../../shared/toastr.service';
import { Subscription } from 'rxjs';
import { Localstorage } from '../../../services/localstorage';
import { ACTIVE_GAME_ROOM } from '../../../constants';
import { GameRoom } from '../../model/interface';

@Component({
  selector: 'app-tic-tac-toe',
  imports: [InviteModal, Toastr],
  templateUrl: './tic-tac-toe.html',
  styleUrl: './tic-tac-toe.css',
  standalone: true,
})
export class TicTacToe implements OnInit, OnDestroy {
  // Game State
  board = signal<(string | null)[]>(Array(9).fill(null));
  currentPlayer = signal<'X' | 'O'>('X');
  winner = signal<string | null>(null);
  isDraw = signal(false);
  statusMessage = signal('');

  // Multiplayer State
  roomId = signal<string | null>(null);
  mySymbol = signal<'X' | 'O' | null>(null);
  opponentName = signal<string>('');
  isMyTurn = signal(false);
  isWaitingForOpponent = signal(false);
  userDetails: any;

  // Invite Modal Control
  isReciveInvitation = signal(false);
  showInviteModal = signal(false);
  incomingInvite = signal<Invite | null>(null);

  // Game Active Flag
  isGameActive = signal(false);
  scores = signal<{ X: number; O: number }>({ X: 0, O: 0 });

  private sub = new Subscription();

  constructor(
    private socketService: SocketService,
    private router: Router,
    public toastService: ToastrService,
    private localStorageService: Localstorage
  ) {
    // Auto-update status message when relevant signals change
    effect(() => {
      this.updateStatusMessage();
    });
  }

  ngOnInit(): void {
    // Listen to all real-time events
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    // Incoming Invite
    this.sub.add(
      this.socketService.onReceiveInvite.subscribe((invite) => {
        if (invite && !this.isGameActive()) {
          this.isReciveInvitation.set(true);
          this.incomingInvite.set(invite);
          this.showInviteModal.set(true);
          this.toastService.show('info', `Invite from ${invite.fromName} (${invite.fromCode})`, '');
        }
      })
    );

    this.sub.add(
      this.socketService.user$.subscribe({
        next: (res) => {
          this.userDetails = res;
        },
      })
    );

    // Invite Sent Confirmation
    this.sub.add(
      this.socketService.onInviteSent.subscribe((toCode) => {
        if (toCode) {
          this.isReciveInvitation.set(false);
          this.toastService.show('success', `Invite sent to ${toCode}!`, 'Waiting for response...');
        }
      })
    );

    // Invite Rejected
    this.sub.add(
      this.socketService.onInviteRejected.subscribe((message) => {
        if (message) {
          this.toastService.show('error', 'Invite Rejected', message);
        }
      })
    );

    // Invite Error (user offline, self-invite, etc.)
    this.sub.add(
      this.socketService.onInviteError.subscribe((message) => {
        if (message) {
          this.toastService.show('error', 'Invite Failed', message);
        }
      })
    );

    // To start the game
    this.sub.add(this.startGame());

    // to oppnent move
    this.sub.add(
      this.socketService.onOpponentMove.subscribe(
        (move: { index: number; symbol: 'X' | 'O'; nextTurn: 'X' | 'O' }) => {
          if (move && this.isGameActive()) {
            // 1. Update the board
            this.board.update((b) => {
              b[move.index] = move.symbol;
              return [...b];
            });

            // 2. Update the Global Current Player (IMPORTANT: You were missing this!)
            this.currentPlayer.set(move.nextTurn);

            // 3. Update "Is it My Turn?" based on the NEW current player
            const isItMyTurnNow = move.nextTurn === this.mySymbol();
            this.isMyTurn.set(isItMyTurnNow);

            // 4. Update status message so user sees "Opponent's Turn"
            this.updateStatusMessage();
          }
        }
      )
    );

    // Game Over from server (with result)
    this.sub.add(
      this.socketService.onGameOver.subscribe((result: any) => {
        if (result) {
          this.isGameActive.set(false);
          // Update persistent scores from server
          if (result.scores) {
            this.scores.set(result.scores);
          }

          if (result.winner) {
            const won = result.winner === this.mySymbol();
            this.winner.set(result.winner);
            this.isGameActive.set(false);
            this.toastService.show(won ? 'success' : 'error', won ? 'You Win!' : 'You Lose!', '');
          } else if (result.draw) {
            this.isDraw.set(true);
          }
        }
      })
    );

    this.sub.add(
      this.socketService.onGameRestarted.subscribe((data: any) => {
        if (data) {
          // Reset UI state but keep the session alive
          this.board.set(data.board);
          this.currentPlayer.set(data.currentTurn);
          this.isMyTurn.set(this.mySymbol() === data.currentTurn);
          this.winner.set(null);
          this.isDraw.set(false);
          this.isGameActive.set(true);
          this.toastService.show('info', 'Round Restarted!', 'Good luck!');
        }
      })
    );

    this.sub.add(
      this.socketService.onGameClosed.subscribe((data: any) => {
        if (data) {
          this.isGameActive.set(false);
          this.winner.set(null);
          this.isDraw.set(false);

          this.board.set(Array(9).fill(null));
          this.roomId.set(null);

          this.socketService.onGameClosed.next(null);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }
  // To close the invite modal
  onCloseModal() {
    console.log('test');
    this.router.navigate(['/dashboard']);
  }

  startGame() {
    // Game Actually Starts
    this.socketService.onGameStart.subscribe((gameData: GameRoom) => {
      console.log(gameData);

      if (gameData) {
        this.roomId.set(gameData.roomId);
        this.mySymbol.set(gameData.yourSymbol); // Now correct: "X" or "O"
        this.opponentName.set(
          gameData.yourSymbol === 'X' ? gameData.players.O.username : gameData.players.X.username
        );
        this.isMyTurn.set(gameData.yourSymbol === 'X'); // X starts
        this.isGameActive.set(true);
        this.isWaitingForOpponent.set(false);
        this.board.set(Array(9).fill(null));
        this.winner.set(null);
        this.isReciveInvitation.set(false);
        this.isDraw.set(false);

        this.localStorageService.setData(ACTIVE_GAME_ROOM, gameData.roomId);

        this.toastService.show(
          'success',
          `Game started! You are ${gameData.yourSymbol}`,
          `vs ${this.opponentName()}`
        );
      }
    });
  }

  // Called from Invite Modal (child component)
  onInviteCode(code: string): void {
    if (!code.trim() || this.isGameActive()) return;
    console.log('eeeee Code : ', code);

    this.socketService.sendInvite(code.toUpperCase().trim());
    this.showInviteModal.set(false);
  }

  acceptInvite(): void {
    const invite = this.incomingInvite();
    if (invite) {
      this.socketService.acceptInvite(invite.fromSocketId);
      this.isWaitingForOpponent.set(true);
      this.toastService.show('info', 'Invite accepted!', 'Waiting for opponent...');
    }
    this.closeInviteModal();
  }

  rejectInvite(): void {
    const invite = this.incomingInvite();
    if (invite) {
      this.socketService.rejectInvite(invite.fromSocketId);
      this.toastService.show(
        'error',
        'Invite rejected',
        `You declined ${invite.fromName}'s invite`
      );
    }
    this.closeInviteModal();
  }

  closeInviteModal(): void {
    this.showInviteModal.set(false);
    this.incomingInvite.set(null);
  }

  // Player clicks a cell
  makeMove(index: number): void {
    if (
      !this.isGameActive() ||
      this.board()[index] ||
      !this.isMyTurn() ||
      this.winner() ||
      this.isDraw()
    ) {
      console.log(
        !this.isGameActive(),
        this.board()[index],
        !this.isMyTurn(),
        this.winner(),
        this.isDraw()
      );

      return;
    }

    // Optimistically update UI
    this.board.update((b) => {
      b[index] = this.mySymbol()!;
      return [...b];
    });

    // Send move to server
    this.socketService.makeMove(this.roomId()!, index);

    // Switch turn locally
    this.isMyTurn.set(false);
  }

  // Restart game
  onRestartGame() {
    const currentRoom = this.roomId();
    if (!currentRoom) {
      console.error('Cannot restart: No Room ID found');
      return;
    }
    this.socketService.restartGame(currentRoom);
  }

  onExitGame() {
    const rid = this.roomId();

    if (rid) {
      this.socketService.exitGame(rid); // Call the socket event
      this.localStorageService.removeDate(ACTIVE_GAME_ROOM);
      this.router.navigate(['/dashboard']);
      this.isGameActive.set(false);
    }
    this.router.navigate(['/dashboard']);
  }

  private updateStatusMessage(): void {
    if (this.winner()) {
      const won = this.winner() === this.mySymbol();
      this.statusMessage.set(won ? 'YOU WIN!' : 'OPPONENT WINS!');
    } else if (this.isDraw()) {
      this.statusMessage.set('DRAW!');
    } else if (this.isWaitingForOpponent()) {
      this.statusMessage.set('Waiting for opponent...');
    } else if (!this.isGameActive()) {
      this.statusMessage.set('Find an opponent to play!');
    } else {
      this.statusMessage.set(this.isMyTurn() ? 'Your turn!' : "Opponent's turn");
    }
  }

  ngOnDestroy(): void {
    this.socketService.onGameClosed.next(null);
    this.socketService.onGameOver.next(null);
    this.socketService.onGameRestarted.next(null);
    this.socketService.onGameStart.next(null);
    this.socketService.onInviteError.next(null);
    this.socketService.onInviteRejected.next(null);
    this.socketService.onInviteSent.next(null);
    this.socketService.onReceiveInvite.next(null);
    this.sub.unsubscribe();
  }
}
