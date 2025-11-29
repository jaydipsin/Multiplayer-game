interface Project {
  name: string;
  description: string;
  imageUrl: string;
  lastUpdate: string; // or Date if you plan to store it as a Date object
  link: string;
}

export interface GameRoom {
  roomId: string;
  board: (string | null)[];
  currentTurn: "X" | "O";
  players: {
    X: PlayerInfo;
    O: PlayerInfo;
  };
  yourSymbol: "X" | "O";
  opponent: OpponentInfo;
}

export interface PlayerInfo {
  username: string;
  code: string;
  userId: string;
}

export interface OpponentInfo {
  userId: string;
  socketId: string;
  username: string;
  code: string;
}
