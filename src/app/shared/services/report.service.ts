import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, DashboardStats, Attendance, ComplianceReport, ExerciseComplianceReport, AttendanceStatus } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private api = inject(ApiService);

    getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
        return this.api.get<ApiResponse<DashboardStats>>('/api/dashboard/stats');
    }

    getAttendanceReport(params?: {
        startDate?: string;
        endDate?: string;
        clientId?: number;
        trainerId?: number;
        status?: AttendanceStatus;
    }): Observable<ApiResponse<Attendance[]>> {
        const queryParams = new URLSearchParams();
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        if (params?.clientId) queryParams.append('clientId', params.clientId.toString());
        if (params?.trainerId) queryParams.append('trainerId', params.trainerId.toString());
        if (params?.status) queryParams.append('status', params.status);

        const query = queryParams.toString();
        return this.api.get<ApiResponse<Attendance[]>>(`/api/reports/attendance${query ? '?' + query : ''}`);
    }

    getClientComplianceReport(clientId: number): Observable<ApiResponse<ComplianceReport>> {
        return this.api.get<ApiResponse<ComplianceReport>>(`/api/reports/compliance/client/${clientId}`);
    }

    getExerciseComplianceReport(planId: number): Observable<ApiResponse<ExerciseComplianceReport>> {
        return this.api.get<ApiResponse<ExerciseComplianceReport>>(`/api/reports/compliance/exercises?planId=${planId}`);
    }
}
