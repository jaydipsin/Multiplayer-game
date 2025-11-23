import { createAction, props } from '@ngrx/store';
import { User } from '../model/user.type';

export const setUserAction = createAction('[App] Set User', props<{ user: User }>());

export const autoLogin = createAction("[App] Auto Login");
