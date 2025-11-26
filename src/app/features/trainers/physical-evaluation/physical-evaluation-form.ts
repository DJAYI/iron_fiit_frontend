import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EvaluationService } from '../../../shared/services/evaluation.service';
import { UserService } from '../../../shared/services/user.service';
import { Client, Trainer } from '../../../shared/interfaces';

@Component({
    selector: 'app-physical-evaluation-form',
    imports: [ReactiveFormsModule],
    template: `
        <div class="container">
            <h2>{{ evaluationId() ? 'Editar' : 'Nueva' }} Evaluación Física</h2>
            
            @if (error()) {
                <div class="alert alert-error">{{ error() }}</div>
            }
            
            <form [formGroup]="evaluationForm" (ngSubmit)="submitEvaluation()">
                <!-- Cliente -->
                <div class="form-group">
                    <label for="clientId">Cliente *</label>
                    <select id="clientId" formControlName="clientId" class="form-control">
                        <option value="">Seleccione un cliente</option>
                        @for (client of clients(); track client.id) {
                            <option [value]="client.id">{{ client.firstName }} {{ client.lastName }}</option>
                        }
                    </select>
                    @if (evaluationForm.get('clientId')?.invalid && evaluationForm.get('clientId')?.touched) {
                        <small class="error">El cliente es requerido</small>
                    }
                </div>

                <!-- Entrenador -->
                <div class="form-group">
                    <label for="trainerId">Entrenador *</label>
                    <select id="trainerId" formControlName="trainerId" class="form-control">
                        <option value="">Seleccione un entrenador</option>
                        @for (trainer of trainers(); track trainer.trainerId) {
                            <option [value]="trainer.trainerId">{{ trainer.firstName }} {{ trainer.lastName }}</option>
                        }
                    </select>
                    @if (evaluationForm.get('trainerId')?.invalid && evaluationForm.get('trainerId')?.touched) {
                        <small class="error">El entrenador es requerido</small>
                    }
                </div>

                

                <!-- Fecha de Evaluación -->
                <div class="form-group">
                    <label for="evaluationDate">Fecha de Evaluación *</label>
                    <input 
                        type="date" 
                        id="evaluationDate" 
                        formControlName="evaluationDate" 
                        class="form-control"
                    />
                    @if (evaluationForm.get('evaluationDate')?.invalid && evaluationForm.get('evaluationDate')?.touched) {
                        <small class="error">La fecha es requerida</small>
                    }
                </div>

                <!-- Peso -->
                <div class="form-group">
                    <label for="weight">Peso (kg) *</label>
                    <input 
                        type="number" 
                        id="weight" 
                        formControlName="weight" 
                        class="form-control"
                        step="0.1"
                        min="0.01"
                    />
                    @if (evaluationForm.get('weight')?.invalid && evaluationForm.get('weight')?.touched) {
                        <small class="error">El peso debe ser mayor a 0</small>
                    }
                </div>

                <!-- IMC -->
                <div class="form-group">
                    <label for="bmi">IMC *</label>
                    <input 
                        type="number" 
                        id="bmi" 
                        formControlName="bmi" 
                        class="form-control"
                        step="0.1"
                        min="0.01"
                    />
                    @if (evaluationForm.get('bmi')?.invalid && evaluationForm.get('bmi')?.touched) {
                        <small class="error">El IMC debe ser mayor a 0</small>
                    }
                </div>

                <!-- Porcentaje de Grasa Corporal -->
                <div class="form-group">
                    <label for="bodyFatPercentage">Porcentaje de Grasa Corporal (%) *</label>
                    <input 
                        type="number" 
                        id="bodyFatPercentage" 
                        formControlName="bodyFatPercentage" 
                        class="form-control"
                        step="0.1"
                        min="0.01"
                    />
                    @if (evaluationForm.get('bodyFatPercentage')?.invalid && evaluationForm.get('bodyFatPercentage')?.touched) {
                        <small class="error">El porcentaje debe ser mayor a 0</small>
                    }
                </div>

                <!-- Medida de Cintura -->
                <div class="form-group">
                    <label for="waistMeasurement">Medida de Cintura (cm) *</label>
                    <input 
                        type="number" 
                        id="waistMeasurement" 
                        formControlName="waistMeasurement" 
                        class="form-control"
                        step="0.1"
                        min="0.01"
                    />
                    @if (evaluationForm.get('waistMeasurement')?.invalid && evaluationForm.get('waistMeasurement')?.touched) {
                        <small class="error">La medida debe ser mayor a 0</small>
                    }
                </div>

                <!-- Medida de Cadera -->
                <div class="form-group">
                    <label for="hipMeasurement">Medida de Cadera (cm) *</label>
                    <input 
                        type="number" 
                        id="hipMeasurement" 
                        formControlName="hipMeasurement" 
                        class="form-control"
                        step="0.1"
                        min="0.01"
                    />
                    @if (evaluationForm.get('hipMeasurement')?.invalid && evaluationForm.get('hipMeasurement')?.touched) {
                        <small class="error">La medida debe ser mayor a 0</small>
                    }
                </div>

                <!-- Altura -->
                <div class="form-group">
                    <label for="heightMeasurement">Altura (cm) *</label>
                    <input 
                        type="number" 
                        id="heightMeasurement" 
                        formControlName="heightMeasurement" 
                        class="form-control"
                        step="0.1"
                        min="0.01"
                    />
                    @if (evaluationForm.get('heightMeasurement')?.invalid && evaluationForm.get('heightMeasurement')?.touched) {
                        <small class="error">La altura debe ser mayor a 0</small>
                    }
                </div>

                <!-- Notas -->
                <div class="form-group">
                    <label for="notes">Notas</label>
                    <textarea 
                        id="notes" 
                        formControlName="notes" 
                        class="form-control"
                        rows="4"
                    ></textarea>
                </div>

                <div class="form-actions">
                    <button 
                        type="button" 
                        class="btn btn-secondary"
                        (click)="cancel()"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        class="btn btn-primary"
                        [disabled]="evaluationForm.invalid || loading()"
                    >
                        {{ loading() ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </form>
        </div>
    `,
    styles: [`
        .container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
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

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #555;
        }

        .form-control {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        .form-control:focus {
            outline: none;
            border-color: #007bff;
        }

        .error {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        }

        .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 2rem;
        }

        .btn {
            padding: 0.5rem 1.5rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .btn-primary {
            background-color: #007bff;
            color: white;
        }

        .btn-primary:hover:not(:disabled) {
            background-color: #0056b3;
        }

        .btn-secondary {
            background-color: #6c757d;
            color: white;
        }

        .btn-secondary:hover {
            background-color: #545b62;
        }

        textarea.form-control {
            resize: vertical;
            min-height: 100px;
        }
    `]
})
export class PhysicalEvaluationFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private evaluationService = inject(EvaluationService);
    private userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    evaluationId = signal<number | null>(null);
    evaluationForm!: FormGroup;
    loading = signal(false);
    error = signal<string | null>(null);
    clients = signal<Client[]>([]);
    trainers = signal<Trainer[]>([]);

    ngOnInit(): void {
        this.initForm();
        this.loadClients();
        this.loadTrainers();

        const id = this.route.snapshot.params['id'];
        if (id) {
            this.evaluationId.set(+id);
            this.loadEvaluation(+id);
        }
    }

    private initForm(): void {
        this.evaluationForm = this.fb.group({
            clientId: ['', [Validators.required]],
            trainerId: ['', [Validators.required]],
            evaluationDate: ['', [Validators.required]],
            weight: ['', [Validators.required, Validators.min(0.01)]],
            bmi: ['', [Validators.required, Validators.min(0.01)]],
            bodyFatPercentage: ['', [Validators.required, Validators.min(0.01)]],
            waistMeasurement: ['', [Validators.required, Validators.min(0.01)]],
            hipMeasurement: ['', [Validators.required, Validators.min(0.01)]],
            heightMeasurement: ['', [Validators.required, Validators.min(0.01)]],
            notes: ['']
        });
    }

    private loadClients(): void {
        this.userService.getClients().subscribe({
            next: (response) => {
                if (response.clients) {
                    this.clients.set(response.clients);
                }
            },
            error: (err) => {
                console.error('Error loading clients:', err);
            }
        });
    }

    private loadTrainers(): void {
        this.userService.getTrainers().subscribe({
            next: (response) => {
                if (response.trainers) {
                    this.trainers.set(response.trainers);
                }
            },
            error: (err) => {
                console.error('Error loading trainers:', err);
            }
        });
    }



    private loadEvaluation(id: number): void {
        this.loading.set(true);
        this.evaluationService.getEvaluationById(id).subscribe({
            next: (response) => {
                if (response.data) {
                    this.evaluationForm.patchValue({
                        clientId: response.data.clientId,
                        trainerId: response.data.trainerId,
                        evaluationDate: response.data.evaluationDate,
                        weight: response.data.weight,
                        bmi: response.data.bmi,
                        bodyFatPercentage: response.data.bodyFatPercentage,
                        waistMeasurement: response.data.waistMeasurement,
                        hipMeasurement: response.data.hipMeasurement,
                        heightMeasurement: response.data.heightMeasurement,
                        notes: response.data.notes
                    });
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set('Error al cargar la evaluación');
                this.loading.set(false);
            }
        });
    }

    submitEvaluation(): void {
        if (this.evaluationForm.invalid) {
            Object.keys(this.evaluationForm.controls).forEach(key => {
                this.evaluationForm.get(key)?.markAsTouched();
            });
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        const formData = this.evaluationForm.value;

        const id = this.evaluationId();
        const request = id
            ? this.evaluationService.updateEvaluation(id, formData)
            : this.evaluationService.createEvaluation(formData);

        request.subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate(['/trainer/evaluations']);
            },
            error: (err) => {
                this.error.set(err.error?.message || 'Error al guardar la evaluación');
                this.loading.set(false);
            }
        });
    }

    cancel(): void {
        this.router.navigate(['/trainer/evaluations']);
    }
}
