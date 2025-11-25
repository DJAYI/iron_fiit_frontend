import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, tap, catchError, throwError } from "rxjs";
import { ApiResponse } from "../../../shared/interfaces";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class LogoutUserService {
    private http = inject(HttpClient);
    private readonly LOGOUT_ENDPOINT = `${environment.apiUrl}/api/auth/logout`;

    /**
     * Logs out the current user and invalidates the session
     * @returns Observable with API response
     */
    logoutUser(): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(this.LOGOUT_ENDPOINT, null, {
            withCredentials: true
        }).pipe(
            tap(response => {
                if (response.error === true) {
                    console.error('Logout failed:', response.message);
                }
            }),
            catchError(error => {
                console.error('Logout request failed:', error);
                // Even if logout fails on server, we should clear client session
                return throwError(() => error);
            })
        );
    }
}