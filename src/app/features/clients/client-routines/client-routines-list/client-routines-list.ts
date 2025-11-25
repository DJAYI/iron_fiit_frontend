import { Component, OnInit, inject, signal } from '@angular/core';
import { TrainingService } from '../../../../shared/services/training.service';
import { Routine } from '../../../../shared/interfaces';

@Component({
    selector: 'app-client-routines-list',
    template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Mis Rutinas</h1>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else if (routines().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (routine of routines(); track routine.id) {
            <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ routine.name }}</h3>
                  <p class="text-gray-600 text-sm mt-2">{{ routine.description }}</p>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="text-xs text-gray-500">
                  <span class="font-medium">Plan:</span> {{ routine.trainmentPlanName }}
                </p>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="mt-4 text-gray-500">No tienes rutinas asignadas</p>
          <p class="text-sm text-gray-400 mt-2">Tu entrenador creará rutinas para ti</p>
        </div>
      }
    </div>
  `
})
export class ClientRoutinesListComponent implements OnInit {
    private trainingService = inject(TrainingService);

    routines = signal<Routine[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadRoutines();
    }

    loadRoutines() {
        this.trainingService.getMyRoutines().subscribe({
            next: (response) => {
                if (!response.error && response.data) {
                    this.routines.set(response.data);
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }
}
