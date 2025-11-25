import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, tap, catchError, throwError } from "rxjs";
import { AuthUserCredentials, LoginResponse } from "../interfaces/auth-user-credentials";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class LoginUserService {
    private http = inject(HttpClient);
    private readonly LOGIN_ENDPOINT = `${environment.apiUrl}/api/auth/login`;

    /**
     * Authenticates a user with the provided credentials
     * @param credentials - User credentials (username and password)
     * @returns Observable with login response containing token, role and username
     */
    loginUser(credentials: AuthUserCredentials): Observable<LoginResponse> {
        if (!credentials.username || !credentials.password) {
            return throwError(() => new Error('Credenciales incompletas'));
        }

        return this.http.post<LoginResponse>(this.LOGIN_ENDPOINT, credentials, {
            withCredentials: true
        }).pipe(
            tap(response => {
                if (response.error) {
                    console.error('Login failed:', response.error);
                } else {
                    console.log('Login successful for user:', response.username);
                }
            }),
            catchError(error => {
                console.error('Login request failed:', error);
                return throwError(() => error);
            })
        );
    }
}