import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogService } from '../../../../../shared/services/catalog.service';
import { Exercise } from '../../../../../shared/interfaces/catalog.interface';

@Component({
    selector: 'app-exercise-list',
    template: `
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Gestión de Ejercicios</h1>
                <button 
                    (click)="createExercise()"
                    class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Crear Ejercicio
                </button>
            </div>

            @if (loading()) {
                <div class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    <p class="mt-4 text-gray-600">Cargando ejercicios...</p>
                </div>
            } @else if (error()) {
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {{ error() }}
                </div>
            } @else {
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    @for (exercise of exercises(); track exercise.id) {
                        <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                            <div class="w-full h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mb-4 flex items-center justify-center">
                                <svg class="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ exercise.name }}</h3>
                            <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ exercise.description }}</p>
                            
                            <div class="flex gap-2">
                                <button 
                                    (click)="editExercise(exercise.id)"
                                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                                    Editar
                                </button>
                                <button 
                                    (click)="deleteExercise(exercise.id)"
                                    class="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    }
                </div>

                @if (exercises().length === 0) {
                    <div class="text-center py-12 text-gray-500">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        <p>No hay ejercicios registrados</p>
                        <button 
                            (click)="createExercise()"
                            class="mt-4 text-orange-600 hover:text-orange-700 font-medium">
                            Crear el primero
                        </button>
                    </div>
                }
            }
        </div>
    `
})
export class ExerciseListComponent implements OnInit {
    private catalogService = inject(CatalogService);
    private router = inject(Router);

    exercises = signal<Exercise[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    ngOnInit() {
        this.loadExercises();
    }

    loadExercises() {
        this.loading.set(true);
        this.error.set(null);

        this.catalogService.getAllExercises().subscribe({
            next: (response) => {
                this.exercises.set(response.data);
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set('Error al cargar los ejercicios');
                this.loading.set(false);
                console.error(err);
            }
        });
    }

    createExercise() {
        this.router.navigate(['/admin/catalog/exercises/new']);
    }

    editExercise(id: number) {
        this.router.navigate(['/admin/catalog/exercises/edit', id]);
    }

    deleteExercise(id: number) {
        if (!confirm('¿Estás seguro de eliminar este ejercicio?')) return;

        this.catalogService.deleteExercise(id).subscribe({
            next: () => {
                this.loadExercises();
            },
            error: (err) => {
                alert('Error al eliminar el ejercicio');
                console.error(err);
            }
        });
    }
}
