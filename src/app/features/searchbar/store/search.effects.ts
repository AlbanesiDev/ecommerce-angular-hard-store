import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, of } from "rxjs";
import * as SearchActions from "./search.actions";
import { SearchService } from "../services/search.service";

@Injectable()
export class SearchEffects {
  private actions$: Actions = inject(Actions);
  private productService: SearchService = inject(SearchService);

  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.searchProducts),
      mergeMap(({ query }) =>
        this.productService.searchProducts(query).pipe(
          map((products) => SearchActions.searchProductsSuccess({ products: products })),
          catchError((error) => of(SearchActions.searchProductsFailure({ error: error }))),
        ),
      ),
    ),
  );
}
