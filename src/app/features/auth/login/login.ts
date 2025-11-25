import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { LoginUserService } from "../services/login-user.service";
import { SessionHandlerService } from "../services/session-handler.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { AuthUserCredentials } from "../interfaces/auth-user-credentials";

@Component({
    selector: 'app-login-page',
    templateUrl: './login.html',
    imports: [ReactiveFormsModule]
})

export class LoginPageComponent {
    private loginUserService = inject(LoginUserService);
    private sessionHandler = inject(SessionHandlerService);
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    showPassword = signal(false);
    isLoading = signal(false);

    loginForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });

    togglePasswordVisibility() {
        this.showPassword.update(value => !value);
    }

    login() {
        if (this.loginForm.invalid) {
            this.notificationService.warning('Por favor, completa todos los campos correctamente');
            return;
        }

        this.isLoading.set(true);
        const credentials = this.loginForm.value as AuthUserCredentials;

        this.loginUserService.loginUser(credentials).subscribe({
            next: (response) => {
                this.isLoading.set(false);

                // Check if response has error
                if (response.error) {
                    this.notificationService.error(response.error);
                    return;
                }

                // Validate response has required fields
                if (!response.username || !response.role) {
                    this.notificationService.error('Respuesta inválida del servidor');
                    return;
                }

                // Extract role from string format "[ROLE_NAME]"
                const roleMatch = response.role.match(/ROLE_(\w+)/);
                if (!roleMatch) {
                    this.notificationService.error('Formato de rol inválido');
                    return;
                }

                const role = roleMatch[1] as 'CLIENT' | 'TRAINER' | 'AUDITOR';

                // Save session
                this.sessionHandler.setSession(response.username, role);
                this.notificationService.success(`¡Bienvenido, ${response.username}!`);

                // Redirect based on role
                if (role === 'CLIENT') {
                    this.router.navigate(['/client/dashboard']);
                } else if (role === 'TRAINER') {
                    this.router.navigate(['/trainer/dashboard']);
                } else if (role === 'AUDITOR') {
                    this.router.navigate(['/admin/dashboard']);
                } else {
                    this.notificationService.warning('Rol no reconocido');
                }
            },
            error: () => {
                this.isLoading.set(false);
                this.notificationService.error('Error al iniciar sesión. Verifica tus credenciales.');
            }
        });
    }
}