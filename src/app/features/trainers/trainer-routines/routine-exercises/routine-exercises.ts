import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineExerciseService } from '../../../../shared/services/routine-exercise.service';
import { CatalogService } from '../../../../shared/services/catalog.service';
import { RoutineExercise, CreateRoutineExerciseRequest } from '../../../../shared/interfaces/training.interface';
import { Exercise } from '../../../../shared/interfaces/catalog.interface';

@Component({
    selector: 'app-routine-exercises',
    imports: [CommonModule, FormsModule],
    templateUrl: './routine-exercises.html',
    styleUrls: ['./routine-exercises.css']
})
export class RoutineExercisesComponent implements OnInit {
    private routineExerciseService = inject(RoutineExerciseService);
    private catalogService = inject(CatalogService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    routineId = signal<number>(0);
    routineExercises = signal<RoutineExercise[]>([]);
    availableExercises = signal<Exercise[]>([]);
    loading = signal(true);
    showAddForm = signal(false);

    // Form fields
    selectedExerciseId = signal<number | null>(null);
    sets = signal<number>(3);
    reps = signal<number>(12);
    restSeconds = signal<number>(60);
    targetWeight = signal<number | null>(null);
    timeSeconds = signal<number | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.routineId.set(+id);
            this.loadRoutineExercises();
            this.loadAvailableExercises();
        }
    }

    loadRoutineExercises() {
        this.loading.set(true);
        this.routineExerciseService.getRoutineExercises(this.routineId()).subscribe({
            next: (response) => {
                this.routineExercises.set(response.data ?? []);
                this.loading.set(false);
            },
            error: (error: any) => {
                console.error('Error loading routine exercises:', error);
                this.loading.set(false);
            }
        });
    }

    loadAvailableExercises() {
        this.catalogService.getExercises().subscribe({
            next: (response) => {
                this.availableExercises.set(response.data ?? []);
            },
            error: (error: any) => {
                console.error('Error loading exercises:', error);
            }
        });
    }

    toggleAddForm() {
        this.showAddForm.set(!this.showAddForm());
        if (this.showAddForm()) {
            this.resetForm();
        }
    }

    resetForm() {
        this.selectedExerciseId.set(null);
        this.sets.set(3);
        this.reps.set(12);
        this.restSeconds.set(60);
        this.targetWeight.set(null);
        this.timeSeconds.set(null);
    }

    addExercise() {
        if (!this.selectedExerciseId()) {
            alert('Por favor selecciona un ejercicio');
            return;
        }

        const nextOrder = this.routineExercises().length + 1;

        const request: CreateRoutineExerciseRequest = {
            routineId: this.routineId(),
            exerciseId: this.selectedExerciseId()!,
            order: nextOrder,
            sets: this.sets(),
            reps: this.reps(),
            restSeconds: this.restSeconds(),
            targetWeight: this.targetWeight(),
            timeSeconds: this.timeSeconds()
        };

        this.routineExerciseService.createRoutineExercise(request).subscribe({
            next: () => {
                this.loadRoutineExercises();
                this.toggleAddForm();
            },
            error: (error: any) => {
                console.error('Error adding exercise:', error);
                alert('Error al agregar el ejercicio');
            }
        });
    }

    deleteExercise(id: number) {
        if (!confirm('¿Estás seguro de eliminar este ejercicio?')) {
            return;
        }

        this.routineExerciseService.deleteRoutineExercise(id).subscribe({
            next: () => {
                this.loadRoutineExercises();
            },
            error: (error: any) => {
                console.error('Error deleting exercise:', error);
                alert('Error al eliminar el ejercicio');
            }
        });
    }

    moveUp(exercise: RoutineExercise, index: number) {
        if (index === 0) return;

        const exercises = [...this.routineExercises()];
        const temp = exercises[index];
        exercises[index] = exercises[index - 1];
        exercises[index - 1] = temp;

        this.updateExerciseOrders(exercises);
    }

    moveDown(exercise: RoutineExercise, index: number) {
        if (index === this.routineExercises().length - 1) return;

        const exercises = [...this.routineExercises()];
        const temp = exercises[index];
        exercises[index] = exercises[index + 1];
        exercises[index + 1] = temp;

        this.updateExerciseOrders(exercises);
    }

    updateExerciseOrders(exercises: RoutineExercise[]) {
        const updates = exercises.map((ex, idx) => ({
            id: ex.id,
            order: idx + 1
        }));

        // Update each exercise order
        let completed = 0;
        updates.forEach(update => {
            this.routineExerciseService.updateRoutineExercise(update).subscribe({
                next: () => {
                    completed++;
                    if (completed === updates.length) {
                        this.loadRoutineExercises();
                    }
                },
                error: (error: any) => {
                    console.error('Error updating exercise order:', error);
                }
            });
        });
    }

    goBack() {
        this.router.navigate(['/trainer/routines']);
    }
}
