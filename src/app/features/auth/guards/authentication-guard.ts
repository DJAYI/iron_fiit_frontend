import { CanActivateFn } from '@angular/router';
import { SessionHandlerService } from '../services/session-handler.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {

  const sessionHandler = inject(SessionHandlerService);

  return sessionHandler.username() !== null && sessionHandler.role() !== null;
};
