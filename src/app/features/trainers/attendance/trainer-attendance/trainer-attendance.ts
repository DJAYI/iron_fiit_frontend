import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../../shared/services/attendance.service';
import { Attendance, AttendanceStatus } from '../../../../shared/interfaces';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
    selector: 'app-trainer-attendance',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './trainer-attendance.html'
})
export class TrainerAttendanceComponent implements OnInit {
    private attendanceService = inject(AttendanceService);
    private notificationService = inject(NotificationService);

    attendances = signal<Attendance[]>([]);
    loading = signal(false);
    updatingAttendance = signal<number | null>(null);

    // Computed signals for stats
    uniqueClientsCount = computed(() => {
        const clientIds = this.attendances().map(a => a.clientId);
        return new Set(clientIds).size;
    });

    todayCount = computed(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.attendances().filter(a => {
            const date = new Date(a.dateTime);
            date.setHours(0, 0, 0, 0);
            return date.getTime() === today.getTime();
        }).length;
    });

    ngOnInit(): void {
        this.loadAttendances();
    }

    loadAttendances(): void {
        this.loading.set(true);
        this.attendanceService.getAllAttendances().subscribe({
            next: (response) => {
                this.attendances.set(response.attendances);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading attendances:', error);
                this.notificationService.error('Error al cargar las asistencias');
                this.loading.set(false);
            }
        });
    }

    formatDateTime(dateTime: string): string {
        const date = new Date(dateTime);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(dateTime: string): string {
        const date = new Date(dateTime);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(dateTime: string): string {
        const date = new Date(dateTime);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    toggleCompleted(attendance: Attendance): void {
        this.updatingAttendance.set(attendance.id);

        this.attendanceService.markCompleted({
            attendanceId: attendance.id,
            completed: !attendance.completed
        }).subscribe({
            next: (response) => {
                this.notificationService.success(
                    attendance.completed ? 'Asistencia marcada como no completada' : 'Asistencia marcada como completada'
                );
                this.loadAttendances();
                this.updatingAttendance.set(null);
            },
            error: (error) => {
                console.error('Error updating attendance:', error);
                this.notificationService.error('Error al actualizar la asistencia');
                this.updatingAttendance.set(null);
            }
        });
    }

    getStatusLabel(status: AttendanceStatus): string {
        const labels: Record<AttendanceStatus, string> = {
            'ATTENDED': 'Asistió',
            'NOT_ATTENDED': 'No Asistió',
            'ATTENDED_NO_ROUTINE': 'Asistió sin Rutina'
        };
        return labels[status];
    }

    getStatusClass(status: AttendanceStatus): string {
        const classes: Record<AttendanceStatus, string> = {
            'ATTENDED': 'bg-green-100 text-green-800',
            'NOT_ATTENDED': 'bg-red-100 text-red-800',
            'ATTENDED_NO_ROUTINE': 'bg-yellow-100 text-yellow-800'
        };
        return classes[status];
    }
}
