import { Injectable } from '@angular/core';
import { User } from '../model/user.type';
import { JsonPipe } from '@angular/common';
import { LOCAL_STORAGE_USER_KEY } from '../constants';

interface lsUser {
  accessToken: string;
  message: string;
  user: User;
}
@Injectable({
  providedIn: 'root',
})
export class Localstorage {
  setUser(user: lsUser) {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  }

  getUser(): lsUser | null {
    const user = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  updateUser(user: Partial<lsUser>) {
    const currentUser = this.getUser();
    if (currentUser) {
      const updateUser = { ...currentUser, ...user };
      this.setUser(updateUser);
    } else {
      this.setUser(user as lsUser);
    }
  }
}
