import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EndpointService {
  SINGUP_URL = 'auth/signup';
  LOGIN_URL = 'auth/login';
  REFRESH = '/refresh';
}
