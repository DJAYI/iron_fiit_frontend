import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TrainingService } from '../../../../shared/services/training.service';
import { TrainingPlanState } from '../../../../shared/interfaces';

@Component({
    selector: 'app-state-form',
    template: `
        <div class="max-w-3xl mx-auto">
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-800">{{ isEditMode() ? 'Editar Estado' : 'Crear Estado' }}</h1>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <form [formGroup]="stateForm" (ngSubmit)="onSubmit()" class="space-y-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                        <input 
                            type="text" 
                            id="name" 
                            formControlName="name"
                            placeholder="Ingrese el nombre del estado"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                        @if (stateForm.get('name')?.invalid && stateForm.get('name')?.touched) {
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
                            [disabled]="stateForm.invalid || loading()"
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
export class StateFormComponent {
    private fb = inject(FormBuilder);
    private trainingService = inject(TrainingService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    stateForm: FormGroup;
    stateId = signal<number | null>(null);
    loading = signal(false);
    isEditMode = signal(false);

    constructor() {
        this.stateForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    ngOnInit() {
        const id = this.route.snapshot.queryParamMap.get('id');
        if (id) {
            this.stateId.set(Number(id));
            this.isEditMode.set(true);
            this.loadState(Number(id));
        }
    }

    loadState(id: number) {
        this.loading.set(true);
        this.trainingService.getAllStates().subscribe({
            next: (response) => {
                if (response.trainmentObjectives) {
                    const state = response.trainmentObjectives.find((st: TrainingPlanState) => st.id === id);
                    if (state) {
                        this.stateForm.patchValue({
                            name: state.name
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
        if (this.stateForm.valid) {
            this.loading.set(true);
            const formValue = this.stateForm.value;

            if (this.isEditMode() && this.stateId()) {
                this.trainingService.updateState(this.stateId()!, {
                    id: this.stateId()!,
                    name: formValue.name
                }).subscribe({
                    next: () => {
                        this.loading.set(false);
                        this.router.navigate(['/admin/catalog/states']);
                    },
                    error: () => {
                        this.loading.set(false);
                    }
                });
            } else {
                this.trainingService.createState({
                    name: formValue.name
                }).subscribe({
                    next: () => {
                        this.loading.set(false);
                        this.router.navigate(['/admin/catalog/states']);
                    },
                    error: () => {
                        this.loading.set(false);
                    }
                });
            }
        }
    }

    onCancel() {
        this.router.navigate(['/admin/catalog/states']);
    }
}
