import { createReducer, on } from "@ngrx/store";
import * as SearchActions from "./search.actions";
import { SearchState } from "../interfaces/search.interface";

export const initialState: SearchState = {
  products: [],
  query: "",
  loading: false,
  error: null,
};

export const searchReducer = createReducer(
  initialState,
  on(SearchActions.searchProducts, (state, { query }) => ({
    ...state,
    query,
    loading: true,
    error: null,
  })),
  on(SearchActions.searchProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
  })),
  on(SearchActions.searchProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
