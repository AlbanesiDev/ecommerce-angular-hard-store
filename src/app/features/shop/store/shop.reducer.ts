import { createReducer, on } from "@ngrx/store";
import * as ShopActions from "./shop.actions";
import { ShopState } from "../interfaces/shop.interfaces";

export const initialState: ShopState = {
  products: [],
  viewMode: "grid",
  sortOrder: "default",
  loading: false,
  error: null,
};

export const shopReducer = createReducer(
  initialState,
  on(ShopActions.loadProducts, (state) => ({ ...state, loading: true })),
  on(ShopActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products: products,
    loading: false,
  })),
  on(ShopActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error: error,
    loading: false,
  })),
  on(ShopActions.changeViewMode, (state, { viewMode }) => ({
    ...state,
    viewMode: viewMode,
  })),
  on(ShopActions.changeSortOrder, (state, { sortOrder }) => ({
    ...state,
    sortOrder: sortOrder,
  })),
);
