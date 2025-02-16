import { TrackResponse } from './track.response';
import type { User } from './user';
import { UserResponse } from './user.response';

export interface Track {
  id: number;
  album: string;
  author: string;
  duration: number;
  genre: string;
  name: string;
  release: Date;
  stared: User[];
  track: string;
  isLiked?: boolean;
}


export class TrackModel implements Track {
  private _id: number;
  private _album: string;
  private _author: string;
  private _duration: number;
  private _genre: string;
  private _name: string;
  private _release: Date;
  private _stared: User[];
  private _track: string;
  private _isLiked?: boolean;

  constructor(response: TrackResponse, private readonly userConstructor: new (userResponse: UserResponse) => User) {
    if (!response.id) {
      throw new Error('Expect id in Track response')
    }
    this._id = response.id

    if (!response.album) {
      throw new Error('Expect album in Track response')
    }
    this._album = response.album

    if (!response.author) {
      throw new Error('Expect author in Track response')
    }
    this._author = response.author

    if (!response.duration_in_seconds) {
      throw new Error('Expect duration in Track response')
    }
    this._duration = response.duration_in_seconds

    if (!response.genre) {
      throw new Error('Expect genre in Track response')
    }
    this._genre = response.genre

    if (!response.name) {
      throw new Error('Expect name in Track response')
    }
    this._name = response.name

    if (!response.release_date) {
      throw new Error('Expect release in Track response')
    }
    this._release = response.release_date

    if (!response.stared_user) {
      throw new Error('Expect stared in Track response')
    }
    if (!Array.isArray(response.stared_user)) {
      throw new Error('Expected list of user')
    }

    this._stared = response.stared_user.map((u) => new this.userConstructor(u));

    if (!response.track_file) {
      throw new Error('Expect track in Track response')
    }
    this._track = response.track_file

    this._isLiked = response.is_liked;
  }

  get id() {
    return this._id;
  }

  get album() {
    return this._album;
  }

  get author() {
    return this._author;
  }

  get duration() {
    return this._duration;
  }

  get genre() {
    return this._genre;
  }

  get name() {
    return this._name;
  }

  get release() {
    return this._release;
  }

  get stared() {
    return this._stared;
  }

  get track() {
    return this._track;
  }

  get isLiked() {
    return this._isLiked;
  }


}
