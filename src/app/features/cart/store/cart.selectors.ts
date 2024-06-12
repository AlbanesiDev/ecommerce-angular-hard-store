import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CartState } from "./cart.reducer";

export const selectCartState = createFeatureSelector<CartState>("cart");

export const selectProducts = createSelector(selectCartState, (state) => state.products);
