import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CryingComponent } from '../../../shared/Icons/crying/crying.component';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [RouterModule, CryingComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {}
