import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IloginPayload,
  IloginResponse,
  IsignUpResponse,
  IsingUpPayload,
} from '../model/auth.interface';
import { EndpointService } from './endpoint.service';
import { BASE_URL } from '../../constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private endPointService: EndpointService) {}

  signUp(payload: IsingUpPayload) {
    return this.http.post<IsignUpResponse>(
      `${BASE_URL}/${this.endPointService.SINGUP_URL}`,
      payload
    );
  }

  login(payload: IloginPayload) {
    return this.http.post<IloginResponse>(`${BASE_URL}/${this.endPointService.LOGIN_URL}`, payload);
  }
}
