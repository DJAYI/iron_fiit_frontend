import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}${endpoint}`, {
            withCredentials: true
        });
    }

    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, {
            withCredentials: true
        });
    }

    put<T>(endpoint: string, body?: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}${endpoint}`, body, {
            withCredentials: true
        });
    }

    patch<T>(endpoint: string, body?: any): Observable<T> {
        return this.http.patch<T>(`${this.apiUrl}${endpoint}`, body, {
            withCredentials: true
        });
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}${endpoint}`, {
            withCredentials: true
        });
    }
}
