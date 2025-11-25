import { Component, output, inject, computed } from "@angular/core";
import { Router } from "@angular/router";
import { SessionHandlerService } from "../../features/auth/services/session-handler.service";
import { LogoutUserService } from "../../features/auth/services/logout-user.service";
import { NotificationService } from "../../shared/services/notification.service";

@Component({
    selector: 'app-dashboard-header',
    template: `
    <header class="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
        <div class="flex items-center gap-4">
            <button 
                (click)="toggleSidebar()" 
                class="text-gray-600 hover:text-gray-900 border border-gray-300 p-2 rounded-lg transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>

            <div>
                <h1 class="text-2xl font-bold text-gray-800">{{ pageTitle() }}</h1>
                <p class="text-sm text-gray-500">{{ subtitle() }}</p>
            </div>
        </div>

        <div class="flex items-center gap-4">
            <div class="text-right">
                <p class="text-sm font-medium text-gray-800">{{ username() }}</p>
                <p class="text-xs text-gray-500">{{ roleLabel() }}</p>
            </div>
            <button 
                (click)="logout()" 
                class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </header>`
})

export class DashboardHeaderComponent {
    private sessionHandler = inject(SessionHandlerService);
    private logoutService = inject(LogoutUserService);
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    handleSidebar = output<void>();

    username = computed(() => this.sessionHandler.username() || 'Usuario');

    roleLabel = computed(() => {
        const role = this.sessionHandler.role();
        if (role === 'AUDITOR') return 'Administrador';
        if (role === 'TRAINER') return 'Entrenador';
        if (role === 'CLIENT') return 'Cliente';
        return '';
    });

    pageTitle = computed(() => {
        const role = this.sessionHandler.role();
        if (role === 'AUDITOR') return 'Panel de Administración';
        if (role === 'TRAINER') return 'Panel del Entrenador';
        if (role === 'CLIENT') return 'Mi Panel';
        return 'Dashboard';
    });

    subtitle = computed(() => {
        const role = this.sessionHandler.role();
        if (role === 'AUDITOR') return 'Gestiona usuarios y reportes del sistema';
        if (role === 'TRAINER') return 'Administra tus clientes y planes de entrenamiento';
        if (role === 'CLIENT') return 'Visualiza tu progreso y rutinas';
        return '';
    });

    toggleSidebar() {
        this.handleSidebar.emit();
    }

    logout() {
        this.logoutService.logoutUser().subscribe({
            next: () => {
                this.sessionHandler.clearSession();
                this.notificationService.success('Sesión cerrada exitosamente');
                this.router.navigate(['/login']);
            },
            error: () => {
                this.sessionHandler.clearSession();
                this.router.navigate(['/login']);
            }
        });
    }
}