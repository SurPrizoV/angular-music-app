export interface Track {
  album: string;
  author: string;
  duration_in_seconds: number;
  genre: string;
  id: number;
  logo?: string;
  name: string;
  release_date: Date;
  stared_user: User[];
  // REVIEW Определись со стилем именования переменных CamelCase
  isLiked?: boolean;
  // REVIEW или же Snake_case Можно прикрутить линтер чтобы было проше себя контролировать.
  // В целом это плоха практика иметь в проекте несколько стилей нейминга.
  track_file: string;
}

export interface Collection {
  id: number;
  items: Track[];
  name: string;
  owner: string;
}

export interface User {
  // REVIEW я бы расположил сначала обязательные свойства а потом опциональные. Где то я увидел такую практику и тоже ее придерживаюсь.
  // Но вроде как дела вкуса.
  username?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh?: string;
}
