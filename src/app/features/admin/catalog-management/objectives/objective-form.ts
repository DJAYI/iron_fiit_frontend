import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TrainingService } from '../../../../shared/services/training.service';
import { TrainingPlanObjective } from '../../../../shared/interfaces';

@Component({
    selector: 'app-objective-form',
    template: `
        <div class="max-w-3xl mx-auto">
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-800">{{ isEditMode() ? 'Editar Objetivo' : 'Crear Objetivo' }}</h1>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <form [formGroup]="objectiveForm" (ngSubmit)="onSubmit()" class="space-y-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                        <input 
                            type="text" 
                            id="name" 
                            formControlName="name"
                            placeholder="Ingrese el nombre del objetivo"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                        @if (objectiveForm.get('name')?.invalid && objectiveForm.get('name')?.touched) {
                            <span class="text-sm text-red-600 mt-1 block">El nombre es requerido y debe tener al menos 3 caracteres</span>
                        }
                    </div>

                    <div class="flex gap-3 justify-end pt-4">
                        <button 
                            type="button" 
                            (click)="onCancel()" 
                            [disabled]="loading()"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            [disabled]="objectiveForm.invalid || loading()"
                            class="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ loading() ? 'Guardando...' : (isEditMode() ? 'Actualizar' : 'Crear') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `,
    standalone: true,
    imports: [ReactiveFormsModule]
})
export class ObjectiveFormComponent {
    private fb = inject(FormBuilder);
    private trainingService = inject(TrainingService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    objectiveForm: FormGroup;
    objectiveId = signal<number | null>(null);
    loading = signal(false);
    isEditMode = signal(false);

    constructor() {
        this.objectiveForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    ngOnInit() {
        const id = this.route.snapshot.queryParamMap.get('id');
        if (id) {
            this.objectiveId.set(Number(id));
            this.isEditMode.set(true);
            this.loadObjective(Number(id));
        }
    }

    loadObjective(id: number) {
        this.loading.set(true);
        this.trainingService.getAllObjectives().subscribe({
            next: (response) => {
                if (response.trainmentObjectives) {
                    const objective = response.trainmentObjectives.find((obj: TrainingPlanObjective) => obj.id === id);
                    if (objective) {
                        this.objectiveForm.patchValue({
                            name: objective.name
                        });
                    }
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    onSubmit() {
        if (this.objectiveForm.valid) {
            this.loading.set(true);
            const formValue = this.objectiveForm.value;

            if (this.isEditMode() && this.objectiveId()) {
                this.trainingService.updateObjective(this.objectiveId()!, {
                    id: this.objectiveId()!,
                    name: formValue.name
                }).subscribe({
                    next: () => {
                        this.loading.set(false);
                        this.router.navigate(['/admin/catalog/objectives']);
                    },
                    error: () => {
                        this.loading.set(false);
                    }
                });
            } else {
                this.trainingService.createObjective({
                    name: formValue.name
                }).subscribe({
                    next: () => {
                        this.loading.set(false);
                        this.router.navigate(['/admin/catalog/objectives']);
                    },
                    error: () => {
                        this.loading.set(false);
                    }
                });
            }
        }
    }

    onCancel() {
        this.router.navigate(['/admin/catalog/objectives']);
    }
}
