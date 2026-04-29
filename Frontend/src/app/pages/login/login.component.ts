import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="fixed inset-0 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      <!-- Decorative background elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-indigo-900/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div class="max-w-md w-full space-y-8 glass p-10 rounded-2xl shadow-2xl relative z-10 transform hover:scale-[1.01] transition-transform duration-300">
        <div>
          <div class="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center mb-6 text-white text-3xl">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <h2 class="text-center text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
          <p class="mt-2 text-center text-sm text-slate-600">Sign in to manage your tasks and team</p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="email-address" class="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa-regular fa-envelope text-slate-400"></i>
                </div>
                <input formControlName="email" id="email-address" type="email" autocomplete="email" required class="block w-full pl-10 pr-3 py-2.5 border border-slate-300/50 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all" placeholder="you@example.com">
              </div>
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa-solid fa-lock text-slate-400"></i>
                </div>
                <input formControlName="password" id="password" type="password" autocomplete="current-password" required class="block w-full pl-10 pr-3 py-2.5 border border-slate-300/50 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all" placeholder="••••••••">
              </div>
            </div>
          </div>

          <div *ngIf="error" class="bg-red-50/80 border-l-4 border-red-500 p-4 rounded-md animate-fade-in-up">
            <div class="flex items-center">
              <i class="fa-solid fa-circle-exclamation text-red-500 mr-2"></i>
              <p class="text-sm text-red-700 font-medium">{{ error }}</p>
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="loginForm.invalid || loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
              <span *ngIf="loading" class="flex items-center">
                <i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Signing in...
              </span>
              <span *ngIf="!loading">Sign in <i class="fa-solid fa-arrow-right ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i></span>
            </button>
          </div>
          
          <div class="text-sm text-center mt-6">
            <p class="text-slate-600">Don't have an account? <a routerLink="/signup" class="font-bold text-indigo-700 hover:text-indigo-900 transition-colors">Create one now</a></p>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: error => {
          this.error = error.error?.message || 'Login failed';
          this.loading = false;
        }
      });
  }
}
