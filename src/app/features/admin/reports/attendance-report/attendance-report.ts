import { Component, OnInit, inject, signal } from '@angular/core';
import { ReportService } from '../../../../shared/services/report.service';
import { UserService } from '../../../../shared/services/user.service';
import { Attendance, AttendanceStatus, Client } from '../../../../shared/interfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-attendance-report',
    template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Reporte de Asistencia</h1>

      <form [formGroup]="filterForm" class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input formControlName="startDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input formControlName="endDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select formControlName="clientId" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option [value]="null">Todos</option>
              @for (client of clients(); track client.id) {
                <option [value]="client.id">{{ client.firstName }} {{ client.lastName }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select formControlName="status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option [value]="null">Todos</option>
              <option value="ATTENDED">Asistió</option>
              <option value="NOT_ATTENDED">No Asistió</option>
              <option value="ATTENDED_NO_ROUTINE">Asistió sin Rutina</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button (click)="loadReport()" type="button" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Generar Reporte
          </button>
        </div>
      </form>

      @if (loading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      } @else if (attendances().length > 0) {
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (attendance of attendances(); track attendance.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ attendance.clientName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ attendance.date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ attendance.time }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(attendance.status)">
                      {{ getStatusLabel(attendance.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ attendance.completed ? 'Sí' : 'No' }}
                  </td>
                  <td class="px-6 py-4 text-sm">{{ attendance.observations || '-' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <p class="text-gray-500">No se encontraron registros</p>
        </div>
      }
    </div>
  `,
    imports: [ReactiveFormsModule]
})
export class AttendanceReportComponent implements OnInit {
    private reportService = inject(ReportService);
    private userService = inject(UserService);

    attendances = signal<Attendance[]>([]);
    clients = signal<Client[]>([]);
    loading = signal(false);

    filterForm = new FormGroup({
        startDate: new FormControl<string | null>(null),
        endDate: new FormControl<string | null>(null),
        clientId: new FormControl<number | null>(null),
        status: new FormControl<AttendanceStatus | null>(null)
    });

    ngOnInit() {
        this.loadClients();
    }

    loadClients() {
        this.userService.getAllClients().subscribe({
            next: (response) => {
                if (response.clients) {
                    this.clients.set(response.clients);
                }
            }
        });
    }

    loadReport() {
        this.loading.set(true);
        const filters = this.filterForm.value;

        this.reportService.getAttendanceReport({
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            clientId: filters.clientId || undefined,
            status: filters.status || undefined
        }).subscribe({
            next: (response) => {
                if (!response.error && response.data) {
                    this.attendances.set(response.data);
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    getStatusClass(status: AttendanceStatus): string {
        const classes = 'px-2 py-1 text-xs font-semibold rounded-full ';
        switch (status) {
            case 'ATTENDED':
                return classes + 'bg-green-100 text-green-800';
            case 'NOT_ATTENDED':
                return classes + 'bg-red-100 text-red-800';
            case 'ATTENDED_NO_ROUTINE':
                return classes + 'bg-yellow-100 text-yellow-800';
            default:
                return classes + 'bg-gray-100 text-gray-800';
        }
    }

    getStatusLabel(status: AttendanceStatus): string {
        switch (status) {
            case 'ATTENDED':
                return 'Asistió';
            case 'NOT_ATTENDED':
                return 'No Asistió';
            case 'ATTENDED_NO_ROUTINE':
                return 'Asistió sin Rutina';
            default:
                return status;
        }
    }
}
