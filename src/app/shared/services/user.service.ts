import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, Client, Trainer, Auditor, User, CreateClientRequest, UpdateClientRequest, CreateTrainerRequest, UpdateTrainerRequest, CreateAuditorRequest, UpdateAuditorRequest, ClientsListResponse, ClientResponse, TrainersListResponse, TrainerResponse, AuditorsListResponse, AuditorResponse } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private api = inject(ApiService);

    // Generic User endpoints
    getClients(): Observable<ClientsListResponse> {
        return this.api.get<ClientsListResponse>('/api/clients');
    }

    getTrainers(): Observable<TrainersListResponse> {
        return this.api.get<TrainersListResponse>('/api/trainers');
    }

    // CLIENT endpoints
    getAllClients(): Observable<ClientsListResponse> {
        return this.api.get<ClientsListResponse>('/api/clients');
    }

    getClientProfile(): Observable<ApiResponse<Client>> {
        return this.api.get<ApiResponse<Client>>('/api/clients/me');
    }

    createClient(data: CreateClientRequest): Observable<ClientResponse> {
        return this.api.post<ClientResponse>('/api/clients', data);
    }

    updateClient(id: number, data: UpdateClientRequest): Observable<ClientResponse> {
        return this.api.put<ClientResponse>(`/api/clients/${id}`, data);
    }

    updateClientProfile(email: string, phoneNumber: string): Observable<ApiResponse<Client>> {
        return this.api.put<ApiResponse<Client>>(`/api/clients/me?email=${encodeURIComponent(email)}&phoneNumber=${encodeURIComponent(phoneNumber)}`);
    }

    activateClient(id: number): Observable<ApiResponse<any>> {
        return this.api.put<ApiResponse<any>>(`/api/clients/${id}/activate`);
    }

    deactivateClient(id: number): Observable<ApiResponse<any>> {
        return this.api.put<ApiResponse<any>>(`/api/clients/${id}/deactivate`);
    }

    // TRAINER endpoints
    getAllTrainers(): Observable<TrainersListResponse> {
        return this.api.get<TrainersListResponse>('/api/trainers');
    }

    getMyClients(): Observable<ApiResponse<Client[]>> {
        return this.api.get<ApiResponse<Client[]>>('/api/trainers/me/clients');
    }

    createTrainer(data: CreateTrainerRequest): Observable<TrainerResponse> {
        return this.api.post<TrainerResponse>('/api/trainers', data);
    }

    updateTrainer(id: number, data: UpdateTrainerRequest): Observable<TrainerResponse> {
        return this.api.put<TrainerResponse>(`/api/trainers/${id}`, data);
    }

    activateTrainer(id: number): Observable<ApiResponse<any>> {
        return this.api.put<ApiResponse<any>>(`/api/trainers/${id}/activate`);
    }

    deactivateTrainer(id: number): Observable<ApiResponse<any>> {
        return this.api.put<ApiResponse<any>>(`/api/trainers/${id}/deactivate`);
    }

    // AUDITOR endpoints
    getAllAuditors(): Observable<AuditorsListResponse> {
        return this.api.get<AuditorsListResponse>('/api/auditors');
    }

    createAuditor(data: CreateAuditorRequest): Observable<AuditorResponse> {
        return this.api.post<AuditorResponse>('/api/auditors', data);
    }

    updateAuditor(id: number, data: UpdateAuditorRequest): Observable<AuditorResponse> {
        return this.api.put<AuditorResponse>(`/api/auditors/${id}`, data);
    }
}
