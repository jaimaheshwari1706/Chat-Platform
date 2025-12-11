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
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {{isLogin ? 'Sign in to chat' : 'Create account'}}
          </h2>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                [(ngModel)]="username"
                name="username"
                type="text"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <input
                [(ngModel)]="password"
                name="password"
                type="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div *ngIf="error" class="text-red-600 text-sm text-center">
            {{error}}
          </div>

          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{isLogin ? 'Sign in' : 'Sign up'}}
            </button>
          </div>

          <div class="text-center">
            <button
              type="button"
              (click)="toggleMode()"
              class="text-indigo-600 hover:text-indigo-500"
            >
              {{isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}}
            </button>
          </div>
        </form>
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
    this.error = '';
    
    const authObservable = this.isLogin 
      ? this.authService.login(this.username, this.password)
      : this.authService.register(this.username, this.password);

    authObservable.subscribe({
      next: (response) => {
        this.authService.setCurrentUser({
          username: response.username,
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