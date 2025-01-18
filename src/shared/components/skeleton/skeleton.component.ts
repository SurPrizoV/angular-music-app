import { Component } from '@angular/core';

import { ClockIconComponent } from '../../Icons/clock-icon/clock-icon.component';
import { SkeletonTrackIconComponent } from '../../Icons/skeleton-track-icon/skeleton-track-icon.component';
import { SkeletonNameComponent } from '../../Icons/skeleton-name/skeleton-name.component';
import { SkeletonAuthorComponent } from '../../Icons/skeleton-author/skeleton-author.component';
import { HeartIconComponent } from '../../Icons/heart-icon/heart-icon.component';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [
    ClockIconComponent,
    SkeletonTrackIconComponent,
    SkeletonNameComponent,
    SkeletonAuthorComponent,
    HeartIconComponent,
  ],
  templateUrl: './skeleton.component.html',
})
export class SkeletonComponent {}
