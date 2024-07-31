import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { ClientContextService, SSRContextService } from './service/ssr-context.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(appRoutes),
    {
      provide: SSRContextService,
      useClass: ClientContextService,
    },
  ],
};
