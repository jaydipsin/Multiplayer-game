import { authState } from '../model/auth.interface';

export const INITIAL_AUTH_STATE: authState = {
  refreshToken:null ,
  accessToken: null,
  isAuthenticated: false,
  errorMessage: null,
};
