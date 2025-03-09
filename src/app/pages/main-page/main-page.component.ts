import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TrackIconComponent } from '../../../shared/Icons/track-icon/track-icon.component';
import { HeartIconComponent } from '../../../shared/Icons/heart-icon/heart-icon.component';
import { DislikeComponent } from '../../../shared/Icons/dislike/dislike.component';
import { ClockIconComponent } from '../../../shared/Icons/clock-icon/clock-icon.component';
import { SkeletonImgComponent } from '../../../shared/Icons/skeleton-img/skeleton-img.component';
import { PlaylistDayComponent } from '../../../shared/Img/playlist-day/playlist-day.component';
import { PlaylistHitsComponent } from '../../../shared/Img/playlist-hits/playlist-hits.component';
import { PlaylistIndiComponent } from '../../../shared/Img/playlist-indi/playlist-indi.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { TracksAPIService } from '../../../shared/services/tracksAPI.service';
import { SearchFilterService } from '../../../shared/services/searchFilter.service';
import { PlayerService } from '../../../shared/services/player.service';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';
import type { Track } from '../../../shared/types/track';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    TrackIconComponent,
    HeartIconComponent,
    DislikeComponent,
    ClockIconComponent,
    SkeletonImgComponent,
    PlaylistDayComponent,
    PlaylistHitsComponent,
    PlaylistIndiComponent,
    SelectComponent,
    SkeletonComponent,
    TimeFormatPipe,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit {
  /** Список отсортированных треков по поиску, жанру, автору и году. */
  protected filteredTracks: Track[] = [];
  /** Список авторов для фильтрации. */
  protected authors: string[] = [];
  /** Список жанров для фильтрации. */
  protected genres: string[] = [];
  /** Флаг для отображения скелетона. */
  protected isLoading: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly tracksAPIService: TracksAPIService,
    public readonly searchFilterService: SearchFilterService,
    private readonly playerService: PlayerService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.tracksAPIService.getTracks().subscribe({
      next: (tracks: Track[]) => {
        this.isLoading = true;
        for (const track of tracks) {
          const isLiked = track.stared.some((user) => user.email === localStorage.getItem('mail'))
          track.isLiked = isLiked
        }

        this.authors = [...new Set(tracks.map((track) => track.author))];
        this.genres = [...new Set(tracks.map((track) => track.genre))];

        this.searchFilterService.setTracks(tracks);

        this.searchFilterService.filterTracks().subscribe((filteredTracks) => {
          console.log('this.searchFilterService.filterTracks(). ::::', filteredTracks);
          this.filteredTracks = filteredTracks;
        });

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  protected playTrack(track: Track) {
    const trackIndex = this.filteredTracks.findIndex((t) => t.id === track.id);
    if (trackIndex !== -1) {
      this.playerService.setTracks(this.filteredTracks);
      this.playerService.setCurrentIndex(trackIndex);
      this.playerService.play();
    }
  }

  protected onLike(event: MouseEvent, id: number) {
    event.stopPropagation();
    this.tracksAPIService.addTrackInFavorite(id).subscribe();
  }

  protected onDisLike(event: MouseEvent, id: number) {
    event.stopPropagation();
    this.tracksAPIService.removeTrackFromFavorite(id).subscribe();
  }

  protected onNavigate(param: string) {
    this.router.navigate([`/${param}`]);
  }
}
