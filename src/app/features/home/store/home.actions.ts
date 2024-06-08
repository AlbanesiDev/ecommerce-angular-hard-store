import { createAction, props } from "@ngrx/store";
import { HomeBanners, HomeProducts } from "../interfaces/home.interface";

export const loadBanners = createAction("[Home] Load Home Banners");
export const loadBannersSuccess = createAction("[Home] Load Home Banners Success", props<{ banners: HomeBanners[] }>());
export const loadBannersFailure = createAction("[Home] Load Home Banners Error", props<{ error: unknown }>());

export const loadProducts = createAction("[Home] Load Home Products");
export const loadProductsSuccess = createAction(
  "[Home] Load Home Products Success",
  props<{ products: HomeProducts[] }>(),
);
export const loadProductsFailure = createAction("[Home] Load Home Products Error", props<{ error: unknown }>());
