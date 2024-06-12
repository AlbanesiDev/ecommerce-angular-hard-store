import { createReducer, on } from "@ngrx/store";
import { addProduct, removeProduct, clearCart } from "./cart.actions";
import { Product } from "../../../core/interfaces/product.interface";

export interface CartState {
  products: Product[];
}

export const initialState: CartState = {
  products: [],
};

export const cartReducer = createReducer(
  initialState,
  on(addProduct, (state, { product }) => ({ ...state, products: [...state.products, product] })),
  on(removeProduct, (state, { idCart }) => ({
    ...state,
    products: state.products.filter((product) => product.id_cart !== idCart),
  })),
  on(clearCart, (state) => ({ ...state, products: [] })),
);
