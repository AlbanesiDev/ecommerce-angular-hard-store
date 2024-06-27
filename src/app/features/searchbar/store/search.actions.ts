import { createAction, props } from "@ngrx/store";
import { Product } from "../../../core";

export const searchProducts = createAction("[Search] Search Products", props<{ query: string }>());

export const searchProductsSuccess = createAction("[Search] Search Products Success", props<{ products: Product[] }>());

export const searchProductsFailure = createAction("[Search] Search Products Failure", props<{ error: unknown }>());
