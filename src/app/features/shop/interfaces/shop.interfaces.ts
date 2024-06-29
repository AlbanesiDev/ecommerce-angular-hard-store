import { Product } from "../../../core";

export interface ShopState {
  products: Product[];
  viewMode: ViewMode;
  sortOrder: SortOrder;
  loading: boolean;
  error: unknown;
}
export type ViewMode = "grid" | "list";
export type SortOrder = "priceAsc" | "priceDesc" | "alphaAsc" | "alphaDesc" | "default";

export interface CategoryOrSubcategory {
  id: number;
  label: string;
  isSubcategory: boolean;
}

export interface Categories {
  id_category: number;
  label: string;
  children?: Children[];
}

export interface Children {
  id_subcategory: number;
  label: string;
}
