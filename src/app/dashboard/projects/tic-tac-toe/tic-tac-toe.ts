import { Component, OnInit, signal } from '@angular/core';
import { DialogModal } from '../../../components/dialog-modal/dialog-modal';
import { InviteModal } from "../../../components/invite-modal/invite-modal";

@Component({
  selector: 'app-tic-tac-toe',
  imports: [DialogModal, InviteModal],
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
  avatarUrl = 'https://images.unsplash.com/photo-1531297484001-80022131c5a9?w=100';

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
