import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';

import { SearchFilterService } from './searchFilter.service';

import { envTrack } from '../../app/environments/environment';
import { Collection, Track } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TracksAPIService {
  tracksSubject = new Subject<Track[]>();
  tracks$ = this.tracksSubject.asObservable();

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  getTracks(): Observable<Track[]> {
    return this.http
      .get<Track[]>(`${envTrack.baseURL}/${envTrack.URLcatalog}/all/`)
      .pipe(tap((tracks) => this.searchFilterService.setTracks(tracks)));
  }

  getTrackCollectionById(id: number): Observable<Track[]> {
    return this.http
      .get<Collection>(`${envTrack.baseURL}/${envTrack.other}/${id}/`)
      .pipe(
        map((collection: Collection) => collection.items),
        tap((tracks) => this.searchFilterService.setTracks(tracks))
      );
  }

  getFavoriteTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(
      `${envTrack.baseURL}/${envTrack.URLcatalog}/favorite/all/`
    );
  }

  addTrackInFavorite(id: number) {
    return this.http
      .post(`${envTrack.baseURL}/${envTrack.URLcatalog}/${id}/favorite/`, {})
      .pipe(
        tap(() => this.searchFilterService.updateTrack(id, { isLiked: true }))
      );
  }

  removeTrackFromFavorite(id: number) {
    return this.http
      .delete(`${envTrack.baseURL}/${envTrack.URLcatalog}/${id}/favorite/`)
      .pipe(
        tap(() => this.searchFilterService.updateTrack(id, { isLiked: false }))
      );
  }
}
