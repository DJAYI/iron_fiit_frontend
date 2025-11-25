import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CatalogService } from '../../../../../shared/services/catalog.service';
import { Category, MuscleGroup, UpdateExerciseRequest } from '../../../../../shared/interfaces/catalog.interface';

@Component({
    selector: 'app-exercise-form',
    template: `
        <div class="max-w-2xl mx-auto">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-3xl font-bold text-gray-800">{{ isEditMode() ? 'Editar Ejercicio' : 'Crear Ejercicio' }}</h1>
                <button (click)="goBack()" class="text-gray-600 hover:text-gray-800">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                </button>
            </div>

            <form [formGroup]="exerciseForm" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input 
                        formControlName="name"
                        type="text" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ej: Press de banca">
                    @if (exerciseForm.get('name')?.invalid && exerciseForm.get('name')?.touched) {
                        <p class="mt-1 text-sm text-red-600">El nombre es requerido</p>
                    }
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                    <textarea 
                        formControlName="description"
                        rows="4"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe el ejercicio..."></textarea>
                    @if (exerciseForm.get('description')?.invalid && exerciseForm.get('description')?.touched) {
                        <p class="mt-1 text-sm text-red-600">La descripción es requerida</p>
                    }
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                    <select 
                        formControlName="categoryId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="">Selecciona una categoría</option>
                        @for (category of categories(); track category.id) {
                            <option [value]="category.id">{{ category.name }}</option>
                        }
                    </select>
                    @if (exerciseForm.get('categoryId')?.invalid && exerciseForm.get('categoryId')?.touched) {
                        <p class="mt-1 text-sm text-red-600">La categoría es requerida</p>
                    }
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Grupo Muscular *</label>
                    <select 
                        formControlName="muscularGroupId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="">Selecciona un grupo muscular</option>
                        @for (group of muscleGroups(); track group.id) {
                            <option [value]="group.id">{{ group.name }}</option>
                        }
                    </select>
                    @if (exerciseForm.get('muscularGroupId')?.invalid && exerciseForm.get('muscularGroupId')?.touched) {
                        <p class="mt-1 text-sm text-red-600">El grupo muscular es requerido</p>
                    }
                </div>

                <div class="flex gap-3 pt-4">
                    <button 
                        type="submit"
                        [disabled]="exerciseForm.invalid || loading()"
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
export class ExerciseFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private catalogService = inject(CatalogService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    exerciseForm: FormGroup;
    categories = signal<Category[]>([]);
    muscleGroups = signal<MuscleGroup[]>([]);
    loading = signal(false);
    isEditMode = signal(false);
    exerciseId: number | null = null;

    constructor() {
        this.exerciseForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            categoryId: ['', Validators.required],
            muscularGroupId: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.loadCategories();
        this.loadMuscleGroups();

        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEditMode.set(true);
            this.exerciseId = parseInt(id, 10);
            this.loadExercise(this.exerciseId);
        }
    }

    loadCategories() {
        this.catalogService.getAllCategories().subscribe({
            next: (response) => this.categories.set(response.categories),
            error: (err) => console.error('Error loading categories:', err)
        });
    }

    loadMuscleGroups() {
        this.catalogService.getAllMuscleGroups().subscribe({
            next: (response) => this.muscleGroups.set(response.muscularGroups),
            error: (err) => console.error('Error loading muscle groups:', err)
        });
    }

    loadExercise(id: number) {
        this.catalogService.getExercise(id).subscribe({
            next: (response) => {
                const exercise = response.data;
                if (!exercise) {
                    alert('Ejercicio no encontrado');
                    this.goBack();
                    return;
                }

                this.exerciseForm.patchValue({
                    name: exercise.name,
                    description: exercise.description,
                    categoryId: exercise.categoryId,
                    muscularGroupId: exercise.muscularGroupId
                });
            },
            error: (err) => {
                console.error('Error loading exercise:', err);
                alert('Error al cargar el ejercicio');
                this.goBack();
            }
        });
    }

    onSubmit() {
        if (this.exerciseForm.invalid) return;

        this.loading.set(true);

        const formValue = this.exerciseForm.value;

        const formData = this.isEditMode()
            ? {
                id: this.exerciseId!,
                name: formValue.name,
                description: formValue.description,
                categoryId: parseInt(formValue.categoryId, 10),
                muscularGroupId: parseInt(formValue.muscularGroupId, 10)
            }
            : {
                name: formValue.name,
                description: formValue.description,
                categoryId: parseInt(formValue.categoryId, 10),
                muscularGroupId: parseInt(formValue.muscularGroupId, 10)
            };

        const request = this.isEditMode()
            ? this.catalogService.updateExercise(this.exerciseId!, formData as UpdateExerciseRequest)
            : this.catalogService.createExercise(formData);

        request.subscribe({
            next: () => {
                this.loading.set(false);
                this.goBack();
            },
            error: (err) => {
                this.loading.set(false);
                alert('Error al guardar el ejercicio');
                console.error(err);
            }
        });
    }

    goBack() {
        this.router.navigate(['/admin/catalog/exercises']);
    }
}
