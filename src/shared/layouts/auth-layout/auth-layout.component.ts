import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { LogoComponent } from '../../Icons/logo/logo.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule, LogoComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent implements OnInit {
  /** Флаг для отображения сообщения подтверждения регистрации. */
  protected showMessage: boolean = false;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((p) => {
      if (p['success']) {
        this.showMessage = true;

        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      }
    });
  }
}
