import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;
  private cache = new Map<string, { data: any; timestamp: number }>();

  get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const key = `${path}?${params ? JSON.stringify(params) : ''}`;
    const cached = this.cache.get(key);
    const now = Date.now();
    if (cached && now - cached.timestamp < 60_000) {
      return Promise.resolve(cached.data as T);
    }

    let httpParams = new HttpParams();
    if (params) Object.entries(params).forEach(([k, v]) => (httpParams = httpParams.set(k, v)));
    return firstValueFrom(this.http.get<T>(`${this.base}${path}`, { params: httpParams })).then(res => {
      this.cache.set(key, { data: res, timestamp: Date.now() });
      return res;
    });
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return firstValueFrom(this.http.post<T>(`${this.base}${path}`, body));
  }
}
