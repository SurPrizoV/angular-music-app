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
  isLiked?: boolean;
  track_file: string;
}

export interface Collection {
  id: number;
  items: Track[];
  name: string;
  owner: string;
}

export interface User {
  username?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh?: string;
}
