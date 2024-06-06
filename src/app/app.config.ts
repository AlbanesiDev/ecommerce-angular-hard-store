import { registerLocaleData } from "@angular/common";
import { provideHttpClient, withInterceptors, withFetch } from "@angular/common/http";
import { ApplicationConfig, isDevMode, LOCALE_ID, APP_INITIALIZER } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideClientHydration } from "@angular/platform-browser";
import {
  InMemoryScrollingOptions,
  InMemoryScrollingFeature,
  withInMemoryScrolling,
  provideRouter,
  withComponentInputBinding,
} from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { MetaReducer, provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { MessageService, PrimeNGConfig } from "primeng/api";
import { routes } from "./app.routes";
import { localStorageMetaReducer, loaderInterceptor, produtErrorHandlerInterceptor, provideFirebase } from "./core";
import { cartReducer } from "./features/cart";
import localeEs from "@angular/common/locales/es-AR";
registerLocaleData(localeEs);

const scrollConfig: InMemoryScrollingOptions = { scrollPositionRestoration: "top", anchorScrolling: "enabled" };
const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);
const metaReducers: MetaReducer[] = [localStorageMetaReducer];
const initializeAppFactory = (primeConfig: PrimeNGConfig) => () => {
  primeConfig.ripple = true;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature, withComponentInputBinding()),
    provideHttpClient(withInterceptors([loaderInterceptor, produtErrorHandlerInterceptor]), withFetch()),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideStore({ cart: cartReducer }, { metaReducers }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: true,
    }),
    provideEffects([]),
    { provide: LOCALE_ID, useValue: "es-AR" },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [PrimeNGConfig],
      multi: true,
    },
    provideFirebase,
    MessageService,
  ],
};
