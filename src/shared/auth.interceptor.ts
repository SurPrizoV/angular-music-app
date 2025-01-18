import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

import { AuthService } from './services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  if (authService.isAuth()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('[Interceptor]:', error);

      if (error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          return authService.refreshToken(refreshToken).pipe(
            switchMap((response) => {
              authService.setToken(response);
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.access}`,
                },
              });
              return next(clonedRequest);
            }),
            catchError((refreshError) => {
              console.warn(
                '[Interceptor]: Ошибка обновления токена, выход из системы.'
              );
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          console.warn(
            '[Interceptor]: Токен для обновления отсутствует, выход из системы.'
          );
          authService.logout();
        }
      }

      return throwError(() => error);
    })
  );
};
