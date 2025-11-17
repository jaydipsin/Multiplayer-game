import { BaseMongoFields } from '../../model/app.model';
import { User } from '../../model/user.type';

export interface authState {
  accessToken: string | null;
  isAuthenticated: boolean;
  errorMessage: string | null;
}

export interface IsingUpPayload {
  username: string;
  email: string;
  password: string;
}

export interface IsignUpResponse {
  accessToken: string;
  user: User;
  message: string;
}

export interface IloginPayload {
  email: string;
  password: string;
}

export interface IloginResponse extends BaseMongoFields {
  accessToken: string;
  user: User;
  message: string;
}
