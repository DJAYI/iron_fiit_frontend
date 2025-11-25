import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Auditor } from '../../../../shared/interfaces';

@Component({
    selector: 'app-auditor-list',
    template: `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-900">Gestión de Auditores</h1>
                <a [routerLink]="['/admin/users/auditors/new']" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 inline-block">
                    + Nuevo Auditor
                </a>
            </div>

            @if (loading()) {
                <div class="flex justify-center items-center h-64">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
                </div>
            } @else {
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
                            @for (auditor of auditors(); track auditor.id) {
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">{{ auditor.firstName }} {{ auditor.lastName }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ auditor.documentType }} {{ auditor.documentNumber }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-500">{{ auditor.email }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-500">{{ auditor.phoneNumber }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-500">{{ auditor.username }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a [routerLink]="['/admin/users/auditors/edit', auditor.id]" class="text-orange-600 hover:text-orange-900 mr-4">
                                            Editar
                                        </a>
                                    </td>
                                </tr>
                            } @empty {
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                                        No hay auditores registrados
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    `,
    imports: [RouterLink]
})
export class AuditorListComponent implements OnInit {
    private userService = inject(UserService);
    private notificationService = inject(NotificationService);

    auditors = signal<Auditor[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.loadAuditors();
    }

    loadAuditors() {
        this.loading.set(true);
        this.userService.getAllAuditors().subscribe({
            next: (response) => {
                this.auditors.set(response.auditors);
                this.loading.set(false);
            },
            error: () => {
                this.notificationService.error('Error al cargar los auditores');
                this.loading.set(false);
            }
        });
    }
}
