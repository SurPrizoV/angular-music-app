import { Env } from './interface';

export const envUser: Env = {
  baseURL: 'https://skypro-music-api.skyeng.tech',
  URLcatalog: 'user',
};

export const envTrack: Env = {
  baseURL: 'https://skypro-music-api.skyeng.tech/catalog',
  URLcatalog: 'track',
  other: 'selection',
};
