import { Component, OnInit, inject, signal } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { TrainingService } from '../../../shared/services/training.service';
import { EvaluationService } from '../../../shared/services/evaluation.service';
import { Client, TrainingPlan, PhysicalEvaluation } from '../../../shared/interfaces';

@Component({
  selector: 'app-client-dashboard',
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Mi Panel</h1>

      @if (profile()) {
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Bienvenido, {{ profile()!.firstName }}!</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-600">Email</p>
              <p class="text-lg font-medium text-gray-900">{{ profile()!.email }}</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-gray-600">Teléfono</p>
              <p class="text-lg font-medium text-gray-900">{{ profile()!.phoneNumber }}</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg">
              <p class="text-sm text-gray-600">Usuario</p>
              <p class="text-lg font-medium text-gray-900">{{ profile()!.username }}</p>
            </div>
          </div>
        </div>
      }

      @if (activePlan()) {
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Plan de Entrenamiento Activo</h2>
          <div class="space-y-2">
            <p><span class="font-medium">Nombre:</span> {{ activePlan()!.name }}</p>
            <p><span class="font-medium">Descripción:</span> {{ activePlan()!.description }}</p>
            <p><span class="font-medium">Entrenador:</span> {{ activePlan()!.trainerName }}</p>
            <p><span class="font-medium">Objetivo:</span> {{ activePlan()!.objectiveName }}</p>
            <p><span class="font-medium">Período:</span> {{ activePlan()!.startDate }} - {{ activePlan()!.endDate }}</p>
          </div>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-500">No tienes un plan de entrenamiento activo</p>
        </div>
      }

      @if (lastEvaluation()) {
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Última Evaluación Física</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-3 bg-gray-50 rounded">
              <p class="text-sm text-gray-600">Peso</p>
              <p class="text-2xl font-bold text-gray-900">{{ lastEvaluation()!.weight }} kg</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded">
              <p class="text-sm text-gray-600">IMC</p>
              <p class="text-2xl font-bold text-gray-900">{{ lastEvaluation()!.bmi }}</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded">
              <p class="text-sm text-gray-600">% Grasa</p>
              <p class="text-2xl font-bold text-gray-900">{{ lastEvaluation()!.bodyFatPercentage }}%</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded">
              <p class="text-sm text-gray-600">Cintura</p>
              <p class="text-2xl font-bold text-gray-900">{{ lastEvaluation()!.waistMeasurement }} cm</p>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-500">Fecha: {{ lastEvaluation()!.evaluationDate }}</p>
        </div>
      }
    </div>
  `
})
export class ClientDashboardComponent implements OnInit {
  private userService = inject(UserService);
  private trainingService = inject(TrainingService);
  private evaluationService = inject(EvaluationService);

  profile = signal<Client | null>(null);
  activePlan = signal<TrainingPlan | null>(null);
  lastEvaluation = signal<PhysicalEvaluation | null>(null);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getClientProfile().subscribe({
      next: (response) => {
        if (!response.error && response.data) {
          this.profile.set(response.data);
        }
      }
    });

    this.trainingService.getMyActiveTrainingPlan().subscribe({
      next: (response) => {
        if (response.data) {
          this.activePlan.set(response.data);
        }
      }
    });

    this.evaluationService.getMyEvaluations().subscribe({
      next: (response) => {
        if (!response.error && response.data && response.data.length > 0) {
          this.lastEvaluation.set(response.data[0]);
        }
      }
    });
  }
}
