import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../shared/services/user.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CreateClientRequest, UpdateClientRequest, DocumentType, Client } from '../../../../shared/interfaces';

@Component({
  selector: 'app-client-form',
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">{{ isEditMode() ? 'Editar Cliente' : 'Nuevo Cliente' }}</h1>
        <a [routerLink]="['/admin/users/clients']" class="text-gray-600 hover:text-gray-900 cursor-pointer">
          ← Volver
        </a>
      </div>

      @if (loading() && isEditMode()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
        </div>
      } @else {
        <form [formGroup]="clientForm" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input formControlName="firstName" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input formControlName="lastName" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>
          </div>

          @if (!isEditMode()) {
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                <select formControlName="documentType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                <input formControlName="documentNumber" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
              </div>
            </div>
          }

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input formControlName="email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input formControlName="phoneNumber" type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
          </div>

          @if (!isEditMode()) {
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input formControlName="username" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input formControlName="password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>
          }

          <div class="flex justify-end space-x-3 pt-4">
            <a [routerLink]="['/admin/users/clients']" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 inline-block cursor-pointer">
              Cancelar
            </a>
            <button type="submit" [disabled]="clientForm.invalid || submitting()" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">
              {{ submitting() ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
  imports: [ReactiveFormsModule, RouterLink]
})
export class ClientFormComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  loading = signal(false);
  submitting = signal(false);
  isEditMode = signal(false);
  clientId = signal<number | null>(null);
  originalClient = signal<Client | null>(null);

  clientForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    documentType: new FormControl<DocumentType>('CC'),
    documentNumber: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required]),
    username: new FormControl(''),
    password: new FormControl('')
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.clientId.set(Number(id));
      this.loadClient(Number(id));
    } else {
      // In create mode, add validators for required fields
      this.clientForm.get('documentType')?.setValidators([Validators.required]);
      this.clientForm.get('documentNumber')?.setValidators([Validators.required]);
      this.clientForm.get('username')?.setValidators([Validators.required]);
      this.clientForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.clientForm.updateValueAndValidity();
    }
  }

  loadClient(id: number) {
    this.loading.set(true);
    // TODO: Create getClientById endpoint
    this.userService.getAllClients().subscribe({
      next: (response) => {
        const client = response.clients.find(c => c.id === id);
        if (client) {
          this.originalClient.set(client);
          this.clientForm.patchValue({
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            phoneNumber: client.phoneNumber
          });
        } else {
          this.notificationService.error('Cliente no encontrado');
          this.router.navigate(['/admin/users/clients']);
        }
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error al cargar el cliente');
        this.loading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.clientForm.invalid) return;

    this.submitting.set(true);

    if (this.isEditMode()) {
      const original = this.originalClient();
      if (!original) {
        this.notificationService.error('Error: Datos originales no disponibles');
        this.submitting.set(false);
        return;
      }

      const updateData: UpdateClientRequest = {
        firstName: this.clientForm.value.firstName!,
        lastName: this.clientForm.value.lastName!,
        documentType: original.documentType || 'CC',
        documentNumber: original.documentNumber || '0',
        email: this.clientForm.value.email!,
        phoneNumber: this.clientForm.value.phoneNumber!,
        username: original.username || 'user',
        password: original.password || 'password123',
        isEnabled: original.isEnabled !== undefined ? original.isEnabled : true,
        isAccountNoExpired: original.isAccountNoExpired !== undefined ? original.isAccountNoExpired : true,
        isAccountNoLocked: original.isAccountNoLocked !== undefined ? original.isAccountNoLocked : true,
        roles: original.roles && original.roles.length > 0 ? original.roles : ['ROLE_CLIENT']
      };

      this.userService.updateClient(this.clientId()!, updateData).subscribe({
        next: (response) => {
          this.notificationService.success('Cliente actualizado exitosamente');
          this.router.navigate(['/admin/users/clients']);
          this.submitting.set(false);
        },
        error: () => {
          this.notificationService.error('Error al actualizar el cliente');
          this.submitting.set(false);
        }
      });
    } else {
      const data = this.clientForm.value as CreateClientRequest;

      this.userService.createClient(data).subscribe({
        next: (response) => {
          this.notificationService.success('Cliente creado exitosamente');
          this.router.navigate(['/admin/users/clients']);
          this.submitting.set(false);
        },
        error: () => {
          this.notificationService.error('Error al crear el cliente');
          this.submitting.set(false);
        }
      });
    }
  }
}
