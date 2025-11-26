import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationService } from '../../../../shared/services/evaluation.service';
import { PhysicalEvaluation } from '../../../../shared/interfaces';

@Component({
    selector: 'app-client-evaluations',
    imports: [CommonModule],
    template: `
        <div class="container">
            <h2>Mis Evaluaciones Físicas</h2>

            @if (error()) {
                <div class="alert alert-error">{{ error() }}</div>
            }

            @if (loading()) {
                <div class="loading">Cargando evaluaciones...</div>
            } @else {
                @if (evaluations().length === 0) {
                    <div class="empty-state">
                        <p>No tienes evaluaciones físicas registradas</p>
                    </div>
                } @else {
                    <div class="evaluations-grid">
                        @for (evaluation of evaluations(); track evaluation.id) {
                            <div class="evaluation-card">
                                <div class="card-header">
                                    <h3>{{ formatDate(evaluation.evaluationDate) }}</h3>
                                </div>
                                <div class="card-body">
                                    <div class="measurement-row">
                                        <span class="label">Peso:</span>
                                        <span class="value">{{ evaluation.weight }} kg</span>
                                    </div>
                                    <div class="measurement-row">
                                        <span class="label">IMC:</span>
                                        <span class="value">{{ evaluation.bmi }}</span>
                                    </div>
                                    <div class="measurement-row">
                                        <span class="label">Grasa Corporal:</span>
                                        <span class="value">{{ evaluation.bodyFatPercentage }}%</span>
                                    </div>
                                    <div class="measurement-row">
                                        <span class="label">Cintura:</span>
                                        <span class="value">{{ evaluation.waistMeasurement }} cm</span>
                                    </div>
                                    <div class="measurement-row">
                                        <span class="label">Cadera:</span>
                                        <span class="value">{{ evaluation.hipMeasurement }} cm</span>
                                    </div>
                                    <div class="measurement-row">
                                        <span class="label">Altura:</span>
                                        <span class="value">{{ evaluation.heightMeasurement }} cm</span>
                                    </div>
                                    @if (evaluation.notes) {
                                        <div class="notes">
                                            <strong>Notas:</strong>
                                            <p>{{ evaluation.notes }}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                }
            }
        </div>
    `,
    styles: [`
        .container {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        h2 {
            margin-bottom: 2rem;
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
            margin: 0;
        }

        .evaluations-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5rem;
        }

        .evaluation-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .evaluation-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem;
        }

        .card-header h3 {
            margin: 0;
            font-size: 1.125rem;
        }

        .card-body {
            padding: 1.5rem;
        }

        .measurement-row {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .measurement-row:last-of-type {
            border-bottom: none;
        }

        .label {
            font-weight: 500;
            color: #666;
        }

        .value {
            font-weight: 600;
            color: #333;
        }

        .notes {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 2px solid #f0f0f0;
        }

        .notes strong {
            color: #495057;
            display: block;
            margin-bottom: 0.5rem;
        }

        .notes p {
            margin: 0;
            color: #666;
            line-height: 1.6;
            white-space: pre-wrap;
        }
    `]
})
export class ClientEvaluationsComponent implements OnInit {
    private evaluationService = inject(EvaluationService);

    evaluations = signal<PhysicalEvaluation[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.loadEvaluations();
    }

    private loadEvaluations(): void {
        this.loading.set(true);
        this.error.set(null);

        // Backend will filter by current client from authentication
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
}
