import { Component, OnInit, inject, signal } from '@angular/core';
import { ReportService } from '../../../shared/services/report.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { DashboardStats } from '../../../shared/interfaces';

@Component({
    selector: 'app-admin-dashboard',
    template: `
    <div class="space-y-6">
      <!-- Hero Section -->
      <div class="bg-white rounded-2xl shadow-lg p-8 bg-linear-to-r from-orange-50 to-red-50">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
            <p class="text-gray-600">Vista general del sistema Iron Fit</p>
          </div>
          <img src="assets/images/LOGO IRONFIT SIN LET.png" alt="Iron Fit" class="w-24 h-24 opacity-80">
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
        </div>
      } @else if (stats()) {
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Clients Card -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Total Clientes</p>
                <p class="text-4xl font-bold text-gray-900">{{ stats()!.totalClients }}</p>
                <p class="text-xs text-blue-600 mt-2 font-medium">Usuarios activos</p>
              </div>
              <div class="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Trainers Card -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Total Entrenadores</p>
                <p class="text-4xl font-bold text-gray-900">{{ stats()!.totalTrainers }}</p>
                <p class="text-xs text-green-600 mt-2 font-medium">Personal activo</p>
              </div>
              <div class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Active Plans Card -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Planes Activos</p>
                <p class="text-4xl font-bold text-gray-900">{{ stats()!.activePlans }}</p>
                <p class="text-xs text-purple-600 mt-2 font-medium">En progreso</p>
              </div>
              <div class="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Weekly Attendance Card -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-orange-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Asistencias Semanal</p>
                <p class="text-4xl font-bold text-gray-900">{{ stats()!.weeklyAttendance }}</p>
                <p class="text-xs text-orange-600 mt-2 font-medium">Últimos 7 días</p>
              </div>
              <div class="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                <svg class="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Last Update Info -->
        <div class="bg-white rounded-xl shadow-md p-4 border-t-4 border-gray-300">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Última actualización: {{ formatDate(stats()!.calculatedAt) }}</span>
            </div>
            <button 
              (click)="loadStats()"
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2 text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Actualizar
            </button>
          </div>
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-md p-8 text-center">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-600">No se pudieron cargar las estadísticas</p>
        </div>
      }
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
    private reportService = inject(ReportService);
    private notificationService = inject(NotificationService);

    stats = signal<DashboardStats | null>(null);
    loading = signal(true);

    ngOnInit() {
        this.loadStats();
    }

    loadStats() {
        this.loading.set(true);
        this.reportService.getDashboardStats().subscribe({
            next: (response) => {
                if (!response.error && response.data) {
                    this.stats.set(response.data);
                } else {
                    this.notificationService.error('Error al cargar estadísticas');
                }
                this.loading.set(false);
            },
            error: () => {
                this.notificationService.error('Error al cargar estadísticas');
                this.loading.set(false);
            }
        });
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleString('es-ES');
    }
}
