import { Component, OnInit, inject, signal } from '@angular/core';
import { TrainingService } from '../../../../shared/services/training.service';
import { TrainingPlan } from '../../../../shared/interfaces';

@Component({
    selector: 'app-client-plan-view',
    template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Mi Plan de Entrenamiento</h1>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else if (plan()) {
        <div class="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ plan()!.name }}</h2>
            <p class="text-gray-600 mt-2">{{ plan()!.description }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p class="text-sm font-medium text-gray-700">Entrenador</p>
              <p class="text-gray-900">{{ plan()!.trainerName }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">Objetivo</p>
              <p class="text-gray-900">{{ plan()!.objectiveName }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">Fecha de Inicio</p>
              <p class="text-gray-900">{{ plan()!.startDate }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">Fecha de Finalización</p>
              <p class="text-gray-900">{{ plan()!.endDate }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">Estado</p>
              <span class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {{ plan()!.stateName }}
              </span>
            </div>
          </div>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="mt-4 text-gray-500">No tienes un plan de entrenamiento activo</p>
          <p class="text-sm text-gray-400 mt-2">Contacta a tu entrenador para crear uno</p>
        </div>
      }
    </div>
  `
})
export class ClientPlanViewComponent implements OnInit {
    private trainingService = inject(TrainingService);

    plan = signal<TrainingPlan | null>(null);
    loading = signal(true);

    ngOnInit() {
        this.loadPlan();
    }

    loadPlan() {
        this.trainingService.getMyActiveTrainingPlan().subscribe({
            next: (response) => {
                if (!response.error && response.data) {
                    this.plan.set(response.data);
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }
}
