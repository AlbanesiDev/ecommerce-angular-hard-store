import { Action, ActionReducer, INIT, UPDATE } from "@ngrx/store";

export function localStorageMetaReducer<S, A extends Action = Action>(
  reducer: ActionReducer<S, A>,
): ActionReducer<S, A> {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem("state");
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem("state");
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem("state", JSON.stringify(nextState));
    return nextState;
  };
}
