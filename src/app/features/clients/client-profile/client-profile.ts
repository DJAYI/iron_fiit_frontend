import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { Client } from '../../../shared/interfaces';

@Component({
    selector: 'app-client-profile',
    template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Mi Perfil</h1>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else if (profile()) {
        <div class="bg-white rounded-lg shadow p-6 space-y-4">
          <div class="pb-4 border-b">
            <h2 class="text-xl font-semibold text-gray-900">Información Personal</h2>
            <p class="text-sm text-gray-500 mt-1">Algunos campos no pueden ser editados</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-700">Nombre</p>
              <p class="text-gray-900">{{ profile()!.firstName }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">Apellido</p>
              <p class="text-gray-900">{{ profile()!.lastName }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-700">Tipo de Documento</p>
              <p class="text-gray-900">{{ profile()!.documentType }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">Número de Documento</p>
              <p class="text-gray-900">{{ profile()!.documentNumber }}</p>
            </div>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Usuario</p>
            <p class="text-gray-900">{{ profile()!.username }}</p>
          </div>

          <div class="pt-4 border-t">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Actualizar Información de Contacto</h3>
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input formControlName="email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input formControlName="phoneNumber" type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              @if (successMessage()) {
                <div class="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p class="text-green-600 text-sm">{{ successMessage() }}</p>
                </div>
              }

              @if (errorMessage()) {
                <div class="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p class="text-red-600 text-sm">{{ errorMessage() }}</p>
                </div>
              }

              <button type="submit" [disabled]="profileForm.invalid || saving()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                {{ saving() ? 'Guardando...' : 'Actualizar' }}
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  `,
    imports: [ReactiveFormsModule]
})
export class ClientProfileComponent implements OnInit {
    private userService = inject(UserService);

    profile = signal<Client | null>(null);
    loading = signal(true);
    saving = signal(false);
    successMessage = signal('');
    errorMessage = signal('');

    profileForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        phoneNumber: new FormControl('', [Validators.required])
    });

    ngOnInit() {
        this.loadProfile();
    }

    loadProfile() {
        this.userService.getClientProfile().subscribe({
            next: (response) => {
                if (!response.error && response.data) {
                    this.profile.set(response.data);
                    this.profileForm.patchValue({
                        email: response.data.email,
                        phoneNumber: response.data.phoneNumber
                    });
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    onSubmit() {
        if (this.profileForm.invalid) return;

        this.saving.set(true);
        this.successMessage.set('');
        this.errorMessage.set('');

        const email = this.profileForm.value.email!;
        const phoneNumber = this.profileForm.value.phoneNumber!;

        this.userService.updateClientProfile(email, phoneNumber).subscribe({
            next: (response) => {
                if (response.error) {
                    this.errorMessage.set(response.message);
                } else {
                    this.successMessage.set('Perfil actualizado exitosamente');
                    this.loadProfile();
                }
                this.saving.set(false);
            },
            error: () => {
                this.errorMessage.set('Error al actualizar el perfil');
                this.saving.set(false);
            }
        });
    }
}
