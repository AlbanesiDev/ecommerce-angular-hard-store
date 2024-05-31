import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from "@angular/core";
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from "@angular/router";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideClientHydration } from "@angular/platform-browser";
import { registerLocaleData } from "@angular/common";
import localeEs from "@angular/common/locales/es-AR";

import { routes } from "./app.routes";
import { loaderInterceptor } from "./core/interceptors/loader.interceptor";
import { provideFirebase } from "./core/config/firebase.config";
import { PrimeNGConfig } from "primeng/api";
registerLocaleData(localeEs);

const scrollConfig: InMemoryScrollingOptions = { scrollPositionRestoration: "top", anchorScrolling: "enabled" };
const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);
const initializeAppFactory = (primeConfig: PrimeNGConfig) => () => {
  primeConfig.ripple = true;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature, withComponentInputBinding()),
    provideHttpClient(withInterceptors([loaderInterceptor]), withFetch()),
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: "es-AR" },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [PrimeNGConfig],
      multi: true,
    },
    provideFirebase,
  ],
};
