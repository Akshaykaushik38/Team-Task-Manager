import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center overflow-y-auto py-8" style="background:#050814;">

      <!-- ── Animated Background ── -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25 animate-blob"
             style="background: radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%); filter:blur(60px);"></div>
        <div class="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 animate-blob delay-400"
             style="background: radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%); filter:blur(80px);"></div>
        <div class="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full opacity-10 animate-blob delay-200"
             style="background: radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%); filter:blur(50px);"></div>
        <div class="absolute inset-0 opacity-[0.025]"
             style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>
      </div>

      <!-- ── Signup Card ── -->
      <div class="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">

        <!-- Glow ring -->
        <div class="absolute -inset-0.5 rounded-2xl opacity-40"
             style="background: linear-gradient(135deg, rgba(168,85,247,0.5), rgba(99,102,241,0.3), rgba(6,182,212,0.3)); filter:blur(8px);"></div>

        <div class="relative glass-modal rounded-2xl p-8 sm:p-10">

          <!-- Header -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-5 animate-float"
                 style="background: linear-gradient(135deg, #8b5cf6, #6366f1); box-shadow: 0 0 40px rgba(139,92,246,0.5);">
              <i class="fa-solid fa-user-plus text-white text-2xl"></i>
            </div>
            <h1 class="text-3xl font-bold text-white tracking-tight">Create Account</h1>
            <p class="mt-2 text-slate-400 text-sm">Join <span class="text-gradient font-semibold">TeamTasker</span> and start collaborating</p>
          </div>

          <!-- Form -->
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-4">

            <!-- Full Name -->
            <div class="space-y-1.5 animate-fade-in-up delay-100">
              <label for="signup-name" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fa-regular fa-user text-slate-500 text-sm"></i>
                </div>
                <input formControlName="name" id="signup-name" type="text" placeholder="John Doe"
                       class="input-dark text-sm" style="padding-left:2.75rem;">
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-1.5 animate-fade-in-up delay-200">
              <label for="signup-email" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fa-regular fa-envelope text-slate-500 text-sm"></i>
                </div>
                <input formControlName="email" id="signup-email" type="email" placeholder="you@example.com"
                       class="input-dark text-sm" style="padding-left:2.75rem;">
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-1.5 animate-fade-in-up delay-300">
              <label for="signup-password" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fa-solid fa-lock text-slate-500 text-sm"></i>
                </div>
                <input formControlName="password" id="signup-password" type="password" placeholder="Min. 6 characters"
                       class="input-dark text-sm" style="padding-left:2.75rem;">
              </div>
              <p class="text-xs text-slate-600 pl-1">Must be at least 6 characters</p>
            </div>

            <!-- Role -->
            <div class="space-y-1.5 animate-fade-in-up delay-400">
              <label for="signup-role" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Role</label>
              <div class="grid grid-cols-2 gap-3">
                <!-- Member option -->
                <label class="role-option cursor-pointer" [class.role-selected]="signupForm.get('role')?.value === 'Member'">
                  <input type="radio" formControlName="role" value="Member" class="sr-only">
                  <div class="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200"
                       [style]="signupForm.get('role')?.value === 'Member'
                         ? 'background:rgba(52,211,153,0.1); border-color:rgba(52,211,153,0.4); color:#34d399;'
                         : 'background:rgba(255,255,255,0.03); border-color:rgba(255,255,255,0.08); color:#64748b;'">
                    <i class="fa-solid fa-user text-lg"></i>
                    <span class="text-xs font-semibold">Team Member</span>
                  </div>
                </label>
                <!-- Admin option -->
                <label class="role-option cursor-pointer" [class.role-selected]="signupForm.get('role')?.value === 'Admin'">
                  <input type="radio" formControlName="role" value="Admin" class="sr-only">
                  <div class="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200"
                       [style]="signupForm.get('role')?.value === 'Admin'
                         ? 'background:rgba(251,191,36,0.1); border-color:rgba(251,191,36,0.4); color:#fbbf24;'
                         : 'background:rgba(255,255,255,0.03); border-color:rgba(255,255,255,0.08); color:#64748b;'">
                    <i class="fa-solid fa-shield-halved text-lg"></i>
                    <span class="text-xs font-semibold">Project Admin</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Error -->
            <div *ngIf="error"
                 class="flex items-center gap-3 px-4 py-3 rounded-xl animate-fade-in"
                 style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25);">
              <i class="fa-solid fa-triangle-exclamation text-rose-400 text-sm flex-shrink-0"></i>
              <p class="text-rose-300 text-sm font-medium">{{ error }}</p>
            </div>

            <!-- Submit -->
            <button type="submit" id="signup-submit"
                    [disabled]="signupForm.invalid || loading"
                    class="btn-primary w-full mt-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              <span *ngIf="loading" class="flex items-center gap-2">
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                Creating account...
              </span>
              <span *ngIf="!loading" class="flex items-center gap-2">
                Create Account
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

          <!-- Login link -->
          <p class="text-center text-sm text-slate-500">
            Already have an account?
            <a routerLink="/login" class="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors ml-1">
              Sign in <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) this.router.navigate(['/']);
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Member', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.authService.signup(this.signupForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.error = err.error?.message || 'Signup failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
