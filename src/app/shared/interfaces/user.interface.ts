export type UserRole = 'CLIENT' | 'TRAINER' | 'AUDITOR';
export type DocumentType = 'CC' | 'CE' | 'TI' | 'PAS';

export interface AuthUser {
    username: string;
    roles: UserRole[];
}

export interface ClientsListResponse {
    clients: Client[];
    message: string;
}

export interface ClientResponse {
    client: Client;
    message: string;
}

export interface TrainersListResponse {
    trainers: Trainer[];
    message: string;
}

export interface TrainerResponse {
    trainer: Trainer;
    message: string;
}

export interface AuditorsListResponse {
    auditors: Auditor[];
    message: string;
}

export interface AuditorResponse {
    auditor: Auditor;
    message: string;
}

export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    isEnabled: boolean;
    isAccountNoExpired: boolean;
    isAccountNoLocked: boolean;
    roles: string[];
}

export interface Trainer {
    id: number;
    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    email: string;
    phoneNumber: string;
    username: string;
    expertiseIds?: number[];
}

export interface Auditor {
    id: number;
    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    email: string;
    phoneNumber: string;
    username: string;
}

export interface CreateClientRequest {
    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
}

export interface UpdateClientRequest {
    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    isEnabled: boolean;
    isAccountNoExpired: boolean;
    isAccountNoLocked: boolean;
    roles: string[];
}

export interface CreateTrainerRequest {
    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    expertiseIds: number[];
}

export interface UpdateTrainerRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    expertiseIds: number[];
}

export interface CreateAuditorRequest {
    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
}

export interface UpdateAuditorRequest {
    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
}
