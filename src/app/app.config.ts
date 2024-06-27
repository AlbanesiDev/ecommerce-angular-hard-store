import { registerLocaleData } from "@angular/common";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig, isDevMode, LOCALE_ID, APP_INITIALIZER } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideClientHydration } from "@angular/platform-browser";
import {
  InMemoryScrollingOptions,
  InMemoryScrollingFeature,
  provideRouter,
  withInMemoryScrolling,
  withComponentInputBinding,
} from "@angular/router";

import localeEs from "@angular/common/locales/es-AR";
registerLocaleData(localeEs);

import { provideStoreDevtools } from "@ngrx/store-devtools";
import { StoreConfig, provideStore } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";

import { ConfirmationService, MessageService, PrimeNGConfig } from "primeng/api";

import { routes } from "./app.routes";
import { AppState, metaReducers, provideFirebase } from "./core";
import { cartReducer } from "./features/cart";

import { SearchEffects, searchReducer } from "./features/searchbar";
import { HomeEffects, homeReducer } from "./features/home";
import { ShopEffects, shopReducer } from "./features/shop";
import { AuthEffects, authReducer } from "./features/auth";

const scrollConfig: InMemoryScrollingOptions = { scrollPositionRestoration: "top", anchorScrolling: "enabled" };
const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

const initializeAppFactory = (primeConfig: PrimeNGConfig) => () => {
  primeConfig.ripple = true;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideStore(
      { cart: cartReducer, home: homeReducer, shop: shopReducer, search: searchReducer, auth: authReducer },
      {
        metaReducers,
      } as StoreConfig<AppState>,
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: true,
    }),
    provideEffects([HomeEffects, ShopEffects, SearchEffects, AuthEffects]),
    { provide: LOCALE_ID, useValue: "es-AR" },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [PrimeNGConfig],
      multi: true,
    },
    provideFirebase,
    MessageService,
    ConfirmationService,
  ],
};
