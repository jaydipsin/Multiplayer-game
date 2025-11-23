import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { AUTH_PATH, DASHBOARD_PATH, TIC_TAC_TOE } from './shared/routes';
import { noAuthGuard } from './guards/none-auth.gurd';

export const routes: Routes = [
  {
    path: '',
    redirectTo: AUTH_PATH,
    pathMatch: 'full',
  },
  {
    path: AUTH_PATH,
    loadComponent: () => import('./auth/auth/auth').then((m) => m.Auth),
    canActivate: [noAuthGuard],
  },
  {
    path: DASHBOARD_PATH,
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard-component/dashboard-component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: TIC_TAC_TOE,
        loadComponent: () =>
          import('./dashboard/projects/tic-tac-toe/tic-tac-toe').then((m) => m.TicTacToe),
      },
    ],
  },
];
