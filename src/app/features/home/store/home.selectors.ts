import { createFeatureSelector, createSelector } from "@ngrx/store";
import { HomeState } from "../interfaces/home.interface";

export const selectHomeState = createFeatureSelector<HomeState>("home");

export const selectBanners = createSelector(selectHomeState, (state: HomeState) => state.banners);
export const selectBannersLoading = createSelector(selectHomeState, (state: HomeState) => state.loadingBanners);
export const selectBannersFailure = createSelector(selectHomeState, (state: HomeState) => state.errorBanners);
export const selectProducts = createSelector(selectHomeState, (state: HomeState) => state.products);
export const selectProductsLoading = createSelector(selectHomeState, (state: HomeState) => state.loadingProducts);
export const selectProductsFailure = createSelector(selectHomeState, (state: HomeState) => state.errorProducts);
