import { Injectable, inject } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { map, catchError, of, exhaustMap } from "rxjs";
import * as ShopActions from "./shop.actions";
import { ShopService } from "../services/shop.service";
import { Product } from "../../../core";

@Injectable()
export class ShopEffects {
  private _actions: Actions = inject(Actions);
  private _shopService: ShopService = inject(ShopService);

  loadProducts$ = createEffect(() =>
    this._actions.pipe(
      ofType(ShopActions.loadProducts),
      exhaustMap((action) => {
        const { pageSize, numberPage } = action;
        return this._shopService.getProducts(pageSize, numberPage).pipe(
          map((products: Product[]) => ShopActions.loadProductsSuccess({ products })),
          catchError((error) => of(ShopActions.loadProductsFailure({ error }))),
        );
      }),
    ),
  );
}
