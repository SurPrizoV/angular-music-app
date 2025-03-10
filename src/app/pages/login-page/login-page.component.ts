import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { EyeComponent } from '../../../shared/Icons/eye/eye.component';
import { CloseEyeComponent } from '../../../shared/Icons/close-eye/close-eye.component';
import { LoaderComponent } from '../../../shared/Icons/loader/loader.component';
import { AuthService } from '../../../shared/services/auth.service';

import { catchError, of } from 'rxjs';
import { UserModel } from '../../../shared/types/user';
import { UserRequest } from '../../../shared/types/user.request';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    EyeComponent,
    CloseEyeComponent,
    LoaderComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  protected form!: FormGroup;
  /** Флаг для перевода кнопки в состояние disabled. */
  protected disabled!: boolean;
  /** Флаг для скрытия/отображения пароля. */
  protected showPass!: boolean;
  /** Флаг для отображения состояния загрузки. */
  protected isLoading: boolean = false;
  /** Для сообщения об ошибке */
  protected errorMessage?: string;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  get error(): string {
    return this.authService.error;
  }

  protected submit() {
    if (this.form.invalid) {
      return;
    }

    this.disabled = true;
    this.isLoading = true;

    const user: UserRequest = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService
      .login(user)
      .pipe(
        catchError((error) => {
          if (error.statusText === 'Unknown Error') {
            this.errorMessage = `Для дальнейшего пользования приложением, перейдите https://github.com/SurPrizoV/angular-music-app?tab=readme-ov-file в раздел Ошибки`;
          } else {
            this.errorMessage = error.statusText;
          }
          this.disabled = false;
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(() => {
        this.authService.getToken(user).subscribe(() => {
          this.form.reset();
          this.router.navigate(['/']);
          this.disabled = false;
          this.isLoading = false;
        });
      });
  }

  protected toggleShowPass() {
    this.showPass = !this.showPass;
  }
}
