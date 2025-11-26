import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../../shared/services/report.service';
import { TrainingService } from '../../../../shared/services/training.service';
import { ExerciseComplianceReport, TrainingPlan } from '../../../../shared/interfaces';

@Component({
  selector: 'app-progress-report',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Reporte de Progreso de Ejercicios</h1>
      </div>

      <!-- Selector de Plan de Entrenamiento -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="max-w-md">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Plan de Entrenamiento
          </label>
          <select 
            [(ngModel)]="selectedPlanId"
            (ngModelChange)="onPlanChange()"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option [value]="null">Seleccione un plan...</option>
            @for (plan of plans(); track plan.id) {
              <option [value]="plan.id">{{ plan.name }} - {{ plan.clientName }}</option>
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

      <!-- Reporte de Progreso -->
      @if (report() && !loading()) {
        <div class="space-y-6">
          <!-- Header del Plan -->
          <div class="bg-linear-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <h2 class="text-2xl font-bold mb-2">{{ report()!.planName }}</h2>
            <p class="text-blue-100">Cliente: {{ report()!.clientName }}</p>
            <div class="mt-4 flex items-center space-x-4">
              <div class="flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span class="text-sm">{{ report()!.routineCount }} rutinas</span>
              </div>
            </div>
          </div>

          <!-- Métricas Principales -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Total Ejercicios -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Ejercicios</p>
                  <p class="text-4xl font-bold text-gray-900 mt-2">{{ report()!.totalExercises }}</p>
                  <p class="text-xs text-gray-500 mt-1">en el plan</p>
                </div>
                <div class="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Ejercicios Completados -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Ejercicios Completados</p>
                  <p class="text-4xl font-bold text-green-600 mt-2">{{ report()!.completedExercises }}</p>
                  <p class="text-xs text-gray-500 mt-1">finalizados</p>
                </div>
                <div class="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Porcentaje de Cumplimiento -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4" [class]="'border-' + getCompletionColor(report()!.completionPercentage)">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">% Progreso</p>
                  <p class="text-4xl font-bold mt-2" [class]="'text-' + getCompletionColor(report()!.completionPercentage)">
                    {{ report()!.completionPercentage.toFixed(1) }}%
                  </p>
                  <p class="text-xs text-gray-500 mt-1">completado</p>
                </div>
                <div class="h-14 w-14 rounded-full flex items-center justify-center" [class]="'bg-' + getCompletionColor(report()!.completionPercentage) + '-100'">
                  <svg class="h-8 w-8" [class]="'text-' + getCompletionColor(report()!.completionPercentage)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico de Progreso Circular -->
          <div class="bg-white rounded-lg shadow-md p-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Progreso Visual</h3>
            
            @if (report()!.totalExercises === 0) {
              <!-- No hay ejercicios en el plan -->
              <div class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Sin ejercicios configurados</h3>
                <p class="mt-1 text-sm text-gray-500">Agrega ejercicios a las rutinas del plan para ver el progreso.</p>
                <div class="mt-4">
                  <button class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Ir a Rutinas
                  </button>
                </div>
              </div>
            } @else if (report()!.completedExercises === 0) {
              <!-- Hay ejercicios pero ninguno completado -->
              <div class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Plan recién iniciado</h3>
                <p class="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                  El plan tiene <strong>{{ report()!.totalExercises }}</strong> ejercicio(s) configurado(s).
                </p>
                <p class="mt-2 text-xs text-gray-600">
                  Los ejercicios se marcan como completados automáticamente cuando el trainer marca una asistencia como completada.
                </p>
              </div>
            } @else {
              <!-- Progreso normal -->
              <div class="flex flex-col md:flex-row items-center justify-around">
                <!-- Círculo de Progreso -->
                <div class="relative w-64 h-64">
                  <svg class="transform -rotate-90 w-64 h-64">
                    <circle cx="128" cy="128" r="112" stroke="#e5e7eb" stroke-width="16" fill="none"/>
                    <circle 
                      cx="128" cy="128" r="112" 
                      [attr.stroke]="getProgressStrokeColor(report()!.completionPercentage)"
                      stroke-width="16" 
                      fill="none"
                      stroke-linecap="round"
                      [style.stroke-dasharray]="703.7"
                      [style.stroke-dashoffset]="703.7 - (703.7 * report()!.completionPercentage / 100)"/>
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center flex-col">
                    <span class="text-5xl font-bold" [class]="'text-' + getCompletionColor(report()!.completionPercentage)">
                      {{ report()!.completionPercentage.toFixed(0) }}%
                    </span>
                    <span class="text-gray-600 text-sm mt-2">Completado</span>
                  </div>
                </div>

                <!-- Estadísticas Adicionales -->
                <div class="mt-8 md:mt-0 space-y-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 rounded-full bg-green-500"></div>
                    <span class="text-gray-700">
                      <span class="font-semibold">{{ report()!.completedExercises }}</span> ejercicios completados
                    </span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 rounded-full bg-gray-300"></div>
                    <span class="text-gray-700">
                      <span class="font-semibold">{{ report()!.totalExercises - report()!.completedExercises }}</span> ejercicios pendientes
                    </span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span class="text-gray-700">
                      <span class="font-semibold">{{ report()!.routineCount }}</span> rutinas en el plan
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Barra de Progreso Lineal -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Progreso Lineal</h3>
            
            @if (report()!.totalExercises > 0 && report()!.completedExercises > 0) {
              <div class="relative">
                <div class="overflow-hidden h-10 text-sm flex rounded-full bg-gray-200">
                  <div 
                    [style.width.%]="report()!.completionPercentage"
                    [class]="'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ' + getProgressBarClass(report()!.completionPercentage)">
                    <span class="font-bold">{{ report()!.completionPercentage.toFixed(1) }}%</span>
                  </div>
                </div>
                <div class="flex justify-between mt-3 text-sm text-gray-600">
                  <span>Inicio</span>
                  <span>{{ report()!.completedExercises }} / {{ report()!.totalExercises }}</span>
                  <span>Meta</span>
                </div>
              </div>
            } @else {
              <div class="text-center py-6 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-500">
                  @if (report()!.totalExercises === 0) {
                    No hay ejercicios en el plan para mostrar progreso
                  } @else {
                    Progreso: <strong>0 / {{ report()!.totalExercises }}</strong> ejercicios
                  }
                </p>
              </div>
            }
          </div>

          <!-- Análisis y Recomendaciones -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Análisis del Progreso</h3>
            
            <!-- Nota informativa sobre el sistema -->
            <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <div class="ml-3">
                  <p class="text-sm font-medium text-blue-900">Sistema de Seguimiento Automático</p>
                  <p class="text-sm text-blue-700 mt-1">
                    Los ejercicios se marcan como completados automáticamente cuando el trainer registra una asistencia como completada. 
                    Todos los ejercicios de la rutina asignada a esa sesión se consideran realizados.
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-start">
                <div class="shrink-0">
                  <svg class="h-6 w-6" [class]="'text-' + getCompletionColor(report()!.completionPercentage)" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Nivel de Progreso</p>
                  <p class="text-sm text-gray-600">{{ getProgressLevel(report()!.completionPercentage) }}</p>
                </div>
              </div>

              @if (report()!.completedExercises > 0) {
                <div class="flex items-start">
                  <div class="shrink-0">
                    <svg class="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Ejercicios Restantes</p>
                    <p class="text-sm text-gray-600">{{ report()!.totalExercises - report()!.completedExercises }} ejercicios para completar el plan</p>
                  </div>
                </div>
              }

              @if (report()!.completionPercentage === 100) {
                <div class="flex items-start">
                  <div class="shrink-0">
                    <svg class="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">¡Plan Completado!</p>
                    <p class="text-sm text-gray-600">El cliente ha finalizado todos los ejercicios del plan</p>
                  </div>
                </div>
              } @else if (report()!.completionPercentage < 30) {
                <div class="flex items-start">
                  <div class="shrink-0">
                    <svg class="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Progreso Inicial</p>
                    <p class="text-sm text-gray-600">Se recomienda hacer seguimiento cercano para mantener la motivación</p>
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Seleccione un Plan</h3>
          <p class="mt-1 text-sm text-gray-500">Elija un plan de entrenamiento para ver el progreso de ejercicios.</p>
        </div>
      }
    </div>
  `
})
export class ProgressReportComponent implements OnInit {
  private reportService = inject(ReportService);
  private trainingService = inject(TrainingService);

  plans = signal<TrainingPlan[]>([]);
  selectedPlanId: number | null = null;
  report = signal<ExerciseComplianceReport | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.trainingService.getAllTrainingPlans().subscribe({
      next: (response) => {
        this.plans.set(response.data);
      },
      error: (err: any) => {
        this.error.set('Error al cargar planes de entrenamiento');
        console.error('Error loading plans:', err);
      }
    });
  }

  onPlanChange(): void {
    if (this.selectedPlanId) {
      this.loadProgressReport(this.selectedPlanId);
    } else {
      this.report.set(null);
    }
  }

  loadProgressReport(planId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.reportService.getExerciseComplianceReport(planId).subscribe({
      next: (response) => {
        this.report.set(response.data ?? null);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err.error?.message || 'Error al cargar el reporte de progreso');
        this.loading.set(false);
        console.error('Error loading progress report:', err);
      }
    });
  }

  getCompletionColor(percentage: number): string {
    if (percentage >= 80) return 'green-500';
    if (percentage >= 60) return 'blue-500';
    if (percentage >= 40) return 'yellow-500';
    return 'red-500';
  }

  getProgressBarClass(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getProgressStrokeColor(percentage: number): string {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#3b82f6';
    if (percentage >= 40) return '#eab308';
    return '#ef4444';
  }

  getProgressLevel(percentage: number): string {
    if (percentage >= 80) return 'Excelente - Progreso destacado en el plan de entrenamiento';
    if (percentage >= 60) return 'Bueno - Avance constante en los ejercicios';
    if (percentage >= 40) return 'Regular - Se recomienda incrementar el ritmo';
    return 'Inicial - Requiere motivación y seguimiento';
  }
}
