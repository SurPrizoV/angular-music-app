import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { PlayerService } from './player.service';

import { Track } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class SearchFilterService {
  private tracksSubj = new BehaviorSubject<Track[]>([]);
  private searchSubj = new BehaviorSubject<string>('');
  private authorFilterSubj = new BehaviorSubject<string[]>([]);
  private genreFilterSubj = new BehaviorSubject<string[]>([]);
  private sortSubj = new BehaviorSubject<'asc' | 'desc'>('asc');
  private shuffleSubj = new BehaviorSubject<boolean>(false);

  tracks$ = this.tracksSubj.asObservable();
  search$ = this.searchSubj.asObservable();
  authorFilter$ = this.authorFilterSubj.asObservable();
  genreFilter$ = this.genreFilterSubj.asObservable();
  sort$ = this.sortSubj.asObservable();
  shuffle$ = this.shuffleSubj.asObservable();

  constructor(private playerService: PlayerService) {}

  setTracks(tracks: Track[]) {
    this.tracksSubj.next(tracks);
    this.filterTracks();
  }

  updateTrack(id: number, changes: Partial<Track>) {
    const updatedTracks = this.tracksSubj.value.map((track) =>
      track.id === id ? { ...track, ...changes } : track
    );
    this.tracksSubj.next(updatedTracks);
  }

  updateSearch(value: string) {
    this.searchSubj.next(value);
  }

  updateAuthorFilter(authors: string[]) {
    this.authorFilterSubj.next(authors);
  }

  updateGenreFilter(genres: string[]) {
    this.genreFilterSubj.next(genres);
  }

  updateSort(order: 'asc' | 'desc') {
    this.sortSubj.next(order);
  }

  toggleShuffle(isShuffle: boolean) {
    this.shuffleSubj.next(isShuffle);
  }

  filterTracks() {
    return combineLatest([
      this.tracks$,
      this.search$,
      this.authorFilter$,
      this.genreFilter$,
      this.sort$,
      this.shuffle$,
    ]).pipe(
      map(([tracks, searchTerm, selectedAuthors, selectedGenres, sortOrder, shuffle]) => {
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
            const dateA = new Date(a.release_date).getTime();
            const dateB = new Date(b.release_date).getTime();
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

        return filteredTracks;
      })
    );
  }
}
