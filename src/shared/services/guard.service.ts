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

@Injectable({
  providedIn: 'root',
})
/**
 * Сервис для обработки активации маршрутов на основе статуса аутентификации пользователя.
 * Реализует интерфейс CanActivate для ограничения доступа к маршрутам на основе статуса аутентификации.
 */
export class GuardService implements CanActivate {
  // думаю на конструктор конкретно здесь избыточно писать расширенный коментарий.
  // - класс создается в коде ангуляр. Мы уже придерживаеся определнных аргументов при вызове конструктора.
  // работает с классом не разработчик, задача разработчика правильно передать структурам ройтинга в таком сценарии описывать конструктор избыточно.
  /**
   * Создает экземпляр сервиса GuardService.
   *
   * @param {AuthService} authService - Сервис аутентификации, используемый для проверки, авторизован ли пользователь.
   * @param {Router} router - Роутер, используемый для навигации, если пользователь не авторизован.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  // тут возможно тоже нет смысла. Мы реализуем интерфейс CanActivate там уже есть дока (провались в описние  интерфейса). Здесь возможно стоит ограничиться
  // парой строк.
  /**
   * Определяет, можно ли активировать маршрут на основе статуса аутентификации пользователя.
   * Если пользователь авторизован, маршрут может быть активирован. В противном случае пользователь будет перенаправлен на страницу входа.
   *
   * @param {ActivatedRouteSnapshot} route - Текущий снимок маршрута.
   * @param {RouterStateSnapshot} state - Текущий снимок состояния роутера.
   * @returns {MaybeAsync<GuardResult>} Логическое значение или промис, который разрешается в логическое значение, указывающее, можно ли активировать маршрут.
   *
   * @throws {Error} Выбрасывает ошибку, если пользователь не авторизован и не может получить доступ к маршруту.
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
