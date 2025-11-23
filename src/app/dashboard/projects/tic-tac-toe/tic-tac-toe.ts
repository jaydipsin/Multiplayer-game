import { Component, OnInit, signal } from '@angular/core';
import { DialogModal } from '../../../components/dialog-modal/dialog-modal';
import { InviteModal } from '../../../components/invite-modal/invite-modal';
import { SocketService } from '../../../services/socket.service';
import { Router } from '@angular/router';
import { Toastr } from '../../../components/toastr/toastr';
import { ToastrService } from '../../../shared/toastr.service';

@Component({
  selector: 'app-tic-tac-toe',
  imports: [DialogModal, InviteModal, Toastr],
  templateUrl: './tic-tac-toe.html',
  styleUrl: './tic-tac-toe.css',
})
export class TicTacToe implements OnInit {
  // --- Game State Properties ---
  board: (string | null)[] = [];
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;
  isDraw = false;
  statusMessage = '';
  scores = { X: 0, O: 0 };
  isGameStart = signal(false);

  // --- Placeholder User Info ---
  userName = 'Spider-User';
  avatarUrl = '';

  constructor(
    private socketService: SocketService,
    private router: Router,
    public toastService: ToastrService
  ) {
    // Listen to incoming invites

    this.socketService.onGameStart.subscribe((game) => {
      if (game) {
        console.log('Game started!', game);
        // Navigate to game room
        this.router.navigate(['/game', game.roomId]);
      }
    });
  }

  // Your perfect method

  ngOnInit(): void {
    // this.startNewGame();
  }

  /** Resets the game board to its initial state for a new round */
  startNewGame(): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.isDraw = false;
    this.updateStatusMessage();
  }

  onInviteCode(code: string) {
    this.socketService.sendInvite(code);
    this.toastService.show('info', 'Invitation Sent', '');
  }

  /** Handles a player's move when a cell is clicked */
  makeMove(index: number): void {
    if (this.board[index] || this.winner) {
      return; // If the cell is taken or the game is over, do nothing
    }

    this.board[index] = this.currentPlayer;
    this.checkForWinner();

    if (!this.winner) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      this.updateStatusMessage();
    }
  }

  /** Checks all winning combinations and for a draw */
  private checkForWinner(): void {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        this.winner = this.currentPlayer;
        this.scores[this.winner as 'X' | 'O']++;
        this.updateStatusMessage();
        return;
      }
    }

    // If all cells are filled and there's no winner, it's a draw
    if (!this.board.includes(null)) {
      this.isDraw = true;
      this.updateStatusMessage();
    }
  }

  /** Updates the main status message based on the game state */
  private updateStatusMessage(): void {
    if (this.winner) {
      this.statusMessage = `[ PLAYER ${this.winner} WINS! ]`;
    } else if (this.isDraw) {
      this.statusMessage = `[ STALEMATE ]`;
    } else {
      this.statusMessage = `[ PLAYER ${this.currentPlayer}'S_TURN ]`;
    }
  }
}
