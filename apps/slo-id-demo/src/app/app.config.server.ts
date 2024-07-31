import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { SSRContextService, ServerContextService } from './service/ssr-context.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: SSRContextService,
      useClass: ServerContextService,
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
