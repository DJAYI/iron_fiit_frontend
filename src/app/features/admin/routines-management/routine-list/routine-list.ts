import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrainingService } from '../../../../shared/services/training.service';
import { Routine } from '../../../../shared/interfaces';

@Component({
  selector: 'app-routine-list',
  template: `
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">Gestión de Rutinas</h1>
                    @if (filterByPlanId()) {
                        <p class="text-sm text-gray-600 mt-1">Filtrando por plan de entrenamiento</p>
                    }
                </div>
                <button 
                    (click)="createRoutine()"
                    class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Crear Rutina
                </button>
            </div>

            @if (loading()) {
                <div class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    <p class="mt-4 text-gray-600">Cargando rutinas...</p>
                </div>
            } @else if (error()) {
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {{ error() }}
                </div>
            } @else {
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    @for (routine of routines(); track routine.id) {
                        <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                            <div class="w-full h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                                <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ routine.name }}</h3>
                            <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ routine.description }}</p>
                            <p class="text-xs text-gray-500 mb-4">Plan: {{ routine.trainmentPlanName }}</p>
                            
                            <div class="flex gap-2">
                                <button 
                                    (click)="editRoutine(routine.id)"
                                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                                    Editar
                                </button>
                            </div>
                        </div>
                    }
                </div>

                @if (routines().length === 0) {
                    <div class="text-center py-12 text-gray-500">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                        </svg>
                        <p>No hay rutinas registradas</p>
                        <button 
                            (click)="createRoutine()"
                            class="mt-4 text-orange-600 hover:text-orange-700 font-medium">
                            Crear la primera
                        </button>
                    </div>
                }
            }
        </div>
    `
})
export class RoutineListComponent implements OnInit {
  private trainingService = inject(TrainingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  routines = signal<Routine[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  filterByPlanId = signal<number | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const planId = params['planId'];
      if (planId) {
        this.filterByPlanId.set(parseInt(planId, 10));
        this.loadRoutinesByPlan(parseInt(planId, 10));
      } else {
        this.loadRoutines();
      }
    });
  }

  loadRoutines() {
    this.loading.set(true);
    this.error.set(null);

    this.trainingService.getAllRoutines().subscribe({
      next: (response) => {
        this.routines.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las rutinas');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  loadRoutinesByPlan(planId: number) {
    this.loading.set(true);
    this.error.set(null);

    this.trainingService.getRoutinesByTrainingPlan(planId).subscribe({
      next: (response) => {
        this.routines.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las rutinas del plan');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  createRoutine() {
    const planId = this.filterByPlanId();
    if (planId) {
      this.router.navigate(['/admin/routines/routines/new'], { queryParams: { planId } });
    } else {
      this.router.navigate(['/admin/routines/routines/new']);
    }
  }

  editRoutine(id: number) {
    this.router.navigate(['/admin/routines/routines/edit', id]);
  }
}
