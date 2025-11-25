import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../../../../shared/services/training.service';
import { TrainingPlan } from '../../../../shared/interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-training-plan-list',
  template: `
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Planes de Entrenamiento</h1>
                <button 
                    (click)="createPlan()"
                    class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Crear Plan
                </button>
            </div>

            @if (loading()) {
                <div class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    <p class="mt-4 text-gray-600">Cargando planes...</p>
                </div>
            } @else if (error()) {
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {{ error() }}
                </div>
            } @else {
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrenador</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objetivo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @for (plan of plans(); track plan.id) {
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4">
                                        <div class="text-sm font-medium text-gray-900">{{ plan.name }}</div>
                                        <div class="text-sm text-gray-500">{{ plan.description }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ plan.clientName }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ plan.trainerName }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ plan.objectiveName }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {{ plan.stateName }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ plan.startDate | date:'dd/MM/yyyy' }} - {{ plan.endDate | date:'dd/MM/yyyy' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            (click)="editPlan(plan.id)"
                                            class="text-blue-600 hover:text-blue-900 mr-3">
                                            Editar
                                        </button>
                                        <button 
                                            (click)="viewRoutines(plan.id)"
                                            class="text-green-600 hover:text-green-900">
                                            Rutinas
                                        </button>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>

                    @if (plans().length === 0) {
                        <div class="text-center py-12 text-gray-500">
                            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p>No hay planes de entrenamiento registrados</p>
                            <button 
                                (click)="createPlan()"
                                class="mt-4 text-orange-600 hover:text-orange-700 font-medium">
                                Crear el primero
                            </button>
                        </div>
                    }
                </div>
            }
        </div>
    `,
  imports: [DatePipe]
})
export class TrainingPlanListComponent implements OnInit {
  private trainingService = inject(TrainingService);
  private router = inject(Router);

  plans = signal<TrainingPlan[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading.set(true);
    this.error.set(null);

    this.trainingService.getAllTrainingPlans().subscribe({
      next: (response) => {
        this.plans.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los planes de entrenamiento');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  createPlan() {
    this.router.navigate(['/admin/routines/training-plans/new']);
  }

  editPlan(id: number) {
    this.router.navigate(['/admin/routines/training-plans/edit', id]);
  }

  viewRoutines(planId: number) {
    this.router.navigate(['/admin/routines/routines'], { queryParams: { planId } });
  }
}
