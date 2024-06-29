import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ShopState } from "../interfaces/shop.interfaces";

export const selectShopState = createFeatureSelector<ShopState>("shop");

export const selectProducts = createSelector(selectShopState, (state: ShopState) => state.products);
export const selectLoading = createSelector(selectShopState, (state: ShopState) => state.loading);
export const selectViewMode = createSelector(selectShopState, (state: ShopState) => state.viewMode);
export const selectSortOrder = createSelector(selectShopState, (state: ShopState) => state.sortOrder);
