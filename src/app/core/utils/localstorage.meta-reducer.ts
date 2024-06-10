/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, ActionReducer, INIT, UPDATE } from "@ngrx/store";

interface AppState {
  cart: any;
  home: any;
  shop: any;
  search: any;
}

const SHOP_EXPIRATION_TIME = 300000; // 5 minutes

function loadState<T>(key: string): T | null {
  const storageValue = localStorage.getItem(key);
  if (storageValue) {
    try {
      const { state, expiry } = JSON.parse(storageValue);
      if (expiry && Date.now() > expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return state;
    } catch {
      localStorage.removeItem(key);
    }
  }
  return null;
}

function saveState<T>(key: string, state: T, expiry?: number) {
  const value = {
    state,
    expiry: expiry ? Date.now() + expiry : null,
  };
  localStorage.setItem(key, JSON.stringify(value));
}

export function localStorageMetaReducer<S extends AppState, A extends Action = Action>(
  reducer: ActionReducer<S, A>,
): ActionReducer<S, A> {
  return (state: any, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const cartState = loadState<typeof state.cart>("cart");
      const homeState = loadState<typeof state.home>("home");
      const shopState = loadState<typeof state.shop>("shop");
      const searchState = loadState<typeof state.search>("search");

      return {
        ...state,
        cart: cartState ?? state?.cart,
        home: homeState ?? state?.home,
        shop: shopState ?? state?.shop,
        search: searchState ?? state?.search,
      } as S;
    }

    const nextState = reducer(state, action);
    saveState("cart", nextState.cart);
    saveState("home", nextState.home);
    saveState("shop", nextState.shop, SHOP_EXPIRATION_TIME);
    saveState("search", nextState.search);
    return nextState;
  };
}
