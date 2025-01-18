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
  disabled!: boolean;
  showPass!: boolean;
  showRepeatPass!: boolean;

  constructor(private authService: AuthService, private router: Router) {}

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

  submit() {
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

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  toggleShowRepeatPass() {
    this.showRepeatPass = !this.showRepeatPass;
  }

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
