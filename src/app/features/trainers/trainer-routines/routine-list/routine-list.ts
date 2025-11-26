import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../../../../shared/services/training.service';
import { Routine } from '../../../../shared/interfaces';

@Component({
  selector: 'app-routine-list',
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Mis Rutinas</h1>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else if (routines().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (routine of routines(); track routine.id) {
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900">{{ routine.name }}</h3>
              <p class="text-gray-600 mt-2">{{ routine.description }}</p>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-500">
                  <span class="font-medium">Plan:</span> {{ routine.trainmentPlanName }}
                </p>
              </div>
              <div class="mt-4 flex space-x-2">
                <button
                  (click)="manageExercises(routine.id)"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Gestionar Ejercicios</span>
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <p class="text-gray-500">No tienes rutinas creadas</p>
        </div>
      }
    </div>
  `
})
export class RoutineListComponent implements OnInit {
  private trainingService = inject(TrainingService);
  private router = inject(Router);

  routines = signal<Routine[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadRoutines();
  }

  loadRoutines() {
    this.trainingService.getTrainerRoutines().subscribe({
      next: (response) => {
        if (response.data) {
          this.routines.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  manageExercises(routineId: number) {
    this.router.navigate(['/trainer/routines', routineId, 'exercises']);
  }
}
