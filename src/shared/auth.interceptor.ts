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

/**
 * Интерсептор HTTP-запросов для добавления авторизационного токена в заголовки запросов.
 * Также обрабатывает ошибки с кодом 401 (Unauthorized) для автоматического обновления токена с использованием refresh token.
 * При ошибке обновления токена выполняется выход из системы.
 *
 * @param {HttpRequest<any>} req - HTTP запрос, к которому применяется интерсептор.
 * @param {HttpHandlerFn} next - Следующий обработчик запроса, к которому будет передан (и модифицированный) запрос.
 * @returns {Observable<HttpEvent<any>>} Наблюдаемый поток с событием HTTP, который может быть результатом отправки запроса.
 *
 * @throws {HttpErrorResponse} В случае ошибки при выполнении запроса или обновления токена, ошибка будет проброшена дальше.
 */

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
