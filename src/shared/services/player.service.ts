import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Track } from '../interfaces';
/**
 * Сервис для управления воспроизведением треков в плеере.
 * Предоставляет функциональность для воспроизведения, паузы, перемотки, изменения громкости и повторного воспроизведения треков.
 */
@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  /**
   * Аудио объект для управления воспроизведением.
   */
  private audio = new Audio();

  /**
   * Список треков для воспроизведения.
   */
  private trackList: Track[] = [];

  /**
   * Индекс текущего воспроизводимого трека в списке.
   */
  private currentIndex = 0;

  /**
   * Режим повторения треков.
   * Может быть 'none' (нет повторения), 'track' (повторить текущий трек), 'all' (повторить все треки).
   */
  private repeatMode: 'none' | 'track' | 'all' = 'none';

  /**
   * Поведение для текущего трека. Содержит информацию о текущем треке или null, если трек не выбран.
   */
  currentTrack$ = new BehaviorSubject<Track | null>(null);

  /**
   * Поведение для статуса воспроизведения. Логическое значение, показывающее, воспроизводится ли трек в данный момент.
   */
  isPlaying$ = new BehaviorSubject<boolean>(false);

  /**
   * Поведение для текущего времени воспроизведения трека.
   */
  currentTime$ = new BehaviorSubject<number>(0);

  /**
   * Поведение для общей продолжительности трека.
   */
  duration$ = new BehaviorSubject<number>(0);

  /**
   * Создает экземпляр PlayerService и устанавливает обработчики событий для аудио.
   */
  constructor() {
    this.audio.addEventListener('ended', () => this.onTrackEnd());

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime$.next(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration$.next(this.audio.duration);
    });
  }

  /**
   * Устанавливает список треков для воспроизведения.
   * Сбрасывает индекс текущего трека на 0 и обновляет текущий трек.
   */
  setTracks(tracks: Track[]) {
    this.trackList = tracks;
    this.currentIndex = 0;
    this.updateCurrentTrack();
  }

  /**
   * Устанавливает индекс текущего трека.
   * Обновляет текущий трек в зависимости от указанного индекса.
   */
  setCurrentIndex(index: number) {
    if (index >= 0 && index < this.trackList.length) {
      this.currentIndex = index;
      this.updateCurrentTrack();
    }
  }

  /**
   * Запускает воспроизведение текущего трека.
   */
  play() {
    if (!this.currentTrack$.value) return;
    this.audio.play();
    this.isPlaying$.next(true);
  }

  /**
   * Приостанавливает воспроизведение текущего трека.
   */
  pause() {
    this.audio.pause();
    this.isPlaying$.next(false);
  }

  /**
   * Переключает на следующий трек в списке.
   * Если установлен режим повторения трека, то текущий трек будет проигрываться заново.
   * Если режим повторения 'all', то воспроизведение переключится на следующий трек.
   */
  next() {
    if (this.repeatMode === 'track') {
      this.audio.currentTime = 0;
      this.audio.play();
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.trackList.length;
      this.updateCurrentTrack();
    }
  }

  /**
   * Переключает на предыдущий трек в списке.
   */
  previous() {
    this.currentIndex =
      (this.currentIndex - 1 + this.trackList.length) % this.trackList.length;
    this.updateCurrentTrack();
  }

  /**
   * Устанавливает режим повторения.
   */
  setRepeatMode(mode: 'none' | 'track' | 'all') {
    this.repeatMode = mode;
  }

  /**
   * Устанавливает громкость воспроизведения.
   */
  setVolume(volume: number) {
    this.audio.volume = volume;
  }

  /**
   * Перематывает трек на указанное время.
   */
  seekTo(time: number) {
    this.audio.currentTime = time;
  }

  /**
   * Сбрасывает трек. Останавливает воспроизведение и сбрасывает время.
   */
  resetTrack() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying$.next(false);
    this.currentTrack$.next(null);
  }

  /**
   * Обновляет текущий трек, устанавливая его источник и сбрасывая время.
   * Если текущий трек воспроизводится, то он будет продолжен.
   */
  private updateCurrentTrack() {
    const track = this.trackList[this.currentIndex] || null;
    this.currentTrack$.next(track);

    if (track) {
      this.audio.pause();
      this.audio.src = track.track;
      this.audio.currentTime = 0;

      if (this.isPlaying$.value) {
        this.audio.play();
      }
    }
  }

  /**
   * Обрабатывает окончание воспроизведения трека.
   * Переключает на следующий трек или повторяет текущий в зависимости от режима повторения.
   */
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
