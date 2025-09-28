import { authState } from '../model/auth.interface';

export const INITIAL_AUTH_STATE: authState = {
  token: null,
  isAuthenticated: false,
  errorMessage: null,
};
