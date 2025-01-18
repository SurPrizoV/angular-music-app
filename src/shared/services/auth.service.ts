import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { PlayerService } from './player.service';

import { envUser } from '../../app/environments/environment';
import { AuthResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers: HttpHeaders = new HttpHeaders({
    'content-type': 'application/json',
  });
  error!: string;

  private refreshTokenInterval: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private playerService: PlayerService
  ) {}

  get token(): string {
    return localStorage.getItem('accessToken') || '';
  }

  login(user: User): Observable<AuthResponse> {
    localStorage.setItem('mail', user.email);
    return this.http
      .post<AuthResponse>(
        `${envUser.baseURL}/${envUser.URLcatalog}/login/`,
        JSON.stringify(user),
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

  getToken(user: User): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${envUser.baseURL}/${envUser.URLcatalog}/token/`,
        JSON.stringify(user),
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

  refreshToken(token: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${envUser.baseURL}/${envUser.URLcatalog}/token/refresh/`,
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

  register(user: User): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${envUser.baseURL}/${envUser.URLcatalog}/signup/`,
        JSON.stringify(user),
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

  isAuth(): boolean {
    return !!this.token;
  }

  setToken(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.access);
    if (response.refresh) {
      localStorage.setItem('refreshToken', response.refresh);
    }
  }

  private formatBackendErrors(errors: { [key: string]: string[] }): string {
    const errorMessages: string[] = [];
    Object.keys(errors).forEach((key) => {
      const messages = errors[key];
      errorMessages.push(...messages);
    });
    return errorMessages.join(' ');
  }
}
