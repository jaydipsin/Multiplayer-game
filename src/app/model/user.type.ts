export interface User {
  _id: string;          // MongoDB ObjectId as string
  username: string;
  email: string;
  code: string;
  isOnline: boolean;
  lastSeen: string;     // ISO date string
  createdAt: string;    // also ISO date string
  updatedAt: string;
}