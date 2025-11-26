import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TrainingService } from '../../../../shared/services/training.service';
import { UserService } from '../../../../shared/services/user.service';
import { Client, Trainer, TrainingPlanObjective, TrainingPlanState } from '../../../../shared/interfaces';

@Component({
  selector: 'app-training-plan-form',
  template: `
        <div class="max-w-3xl mx-auto">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-3xl font-bold text-gray-800">{{ isEditMode() ? 'Editar Plan' : 'Crear Plan de Entrenamiento' }}</h1>
                <button (click)="goBack()" class="text-gray-600 hover:text-gray-800">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                </button>
            </div>

            <form [formGroup]="planForm" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Plan *</label>
                        <input 
                            formControlName="name"
                            type="text" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Ej: Plan de Fuerza Básico">
                        @if (planForm.get('name')?.invalid && planForm.get('name')?.touched) {
                            <p class="mt-1 text-sm text-red-600">El nombre es requerido</p>
                        }
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                        <textarea 
                            formControlName="description"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Describe el plan..."></textarea>
                        @if (planForm.get('description')?.invalid && planForm.get('description')?.touched) {
                            <p class="mt-1 text-sm text-red-600">La descripción es requerida</p>
                        }
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                        <select 
                            formControlName="clientId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option value="">Selecciona un cliente</option>
                            @for (client of clients(); track client.id) {
                                <option [value]="client.id">{{ client.firstName }} {{ client.lastName }}</option>
                            }
                        </select>
                        @if (planForm.get('clientId')?.invalid && planForm.get('clientId')?.touched) {
                            <p class="mt-1 text-sm text-red-600">El cliente es requerido</p>
                        }
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Entrenador *</label>
                        <select 
                            formControlName="trainerId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option value="">Selecciona un entrenador</option>
                            @for (trainer of trainers(); track trainer.trainerId) {
                                <option [value]="trainer.trainerId">{{ trainer.firstName }} {{ trainer.lastName }}</option>
                            }
                        </select>
                        @if (planForm.get('trainerId')?.invalid && planForm.get('trainerId')?.touched) {
                            <p class="mt-1 text-sm text-red-600">El entrenador es requerido</p>
                        }
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Objetivo *</label>
                        <select 
                            formControlName="objectiveId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option value="">Selecciona un objetivo</option>
                            @for (objective of objectives(); track objective.id) {
                                <option [value]="objective.id">{{ objective.name }}</option>
                            }
                        </select>
                        @if (planForm.get('objectiveId')?.invalid && planForm.get('objectiveId')?.touched) {
                            <p class="mt-1 text-sm text-red-600">El objetivo es requerido</p>
                        }
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                        <select 
                            formControlName="stateId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                            <option value="">Selecciona un estado</option>
                            @for (state of states(); track state.id) {
                                <option [value]="state.id">{{ state.name }}</option>
                            }
                        </select>
                        @if (planForm.get('stateId')?.invalid && planForm.get('stateId')?.touched) {
                            <p class="mt-1 text-sm text-red-600">El estado es requerido</p>
                        }
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio *</label>
                        <input 
                            formControlName="startDate"
                            type="date"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        @if (planForm.get('startDate')?.invalid && planForm.get('startDate')?.touched) {
                            <p class="mt-1 text-sm text-red-600">La fecha de inicio es requerida</p>
                        }
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin *</label>
                        <input 
                            formControlName="endDate"
                            type="date"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        @if (planForm.get('endDate')?.invalid && planForm.get('endDate')?.touched) {
                            <p class="mt-1 text-sm text-red-600">La fecha fin es requerida</p>
                        }
                    </div>
                </div>

                <div class="flex gap-3 pt-4">
                    <button 
                        type="submit"
                        [disabled]="planForm.invalid || loading()"
                        class="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors">
                        {{ loading() ? 'Guardando...' : (isEditMode() ? 'Actualizar' : 'Crear') }}
                    </button>
                    <button 
                        type="button"
                        (click)="goBack()"
                        class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    `,
  imports: [ReactiveFormsModule]
})
export class TrainingPlanFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private trainingService = inject(TrainingService);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  planForm: FormGroup;
  clients = signal<Client[]>([]);
  trainers = signal<Trainer[]>([]);
  objectives = signal<TrainingPlanObjective[]>([]);
  states = signal<TrainingPlanState[]>([]);
  loading = signal(false);
  isEditMode = signal(false);
  planId: number | null = null;

  constructor() {
    this.planForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      clientId: ['', Validators.required],
      trainerId: ['', Validators.required],
      objectiveId: ['', Validators.required],
      stateId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadClients();
    this.loadTrainers();
    this.loadObjectives();
    this.loadStates();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.planId = parseInt(id, 10);
      this.loadPlan(this.planId);
    }
  }

  loadClients() {
    this.userService.getAllClients().subscribe({
      next: (response) => this.clients.set(response.clients),
      error: (err) => console.error('Error loading clients:', err)
    });
  }

  loadTrainers() {
    this.userService.getAllTrainers().subscribe({
      next: (response) => {
        console.log('Trainers response:', response);
        if (response.trainers) {
          this.trainers.set(response.trainers);
          console.log('Trainers loaded:', response.trainers);
        }
      },
      error: (err) => console.error('Error loading trainers:', err)
    });
  }

  loadObjectives() {
    this.trainingService.getAllObjectives().subscribe({
      next: (response) => this.objectives.set(response.trainmentObjectives),
      error: (err) => console.error('Error loading objectives:', err)
    });
  }

  loadStates() {
    this.trainingService.getAllStates().subscribe({
      next: (response) => this.states.set(response.trainmentObjectives),
      error: (err) => console.error('Error loading states:', err)
    });
  }

  loadPlan(id: number) {
    this.trainingService.getTrainingPlan(id).subscribe({
      next: (response) => {
        const plan = response.data;
        this.planForm.patchValue({
          name: plan.name,
          description: plan.description,
          clientId: plan.clientId,
          trainerId: plan.trainerId,
          objectiveId: plan.objectiveId,
          stateId: plan.stateId,
          startDate: plan.startDate,
          endDate: plan.endDate
        });
      },
      error: (err) => {
        console.error('Error loading plan:', err);
        alert('Error al cargar el plan');
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.planForm.invalid) return;

    this.loading.set(true);
    const formValue = this.planForm.value;

    // Debug: ver qué valores vienen del formulario
    console.log('Form values:', formValue);

    // Validar que los valores no sean strings vacías o 'undefined'
    if (!formValue.clientId || formValue.clientId === '' || formValue.clientId === 'undefined') {
      alert('Por favor selecciona un cliente');
      this.loading.set(false);
      return;
    }
    if (!formValue.trainerId || formValue.trainerId === '' || formValue.trainerId === 'undefined') {
      alert('Por favor selecciona un entrenador');
      this.loading.set(false);
      return;
    }
    if (!formValue.objectiveId || formValue.objectiveId === '' || formValue.objectiveId === 'undefined') {
      alert('Por favor selecciona un objetivo');
      this.loading.set(false);
      return;
    }
    if (!formValue.stateId || formValue.stateId === '' || formValue.stateId === 'undefined') {
      alert('Por favor selecciona un estado');
      this.loading.set(false);
      return;
    }

    // Convertir a números
    const clientId = Number(formValue.clientId);
    const trainerId = Number(formValue.trainerId);
    const objectiveId = Number(formValue.objectiveId);
    const stateId = Number(formValue.stateId);

    console.log('Converted values:', { clientId, trainerId, objectiveId, stateId });

    const request = this.isEditMode()
      ? this.trainingService.updateTrainingPlan({
        id: this.planId!,
        name: formValue.name,
        description: formValue.description,
        clientId: clientId,
        trainerId: trainerId,
        objectiveId: objectiveId,
        stateId: stateId,
        startDate: formValue.startDate,
        endDate: formValue.endDate
      })
      : this.trainingService.createTrainingPlan({
        name: formValue.name,
        description: formValue.description,
        clientId: clientId,
        trainerId: trainerId,
        objectiveId: objectiveId,
        stateId: stateId,
        startDate: formValue.startDate,
        endDate: formValue.endDate
      });

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.goBack();
      },
      error: (err) => {
        this.loading.set(false);
        alert('Error al guardar el plan');
        console.error(err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/routines/training-plans']);
  }
}
