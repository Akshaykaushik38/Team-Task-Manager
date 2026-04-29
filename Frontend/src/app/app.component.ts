import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
      <!-- Premium Navbar -->
      <nav *ngIf="authService.isLoggedIn()" class="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0 flex items-center text-white font-extrabold text-2xl tracking-tight cursor-pointer hover:scale-105 transition-transform" routerLink="/dashboard">
                <i class="fa-solid fa-layer-group mr-2"></i> TeamTasker
              </div>
              <div class="hidden md:ml-10 md:flex md:space-x-4">
                <a routerLink="/dashboard" routerLinkActive="bg-white/20 text-white" class="text-indigo-100 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <i class="fa-solid fa-chart-pie mr-1.5"></i> Dashboard
                </a>
                <a routerLink="/projects" routerLinkActive="bg-white/20 text-white" class="text-indigo-100 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <i class="fa-solid fa-folder-open mr-1.5"></i> Projects
                </a>
              </div>
            </div>
            <div class="flex items-center">
              <div class="hidden sm:flex sm:items-center sm:space-x-4">
                <!-- User Profile & Role Indicator -->
                <div class="flex flex-col text-right">
                  <span class="text-white text-sm font-semibold">{{ authService.currentUserValue?.name }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full inline-block mt-0.5 self-end shadow-sm"
                        [ngClass]="authService.isAdmin() ? 'bg-amber-400 text-amber-900' : 'bg-emerald-400 text-emerald-900'">
                    <i class="fa-solid" [ngClass]="authService.isAdmin() ? 'fa-shield-halved' : 'fa-user'"></i>
                    {{ authService.isAdmin() ? 'Admin' : 'Member' }}
                  </span>
                </div>
                
                <div class="h-8 w-px bg-indigo-400/50 mx-2"></div>
                
                <button (click)="logout()" class="text-indigo-100 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all group flex items-center">
                  <i class="fa-solid fa-arrow-right-from-bracket mr-1.5 group-hover:translate-x-1 transition-transform"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- Main Content -->
      <main class="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
