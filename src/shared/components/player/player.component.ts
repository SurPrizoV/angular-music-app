import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { BackComponent } from '../../Icons/back/back.component';
import { PauseComponent } from '../../Icons/pause/pause.component';
import { PlayComponent } from '../../Icons/play/play.component';
import { SkipComponent } from '../../Icons/skip/skip.component';
import { RepeatComponent } from '../../Icons/repeat/repeat.component';
import { MixComponent } from '../../Icons/mix/mix.component';
import { TrackIconComponent } from '../../Icons/track-icon/track-icon.component';
import { HeartIconComponent } from '../../Icons/heart-icon/heart-icon.component';
import { DislikeComponent } from '../../Icons/dislike/dislike.component';
import { VolumeComponent } from '../../Icons/volume/volume.component';
import { RepeatTrackComponent } from '../../Icons/repeat-track/repeat-track.component';
import { PlayerService } from '../../services/player.service';
import { SearchFilterService } from '../../services/searchFilter.service';
import { TracksAPIService } from '../../services/tracksAPI.service';

import { Track } from '../../interfaces';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    BackComponent,
    PauseComponent,
    PlayComponent,
    SkipComponent,
    RepeatComponent,
    MixComponent,
    TrackIconComponent,
    HeartIconComponent,
    DislikeComponent,
    VolumeComponent,
    RepeatTrackComponent,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  currentTrack?: Track | null;
  play?: boolean;
  duration: number = 0;
  currentTime: number = 0;
  isShuffle?: boolean;
  originalOrder: Track[] = [];
  repeatMode?: string = 'none';

  constructor(
    private playerService: PlayerService,
    private searchFilterService: SearchFilterService,
    private tracksAPIService: TracksAPIService
  ) {}

  ngOnInit() {
    this.playerService.currentTrack$.subscribe((track) => {
      this.currentTrack = track;
    });

    this.playerService.isPlaying$.subscribe((isPlaying) => {
      this.play = isPlaying;
    });

    this.playerService.duration$.subscribe((duration) => {
      this.duration = duration;
    });

    this.playerService.currentTime$.subscribe((time) => {
      this.currentTime = time;
    });

    this.searchFilterService.filterTracks().subscribe((tracks) => {
      this.originalOrder = tracks;
    });

    this.searchFilterService.shuffle$.subscribe((shuffle) => {
      this.isShuffle = shuffle;
    });
  }

  onSeek(event: Event) {
    this.playerService.seekTo((event.target as HTMLInputElement).valueAsNumber);
  }

  onVolumeChange(event: Event) {
    this.playerService.setVolume(
      (event.target as HTMLInputElement).valueAsNumber
    );
  }

  onPrevious() {
    this.playerService.previous();
  }

  onPlayPause() {
    this.playerService.isPlaying$.value
      ? this.playerService.pause()
      : this.playerService.play();
  }

  onNext() {
    this.playerService.next();
  }

  setRepeatMode(mode: 'none' | 'track' | 'all') {
    this.playerService.setRepeatMode(mode);
    this.repeatMode = mode;
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;

    if (this.isShuffle) {
      this.searchFilterService.toggleShuffle(true);
    } else {
      this.playerService.setTracks(this.originalOrder);
      this.searchFilterService.toggleShuffle(false);
    }
  }

  onLike(id: number) {
    this.tracksAPIService.addTrackInFavorite(id).subscribe();
  }

  onDisLike(id: number) {
    this.tracksAPIService.removeTrackFromFavorite(id).subscribe();
  }
}
