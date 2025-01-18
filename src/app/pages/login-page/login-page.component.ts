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

import { User } from '../../../shared/interfaces';

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
  form!: FormGroup;
  disabled!: boolean;
  showPass!: boolean;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

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

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.disabled = true;
    this.isLoading = true;

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService.login(user).subscribe(() => {
      this.authService.getToken(user).subscribe(() => {
        this.form.reset();
        this.router.navigate(['/']);
        this.disabled = false;
        this.isLoading = false;
      });
    });
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }
}
