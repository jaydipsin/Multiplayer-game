import { authState } from "../model/auth.interface";

export const INITIAL_AUTH_STATE: authState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  errorMessage: null,
};
