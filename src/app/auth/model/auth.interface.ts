import { BaseMongoFields } from '../../model/app.model';
import { User } from '../../model/user.type';

export interface authState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: null | User;
  errorMessage: string | null;
}

export interface IsingUpPayload {
  username: string;
  email: string;
  password: string;
}

export interface IsignUpResponse {
  accessToken: string;
  message: string;
  user: User;
}

export interface IloginPayload {
  email: string;
  password: string;
}

export interface IloginResponse {
  accessToken: string;
  message: string;
  user: User;
}
