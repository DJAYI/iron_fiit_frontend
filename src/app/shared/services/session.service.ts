import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    Session,
    SessionsListResponse,
    SessionResponse,
    CreateSessionRequest,
    UpdateSessionRequest,
} from '../interfaces/session.interface';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;
    private readonly API_URL = `${this.apiUrl}/api/sessions`;

    // Get all sessions for a routine
    getRoutineSessions(routineId: number): Observable<SessionsListResponse> {
        return this.http.get<SessionsListResponse>(`${this.API_URL}/routine/${routineId}`, {
            withCredentials: true
        });
    }

    // Get all sessions for a training plan
    getPlanSessions(planId: number): Observable<SessionsListResponse> {
        return this.http.get<SessionsListResponse>(`${this.API_URL}/plan/${planId}`, {
            withCredentials: true
        });
    }

    // Get a single session
    getSession(id: number): Observable<SessionResponse> {
        return this.http.get<SessionResponse>(`${this.API_URL}/${id}`, {
            withCredentials: true
        });
    }

    // Create a new session
    createSession(request: CreateSessionRequest): Observable<SessionResponse> {
        return this.http.post<SessionResponse>(this.API_URL, request, {
            withCredentials: true
        });
    }

    // Create multiple sessions (one by one)
    createBulkSessions(requests: CreateSessionRequest[]): Observable<SessionsListResponse> {
        // Since /api/sessions/bulk doesn't exist, we create them one by one
        // and return all results as a list
        const requests$ = requests.map(req => this.createSession(req));

        return new Observable(observer => {
            const results: Session[] = [];
            let completed = 0;

            requests$.forEach((req$, index) => {
                req$.subscribe({
                    next: (response) => {
                        results.push(response.data);
                        completed++;

                        if (completed === requests.length) {
                            observer.next({
                                data: results,
                                count: results.length,
                                message: `${results.length} sesiones creadas exitosamente`
                            });
                            observer.complete();
                        }
                    },
                    error: (error) => {
                        observer.error(error);
                    }
                });
            });
        });
    }

    // Update a session
    updateSession(request: UpdateSessionRequest): Observable<SessionResponse> {
        return this.http.put<SessionResponse>(`${this.API_URL}/${request.id}`, request, {
            withCredentials: true
        });
    }

    // Delete a session
    deleteSession(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`, {
            withCredentials: true
        });
    }

    // Mark session as completed
    markSessionCompleted(id: number, completed: boolean): Observable<SessionResponse> {
        return this.http.patch<SessionResponse>(`${this.API_URL}/${id}/complete`, { completed }, {
            withCredentials: true
        });
    }
}
