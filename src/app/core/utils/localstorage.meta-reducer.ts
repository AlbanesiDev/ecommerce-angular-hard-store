/* eslint-disable @typescript-eslint/no-explicit-any */
import { localStorageSync } from "ngrx-store-localstorage";
import { MetaReducer } from "@ngrx/store";
import { AppState } from "../interfaces/app-state.interface";

/**
 * For obvious reasons of data synchronization, the shop should not be stored in the localstorage.
 * In this case it is used only because it is a live preview.
 */
export function localStorageSyncReducer(reducer: any): any {
  return (state: any, action: any) => {
    return localStorageSync({
      keys: ["cart", "home", "shop", "search"],
      rehydrate: true,
      checkStorageAvailability: true,
    })(reducer)(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];
