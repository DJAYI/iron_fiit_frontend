import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-routine-list',
    template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Rutinas</h1>
        <a [routerLink]="['/admin/routines/routines/new']" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 inline-block">
          + Nueva Rutina
        </a>
      </div>

      <div class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Gestión de Rutinas</h3>
        <p class="mt-1 text-sm text-gray-500">Define rutinas de ejercicios para los planes de entrenamiento.</p>
      </div>
    </div>
  `,
    imports: [RouterLink]
})
export class RoutineListComponent { }
