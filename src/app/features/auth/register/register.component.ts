import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { z } from 'zod';
import { AuthService } from '../../../core/services/auth.service';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Please enter your name'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
  <div class="auth-page">
    <div class="auth-inner">
      <div class="brand">
        <img src="assets/chatapp-logo.svg" alt="ChatApp" class="logo" />
        <h1>Create account</h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card">
        <label class="field">
          <span class="label">Full name</span>
          <input formControlName="name" placeholder="Jane Doe" />
          <div class="error" *ngIf="showError('name')">{{ firstError('name') }}</div>
        </label>

        <label class="field">
          <span class="label">Email</span>
          <input formControlName="email" type="email" placeholder="you@domain.com" />
          <div class="error" *ngIf="showError('email')">{{ firstError('email') }}</div>
        </label>

        <label class="field">
          <span class="label">Password</span>
          <input formControlName="password" type="password" placeholder="Password" />
          <div class="error" *ngIf="showError('password')">{{ firstError('password') }}</div>
        </label>

        <label class="field">
          <span class="label">Confirm Password</span>
          <input formControlName="confirmPassword" type="password" placeholder="Confirm password" />
          <div class="error" *ngIf="showError('confirmPassword')">{{ firstError('confirmPassword') }}</div>
        </label>

        <button class="submit" type="submit" [disabled]="loading || form.invalid">
          <span *ngIf="!loading">Create account</span>
          <span *ngIf="loading" class="spinner" aria-hidden="true"></span>
        </button>

        <div class="actions">
          <a routerLink="/login">Already have an account?</a>
        </div>
      </form>
    </div>
  </div>
  `,
  styles: [
    `
    :host { display:block }
    .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background: linear-gradient(180deg,#fff9f0,#fff); padding:24px; }
    .auth-inner { width:100%; max-width:420px; }
    .brand { text-align:center; margin-bottom:16px }
    .brand .logo { width:72px; height:72px; display:block; margin:0 auto 8px }
    .card { background:#fff; border-radius:12px; padding:20px; box-shadow:0 8px 30px rgba(11,20,45,0.06); }
    .field { display:block; margin-bottom:12px; }
    .label { display:block; font-weight:600; margin-bottom:6px; }
    input { width:100%; padding:10px 12px; border:1px solid #eef2f7; border-radius:8px; font-size:14px; }
    .submit { width:100%; display:flex; align-items:center; justify-content:center; padding:10px 12px; border-radius:8px; background:#059669; color:#fff; border:none; font-weight:700; cursor:pointer; }
    .submit:disabled { opacity:0.6; cursor:not-allowed }
    .spinner { width:18px; height:18px; border:3px solid rgba(255,255,255,0.25); border-top-color:#fff; border-radius:50%; animation:spin 1s linear infinite; display:inline-block }
    @keyframes spin { to { transform:rotate(360deg) } }
    .error { color:#dc2626; font-size:13px; margin-top:6px }
    .actions { margin-top:12px; text-align:center }

    @media(min-width:900px){ .auth-inner { max-width:400px } }
    `
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  subs: Subscription[] = [];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const s = this.form.valueChanges.subscribe(() => this.runZodValidation());
    this.subs.push(s);
  }

  ngOnDestroy(): void { this.subs.forEach(s => s.unsubscribe()); }

  firstError(controlName: string) {
    const c = this.form.get(controlName);
    if (!c) return null;
    if (c.touched || c.dirty) {
      const zErr = c.getError('zod');
      if (zErr) return zErr;
      const errors = c.errors ?? {};
      if (errors['required']) return 'Required';
      if (errors['email']) return 'Invalid email';
      if (errors['minlength']) return `Minimum ${ (errors['minlength'] as any).requiredLength } characters`;
    }
    return null;
  }

  showError(controlName: string) { const c = this.form.get(controlName); return !!this.firstError(controlName) && (c?.touched || c?.dirty); }

  private runZodValidation() {
    const vals = this.form.value;
    const res = registerSchema.safeParse(vals as any);

    // clear existing zod errors
    Object.keys(this.form.controls).forEach(k => {
      const ctrl = this.form.get(k);
      if (!ctrl) return;
      const existing = ctrl.errors ?? {};
      const errs = { ...(existing as any) } as any;
      if (errs && errs['zod']) delete errs['zod'];
      if (Object.keys(errs).length > 0) ctrl.setErrors(errs);
      else ctrl.setErrors(null);
    });

    if (!res.success) {
      res.error.issues.forEach(issue => {
        const path = issue.path[0] as string;
        const ctrl = this.form.get(path);
        if (ctrl) ctrl.setErrors({ ...(ctrl.errors || {}), zod: issue.message });
      });
    }
  }

  async onSubmit(): Promise<void> {
    this.runZodValidation();
    if (this.form.invalid) return;

    this.loading = true;
    const { name, email, password } = this.form.value;
    try {
      await this.auth.register(name, email, password);
      await this.router.navigate(['/chat']);
    } catch (err) {
      // leave loading=false in finally
    } finally {
      this.loading = false;
    }
  }
}

