/** Получить json представление модели. */
export interface ToJSON<T> {
  /** Преобразует модель в JSON. */
  toJson(): T;
}
