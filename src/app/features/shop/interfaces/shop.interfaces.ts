import { Product } from "../../../core";

export interface ShopState {
  products: Product[];
  currentPage: number;
  viewMode: ViewMode;
  sortOrder: SortOrder;
  loading: boolean;
  error: unknown;
}

export type ViewMode = "grid" | "list";
export type SortOrder = "min" | "max" | "top";
