import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationId = 0;
    notifications = signal<Notification[]>([]);

    show(message: string, type: NotificationType = 'info', duration = 3000) {
        const id = ++this.notificationId;
        const notification: Notification = { id, message, type };

        this.notifications.update(notifications => [...notifications, notification]);

        setTimeout(() => {
            this.remove(id);
        }, duration);
    }

    success(message: string, duration = 3000) {
        this.show(message, 'success', duration);
    }

    error(message: string, duration = 4000) {
        this.show(message, 'error', duration);
    }

    info(message: string, duration = 3000) {
        this.show(message, 'info', duration);
    }

    warning(message: string, duration = 3500) {
        this.show(message, 'warning', duration);
    }

    remove(id: number) {
        this.notifications.update(notifications =>
            notifications.filter(n => n.id !== id)
        );
    }
}
