import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../shared/services/user.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CreateAuditorRequest, UpdateAuditorRequest, DocumentType } from '../../../../shared/interfaces';

@Component({
    selector: 'app-auditor-form',
    template: `
        <div class="max-w-2xl mx-auto space-y-6">
            <div class="flex items-center justify-between">
                <h1 class="text-3xl font-bold text-gray-900">{{ isEditMode() ? 'Editar Auditor' : 'Nuevo Auditor' }}</h1>
                <a [routerLink]="['/admin/users/auditors']" class="text-gray-600 hover:text-gray-900">← Volver</a>
            </div>

            <form [formGroup]="auditorForm" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <input formControlName="firstName" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        @if (auditorForm.get('firstName')?.invalid && auditorForm.get('firstName')?.touched) {
                            <p class="mt-1 text-sm text-red-600">El nombre es requerido</p>
                        }
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                        <input formControlName="lastName" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        @if (auditorForm.get('lastName')?.invalid && auditorForm.get('lastName')?.touched) {
                            <p class="mt-1 text-sm text-red-600">El apellido es requerido</p>
                        }
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento *</label>
                        <select formControlName="documentType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="">Seleccione...</option>
                            <option value="CC">Cédula de Ciudadanía</option>
                            <option value="CE">Cédula de Extranjería</option>
                            <option value="TI">Tarjeta de Identidad</option>
                            <option value="PAS">Pasaporte</option>
                        </select>
                        @if (auditorForm.get('documentType')?.invalid && auditorForm.get('documentType')?.touched) {
                            <p class="mt-1 text-sm text-red-600">El tipo de documento es requerido</p>
                        }
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Número de Documento *</label>
                        <input formControlName="documentNumber" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        @if (auditorForm.get('documentNumber')?.invalid && auditorForm.get('documentNumber')?.touched) {
                            <p class="mt-1 text-sm text-red-600">El número de documento es requerido</p>
                        }
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input formControlName="email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    @if (auditorForm.get('email')?.invalid && auditorForm.get('email')?.touched) {
                        <p class="mt-1 text-sm text-red-600">Email válido es requerido</p>
                    }
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input formControlName="phoneNumber" type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    @if (auditorForm.get('phoneNumber')?.invalid && auditorForm.get('phoneNumber')?.touched) {
                        <p class="mt-1 text-sm text-red-600">El teléfono es requerido</p>
                    }
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Usuario *</label>
                    <input formControlName="username" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    @if (auditorForm.get('username')?.invalid && auditorForm.get('username')?.touched) {
                        <p class="mt-1 text-sm text-red-600">El usuario es requerido</p>
                    }
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                    <input formControlName="password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    @if (auditorForm.get('password')?.invalid && auditorForm.get('password')?.touched) {
                        <p class="mt-1 text-sm text-red-600">La contraseña es requerida</p>
                    }
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                    <a [routerLink]="['/admin/users/auditors']" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 inline-block">
                        Cancelar
                    </a>
                    <button type="submit" [disabled]="auditorForm.invalid || submitting()" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">
                        {{ submitting() ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </form>
        </div>
    `,
    imports: [ReactiveFormsModule, RouterLink]
})
export class AuditorFormComponent implements OnInit {
    private userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private notificationService = inject(NotificationService);

    submitting = signal(false);
    isEditMode = signal(false);
    auditorId = signal<number | null>(null);

    auditorForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        documentType: new FormControl<DocumentType | ''>('', [Validators.required]),
        documentNumber: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phoneNumber: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    });

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.auditorId.set(Number(id));
            // En modo edición, la contraseña es opcional
            this.auditorForm.get('password')?.clearValidators();
            this.auditorForm.get('password')?.updateValueAndValidity();
        }
    }

    onSubmit() {
        if (this.auditorForm.invalid) return;

        this.submitting.set(true);

        if (this.isEditMode()) {
            const data = this.auditorForm.value as UpdateAuditorRequest;

            this.userService.updateAuditor(this.auditorId()!, data).subscribe({
                next: () => {
                    this.notificationService.success('Auditor actualizado exitosamente');
                    this.router.navigate(['/admin/users/auditors']);
                    this.submitting.set(false);
                },
                error: () => {
                    this.notificationService.error('Error al actualizar el auditor');
                    this.submitting.set(false);
                }
            });
        } else {
            const data = this.auditorForm.value as CreateAuditorRequest;

            this.userService.createAuditor(data).subscribe({
                next: () => {
                    this.notificationService.success('Auditor creado exitosamente');
                    this.router.navigate(['/admin/users/auditors']);
                    this.submitting.set(false);
                },
                error: () => {
                    this.notificationService.error('Error al crear el auditor');
                    this.submitting.set(false);
                }
            });
        }
    }
}
