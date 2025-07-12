import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment.prod';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from './app/app.module';
import { SettingsPopoverPage } from './app/pages/home/settings-popover/settings-popover.page';
import { SettingsPopoverPageModule } from './app/pages/home/settings-popover/settings-popover.module';
import { JwtInterceptor } from './app/shared/interceptors/jwt.interceptor';

if (environment.production) {
  enableProdMode();

  // disable any console.log debugging statements in production mode
  window.console.log = function () {};
  window.console.error = function () {};
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
      // SettingsPopoverPageModule
    ),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
  ],
});
