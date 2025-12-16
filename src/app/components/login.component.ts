import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Connectly</h1>
          <p class="text-gray-400 text-sm">{{isLogin ? 'Welcome back to the conversation' : 'Join the conversation'}}</p>
        </div>

        <!-- Login Form -->
        <div class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          <form class="space-y-6" (ngSubmit)="onSubmit()">
            <div class="space-y-4">
              <div>
                <input
                  [(ngModel)]="username"
                  name="username"
                  type="text"
                  required
                  class="w-full px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                  placeholder="Username"
                />
              </div>
              
              <div>
                <input
                  [(ngModel)]="password"
                  name="password"
                  type="password"
                  required
                  class="w-full px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                  placeholder="Password"
                />
              </div>
            </div>

            <div *ngIf="error" class="bg-red-900/50 border border-red-500/50 text-red-400 text-sm p-4 rounded-2xl text-center backdrop-blur-sm">
              {{error}}
            </div>

            <button
              type="submit"
              [disabled]="!username || !password"
              class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {{isLogin ? 'Sign In' : 'Create Account'}}
            </button>
          </form>
          
          <div class="mt-6 text-center">
            <span class="text-gray-400 text-sm">
              {{isLogin ? "New to Connectly?" : "Already have an account?"}}
            </span>
            <button
              type="button"
              (click)="toggleMode()"
              class="ml-2 text-purple-400 hover:text-purple-300 font-semibold text-sm transition-colors"
            >
              {{isLogin ? 'Create account' : 'Sign in'}}
            </button>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-gray-500 text-xs">Real-time messaging • Secure • Fast</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  isLogin = true;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.username.trim() || !this.password.trim()) return;
    
    this.error = '';
    
    const authObservable = this.isLogin 
      ? this.authService.login(this.username.trim(), this.password)
      : this.authService.register(this.username.trim(), this.password);

    authObservable.subscribe({
      next: (response) => {
        this.authService.setCurrentUser({
          username: response.user.username,
          token: response.token
        });
        this.router.navigate(['/chat']);
      },
      error: (error) => {
        this.error = error.error?.error || 'Authentication failed';
      }
    });
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.error = '';
  }
}