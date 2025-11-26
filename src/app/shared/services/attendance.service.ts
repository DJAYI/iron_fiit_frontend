import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, Attendance, AttendanceListResponse, AttendanceResponse, RegisterAttendanceRequest, MarkCompletedRequest, ClientCompliance } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    private api = inject(ApiService);

    // Client marks their attendance
    registerAttendance(request: RegisterAttendanceRequest): Observable<AttendanceResponse> {
        return this.api.post<AttendanceResponse>('/api/attendances', request);
    }

    // Client gets their own attendance records
    getMyAttendances(): Observable<AttendanceListResponse> {
        return this.api.get<AttendanceListResponse>('/api/attendances');
    }

    // Trainer gets all attendances
    getAllAttendances(): Observable<AttendanceListResponse> {
        return this.api.get<AttendanceListResponse>('/api/attendances/all');
    }

    // Trainer marks attendance as completed
    markCompleted(request: MarkCompletedRequest): Observable<AttendanceResponse> {
        return this.api.patch<AttendanceResponse>('/api/attendances/mark-completed', request);
    }

    getClientCompliance(clientId: number): Observable<ApiResponse<ClientCompliance>> {
        return this.api.get<ApiResponse<ClientCompliance>>(`/api/trainers/me/clients/${clientId}/compliance`);
    }
}
