import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let refreshing = false;
let queue: Array<(token: string) => void> = [];

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);

  const addToken = (r: HttpRequest<unknown>, token: string) =>
    r.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  const token = auth.accessToken();
  const authed = token ? addToken(req, token) : req;

  return next(authed).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || req.url.includes('/auth/')) return throwError(() => err);

      if (refreshing) {
        return from(new Promise<string>((resolve) => queue.push(resolve))).pipe(
          switchMap((newToken) => next(addToken(req, newToken)))
        );
      }

      refreshing = true;
      return from(auth.refresh()).pipe(
        switchMap((newToken) => {
          queue.forEach((cb) => cb(newToken));
          queue = [];
          refreshing = false;
          return next(addToken(req, newToken));
        }),
        catchError((refreshErr) => {
          queue = [];
          refreshing = false;
          auth.logout();
          return throwError(() => refreshErr);
        })
      );
    })
  );
};
