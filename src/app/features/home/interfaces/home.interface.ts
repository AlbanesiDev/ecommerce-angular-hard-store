import { Product } from "../../../core/interfaces/product.interface";

export interface HomeState {
  banners: HomeBanners[];
  products: HomeProducts[];
  loadingBanners: boolean;
  loadingProducts: boolean;
  errorBanners: unknown;
  errorProducts: unknown;
}

export interface HomeBanners {
  id: number;
  src: string;
  srcset: string[];
  alt: string;
  url: string;
}

export interface HomeProducts {
  title: string;
  interval: number;
  products: Product[];
}
