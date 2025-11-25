import { Component } from '@angular/core';

@Component({
    selector: 'app-compliance-report',
    template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Reporte de Cumplimiento de Rutinas</h1>
      </div>

      <div class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Reporte de Cumplimiento</h3>
        <p class="mt-1 text-sm text-gray-500">Visualiza el cumplimiento de rutinas de todos los clientes.</p>
      </div>
    </div>
  `
})
export class ComplianceReportComponent { }
