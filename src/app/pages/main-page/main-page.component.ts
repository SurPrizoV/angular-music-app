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

import { Track } from '../../../shared/interfaces';

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
  filteredTracks: Track[] = [];
  authors: string[] = [];
  genres: string[] = [];
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private tracksAPIService: TracksAPIService,
    public searchFilterService: SearchFilterService,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.tracksAPIService.getTracks().subscribe({
      next: (tracks: Track[]) => {
        this.isLoading = true;
        tracks = tracks.map((track) => ({
          ...track,
          isLiked: track.stared_user.some(
            (user) => user.email === localStorage.getItem('mail')
          ),
        }));

        this.authors = [...new Set(tracks.map((track) => track.author))];
        this.genres = [...new Set(tracks.map((track) => track.genre))];

        this.searchFilterService.setTracks(tracks);

        this.searchFilterService.filterTracks().subscribe((filteredTracks) => {
          this.filteredTracks = filteredTracks;
        });

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  playTrack(track: Track) {
    const trackIndex = this.filteredTracks.findIndex((t) => t.id === track.id);
    if (trackIndex !== -1) {
      this.playerService.setTracks(this.filteredTracks);
      this.playerService.setCurrentIndex(trackIndex);
      this.playerService.play();
    }
  }

  onLike(event: MouseEvent, id: number) {
    event.stopPropagation();
    this.tracksAPIService.addTrackInFavorite(id).subscribe();
  }

  onDisLike(event: MouseEvent, id: number) {
    event.stopPropagation();
    this.tracksAPIService.removeTrackFromFavorite(id).subscribe();
  }

  onNavigate(param: string) {
    this.router.navigate([`/${param}`]);
  }
}
