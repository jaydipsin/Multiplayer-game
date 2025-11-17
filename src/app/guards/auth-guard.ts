import { inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Localstorage } from '../services/localstorage';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const localStorageService = inject(Localstorage);
  const router = inject(Router);
  const user = localStorageService.getUser();
  const activatedRoute = inject(ActivatedRoute);
  if (user) {
    return true;
  } else {
    router.navigate(['/auth'], {
      relativeTo: activatedRoute,
      queryParams: { mode: 'login' },
    });
    return false;
  }
};
