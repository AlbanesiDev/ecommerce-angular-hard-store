import { createAction, props } from "@ngrx/store";
import { Product } from "../../../core/interfaces/product.interface";

export const addProduct = createAction("[Cart] Add Product", props<{ product: Product }>());
export const removeProduct = createAction("[Cart] Remove Product", props<{ idCart: string }>());
export const clearCart = createAction("[Cart] Clear Cart");
