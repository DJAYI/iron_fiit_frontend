import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EvaluationService } from '../../../shared/services/evaluation.service';
import { PhysicalEvaluation } from '../../../shared/interfaces';

@Component({
    selector: 'app-physical-evaluation-list',
    imports: [CommonModule],
    template: `
        <div class="container">
            <div class="header">
                <h2>Evaluaciones Físicas</h2>
                <button class="btn btn-primary" (click)="createEvaluation()">
                    + Nueva Evaluación
                </button>
            </div>

            @if (error()) {
                <div class="alert alert-error">{{ error() }}</div>
            }

            @if (loading()) {
                <div class="loading">Cargando evaluaciones...</div>
            } @else {
                @if (evaluations().length === 0) {
                    <div class="empty-state">
                        <p>No hay evaluaciones registradas</p>
                        <button class="btn btn-primary" (click)="createEvaluation()">
                            Crear Primera Evaluación
                        </button>
                    </div>
                } @else {
                    <div class="table-container">
                        <table class="evaluations-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Peso (kg)</th>
                                    <th>IMC</th>
                                    <th>Grasa (%)</th>
                                    <th>Cintura (cm)</th>
                                    <th>Cadera (cm)</th>
                                    <th>Altura (cm)</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                @for (evaluation of evaluations(); track evaluation.id) {
                                    <tr>
                                        <td>{{ formatDate(evaluation.evaluationDate) }}</td>
                                        <td>{{ evaluation.clientName }}</td>
                                        <td>{{ evaluation.weight }}</td>
                                        <td>{{ evaluation.bmi }}</td>
                                        <td>{{ evaluation.bodyFatPercentage }}</td>
                                        <td>{{ evaluation.waistMeasurement }}</td>
                                        <td>{{ evaluation.hipMeasurement }}</td>
                                        <td>{{ evaluation.heightMeasurement }}</td>
                                        <td class="actions">
                                            <button 
                                                class="btn btn-sm btn-info"
                                                (click)="viewEvaluation(evaluation.id)"
                                                title="Ver detalles"
                                            >
                                                Ver
                                            </button>
                                            <button 
                                                class="btn btn-sm btn-warning"
                                                (click)="editEvaluation(evaluation.id)"
                                                title="Editar"
                                            >
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
    styles: [`
        .container {
            padding: 2rem;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        h2 {
            margin: 0;
            color: #333;
        }

        .alert {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }

        .alert-error {
            background-color: #fee;
            color: #c00;
            border: 1px solid #fcc;
        }

        .loading {
            text-align: center;
            padding: 2rem;
            color: #666;
        }

        .empty-state {
            text-align: center;
            padding: 3rem;
            background-color: #f8f9fa;
            border-radius: 8px;
            margin-top: 2rem;
        }

        .empty-state p {
            font-size: 1.125rem;
            color: #666;
            margin-bottom: 1rem;
        }

        .table-container {
            overflow-x: auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .evaluations-table {
            width: 100%;
            border-collapse: collapse;
        }

        .evaluations-table thead {
            background-color: #f8f9fa;
        }

        .evaluations-table th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #dee2e6;
        }

        .evaluations-table td {
            padding: 1rem;
            border-bottom: 1px solid #dee2e6;
        }

        .evaluations-table tbody tr:hover {
            background-color: #f8f9fa;
        }

        .actions {
            display: flex;
            gap: 0.5rem;
        }

        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .btn-primary {
            background-color: #007bff;
            color: white;
        }

        .btn-primary:hover {
            background-color: #0056b3;
        }

        .btn-sm {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
        }

        .btn-info {
            background-color: #17a2b8;
            color: white;
        }

        .btn-info:hover {
            background-color: #117a8b;
        }

        .btn-warning {
            background-color: #ffc107;
            color: #212529;
        }

        .btn-warning:hover {
            background-color: #e0a800;
        }
    `]
})
export class PhysicalEvaluationListComponent implements OnInit {
    private evaluationService = inject(EvaluationService);
    private router = inject(Router);

    evaluations = signal<PhysicalEvaluation[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.loadEvaluations();
    }

    private loadEvaluations(): void {
        this.loading.set(true);
        this.error.set(null);

        // Get all evaluations - backend will filter by current trainer if needed
        this.evaluationService.getAllEvaluations().subscribe({
            next: (response) => {
                if (response.data) {
                    this.evaluations.set(response.data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set('Error al cargar las evaluaciones');
                this.loading.set(false);
            }
        });
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    createEvaluation(): void {
        this.router.navigate(['/trainer/evaluations/new']);
    }

    viewEvaluation(id: number): void {
        this.router.navigate(['/trainer/evaluations', id]);
    }

    editEvaluation(id: number): void {
        this.router.navigate(['/trainer/evaluations/edit', id]);
    }
}
