import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { addIcons } from 'ionicons';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { 
  mailOutline, 
  lockClosedOutline, 
  eyeOutline, 
  eyeOffOutline,
  alertCircleOutline,
  refreshOutline
} from 'ionicons/icons';
import { provideZoneChangeDetection } from '@angular/core';


addIcons({
  'mail-outline': mailOutline,
  'lock-closed-outline': lockClosedOutline,
  'eye-outline': eyeOutline,
  'eye-off-outline': eyeOffOutline,
  'alert-circle-outline': alertCircleOutline,
  'refresh-outline': refreshOutline
});


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi()), 
    provideClientHydration(withEventReplay()),],
};
