import { Injectable, signal, computed, effect } from "@angular/core";
import { UserRole } from "../../../shared/interfaces";

interface SessionData {
    username: string;
    role: UserRole;
    timestamp: number;
}

@Injectable({
    providedIn: 'root'
})

export class SessionHandlerService {
    private readonly SESSION_KEY = 'ironfit_session';
    private readonly SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

    username = signal<string | null>(null);
    role = signal<UserRole | null>(null);

    // Computed signals
    isAuthenticated = computed(() => this.username() !== null && this.role() !== null);
    isClient = computed(() => this.role() === 'CLIENT');
    isTrainer = computed(() => this.role() === 'TRAINER');
    isAuditor = computed(() => this.role() === 'AUDITOR');

    constructor() {
        // Auto-save session to localStorage
        effect(() => {
            const username = this.username();
            const role = this.role();

            if (username && role) {
                this.saveToStorage(username, role);
            }
        });

        // Restore session on init
        this.restoreSession();
    }

    /**
     * Sets the user session with username and role
     */
    setSession(username: string, role: UserRole): void {
        if (!username || !role) {
            console.error('Invalid session data');
            return;
        }

        this.username.set(username);
        this.role.set(role);
    }

    /**
     * Clears the current user session
     */
    clearSession(): void {
        this.username.set(null);
        this.role.set(null);
        this.clearStorage();
    }

    /**
     * Saves session data to localStorage
     */
    private saveToStorage(username: string, role: UserRole): void {
        try {
            const sessionData: SessionData = {
                username,
                role,
                timestamp: Date.now()
            };
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
        } catch (error) {
            console.error('Error saving session to storage:', error);
        }
    }

    /**
     * Restores session from localStorage if valid
     */
    private restoreSession(): void {
        try {
            const stored = localStorage.getItem(this.SESSION_KEY);
            if (!stored) return;

            const sessionData: SessionData = JSON.parse(stored);
            const now = Date.now();

            // Check if session is expired
            if (now - sessionData.timestamp > this.SESSION_EXPIRY) {
                this.clearStorage();
                return;
            }

            this.username.set(sessionData.username);
            this.role.set(sessionData.role);
        } catch (error) {
            console.error('Error restoring session:', error);
            this.clearStorage();
        }
    }

    /**
     * Clears session data from localStorage
     */
    private clearStorage(): void {
        try {
            localStorage.removeItem(this.SESSION_KEY);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    /**
     * Checks if the session is expired
     */
    isSessionValid(): boolean {
        try {
            const stored = localStorage.getItem(this.SESSION_KEY);
            if (!stored) return false;

            const sessionData: SessionData = JSON.parse(stored);
            const now = Date.now();

            return (now - sessionData.timestamp) <= this.SESSION_EXPIRY;
        } catch {
            return false;
        }
    }
}