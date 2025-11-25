import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionHandlerService } from '../../features/auth/services/session-handler.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const sessionHandler = inject(SessionHandlerService);

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401) {
                sessionHandler.clearSession();
                router.navigate(['/login']);
            }

            return throwError(() => error);
        })
    );
};
