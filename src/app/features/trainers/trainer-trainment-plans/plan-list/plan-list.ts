import { Component, OnInit, inject, signal } from '@angular/core';
import { TrainingService } from '../../../../shared/services/training.service';
import { TrainingPlan } from '../../../../shared/interfaces';

@Component({
    selector: 'app-plan-list',
    template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Mis Planes de Entrenamiento</h1>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else if (plans().length > 0) {
        <div class="space-y-4">
          @for (plan of plans(); track plan.id) {
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-xl font-semibold text-gray-900">{{ plan.name }}</h3>
                  <p class="text-gray-600 mt-1">{{ plan.description }}</p>
                  <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="font-medium text-gray-700">Cliente:</span>
                      <span class="text-gray-600 ml-2">{{ plan.clientName }}</span>
                    </div>
                    <div>
                      <span class="font-medium text-gray-700">Objetivo:</span>
                      <span class="text-gray-600 ml-2">{{ plan.objectiveName }}</span>
                    </div>
                    <div>
                      <span class="font-medium text-gray-700">Fecha Inicio:</span>
                      <span class="text-gray-600 ml-2">{{ plan.startDate }}</span>
                    </div>
                    <div>
                      <span class="font-medium text-gray-700">Fecha Fin:</span>
                      <span class="text-gray-600 ml-2">{{ plan.endDate }}</span>
                    </div>
                  </div>
                </div>
                <span [class]="getStatusClass(plan.stateName)">
                  {{ plan.stateName }}
                </span>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <p class="text-gray-500">No tienes planes de entrenamiento creados</p>
        </div>
      }
    </div>
  `
})
export class PlanListComponent implements OnInit {
    private trainingService = inject(TrainingService);

    plans = signal<TrainingPlan[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadPlans();
    }

    loadPlans() {
        this.trainingService.getMyTrainingPlans().subscribe({
            next: (response) => {
                if (!response.error && response.data) {
                    this.plans.set(response.data);
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    getStatusClass(status: string): string {
        const baseClasses = 'px-3 py-1 rounded-full text-sm font-semibold ';
        return baseClasses + 'bg-blue-100 text-blue-800';
    }
}
