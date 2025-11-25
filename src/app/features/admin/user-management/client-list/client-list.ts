import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';
import { Client } from '../../../../shared/interfaces';

@Component({
    selector: 'app-client-list',
    template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <button [routerLink]="['create']" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Nuevo Cliente
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else if (clients().length > 0) {
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (client of clients(); track client.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ client.firstName }} {{ client.lastName }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ client.documentType }} {{ client.documentNumber }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ client.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ client.phoneNumber }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ client.username }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <a [routerLink]="['edit', client.id]" class="text-blue-600 hover:text-blue-900 cursor-pointer">Editar</a>
                    <button (click)="toggleStatus(client)" class="text-red-600 hover:text-red-900">
                      Desactivar
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <p class="text-gray-500">No hay clientes registrados</p>
        </div>
      }
    </div>
  `,
    imports: [RouterLink]
})
export class ClientListComponent implements OnInit {
    private userService = inject(UserService);
    private router = inject(Router);

    clients = signal<Client[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadClients();
    }

    loadClients() {
        this.loading.set(true);
        this.userService.getAllClients().subscribe({
            next: (response) => {
                if (response.clients) {
                    this.clients.set(response.clients);
                }
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading clients:', error);
                this.loading.set(false);
            }
        });
    }

    toggleStatus(client: Client) {
        if (confirm(`¿Estás seguro de desactivar a ${client.firstName} ${client.lastName}?`)) {
            this.userService.deactivateClient(client.id!).subscribe({
                next: () => {
                    this.loadClients();
                },
                error: (error) => {
                    console.error('Error deactivating client:', error);
                    alert('Error al desactivar el cliente');
                }
            });
        }
    }
}
