import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Localstorage } from '../services/localstorage';

export const noAuthGuard: CanActivateFn = () => {
  const localStorageService = inject(Localstorage);
  const router = inject(Router);
  const user = localStorageService.getUser();

  if (user) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
