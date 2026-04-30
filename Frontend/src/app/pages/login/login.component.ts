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
    <div class="fixed inset-0 flex items-center justify-center overflow-hidden" style="background:#050814;">

      <!-- ── Animated Background Blobs ── -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 animate-blob"
             style="background: radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%); filter:blur(60px);"></div>
        <div class="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full opacity-20 animate-blob delay-300"
             style="background: radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%); filter:blur(80px);"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 animate-blob delay-200"
             style="background: radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%); filter:blur(60px);"></div>
        <!-- Grid overlay -->
        <div class="absolute inset-0 opacity-[0.03]"
             style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>
      </div>

      <!-- ── Login Card ── -->
      <div class="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">

        <!-- Outer glow ring -->
        <div class="absolute -inset-0.5 rounded-2xl opacity-50"
             style="background: linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.3), rgba(6,182,212,0.3)); filter:blur(8px);"></div>

        <div class="relative glass-modal rounded-2xl p-8 sm:p-10">

          <!-- Logo + Heading -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-5 animate-float"
                 style="background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 0 40px rgba(99,102,241,0.5);">
              <i class="fa-solid fa-layer-group text-white text-2xl"></i>
            </div>
            <h1 class="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
            <p class="mt-2 text-slate-400 text-sm">Sign in to your <span class="text-gradient font-semibold">TeamTasker</span> account</p>
          </div>

          <!-- Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">

            <!-- Email -->
            <div class="space-y-1.5">
              <label for="login-email" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fa-regular fa-envelope text-slate-500 text-sm"></i>
                </div>
                <input
                  formControlName="email"
                  id="login-email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  class="input-dark pl-11 text-sm"
                  style="padding-left:2.75rem;"
                >
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label for="login-password" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fa-solid fa-lock text-slate-500 text-sm"></i>
                </div>
                <input
                  formControlName="password"
                  id="login-password"
                  type="password"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="input-dark pl-11 text-sm"
                  style="padding-left:2.75rem;"
                >
              </div>
            </div>

            <!-- Error -->
            <div *ngIf="error"
                 class="flex items-center gap-3 px-4 py-3 rounded-xl animate-fade-in"
                 style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);">
              <i class="fa-solid fa-triangle-exclamation text-rose-400 text-sm flex-shrink-0"></i>
              <p class="text-rose-300 text-sm font-medium">{{ error }}</p>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              id="login-submit"
              [disabled]="loginForm.invalid || loading"
              class="btn-primary w-full mt-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              <span *ngIf="loading" class="flex items-center gap-2">
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                Signing in...
              </span>
              <span *ngIf="!loading" class="flex items-center gap-2">
                Sign In
                <i class="fa-solid fa-arrow-right text-sm opacity-70 group-hover:translate-x-1 transition-transform duration-200"></i>
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="my-6 flex items-center gap-4">
            <div class="flex-1 divider"></div>
            <span class="text-xs text-slate-600 font-medium">OR</span>
            <div class="flex-1 divider"></div>
          </div>

          <!-- Sign up link -->
          <p class="text-center text-sm text-slate-500">
            Don't have an account?
            <a routerLink="/signup" class="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors ml-1">
              Create one <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>
          </p>
        </div>
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
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.error = err.error?.message || 'Invalid credentials. Please try again.';
        this.loading = false;
      }
    });
  }
}
