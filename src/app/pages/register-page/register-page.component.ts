import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EyeComponent } from '../../../shared/Icons/eye/eye.component';
import { CloseEyeComponent } from '../../../shared/Icons/close-eye/close-eye.component';
import { AuthService } from '../../../shared/services/auth.service';

import { catchError, throwError } from 'rxjs';
import { LoaderComponent } from '../../../shared/Icons/loader/loader.component';
import { UserModel } from '../../../shared/types/user';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    EyeComponent,
    CloseEyeComponent,
    LoaderComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit {
  form!: FormGroup;
  /** Флаг для перевода кнопки в состояние disabled. */
  disabled!: boolean;
  /** Флаг для скрытия/отображения пароля. */
  showPass!: boolean;
  /** Флаг для скрытия/отображения повтора пароля. */
  showRepeatPass!: boolean;
  /** Флаг для отображения состояния загрузки. */
  protected isLoading: boolean = false;
  /** Для сообщения об ошибке */
  protected errorMessage?: string;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
        repeatPassword: new FormControl(null, [Validators.required]),
      },
      { validators: this.passEqual }
    );
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

    const user = new UserModel({
      username: this.form.value.email,
      email: this.form.value.email,
      password: this.form.value.password,
    });

    this.authService
      .register(user)
      .pipe(
        catchError((error) => {
          if (error.statusText === 'Unknown Error') {
            this.errorMessage = `Для дальнейшего пользования приложением, перейдите https://github.com/SurPrizoV/angular-music-app?tab=readme-ov-file в раздел Ошибки`;
          } else {
            this.errorMessage = error.statusText;
          }
          this.disabled = false;
          this.isLoading = false;
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.form.reset();
        this.router.navigate(['/login'], { queryParams: { success: true } });
        this.disabled = false;
        this.isLoading = false;
      });
  }

  protected toggleShowPass() {
    this.showPass = !this.showPass;
  }

  protected toggleShowRepeatPass() {
    this.showRepeatPass = !this.showRepeatPass;
  }

  /** Кастомный валидатор для проверки на совпадение паролей. */
  private passEqual(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const repeatPassword = group.get('repeatPassword');

    if (password?.value !== repeatPassword?.value) {
      repeatPassword?.setErrors({ notequal: true });
      return { notequal: true };
    } else {
      repeatPassword?.setErrors(null);
      return null;
    }
  }
}
