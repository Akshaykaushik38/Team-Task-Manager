import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="bg-app min-h-screen flex flex-col font-sans">

      <!-- ─── Navbar ─── -->
      <nav *ngIf="authService.isLoggedIn()" class="navbar sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">

            <!-- Logo -->
            <div class="flex items-center gap-8">
              <a routerLink="/dashboard" class="flex items-center gap-2.5 group cursor-pointer select-none">
                <div class="relative h-9 w-9 rounded-xl flex items-center justify-center overflow-hidden"
                     style="background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 0 20px rgba(99,102,241,0.5);">
                  <i class="fa-solid fa-layer-group text-white text-base"></i>
                </div>
                <span class="text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  Team<span class="text-gradient">Tasker</span>
                </span>
              </a>

              <!-- Nav Links (desktop) -->
              <div class="hidden md:flex items-center gap-1">
                <a routerLink="/dashboard" routerLinkActive="nav-active"
                   class="nav-link flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                  <i class="fa-solid fa-chart-pie text-indigo-400"></i>
                  Dashboard
                </a>
                <a routerLink="/projects" routerLinkActive="nav-active"
                   class="nav-link flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                  <i class="fa-solid fa-folder-open text-purple-400"></i>
                  Projects
                </a>
              </div>
            </div>

            <!-- User Area -->
            <div class="flex items-center gap-3">
              <!-- Role badge -->
              <div class="hidden sm:flex items-center gap-3">
                <div class="flex flex-col items-end">
                  <span class="text-sm font-semibold text-slate-200 leading-tight">
                    {{ authService.currentUserValue?.name }}
                  </span>
                  <span class="text-xs px-2 py-0.5 rounded-full font-semibold mt-0.5"
                        [class]="authService.isAdmin()
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'">
                    <i class="fa-solid mr-1"
                       [class]="authService.isAdmin() ? 'fa-shield-halved' : 'fa-user'"></i>
                    {{ authService.isAdmin() ? 'Admin' : 'Member' }}
                  </span>
                </div>

                <!-- Avatar -->
                <div class="avatar h-9 w-9 text-sm cursor-pointer">
                  {{ (authService.currentUserValue?.name || 'U').charAt(0).toUpperCase() }}
                </div>

                <!-- Separator -->
                <div class="h-8 w-px bg-white/10 mx-1"></div>

                <!-- Logout -->
                <button (click)="logout()"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 border border-transparent hover:border-rose-500/20">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                  <span class="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Progress bar accent line -->
        <div class="progress-bar absolute bottom-0 left-0 right-0 h-0.5 opacity-40"></div>
      </nav>

      <!-- ─── Page Content ─── -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>

      <!-- ─── Footer (when logged in) ─── -->
      <footer *ngIf="authService.isLoggedIn()" class="mt-auto border-t border-white/5 py-4">
        <div class="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-slate-600">
          <span>© 2025 TeamTasker. All rights reserved.</span>
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            API Connected
          </span>
        </div>
      </footer>
    </div>

    <style>
      .nav-active {
        color: #fff !important;
        background: rgba(99,102,241,0.12) !important;
        border: 1px solid rgba(99,102,241,0.2) !important;
      }
      .nav-active i { color: inherit !important; }
    </style>
  `
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
