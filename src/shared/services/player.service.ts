import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Track } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private audio = new Audio();
  private trackList: Track[] = [];
  private currentIndex = 0;
  private repeatMode: 'none' | 'track' | 'all' = 'none';

  currentTrack$ = new BehaviorSubject<Track | null>(null);
  isPlaying$ = new BehaviorSubject<boolean>(false);
  currentTime$ = new BehaviorSubject<number>(0);
  duration$ = new BehaviorSubject<number>(0);

  constructor() {
    this.audio.addEventListener('ended', () => this.onTrackEnd());

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime$.next(this.audio.currentTime);
    });
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration$.next(this.audio.duration);
    });
  }

  setTracks(tracks: Track[]) {
    this.trackList = tracks;
    this.currentIndex = 0;
    this.updateCurrentTrack();
  }

  setCurrentIndex(index: number) {
    if (index >= 0 && index < this.trackList.length) {
      this.currentIndex = index;
      this.updateCurrentTrack();
    }
  }

  play() {
    if (!this.currentTrack$.value) return;
    this.audio.play();
    this.isPlaying$.next(true);
  }

  pause() {
    this.audio.pause();
    this.isPlaying$.next(false);
  }

  next() {
    if (this.repeatMode === 'track') {
      this.audio.currentTime = 0;
      this.audio.play();
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.trackList.length;
      this.updateCurrentTrack();
    }
  }

  previous() {
    this.currentIndex =
      (this.currentIndex - 1 + this.trackList.length) % this.trackList.length;
    this.updateCurrentTrack();
  }

  setRepeatMode(mode: 'none' | 'track' | 'all') {
    this.repeatMode = mode;
  }

  setVolume(volume: number) {
    this.audio.volume = volume;
  }

  seekTo(time: number) {
    this.audio.currentTime = time;
  }

  resetTrack() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying$.next(false);
    this.currentTrack$.next(null);
  }

  private updateCurrentTrack() {
    const track = this.trackList[this.currentIndex] || null;
    this.currentTrack$.next(track);

    if (track) {
      this.audio.pause();
      this.audio.src = track.track_file;
      this.audio.currentTime = 0;

      if (this.isPlaying$.value) {
        this.audio.play();
      }
    }
  }

  private onTrackEnd() {
    if (this.repeatMode === 'track') {
      this.audio.currentTime = 0;
      this.audio.play();
    } else if (this.repeatMode === 'all') {
      this.next();
    } else if (this.currentIndex < this.trackList.length - 1) {
      this.next();
    } else {
      this.isPlaying$.next(false);
    }
  }
}
