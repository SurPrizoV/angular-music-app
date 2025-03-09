import { UserResponse } from "./user.response";
/** это TrackFromBackend т.е данные которые мы получаем в ответе от сервера.
 * еще мы здесь ожидаем что с бекенда может прилететь совершенна любая структура
 * мы должны относиться с недоверием к получаемым данным и будем их проверять.
 * В интерфейсе обозначим это через небоязательные поля.
 */
export interface TrackResponse {
  id?: number;
  name?: string;
  album?: string;
  author?: string;
  duration_in_seconds?: number;
  genre?: string;
  release_date?: Date;
  stared_user?: UserResponse[];
  track_file?: string;
  logo?: string;
  is_liked?: boolean;
}