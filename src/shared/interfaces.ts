export interface Track {
  id: number;
  album: string;
  author: string;
  duration_in_seconds: number;
  genre: string;
  name: string;
  release_date: Date;
  stared_user: User[];
  track_file: string;
  logo?: string;
  is_liked?: boolean;
}

export interface Collection {
  id: number;
  items: Track[];
  name: string;
  owner: string;
}

export interface User {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  access: string;
  refresh?: string;
}
