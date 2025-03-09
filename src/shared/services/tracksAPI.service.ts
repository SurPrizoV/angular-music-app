import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';

import { SearchFilterService } from './searchFilter.service';

import { trackLink } from './APILinks/links';
import { Collection, TrackFromBackend } from '../interfaces';
import { Track, TrackModel } from '../types/track';
import { UserModel } from '../types/user';
/**
 * Сервис для взаимодействия с API, который управляет треками.
 * Предоставляет методы для получения всех треков, коллекций треков, фаворитов,
 * а также добавления и удаления треков из списка избранных.
 */
@Injectable({
  providedIn: 'root',
})
export class TracksAPIService {
  /**
   * Субъект, который хранит список треков, полученных из API.
   * Объявлен как `Subject`, чтобы другие компоненты могли подписаться и получать обновления.
   */
  protected readonly tracksSubject = new Subject<Track[]>();

  /**
   * Наблюдаемый поток для треков, который может быть использован для подписки на обновления.
   */
  protected readonly tracks$ = this.tracksSubject.asObservable();

  /**
   * Создает экземпляр сервиса TracksAPIService.
   *
   * @param {HttpClient} http - Инжектированный сервис HttpClient для выполнения HTTP-запросов.
   * @param {SearchFilterService} searchFilterService - Сервис для фильтрации и обновления списка треков.
   */
  constructor(
    private readonly http: HttpClient,
    private readonly searchFilterService: SearchFilterService
  ) {}

  /**
   * Получает все треки из API.
   * Запрос выполняется по URL, который возвращает список всех треков.
   *
   * @returns {Observable<Track[]>} Наблюдаемый поток с массивом треков.
   */
  getTracks(): Observable<Track[]> {
    return this.http
      .get<TrackFromBackend[]>(
        `${trackLink.baseURL}/${trackLink.URLcatalog}/all/`
      )
      .pipe(
        map((tracks) => tracks.map((track) => new TrackModel(track, UserModel))),
        tap((tracks) => {
          console.log('api::::', tracks);
          return this.searchFilterService.setTracks(tracks)
      })
      );
  }

  /**
   * Получает коллекцию треков по ID.
   * Использует ID для получения коллекции треков, которая затем фильтруется и обновляется.
   *
   * @param {number} id - Идентификатор коллекции.
   * @returns {Observable<Track[]>} Наблюдаемый поток с массивом треков в коллекции.
   */
  getTrackCollectionById(id: number): Observable<Track[]> {
    return this.http
      .get<Collection>(`${trackLink.baseURL}/${trackLink.other}/${id}/`)
      .pipe(
        map((collection: Collection) =>
          collection.items.map((track) => new TrackModel(track, UserModel))
        ),
        tap((tracks) => this.searchFilterService.setTracks(tracks))
      );
  }

  /**
   * Получает список избранных треков.
   * Запрашивает все избранные треки из API.
   *
   * @returns {Observable<Track[]>} Наблюдаемый поток с массивом избранных треков.
   */
  getFavoriteTracks(): Observable<Track[]> {
    return this.http
      .get<TrackFromBackend[]>(
        `${trackLink.baseURL}/${trackLink.URLcatalog}/favorite/all/`
      )
      .pipe(map((tracks) => tracks.map((track) => new TrackModel(track, UserModel))));
  }

  /**
   * Добавляет трек в избранное.
   * Выполняет запрос на добавление трека в список избранных и обновляет статус в фильтре треков.
   *
   * @param {number} id - Идентификатор трека, который нужно добавить в избранное.
   * @returns {Observable<any>} Наблюдаемый поток для отслеживания результата запроса.
   */
  addTrackInFavorite(id: number) {
    return this.http
      .post(`${trackLink.baseURL}/${trackLink.URLcatalog}/${id}/favorite/`, {})
      .pipe(
        tap(() => this.searchFilterService.updateLikedTrack(id, true ))
      );
  }

  /**
   * Удаляет трек из избранного.
   * Выполняет запрос на удаление трека из списка избранных и обновляет статус в фильтре треков.
   *
   * @param {number} id - Идентификатор трека, который нужно удалить из избранного.
   * @returns {Observable<any>} Наблюдаемый поток для отслеживания результата запроса.
   */
  removeTrackFromFavorite(id: number) {
    return this.http
      .delete(`${trackLink.baseURL}/${trackLink.URLcatalog}/${id}/favorite/`)
      .pipe(
        tap(() => this.searchFilterService.updateLikedTrack(id,  false ))
      );
  }

  // /**
  //  * Форматирует трек с бэкенда из snake_сase в camelCase.
  //  */
  // private transformTrack(track: TrackFromBackend): Track {
  //   return {
  //     id: track.id,
  //     album: track.album,
  //     author: track.author,
  //     duration: track.duration_in_seconds,
  //     genre: track.genre,
  //     name: track.name,
  //     release: track.release_date,
  //     stared: track.stared_user,
  //     track: track.track_file,
  //     isLiked: track.is_liked,
  //   };
  // }
}
