import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, Attendance, ClientCompliance } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    private api = inject(ApiService);

    getClientCompliance(clientId: number): Observable<ApiResponse<ClientCompliance>> {
        return this.api.get<ApiResponse<ClientCompliance>>(`/api/trainers/me/clients/${clientId}/compliance`);
    }
}
