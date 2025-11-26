import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../../../../shared/services/training.service';
import { TrainingPlanObjective } from '../../../../shared/interfaces';

@Component({
    selector: 'app-objective-list',
    template: `
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Objetivos de Planes de Entrenamiento</h1>
                <button 
                    (click)="onCreate()"
                    class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Crear Objetivo
                </button>
            </div>

            @if (loading()) {
                <div class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    <p class="mt-4 text-gray-600">Cargando objetivos...</p>
                </div>
            } @else {
                @if (objectives().length === 0) {
                    <div class="text-center py-12 text-gray-500">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        <p>No hay objetivos registrados</p>
                        <button 
                            (click)="onCreate()"
                            class="mt-4 text-orange-600 hover:text-orange-700 font-medium">
                            Crear el primero
                        </button>
                    </div>
                } @else {
                    <div class="bg-white rounded-lg shadow overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                @for (objective of objectives(); track objective.id) {
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">{{ objective.id }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{{ objective.name }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                (click)="onEdit(objective.id)"
                                                class="text-blue-600 hover:text-blue-900 cursor-pointer">
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                }
            }
        </div>
    `,
    standalone: true,
    imports: []
})
export class ObjectiveListComponent {
    private trainingService = inject(TrainingService);
    private router = inject(Router);

    objectives = signal<TrainingPlanObjective[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadObjectives();
    }

    loadObjectives() {
        this.loading.set(true);
        this.trainingService.getAllObjectives().subscribe({
            next: (response) => {
                if (response.trainmentObjectives) {
                    this.objectives.set(response.trainmentObjectives);
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    onEdit(id: number) {
        this.router.navigate(['/admin/catalog/objectives/form'], { queryParams: { id } });
    }

    onCreate() {
        this.router.navigate(['/admin/catalog/objectives/form']);
    }
}
