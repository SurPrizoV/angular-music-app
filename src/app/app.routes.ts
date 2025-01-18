import { Routes } from '@angular/router';
import { GuardService } from '../shared/services/guard.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../shared/layouts/main-layout/main-layout.component').then(
        (c) => c.MainLayoutComponent
      ),
      canActivate: [GuardService],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../app/pages/main-page/main-page.component').then(
            (c) => c.MainPageComponent
          ),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./pages/favorites-page/favorites-page.component').then(
            (c) => c.FavoritesPageComponent
          ),
      },
      {
        path: 'playlist_day',
        loadComponent: () =>
          import('./pages/playlist-day-page/playlist-day-page.component').then(
            (c) => c.PlaylistDayPageComponent
          ),
      },
      {
        path: 'playlist_hundred',
        loadComponent: () =>
          import(
            './pages/playlist-hundred-page/playlist-hundred-page.component'
          ).then((c) => c.PlaylistHundredPageComponent),
      },
      {
        path: 'playlist_indi',
        loadComponent: () =>
          import(
            './pages/playlist-indi-page/playlist-indi-page.component'
          ).then((c) => c.PlaylistIndiPageComponent),
      },
      {
        path: 'error',
        loadComponent: () =>
          import('./pages/error-page/error-page.component').then(
            (c) => c.ErrorPageComponent
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('../shared/layouts/auth-layout/auth-layout.component').then(
        (c) => c.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login-page/login-page.component').then(
            (c) => c.LoginPageComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register-page/register-page.component').then(
            (c) => c.RegisterPageComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/error',
  },
];
