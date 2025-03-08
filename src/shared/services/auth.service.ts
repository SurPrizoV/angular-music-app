import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { PlayerService } from './player.service';

import { userLink } from './APILinks/links';
import { AuthResponse } from '../interfaces';
import type { User } from '../types/user';
import { ToJSON } from '../types/model';
import { UserRequest } from '../types/user.request';
import { AuthBase } from '../types/auth';

/**
 * Сервис для аутентификации и управления пользователем.
 *
 * Позволяет:
 * - Регистрировать нового пользователя.
 * - Авторизовывать пользователя.
 * - Обновлять токен доступа.
 * - Выходить из системы.
 * - Проверять статус аутентификации.
 *
 * Хранит токены доступа и обновления в `localStorage` и автоматически
 * обновляет их при необходимости.
 */

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected headers: HttpHeaders = new HttpHeaders({
    'content-type': 'application/json',
  });
  /** Сообщение об ошибке при аутентификации. */
  error!: string;

  /** Интервал для автоматического обновления токена. */
  private readonly refreshTokenInterval: any;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly playerService: PlayerService
  ) {}

  get token(): string {
    return localStorage.getItem('accessToken') || '';
  }

  /**
   * Авторизует пользователя.
   * @param {User} user - Данные пользователя (email и пароль).
   * @returns {Observable<AuthResponse>} Ответ API с токенами.
   */
  login(auth: AuthBase): Observable<AuthResponse> {
    localStorage.setItem('mail', auth.email);
    return this.http
      .post<AuthResponse>(
        `${userLink.baseURL}/${userLink.URLcatalog}/login/`,
        auth,
        {
          headers: this.headers,
        }
      )
      .pipe(
        tap((response) => {
          this.setToken(response);
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 400 && err.error) {
            this.error = this.formatBackendErrors(err.error);
          } else {
            this.error = 'Произошла ошибка. Попробуйте позже.';
          }
          this.error = err.error.detail;
          return throwError(() => err);
        })
      );
  }

  /**
   * Получает новый токен по данным пользователя.
   * @param {User} user - Данные пользователя.
   * @returns {Observable<AuthResponse>} Ответ API с токенами.
   */
  getToken(authBase: AuthBase): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${userLink.baseURL}/${userLink.URLcatalog}/token/`,
        authBase,
        {
          headers: this.headers,
        }
      )
      .pipe(tap(this.setToken.bind(this)))
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 400 && err.error) {
            this.error = this.formatBackendErrors(err.error);
          } else {
            this.error = 'Произошла ошибка. Попробуйте позже.';
          }
          this.error = err.error.detail;
          return throwError(() => err);
        })
      );
  }

  /**
   * Обновляет токен доступа.
   * @param {string} token - Токен обновления.
   * @returns {Observable<AuthResponse>} Ответ API с новым токеном доступа.
   */
  refreshToken(token: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${userLink.baseURL}/${userLink.URLcatalog}/token/refresh/`,
        JSON.stringify({
          refresh: token,
        }),
        {
          headers: this.headers,
        }
      )
      .pipe(
        tap((response) => this.setToken(response)),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        })
      );
  }

  /**
   * Регистрирует нового пользователя.
   * @param {User} user - Данные пользователя.
   * @returns {Observable<AuthResponse>} Ответ API с токенами.
   */
  register(user: ToJSON<UserRequest>): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${userLink.baseURL}/${userLink.URLcatalog}/signup/`,
        user.toJson(),
        {
          headers: this.headers,
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 400 && err.error) {
            this.error = this.formatBackendErrors(err.error);
          } else {
            this.error = 'Произошла ошибка. Попробуйте позже.';
          }
          return throwError(() => err);
        })
      );
  }

  /**
   * Выходит из системы, очищая токены и данные пользователя.
   */
  logout() {
    this.playerService.resetTrack();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('mail');
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval);
    }
    this.router.navigate(['/login']);
  }

  /**
   * Проверяет, авторизован ли пользователь.
   * @returns {boolean} `true`, если у пользователя есть токен доступа.
   */
  isAuth(): boolean {
    return !!this.token;
  }

  /**
   * Сохраняет токены в `localStorage`.
   * @param {AuthResponse} response - Ответ API с токенами.
   */
  setToken(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.access);
    if (response.refresh) {
      localStorage.setItem('refreshToken', response.refresh);
    }
  }

  /**
   * Форматирует ошибки от бэкенда в строку.
   * @param {{ [key: string]: string[] }} errors - Объект ошибок.
   * @returns {string} Отформатированное сообщение об ошибке.
   */
  private formatBackendErrors(errors: { [key: string]: string[] }): string {
    const errorMessages: string[] = [];
    Object.keys(errors).forEach((key) => {
      const messages = errors[key];
      errorMessages.push(...messages);
    });
    return errorMessages.join(' ');
  }
}
