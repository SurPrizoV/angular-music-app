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

import { User } from '../../../shared/interfaces';

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

    const user: User = {
      username: this.form.value.email,
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService.register(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/login'], { queryParams: { success: true } });
      this.disabled = false;
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
