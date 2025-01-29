import { Link } from './interface';

export const userLink: Link = {
  baseURL: 'https://skypro-music-api.skyeng.tech',
  URLcatalog: 'user',
};

export const trackLink: Link = {
  baseURL: 'https://skypro-music-api.skyeng.tech/catalog',
  URLcatalog: 'track',
  other: 'selection',
};
