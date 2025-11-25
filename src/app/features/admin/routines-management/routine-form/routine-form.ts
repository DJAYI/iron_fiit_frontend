import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TrainingService } from '../../../../shared/services/training.service';
import { TrainingPlan } from '../../../../shared/interfaces';

@Component({
  selector: 'app-routine-form',
  template: `
        <div class="max-w-2xl mx-auto">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-3xl font-bold text-gray-800">{{ isEditMode() ? 'Editar Rutina' : 'Crear Rutina' }}</h1>
                <button (click)="goBack()" class="text-gray-600 hover:text-gray-800">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                </button>
            </div>

            <form [formGroup]="routineForm" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Rutina *</label>
                    <input 
                        formControlName="name"
                        type="text" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ej: Rutina de Pecho y Tríceps">
                    @if (routineForm.get('name')?.invalid && routineForm.get('name')?.touched) {
                        <p class="mt-1 text-sm text-red-600">El nombre es requerido</p>
                    }
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                    <textarea 
                        formControlName="description"
                        rows="4"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe la rutina y sus objetivos..."></textarea>
                    @if (routineForm.get('description')?.invalid && routineForm.get('description')?.touched) {
                        <p class="mt-1 text-sm text-red-600">La descripción es requerida</p>
                    }
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Plan de Entrenamiento *</label>
                    <select 
                        formControlName="trainmentPlanId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="">Selecciona un plan</option>
                        @for (plan of trainingPlans(); track plan.id) {
                            <option [value]="plan.id">{{ plan.name }} - {{ plan.clientName }}</option>
                        }
                    </select>
                    @if (routineForm.get('trainmentPlanId')?.invalid && routineForm.get('trainmentPlanId')?.touched) {
                        <p class="mt-1 text-sm text-red-600">El plan de entrenamiento es requerido</p>
                    }
                </div>

                <div class="flex gap-3 pt-4">
                    <button 
                        type="submit"
                        [disabled]="routineForm.invalid || loading()"
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
export class RoutineFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private trainingService = inject(TrainingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  routineForm: FormGroup;
  trainingPlans = signal<TrainingPlan[]>([]);
  loading = signal(false);
  isEditMode = signal(false);
  routineId: number | null = null;

  constructor() {
    this.routineForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      trainmentPlanId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadTrainingPlans();

    // Check for planId in query params to pre-select
    this.route.queryParams.subscribe(params => {
      const planId = params['planId'];
      if (planId) {
        this.routineForm.patchValue({ trainmentPlanId: planId });
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.routineId = parseInt(id, 10);
      this.loadRoutine(this.routineId);
    }
  }

  loadTrainingPlans() {
    this.trainingService.getAllTrainingPlans().subscribe({
      next: (response) => this.trainingPlans.set(response.data),
      error: (err) => console.error('Error loading training plans:', err)
    });
  }

  loadRoutine(id: number) {
    this.trainingService.getRoutine(id).subscribe({
      next: (response) => {
        const routine = response.data;
        this.routineForm.patchValue({
          name: routine.name,
          description: routine.description,
          trainmentPlanId: routine.trainmentPlanId
        });
      },
      error: (err) => {
        console.error('Error loading routine:', err);
        alert('Error al cargar la rutina');
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.routineForm.invalid) return;

    this.loading.set(true);
    const formValue = this.routineForm.value;

    const request = this.isEditMode()
      ? this.trainingService.updateRoutine({
        id: this.routineId!,
        name: formValue.name,
        description: formValue.description,
        trainmentPlanId: parseInt(formValue.trainmentPlanId, 10)
      })
      : this.trainingService.createRoutine({
        name: formValue.name,
        description: formValue.description,
        trainmentPlanId: parseInt(formValue.trainmentPlanId, 10)
      });

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.goBack();
      },
      error: (err) => {
        this.loading.set(false);
        alert('Error al guardar la rutina');
        console.error(err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/routines/routines']);
  }
}
