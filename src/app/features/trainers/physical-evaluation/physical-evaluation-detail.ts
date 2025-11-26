import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EvaluationService } from '../../../shared/services/evaluation.service';
import { PhysicalEvaluation } from '../../../shared/interfaces';

@Component({
    selector: 'app-physical-evaluation-detail',
    imports: [CommonModule],
    template: `
        <div class="container">
            <div class="header">
                <h2>Detalle de Evaluación Física</h2>
                <div class="actions">
                    <button class="btn btn-secondary" (click)="goBack()">
                        Volver
                    </button>
                    <button class="btn btn-primary" (click)="editEvaluation()">
                        Editar
                    </button>
                </div>
            </div>

            @if (error()) {
                <div class="alert alert-error">{{ error() }}</div>
            }

            @if (loading()) {
                <div class="loading">Cargando evaluación...</div>
            } @else if (evaluation()) {
                <div class="evaluation-detail">
                    <div class="section">
                        <h3>Información General</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="label">Cliente:</span>
                                <span class="value">{{ evaluation()!.clientName }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Fecha de Evaluación:</span>
                                <span class="value">{{ formatDate(evaluation()!.evaluationDate) }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Entrenador:</span>
                                <span class="value">{{ evaluation()!.trainerName }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h3>Mediciones Corporales</h3>
                        <div class="measurements-grid">
                            <div class="measurement-card">
                                <div class="measurement-label">Peso</div>
                                <div class="measurement-value">{{ evaluation()!.weight }} <span class="unit">kg</span></div>
                            </div>
                            <div class="measurement-card">
                                <div class="measurement-label">IMC</div>
                                <div class="measurement-value">{{ evaluation()!.bmi }}</div>
                            </div>
                            <div class="measurement-card">
                                <div class="measurement-label">Grasa Corporal</div>
                                <div class="measurement-value">{{ evaluation()!.bodyFatPercentage }} <span class="unit">%</span></div>
                            </div>
                            <div class="measurement-card">
                                <div class="measurement-label">Cintura</div>
                                <div class="measurement-value">{{ evaluation()!.waistMeasurement }} <span class="unit">cm</span></div>
                            </div>
                            <div class="measurement-card">
                                <div class="measurement-label">Cadera</div>
                                <div class="measurement-value">{{ evaluation()!.hipMeasurement }} <span class="unit">cm</span></div>
                            </div>
                            <div class="measurement-card">
                                <div class="measurement-label">Altura</div>
                                <div class="measurement-value">{{ evaluation()!.heightMeasurement }} <span class="unit">cm</span></div>
                            </div>
                        </div>
                    </div>

                    @if (evaluation()!.notes) {
                        <div class="section">
                            <h3>Notas</h3>
                            <div class="notes-content">
                                {{ evaluation()!.notes }}
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    `,
    styles: [`
        .container {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
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

        .actions {
            display: flex;
            gap: 1rem;
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

        .evaluation-detail {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .section {
            padding: 2rem;
            border-bottom: 1px solid #dee2e6;
        }

        .section:last-child {
            border-bottom: none;
        }

        .section h3 {
            margin: 0 0 1.5rem 0;
            color: #495057;
            font-size: 1.25rem;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .label {
            font-weight: 600;
            color: #6c757d;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .value {
            font-size: 1.125rem;
            color: #212529;
        }

        .measurements-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1.5rem;
        }

        .measurement-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 1.5rem;
            border-radius: 8px;
            color: white;
            text-align: center;
        }

        .measurement-label {
            font-size: 0.875rem;
            opacity: 0.9;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .measurement-value {
            font-size: 2rem;
            font-weight: 700;
        }

        .unit {
            font-size: 1rem;
            font-weight: 400;
            opacity: 0.9;
        }

        .notes-content {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 4px;
            white-space: pre-wrap;
            line-height: 1.6;
            color: #495057;
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

        .btn-secondary {
            background-color: #6c757d;
            color: white;
        }

        .btn-secondary:hover {
            background-color: #545b62;
        }
    `]
})
export class PhysicalEvaluationDetailComponent implements OnInit {
    private evaluationService = inject(EvaluationService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    evaluationId = signal<number>(0);
    evaluation = signal<PhysicalEvaluation | null>(null);
    loading = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.evaluationId.set(+id);
            this.loadEvaluation(+id);
        }
    } private loadEvaluation(id: number): void {
        this.loading.set(true);
        this.error.set(null);

        this.evaluationService.getEvaluationById(id).subscribe({
            next: (response) => {
                if (response.data) {
                    this.evaluation.set(response.data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set('Error al cargar la evaluación');
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

    editEvaluation(): void {
        this.router.navigate(['/trainer/evaluations/edit', this.evaluationId()]);
    }

    goBack(): void {
        this.router.navigate(['/trainer/evaluations']);
    }
}
