import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div class="w-full max-w-sm bg-gray-900 rounded-2xl p-8 shadow-xl">
        <h1 class="text-2xl font-bold text-white mb-6 text-center">Create account</h1>

        @if (error()) {
          <p class="text-red-400 text-sm mb-4 text-center">{{ error() }}</p>
        }

        <form (ngSubmit)="submit()" class="space-y-4">
          <input [(ngModel)]="username" name="username" placeholder="Username"
            class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input [(ngModel)]="email" name="email" type="text" placeholder="Email"
            autocomplete="email"
            class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input [(ngModel)]="password" name="password" type="password" placeholder="Password"
            class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
          <button type="submit" [disabled]="loading()"
            class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg py-3 transition">
            {{ loading() ? 'Creating…' : 'Create account' }}
          </button>
        </form>

        <p class="text-gray-400 text-sm text-center mt-4">
          Have an account? <a routerLink="/login" class="text-indigo-400 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  async submit(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.register(this.username, this.email, this.password);
      this.router.navigate(['/chat']);
    } catch {
      this.error.set('Registration failed. Username or email may already exist.');
    } finally {
      this.loading.set(false);
    }
  }
}
