import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-training-plan-form',
    template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">Formulario de Plan</h1>
        <a [routerLink]="['/admin/routines/training-plans']" class="text-gray-600 hover:text-gray-900">← Volver</a>
      </div>

      <div class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-600">Formulario en desarrollo</p>
      </div>
    </div>
  `,
    imports: [RouterLink]
})
export class TrainingPlanFormComponent { }
