/** Так же мы ожидаем получить от бека некую структуру пользователь. будем к ней тоже относиться с недоверием. */
export interface UserResponse {
  email?: string;
  password?: string;
  username?: string;
}
