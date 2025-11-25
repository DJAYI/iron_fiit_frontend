import { CanActivateFn } from '@angular/router';
import { SessionHandlerService } from '../services/session-handler.service';
import { inject } from '@angular/core';

export const authorizationGuard: CanActivateFn = (route, state) => {
  // Obtener el rol requerido desde los datos de la ruta
  const requiredRole = route.data['requiredRole'] as string;

  // Obtener el rol del usuario desde el servicio de manejo de sesión
  const sessionHandler = inject(SessionHandlerService);
  const userRole = sessionHandler.role();

  // Verificar si el rol del usuario coincide con el rol requerido
  return userRole === requiredRole;

};
