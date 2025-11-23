import { authState } from '../auth/model/auth.interface';
import { User } from './user.type';

export interface AppState {
  auth: authState ;
}
