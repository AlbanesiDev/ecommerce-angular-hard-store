import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HomeService } from "../services/home.service";
import * as HomeActions from "./home.actions";
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class HomeEffects {
  private actions$: Actions = inject(Actions);
  private homeService: HomeService = inject(HomeService);

  loadBanners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomeActions.loadBanners),
      mergeMap(() =>
        this.homeService.getBanners().pipe(
          map((banners) => HomeActions.loadBannersSuccess({ banners })),
          catchError((error) => of(HomeActions.loadProductsFailure({ error }))),
        ),
      ),
    ),
  );
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomeActions.loadProducts),
      mergeMap(() =>
        this.homeService.getProducts().pipe(
          map((products) => HomeActions.loadProductsSuccess({ products })),
          catchError((error) => of(HomeActions.loadProductsFailure({ error }))),
        ),
      ),
    ),
  );
}
