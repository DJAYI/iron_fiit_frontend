import { Component, OnInit, inject, signal } from '@angular/core';
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
}
