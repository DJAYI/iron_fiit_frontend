import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../../shared/services/report.service';
import { UserService } from '../../../../shared/services/user.service';
import { ComplianceReport, Client } from '../../../../shared/interfaces';

@Component({
  selector: 'app-compliance-report',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Reporte de Cumplimiento de Rutinas</h1>
      </div>

      <!-- Selector de Cliente -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="max-w-md">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Cliente
          </label>
          <select 
            [(ngModel)]="selectedClientId"
            (ngModelChange)="onClientChange()"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option [value]="null">Seleccione un cliente...</option>
            @for (client of clients(); track client.id) {
              <option [value]="client.id">{{ client.firstName }} {{ client.lastName }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Mensaje de Error -->
      @if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800">{{ error() }}</p>
        </div>
      }

      <!-- Loading -->
      @if (loading()) {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-500">Cargando reporte...</p>
        </div>
      }

      <!-- Reporte de Cumplimiento -->
      @if (report() && !loading()) {
        <div class="space-y-6">
          <!-- Header del Cliente -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">{{ report()!.clientName }}</h2>
            @if (report()!.hasActivePlan) {
              <p class="text-sm text-gray-600">
                Plan Activo: <span class="font-medium">{{ report()!.activePlanName }}</span>
              </p>
            } @else {
              <p class="text-sm text-yellow-600">
                Sin plan activo asignado
              </p>
            }
          </div>

          <!-- Métricas Principales -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Total Asistencias -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Asistencias</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ report()!.totalAttendances }}</p>
                </div>
                <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Sesiones Completadas -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Sesiones Completadas</p>
                  <p class="text-3xl font-bold text-green-600 mt-2">{{ report()!.completedSessions }}</p>
                  <p class="text-xs text-gray-500 mt-1">de {{ report()!.programmedSessions }} programadas</p>
                </div>
                <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Sesiones Programadas -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Sesiones Programadas</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ report()!.programmedSessions }}</p>
                  @if (report()!.programmedSessions === 0 && report()!.hasActivePlan) {
                    <p class="text-xs text-yellow-600 mt-1">⚠️ Plan sin rutinas/ejercicios</p>
                  }
                </div>
                <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Porcentaje de Cumplimiento -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">% Cumplimiento</p>
                  @if (report()!.programmedSessions === 0) {
                    <p class="text-3xl font-bold text-gray-500 mt-2">N/A</p>
                    <p class="text-xs text-gray-500 mt-1">Sin sesiones programadas</p>
                  } @else {
                    <p class="text-3xl font-bold mt-2" [class]="getCompletionColorClass(report()!.completionPercentage)">
                      {{ report()!.completionPercentage.toFixed(1) }}%
                    </p>
                  }
                </div>
                <div class="h-12 w-12 rounded-lg flex items-center justify-center" [class]="report()!.programmedSessions === 0 ? 'bg-gray-100' : getCompletionBgClass(report()!.completionPercentage)">
                  <svg class="h-6 w-6" [class]="report()!.programmedSessions === 0 ? 'text-gray-400' : getCompletionIconColorClass(report()!.completionPercentage)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Barra de Progreso Visual -->
          @if (report()!.programmedSessions > 0) {
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Progreso de Cumplimiento</h3>
              <div class="relative">
                <div class="overflow-hidden h-8 text-xs flex rounded bg-gray-200">
                  <div 
                    [style.width.%]="report()!.completionPercentage"
                    [class]="'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ' + getProgressBarClass(report()!.completionPercentage)">
                    <span class="font-semibold">{{ report()!.completionPercentage.toFixed(1) }}%</span>
                  </div>
                </div>
                <div class="flex justify-between mt-2 text-sm text-gray-600">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          } @else {
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div class="flex items-start">
                <svg class="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <div>
                  <h4 class="text-lg font-semibold text-yellow-800 mb-2">Plan Sin Configurar</h4>
                  <p class="text-yellow-700 mb-3">
                    El plan "{{ report()!.activePlanName }}" no tiene sesiones programadas. Esto significa que:
                  </p>
                  <ul class="list-disc list-inside text-yellow-700 space-y-1 ml-4">
                    <li>El plan no tiene rutinas asignadas, o</li>
                    <li>Las rutinas no tienen ejercicios configurados</li>
                  </ul>
                  <p class="text-yellow-700 mt-3 font-medium">
                    📝 Acción requerida: Agrega rutinas con ejercicios al plan en la sección de "Gestión de Rutinas"
                  </p>
                </div>
              </div>
            </div>
          }

          <!-- Análisis de Cumplimiento -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Análisis de Cumplimiento</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="shrink-0">
                  <svg class="h-6 w-6" [class]="report()!.completionPercentage >= 80 ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Nivel de Cumplimiento</p>
                  <p class="text-sm text-gray-600">{{ getComplianceLevel(report()!.completionPercentage) }}</p>
                </div>
              </div>

              @if (report()!.programmedSessions > 0) {
                <div class="flex items-start">
                  <div class="shrink-0">
                    <svg class="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Sesiones Pendientes</p>
                    <p class="text-sm text-gray-600">{{ report()!.programmedSessions - report()!.completedSessions }} sesiones por completar</p>
                  </div>
                </div>
              }

              @if (!report()!.hasActivePlan) {
                <div class="flex items-start">
                  <div class="shrink-0">
                    <svg class="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Sin Plan Activo</p>
                    <p class="text-sm text-gray-600">El cliente no tiene un plan de entrenamiento asignado actualmente</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Estado Vacío -->
      @if (!report() && !loading() && !error()) {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Seleccione un Cliente</h3>
          <p class="mt-1 text-sm text-gray-500">Elija un cliente para ver su reporte de cumplimiento de rutinas.</p>
        </div>
      }
    </div>
  `
})
export class ComplianceReportComponent implements OnInit {
  private reportService = inject(ReportService);
  private userService = inject(UserService);

  clients = signal<Client[]>([]);
  selectedClientId: number | null = null;
  report = signal<ComplianceReport | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.userService.getClients().subscribe({
      next: (response) => {
        this.clients.set(response.clients);
      },
      error: (err) => {
        this.error.set('Error al cargar clientes');
        console.error('Error loading clients:', err);
      }
    });
  }

  onClientChange(): void {
    if (this.selectedClientId) {
      this.loadComplianceReport(this.selectedClientId);
    } else {
      this.report.set(null);
    }
  }

  loadComplianceReport(clientId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.reportService.getClientComplianceReport(clientId).subscribe({
      next: (response) => {
        console.log('Compliance Report API Response:', response);
        console.log('Report Data:', response.data);
        this.report.set(response.data ?? null);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar el reporte de cumplimiento');
        this.loading.set(false);
        console.error('Error loading compliance report:', err);
      }
    });
  }

  getCompletionColorClass(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  getCompletionBgClass(percentage: number): string {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-blue-100';
    if (percentage >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  }

  getCompletionIconColorClass(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  getProgressBarClass(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getComplianceLevel(percentage: number): string {
    if (percentage >= 80) return 'Excelente - El cliente mantiene un cumplimiento destacado';
    if (percentage >= 60) return 'Bueno - El cliente tiene un cumplimiento aceptable';
    if (percentage >= 40) return 'Regular - Se recomienda motivar al cliente';
    return 'Bajo - Requiere seguimiento y motivación urgente';
  }
}
