import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClockIconComponent } from '../../../shared/Icons/clock-icon/clock-icon.component';
import { TrackIconComponent } from '../../../shared/Icons/track-icon/track-icon.component';
import { DislikeComponent } from '../../../shared/Icons/dislike/dislike.component';
import { TracksAPIService } from '../../../shared/services/tracksAPI.service';
import { SearchFilterService } from '../../../shared/services/searchFilter.service';
import { PlayerService } from '../../../shared/services/player.service';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

import type { Track } from '../../../shared/types/track';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [
    CommonModule,
    ClockIconComponent,
    TrackIconComponent,
    DislikeComponent,
    TimeFormatPipe,
    SkeletonComponent,
  ],
  templateUrl: './favorites-page.component.html',
})
export class FavoritesPageComponent implements OnInit {
  /** Список треков, пропущенных через фильтр поиска. */
  protected filteredTracks: Track[] = [];
  /** Флаг загрузки для отображения skeleton. */
  protected isLoading: boolean = false;

  constructor(
    private readonly tracksAPIService: TracksAPIService,
    public readonly searchFilterService: SearchFilterService,
    private readonly playerService: PlayerService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.tracksAPIService.getFavoriteTracks().subscribe({
      next: (tracks: Track[]) => {
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

  protected onDisLike(event: MouseEvent, id: number) {
    event.stopPropagation();
    this.tracksAPIService.removeTrackFromFavorite(id).subscribe({
      next: () => {
        this.filteredTracks = this.filteredTracks.filter(
          (track) => track.id !== id
        );
      },
    });
  }
}
