import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AttendanceService } from '../../../shared/services/attendance.service';
import { Attendance, AttendanceStatus } from '../../../shared/interfaces';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
    selector: 'app-client-attendance',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './client-attendance.html'
})
export class ClientAttendanceComponent implements OnInit {
    private attendanceService = inject(AttendanceService);
    private notificationService = inject(NotificationService);
    private fb = inject(FormBuilder);

    attendances = signal<Attendance[]>([]);
    loading = signal(false);
    registering = signal(false);
    showForm = signal(false);

    attendanceForm = this.fb.group({
        status: ['ATTENDED' as AttendanceStatus, Validators.required],
        observations: ['']
    });

    // Computed signals for stats
    monthlyCount = computed(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return this.attendances().filter(a => {
            const date = new Date(a.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length;
    });

    weeklyCount = computed(() => {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        return this.attendances().filter(a => {
            const attendanceDate = new Date(a.date);
            return attendanceDate >= weekStart;
        }).length;
    });

    ngOnInit(): void {
        this.loadAttendances();
    }

    loadAttendances(): void {
        this.loading.set(true);
        this.attendanceService.getMyAttendances().subscribe({
            next: (response) => {
                this.attendances.set(response.data || []);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading attendances:', error);
                this.notificationService.error('Error al cargar las asistencias');
                this.attendances.set([]);
                this.loading.set(false);
            }
        });
    }

    toggleForm(): void {
        this.showForm.update(value => !value);
        if (!this.showForm()) {
            this.attendanceForm.reset({ status: 'ATTENDED', observations: '' });
        }
    }

    markAttendance(): void {
        if (this.attendanceForm.invalid) {
            this.notificationService.error('Por favor completa el formulario');
            return;
        }

        this.registering.set(true);
        const formValue = this.attendanceForm.value;

        this.attendanceService.registerAttendance({
            status: formValue.status as AttendanceStatus,
            observations: formValue.observations || undefined
        }).subscribe({
            next: (response) => {
                this.notificationService.success('Asistencia registrada exitosamente');
                this.loadAttendances();
                this.registering.set(false);
                this.showForm.set(false);
                this.attendanceForm.reset({ status: 'ATTENDED', observations: '' });
            },
            error: (error) => {
                console.error('Error marking attendance:', error);
                this.notificationService.error('Error al registrar asistencia');
                this.registering.set(false);
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

    formatDate(date: string): string {
        // date format: "2025-11-26"
        const [year, month, day] = date.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return dateObj.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(time: string): string {
        // time format: "14:13:19.494882"
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    }

    getTodayAttendance(): Attendance | undefined {
        const attendances = this.attendances();
        if (!attendances || attendances.length === 0) {
            return undefined;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return attendances.find(attendance => {
            const attendanceDate = new Date(attendance.date);
            attendanceDate.setHours(0, 0, 0, 0);
            return attendanceDate.getTime() === today.getTime();
        });
    }

    hasMarkedToday(): boolean {
        return !!this.getTodayAttendance();
    }
}
