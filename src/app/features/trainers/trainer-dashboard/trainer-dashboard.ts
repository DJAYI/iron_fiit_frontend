import { Component, OnInit, inject, signal } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { TrainingService } from '../../../shared/services/training.service';
import { Client, TrainingPlan } from '../../../shared/interfaces';

@Component({
  selector: 'app-trainer-dashboard',
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Panel del Entrenador</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Mis Clientes</h3>
          <p class="text-4xl font-bold text-blue-600">{{ clients().length }}</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Planes Activos</h3>
          <p class="text-4xl font-bold text-green-600">{{ trainingPlans().length }}</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Rutinas Creadas</h3>
          <p class="text-4xl font-bold text-purple-600">{{ routines().length }}</p>
        </div>
      </div>

      @if (clients().length > 0) {
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Mis Clientes</h2>
          <div class="space-y-3">
            @for (client of clients(); track client.id) {
              <div class="flex items-center justify-between border-b pb-3">
                <div>
                  <p class="font-medium">{{ client.firstName }} {{ client.lastName }}</p>
                  <p class="text-sm text-gray-500">{{ client.email }}</p>
                </div>
                <div class="text-sm text-gray-500">{{ client.phoneNumber }}</div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class TrainerDashboardComponent implements OnInit {
  private userService = inject(UserService);
  private trainingService = inject(TrainingService);

  clients = signal<Client[]>([]);
  trainingPlans = signal<TrainingPlan[]>([]);
  routines = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getMyClients().subscribe({
      next: (response) => {
        if (response.data) {
          this.clients.set(response.data);
        }
      }
    });

    this.trainingService.getMyTrainingPlans().subscribe({
      next: (response) => {
        if (response.data) {
          this.trainingPlans.set(response.data);
        }
      }
    });

    this.trainingService.getTrainerRoutines().subscribe({
      next: (response) => {
        if (response.data) {
          this.routines.set(response.data);
        }
      }
    });
  }
}
