import { createAction, props } from '@ngrx/store';
import { User } from '../../model/user.type';
import { IloginResponse, IsignUpResponse, IsingUpPayload } from '../model/auth.interface';

/* Login Actions */
export const loginAction = createAction(
  '[Auth] Login Action',
  props<{ email: string; password: string }>()
);

export const loginSuccessAction = createAction(
  '[Auth] Login Success Action',
  props<IloginResponse>()
);

export const loginFailureAction = createAction(
  '[Auth] Login Failure Action',
  props<{ error: string }>()
);

/* Signup Actions */
export const signupAction = createAction('[Auth] Signup Action', props<IsingUpPayload>());

export const signupSuccessAction = createAction(
  '[Auth] Signup Success Action',
  props<IsignUpResponse>()
);

export const signupFailureAction = createAction(
  '[Auth] Signup Failure Action',
  props<{ error: string }>()
);

/* Logout Actions */
export const logoutAction = createAction('[Auth] Logout Action');

export const logoutSuccessAction = createAction('[Auth] Logout Success Action');

export const logoutFailureAction = createAction(
  '[Auth] Logout Failure Action',
  props<{ error: string }>()
);

/* Rehydrate / Load User on App Init */
export const loadUserAction = createAction('[Auth] Load User Action');

export const loadUserSuccessAction = createAction(
  '[Auth] Load User Success Action',
  props<{ user: User }>()
);

export const loadUserFailureAction = createAction(
  '[Auth] Load User Failure Action',
  props<{ error: string }>()
);
