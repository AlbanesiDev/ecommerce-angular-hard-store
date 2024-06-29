import { createAction, props } from "@ngrx/store";
import { Product } from "../../../core";
import { SortOrder, ViewMode } from "../interfaces/shop.interfaces";

export const loadProducts = createAction(
  "[Shop Page] Load Products",
  props<{
    pageSize: number;
    numberPage: number;
  }>(),
);
export const loadProductsSuccess = createAction("[shop] Load Products Success", props<{ products: Product[] }>());
export const loadProductsFailure = createAction("[shop] Load Products Failure", props<{ error: unknown }>());

export const changeViewMode = createAction("[Shop] Change View Mode", props<{ viewMode: ViewMode }>());
export const changeSortOrder = createAction("[Shop] Change Sort Order", props<{ sortOrder: SortOrder }>());
