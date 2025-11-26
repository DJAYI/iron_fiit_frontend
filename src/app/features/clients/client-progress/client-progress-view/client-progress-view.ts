import { Component, OnInit, inject, signal } from '@angular/core';
import { EvaluationService } from '../../../../shared/services/evaluation.service';
import { PhysicalEvaluation } from '../../../../shared/interfaces';

@Component({
  selector: 'app-client-progress-view',
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Mi Progreso</h1>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else if (evaluations().length > 0) {
        <div class="space-y-6">
          @for (evaluation of evaluations(); track evaluation.id) {
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Evaluación del {{ evaluation.evaluationDate }}</h3>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-1">Peso</p>
                  <p class="text-2xl font-bold text-blue-600">{{ evaluation.weight }} kg</p>
                </div>

                <div class="text-center p-4 bg-green-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-1">IMC</p>
                  <p class="text-2xl font-bold text-green-600">{{ evaluation.bmi }}</p>
                </div>

                <div class="text-center p-4 bg-yellow-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-1">% Grasa</p>
                  <p class="text-2xl font-bold text-yellow-600">{{ evaluation.bodyFatPercentage }}%</p>
                </div>

                <div class="text-center p-4 bg-purple-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-1">Cintura</p>
                  <p class="text-2xl font-bold text-purple-600">{{ evaluation.waistMeasurement }} cm</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="text-center p-4 bg-pink-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-1">Cadera</p>
                  <p class="text-2xl font-bold text-pink-600">{{ evaluation.hipMeasurement }} cm</p>
                </div>

                <div class="text-center p-4 bg-indigo-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-1">Altura</p>
                  <p class="text-2xl font-bold text-indigo-600">{{ evaluation.heightMeasurement }} cm</p>
                </div>
              </div>

              @if (evaluation.notes) {
                <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm font-medium text-gray-700 mb-2">Notas del Entrenador</p>
                  <p class="text-gray-600">{{ evaluation.notes }}</p>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <p class="mt-4 text-gray-500">No tienes evaluaciones físicas registradas</p>
          <p class="text-sm text-gray-400 mt-2">Tu entrenador registrará tus evaluaciones periódicamente</p>
        </div>
      }
    </div>
  `
})
export class ClientProgressViewComponent implements OnInit {
  private evaluationService = inject(EvaluationService);

  evaluations = signal<PhysicalEvaluation[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadEvaluations();
  }

  loadEvaluations() {
    this.evaluationService.getMyEvaluations().subscribe({
      next: (response) => {
        if (!response.error && response.data) {
          this.evaluations.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
