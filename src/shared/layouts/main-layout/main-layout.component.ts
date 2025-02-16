import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { LogoComponent } from '../../Icons/logo/logo.component';
import { SearchIconComponent } from '../../Icons/search-icon/search-icon.component';
import { LogoutIconComponent } from '../../Icons/logout-icon/logout-icon.component';
import { BurgerIconComponent } from '../../Icons/burger-icon/burger-icon.component';
import { MoonComponent } from '../../Icons/moon/moon.component';
import { SunComponent } from '../../Icons/sun/sun.component';
import { PlayerComponent } from '../../components/player/player.component';
import { SearchFilterService } from '../../services/searchFilter.service';
import { AuthService } from '../../services/auth.service';
import { PlayerService } from '../../services/player.service';
import type { Track } from '../../types/track';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    FormsModule,
    LogoComponent,
    SearchIconComponent,
    LogoutIconComponent,
    BurgerIconComponent,
    MoonComponent,
    SunComponent,
    PlayerComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  /** Флаг для определения темы оформления. */
  protected theme: 'dark' | 'light' = 'dark';
  /** Строка для фильтрации треков из поиска. */
  protected searchTrack: string = '';
  /** Флаг состояния открыто/закрыто боковое меню. */
  protected isOpen: boolean = false;
  /** Выбранный трек для проигрывания в плеере. */
  protected currentTrack?: Track | null;

  /** Переменная для хранения подписки на события маршрутизатора. */
  private routerSubscription: Subscription | null = null;
  /** Переменная для хранения строки поиска. */
  protected searchSubject = new Subject<string>();

  constructor(
    private readonly searchFilterService: SearchFilterService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly playerService: PlayerService
  ) {}

  /** Функция для обработчика клика вне бокового меню, чтобы оно закрывалось. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.isOpen &&
      document.querySelector('.left-side-menu-box') &&
      !document
        .querySelector('.left-side-menu-box')!
        .contains(event.target as HTMLElement)
    ) {
      this.isOpen = false;
    }
  }

  ngOnInit() {
    document.body.setAttribute('data-theme', this.theme);
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetMenuAndSearch();
      }
    });

    this.playerService.currentTrack$.subscribe((track) => {
      this.currentTrack = track;
    });

    this.searchSubject.pipe(debounceTime(900)).subscribe((value) => {
      this.onSearchChange(value);
    });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  protected onSearchChange(value: string) {
    this.searchFilterService.updateSearch(value);
  }

  protected toggleOpen = () => {
    this.isOpen = !this.isOpen;
  };

  protected toggleTheme = () => {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', this.theme);
  };

  protected logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private resetMenuAndSearch() {
    this.isOpen = false;
    this.searchTrack = '';
    this.searchFilterService.updateSearch(this.searchTrack);
  }
}
