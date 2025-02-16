import { ToJSON } from './model';
import { UserRequest } from './user.request';
import { UserResponse } from './user.response';

/** Этот интерфейс описывает сущность  пользователя с которомы мы будем работать в приложении и к нему мы должны привевсти да
 * данные с бека.
 */
export interface User {
  /** Электронная почта пользователя. */
  email: string;

  /** Пароль пользователя. */
  password: string;

  /** Имя пользователя. */
  username?: string;
}

export class UserModel implements User, ToJSON<UserRequest> {
  private _email: string;
  private _password: string;
  private _username: string | undefined;

  /** В конструктаре мы сделаем маппинг данных из апи в структуру с которой будет работать приложение
   * + валидируем обязательные поля и сразу же ругаемся на отсутствие критичных полей.
   *
   * по сути это развязка апи и объектов приложения. Меняется апи корректируем маппинг тут.
   */
  constructor(response: UserResponse) {
    if (!response.email) {
      throw new Error('Expected email field for user')
    }
    this._email = response.email;

    if (!response.password) {
      throw new Error('Expected password field for user')
    }
    this._password = response.password;

    this._username = response.username;
  }

  toJson(): UserRequest {
    return {
      email: this._email,
      password: this._password,
    }
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get username() {
    return this._username;
  }
}
