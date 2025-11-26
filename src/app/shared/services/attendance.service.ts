import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse, Attendance, AttendanceListResponse, AttendanceListApiResponse, AttendanceResponse, RegisterAttendanceRequest, MarkCompletedRequest, ClientCompliance } from '../interfaces';

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
        return this.api.get<AttendanceListApiResponse>('/api/attendances').pipe(
            map(response => this.transformAttendanceListResponse(response))
        );
    }

    // Trainer gets all attendances
    getAllAttendances(): Observable<AttendanceListResponse> {
        return this.api.get<AttendanceListApiResponse>('/api/attendances/all').pipe(
            map(response => this.transformAttendanceListResponse(response))
        );
    }

    // Trainer marks attendance as completed
    markCompleted(request: MarkCompletedRequest): Observable<AttendanceResponse> {
        return this.api.patch<AttendanceResponse>('/api/attendances/mark-completed', request);
    }

    getClientCompliance(clientId: number): Observable<ApiResponse<ClientCompliance>> {
        return this.api.get<ApiResponse<ClientCompliance>>(`/api/trainers/me/clients/${clientId}/compliance`);
    }

    private transformAttendanceListResponse(apiResponse: AttendanceListApiResponse): AttendanceListResponse {
        const attendances: Attendance[] = (apiResponse.attendances || []).map(item => {
            const dateTime = new Date(item.dateTime);
            const date = dateTime.toISOString().split('T')[0]; // "2025-11-26"
            const time = dateTime.toTimeString().split(' ')[0]; // "14:56:34"

            return {
                id: item.id,
                clientId: item.clientId,
                clientName: `Cliente ${item.clientId}`, // Placeholder, backend should provide this
                date: date,
                time: time,
                status: item.status,
                completed: item.completed,
                observations: item.observations
            };
        });

        return {
            data: attendances,
            count: attendances.length,
            message: apiResponse.message
        };
    }
}
