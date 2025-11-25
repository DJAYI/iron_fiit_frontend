import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-training-plan-list',
    template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Planes de Entrenamiento</h1>
        <a [routerLink]="['/admin/routines/training-plans/new']" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 inline-block">
          + Nuevo Plan
        </a>
      </div>

      <div class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Gestión de Planes de Entrenamiento</h3>
        <p class="mt-1 text-sm text-gray-500">Crea y administra planes personalizados para tus clientes.</p>
      </div>
    </div>
  `,
    imports: [RouterLink]
})
export class TrainingPlanListComponent { }
