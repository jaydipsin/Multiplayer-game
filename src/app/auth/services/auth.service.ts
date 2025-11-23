import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IloginPayload,
  IloginResponse,
  IsignUpResponse,
  IsingUpPayload,
} from '../model/auth.interface';
import { EndpointService } from './endpoint.service';
import { URL } from '../../enviroment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private endPointService: EndpointService) {}

  signUp(payload: IsingUpPayload) {
    return this.http.post<IsignUpResponse>(
      `${URL}/${this.endPointService.SINGUP_URL}`,
      payload,
      { withCredentials: true } // 👈 important
    );
  }

  login(payload: IloginPayload) {
    return this.http.post<IloginResponse>(
      `${URL}/${this.endPointService.LOGIN_URL}`,
      payload,
      { withCredentials: true } // 👈 important
    );
  }

  refesh() {
    return this.http.post<{ accessToken: string }>(`${URL}/${this.endPointService.REFRESH}`, {});
  }
}
