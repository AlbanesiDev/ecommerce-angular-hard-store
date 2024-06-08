import { createReducer, on } from "@ngrx/store";
import { HomeState } from "../interfaces/home.interface";
import * as HomeActions from "./home.actions";

export const initialState: HomeState = {
  banners: [],
  products: [],
  loadingBanners: false,
  loadingProducts: false,
  errorBanners: null,
  errorProducts: null,
};

export const homeReducer = createReducer(
  initialState,

  on(HomeActions.loadBanners, (state) => ({ ...state, loadingBanners: true, errorBanners: null })),
  on(HomeActions.loadBannersSuccess, (state, { banners }) => ({
    ...state,
    banners,
    loadingBanners: false,
    errorBanners: null,
  })),
  on(HomeActions.loadBannersFailure, (state, { error }) => ({
    ...state,
    errorBanners: error,
    loadingBanners: false,
  })),

  on(HomeActions.loadProducts, (state) => ({ ...state, loadingProducts: true, errorProducts: null })),
  on(HomeActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loadingProducts: false,
    errorProducts: null,
  })),
  on(HomeActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    errorProducts: error,
    loadingProducts: false,
  })),
);
