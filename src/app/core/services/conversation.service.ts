import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private http = inject(HttpClient);

  create(body: { participantId: string }): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${environment.apiUrl}/conversations`, body);
  }
}
