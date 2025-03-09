import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { PlayerService } from './player.service';
import type { Track } from '../types/track';

/**
 * Сервис для управления фильтрацией, сортировкой и перемешиванием списка треков.
 *
 * Позволяет:
 * - Искать треки по названию.
 * - Фильтровать треки по автору и жанру.
 * - Сортировать треки по дате релиза (по возрастанию или убыванию).
 * - Перемешивать треки случайным образом.
 *
 * Использует `BehaviorSubject` для хранения состояний фильтров и `RxJS combineLatest` для
 * динамической фильтрации списка треков при изменении параметров.
 */
@Injectable({
  providedIn: 'root',
})
export class SearchFilterService {
  /** Список всех треков. */
  private readonly tracksSubj = new BehaviorSubject<Track[]>([]);
  /** Строка для поиска. */
  private readonly searchSubj = new BehaviorSubject<string>('');
  /** Фильтры для позиции автора. */
  private readonly authorFilterSubj = new BehaviorSubject<string[]>([]);
  /** Фильтры для позиции жанра. */
  private readonly genreFilterSubj = new BehaviorSubject<string[]>([]);
  /** Сортировка по дате. */
  private readonly sortSubj = new BehaviorSubject<'asc' | 'desc'>('asc');
  /** Режим перемешивания треков. */
  private readonly shuffleSubj = new BehaviorSubject<boolean>(false);

  protected tracks$ = this.tracksSubj.asObservable();
  protected search$ = this.searchSubj.asObservable();
  protected authorFilter$ = this.authorFilterSubj.asObservable();
  protected genreFilter$ = this.genreFilterSubj.asObservable();
  protected sort$ = this.sortSubj.asObservable();
  shuffle$ = this.shuffleSubj.asObservable();

  constructor(private readonly playerService: PlayerService) {}

  /**
   * Устанавливает новый список треков.
   * @param {Track[]} tracks - Список треков.
   */
  setTracks(tracks: Track[]) {
    this.tracksSubj.next(tracks);
    this.filterTracks();
  }

  /**
   * Обновляет данные конкретного трека.
   * @param {number} id - Идентификатор трека.
   * @param {Partial<Track>} changes - Объект с измененными полями трека.
   */
  updateLikedTrack(id: number, isLiked: boolean) {
    const updatedTracks = this.tracksSubj.value.map((track) => {
      if  (track.id === id) {
        track.isLiked = isLiked
      }
      return track;
    });
    this.tracksSubj.next(updatedTracks);
  }

  /**
   * Обновляет поисковый запрос.
   * @param {string} value - Новая строка поиска.
   */
  updateSearch(value: string) {
    this.searchSubj.next(value);
  }

  /**
   * Обновляет фильтр по авторам.
   * @param {string[]} authors - Список выбранных авторов.
   */
  updateAuthorFilter(authors: string[]) {
    this.authorFilterSubj.next(authors);
  }

  /**
   * Обновляет фильтр по жанрам.
   * @param {string[]} genres - Список выбранных жанров.
   */
  updateGenreFilter(genres: string[]) {
    this.genreFilterSubj.next(genres);
  }

  /**
   * Устанавливает порядок сортировки треков.
   * @param {'asc' | 'desc'} order - 'asc' (по возрастанию) или 'desc' (по убыванию).
   */
  updateSort(order: 'asc' | 'desc') {
    this.sortSubj.next(order);
  }

  /**
   * Включает или выключает перемешивание треков.
   * @param {boolean} isShuffle - `true`, если треки должны быть перемешаны.
   */
  toggleShuffle(isShuffle: boolean) {
    this.shuffleSubj.next(isShuffle);
  }

  /**
   * Фильтрует, сортирует и перемешивает треки на основе установленных параметров.
   * @returns {Observable<Track[]>} Поток отфильтрованных и отсортированных треков.
   */
  filterTracks() {
    return combineLatest([
      this.tracks$,
      this.search$,
      this.authorFilter$,
      this.genreFilter$,
      this.sort$,
      this.shuffle$,
    ]).pipe(
      map(
        ([
          tracks,
          searchTerm,
          selectedAuthors,
          selectedGenres,
          sortOrder,
          shuffle,
        ]) => {
          console.log('filterTracks method: ', tracks);
          let filteredTracks = [...tracks];

          if (searchTerm.trim()) {
            filteredTracks = filteredTracks.filter((track) =>
              track.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          if (selectedAuthors.length > 0) {
            filteredTracks = filteredTracks.filter((track) =>
              selectedAuthors.includes(track.author)
            );
          }

          if (selectedGenres.length > 0) {
            filteredTracks = filteredTracks.filter((track) =>
              selectedGenres.includes(track.genre)
            );
          }

          if (sortOrder) {
            filteredTracks = filteredTracks.sort((a, b) => {
              if (!a.release || !b.release) {
                return -1;
              }

              const dateA = new Date(a.release).getTime();
              const dateB = new Date(b.release).getTime();
              return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
          }

          if (shuffle) {
            for (let i = filteredTracks.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [filteredTracks[i], filteredTracks[j]] = [
                filteredTracks[j],
                filteredTracks[i],
              ];
            }
          }

          this.playerService.setTracks(filteredTracks);

          console.log(':::: before return ', filteredTracks);
          return filteredTracks;
        }
      )
    );
  }
}
