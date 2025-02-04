import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';

import { SearchFilterService } from './searchFilter.service';

import { trackLink } from './APILinks/links';
import { Collection, Track } from '../interfaces';
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
      .get<Track[]>(`${trackLink.baseURL}/${trackLink.URLcatalog}/all/`)
      .pipe(tap((tracks) => this.searchFilterService.setTracks(tracks)));
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
        map((collection: Collection) => collection.items),
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
    return this.http.get<Track[]>(
      `${trackLink.baseURL}/${trackLink.URLcatalog}/favorite/all/`
    );
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
        tap(() => this.searchFilterService.updateTrack(id, { is_liked: true }))
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
        tap(() => this.searchFilterService.updateTrack(id, { is_liked: false }))
      );
  }
}
