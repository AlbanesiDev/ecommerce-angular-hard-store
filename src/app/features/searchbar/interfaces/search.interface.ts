import { Product } from "../../../core";

export interface SearchState {
  products: Product[];
  query: string;
  loading: boolean;
  error: unknown;
}
