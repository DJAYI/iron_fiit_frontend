import { Component, OnInit, inject, signal } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { Client } from '../../../../shared/interfaces';

@Component({
    selector: 'app-trainer-clients-list',
    template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Mis Clientes</h1>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else if (clients().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (client of clients(); track client.id) {
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900">{{ client.firstName }} {{ client.lastName }}</h3>
              <div class="mt-3 space-y-2">
                <p class="text-sm text-gray-600"><span class="font-medium">Email:</span> {{ client.email }}</p>
                <p class="text-sm text-gray-600"><span class="font-medium">Teléfono:</span> {{ client.phoneNumber }}</p>
                <p class="text-sm text-gray-600"><span class="font-medium">Documento:</span> {{ client.documentType }} {{ client.documentNumber }}</p>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <p class="text-gray-500">No tienes clientes asignados</p>
        </div>
      }
    </div>
  `
})
export class TrainerClientsListComponent implements OnInit {
    private userService = inject(UserService);

    clients = signal<Client[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadClients();
    }

    loadClients() {
        this.userService.getMyClients().subscribe({
            next: (response) => {
                if (!response.error && response.data) {
                    this.clients.set(response.data);
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }
}
