import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SearchState } from "../interfaces/search.interface";

export const selectSearchState = createFeatureSelector<SearchState>("search");

export const selectSearchProducts = createSelector(selectSearchState, (state: SearchState) => state.products);
