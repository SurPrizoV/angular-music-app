import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClockIconComponent } from '../../../shared/Icons/clock-icon/clock-icon.component';
import { TrackIconComponent } from '../../../shared/Icons/track-icon/track-icon.component';
import { HeartIconComponent } from '../../../shared/Icons/heart-icon/heart-icon.component';
import { DislikeComponent } from '../../../shared/Icons/dislike/dislike.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { TracksAPIService } from '../../../shared/services/tracksAPI.service';
import { PlayerService } from '../../../shared/services/player.service';
import { SearchFilterService } from '../../../shared/services/searchFilter.service';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';

import type { Track } from '../../../shared/types/track';

@Component({
  selector: 'app-playlist-day-page',
  standalone: true,
  imports: [
    CommonModule,
    ClockIconComponent,
    TrackIconComponent,
    HeartIconComponent,
    DislikeComponent,
    SkeletonComponent,
    TimeFormatPipe,
  ],
  templateUrl: './playlist-day-page.component.html',
})
export class PlaylistDayPageComponent implements OnInit {
  /** Список отсортированных треков по поиску. */
  protected filteredTracks: Track[] = [];
  /** Флаг для отображения скелетона. */
  protected isLoading: boolean = false;

  constructor(
    private readonly tracksAPIService: TracksAPIService,
    public searchFilterService: SearchFilterService,
    private readonly playerService: PlayerService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.tracksAPIService.getTrackCollectionById(1).subscribe({
      next: (tracks: Track[]) => {
        for (const track of tracks) {
          const isLiked = track.stared!.some(
            (user) => user.email === localStorage.getItem('mail')
          );

          track.isLiked = isLiked;
        }

        this.searchFilterService.setTracks(tracks);

        this.searchFilterService.filterTracks().subscribe((filteredTracks) => {
          this.filteredTracks = filteredTracks;
        });
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
}
