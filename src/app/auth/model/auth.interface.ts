import { BaseMongoFields } from "../../model/app.model";
import { User } from "../../model/user.type";

export interface authState {
  refreshToken: string | null;
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
  message: string;
  isRegisterd: boolean;
}

export interface IloginPayload {
  email: string;
  password: string;
}


export interface IloginResponse extends BaseMongoFields {
  refreshToken:string;
  accessToken:string;
  user: User;
  message: string;
}