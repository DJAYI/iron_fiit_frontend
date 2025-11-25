import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PhysicalEvaluation, CreatePhysicalEvaluationRequest } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class EvaluationService {
    private api = inject(ApiService);

    getMyEvaluations(): Observable<ApiResponse<PhysicalEvaluation[]>> {
        return this.api.get<ApiResponse<PhysicalEvaluation[]>>('/api/clients/me/evaluations');
    }

    getClientEvaluations(clientId: number): Observable<ApiResponse<PhysicalEvaluation[]>> {
        return this.api.get<ApiResponse<PhysicalEvaluation[]>>(`/api/physical-evaluations/client/${clientId}`);
    }

    createEvaluation(data: CreatePhysicalEvaluationRequest): Observable<ApiResponse<PhysicalEvaluation>> {
        return this.api.post<ApiResponse<PhysicalEvaluation>>('/api/physical-evaluations', data);
    }
}
