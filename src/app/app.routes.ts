import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat.page').then((m) => m.ChatPageComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/chat' },
];

