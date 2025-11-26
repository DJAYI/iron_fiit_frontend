import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../../../shared/services/session.service';
import { TrainingService } from '../../../../shared/services/training.service';
import { Session, CreateSessionRequest, Routine } from '../../../../shared/interfaces';

@Component({
    selector: 'app-session-management',
    imports: [CommonModule, FormsModule],
    templateUrl: './session-management.html',
    styleUrls: ['./session-management.css']
})
export class SessionManagementComponent implements OnInit {
    private sessionService = inject(SessionService);
    private trainingService = inject(TrainingService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    routineId = signal<number>(0);
    routine = signal<Routine | null>(null);
    sessions = signal<Session[]>([]);
    loading = signal(true);
    showAddForm = signal(false);

    // Form fields
    scheduledDate = signal<string>('');
    scheduledTime = signal<string>('09:00');
    notes = signal<string>('');

    // Bulk creation
    showBulkForm = signal(false);
    startDate = signal<string>('');
    endDate = signal<string>('');
    daysOfWeek = signal<number[]>([1, 3, 5]); // Lunes, Miércoles, Viernes
    bulkTime = signal<string>('09:00');

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.routineId.set(+id);
            this.loadRoutine();
            this.loadSessions();
        }
    }

    loadRoutine() {
        this.trainingService.getRoutine(this.routineId()).subscribe({
            next: (response) => {
                this.routine.set(response.data);
            },
            error: (error: any) => {
                console.error('Error loading routine:', error);
            }
        });
    }

    loadSessions() {
        this.loading.set(true);
        this.sessionService.getRoutineSessions(this.routineId()).subscribe({
            next: (response) => {
                this.sessions.set(response.data || []);
                this.loading.set(false);
            },
            error: (error: any) => {
                console.error('Error loading sessions:', error);
                this.sessions.set([]);
                this.loading.set(false);
            }
        });
    }

    toggleAddForm() {
        this.showAddForm.set(!this.showAddForm());
        this.showBulkForm.set(false);
        if (this.showAddForm()) {
            this.resetForm();
        }
    }

    toggleBulkForm() {
        this.showBulkForm.set(!this.showBulkForm());
        this.showAddForm.set(false);
        if (this.showBulkForm()) {
            this.resetBulkForm();
        }
    }

    resetForm() {
        const today = new Date().toISOString().split('T')[0];
        this.scheduledDate.set(today);
        this.scheduledTime.set('09:00');
        this.notes.set('');
    }

    resetBulkForm() {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        this.startDate.set(today);
        this.endDate.set(nextWeek.toISOString().split('T')[0]);
        this.daysOfWeek.set([1, 3, 5]);
        this.bulkTime.set('09:00');
    }

    addSession() {
        if (!this.scheduledDate() || !this.scheduledTime()) {
            alert('Por favor completa la fecha y hora');
            return;
        }

        const request: CreateSessionRequest = {
            routineId: this.routineId(),
            startDate: this.scheduledDate(),
            startTime: this.scheduledTime(),
            notes: this.notes() || undefined
        };

        this.sessionService.createSession(request).subscribe({
            next: () => {
                this.loadSessions();
                this.toggleAddForm();
            },
            error: (error: any) => {
                console.error('Error creating session:', error);
                alert('Error al crear la sesión');
            }
        });
    }

    createBulkSessions() {
        if (!this.startDate() || !this.endDate()) {
            alert('Por favor completa las fechas');
            return;
        }

        const sessions: CreateSessionRequest[] = [];
        const start = new Date(this.startDate());
        const end = new Date(this.endDate());

        // Generate sessions for selected days of week
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
            if (this.daysOfWeek().includes(dayOfWeek)) {
                sessions.push({
                    routineId: this.routineId(),
                    startDate: date.toISOString().split('T')[0],
                    startTime: this.bulkTime(),
                    notes: `Sesión programada automáticamente`
                });
            }
        }

        if (sessions.length === 0) {
            alert('No se generaron sesiones. Verifica las fechas y días seleccionados.');
            return;
        }

        this.sessionService.createBulkSessions(sessions).subscribe({
            next: () => {
                alert(`${sessions.length} sesiones creadas exitosamente`);
                this.loadSessions();
                this.toggleBulkForm();
            },
            error: (error: any) => {
                console.error('Error creating bulk sessions:', error);
                alert('Error al crear las sesiones en lote');
            }
        });
    }

    deleteSession(id: number) {
        if (!confirm('¿Estás seguro de eliminar esta sesión?')) {
            return;
        }

        this.sessionService.deleteSession(id).subscribe({
            next: () => {
                this.loadSessions();
            },
            error: (error: any) => {
                console.error('Error deleting session:', error);
                alert('Error al eliminar la sesión');
            }
        });
    }

    toggleDayOfWeek(day: number) {
        const days = this.daysOfWeek();
        if (days.includes(day)) {
            this.daysOfWeek.set(days.filter(d => d !== day));
        } else {
            this.daysOfWeek.set([...days, day].sort());
        }
    }

    getDayName(day: number): string {
        const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return names[day];
    }

    formatDate(date: string): string {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }

    goBack() {
        this.router.navigate(['/admin/routines/routines']);
    }
}
