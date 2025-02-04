import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from './auth.service';
/**
 * Сервис для обработки активации маршрутов на основе статуса аутентификации пользователя.
 * Реализует интерфейс CanActivate для ограничения доступа к маршрутам на основе статуса аутентификации.
 */
@Injectable({
  providedIn: 'root',
})
export class GuardService implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  /**
   * Определяет, можно ли активировать маршрут на основе статуса аутентификации пользователя.
   * Если пользователь авторизован, маршрут может быть активирован. В противном случае пользователь будет перенаправлен на страницу входа.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.authService.logout();
      this.router.navigate(['/login']);
      throw new Error('Method not implemented.');
    }
  }
}
