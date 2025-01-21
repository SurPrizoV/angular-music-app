import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

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

import { Track } from '../../interfaces';

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
  // TRACEVIEW все публичные методы и свойства должны быть с описанием.
  theme: string = 'dark';
  searchTrack: string = '';
  isOpen: boolean = false;
  // REVIEW Опиши сначала публичине поля и после сгрупируй приватные поля так удобно читать класс и в целом распространненая практика.
  private routerSubscription: Subscription | null = null;
  currentTrack?: Track | null;

  constructor(
    // REVIEW закроме максимально методы.
    private readonly searchFilterService: SearchFilterService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly playerService: PlayerService
  ) {}

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
  }

  // REVIEW а вот приватные методы можно опускать совсем вниз после protected методов хотя допускается располагать их рядом бубличными
  // методами показывая тем сама тесную связь методов и то что приватный метод используется только в функция рядом. В таком случае
  // приватный метод будет ниже.
  // в данном случае можно опустить вниз.
  private resetMenuAndSearch() {
    this.isOpen = false;
    this.searchTrack = '';
    this.searchFilterService.updateSearch(this.searchTrack);
  }

  // REVIEW модификатор доступа protected уменьшает видимость метода из вне. По идеи обработчик события не должен быть видет из вне класса.
  // а только лишь для шаблона.
  // Наружу должны торчать только те методы и свойства которые мы хотим. Ничего лишнего недолжно быть видно из вне.
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

  // REVIEW тоже бы поднять наверх до конструктора
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

  // REVIEW Методы жизненного цикла лучше размещать после конструктора, это позволяет ожидать в нужном месте класса описания этих методов.
  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
}
